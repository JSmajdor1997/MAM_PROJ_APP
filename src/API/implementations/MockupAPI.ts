import { MMKV } from "react-native-mmkv";
import API, { GeneralError, SignUpError, LoginError, LogoutError } from "../API";
import type { APIResponse, QueryMap, TypeMap, CreateMap } from "../API";
import type { WisbEvent, WisbUser, Invitation, WisbWasteland, Message, WastelandCleaningData, WisbDumpster } from "../interfaces";
import WisbObjectType from "../WisbObjectType";
import getMockupInvitations from "../generators/getMockupInvitations";
import getMockupDumpsters from "../generators/mockup_dumpsters";
import getMockupEvents from "../generators/mockup_events";
import getMockupUsers from "../generators/mockup_users";
import getMockupWastelands from "../generators/mockup_wastelands";
import getMockupMessages from "../generators/getMockupMessages";
import type Ref from "../Ref";
import api_endpoint from "./api_endpoint";
import { CRUD } from "../notifications";
import { isEvent } from "../type_guards";
import isLatLngInRegion from "../../utils/isLatLngInRegion";
import MapType from "../../../res/MapType";

interface DB {
    users: Map<number, WisbUser>
    events: Map<number, WisbEvent>
    wastelands: Map<number, WisbWasteland>
    dumpsters: Map<number, WisbDumpster>

    invitations: Map<number, Invitation[]>        //key is user id

    currentUser: WisbUser | null
    messages: Map<number, Message[]>              //key is event's id
}

export default class MockupAPI extends API {
    private static readonly MMKV_ID = "mockup_api"
    private static readonly MMKV_KEY = "mockup_api"
    private mmkvStorage = new MMKV({
        id: MockupAPI.MMKV_ID,
        encryptionKey: 'hunter2'
    })

    readonly db: DB

    protected syncToDB() {

    }

    constructor() {
        super()

        if (!this.mmkvStorage.contains(MockupAPI.MMKV_KEY)) {
            const users = getMockupUsers()
            const dumpsters = getMockupDumpsters(users)
            const wastelands = getMockupWastelands(users)
            const events = getMockupEvents(users, wastelands)
            const invitations = getMockupInvitations(events, users)
            const messages = getMockupMessages(events, users)

            this.mmkvStorage.set(MockupAPI.MMKV_KEY, JSON.stringify({
                currentUser: null,
                wastelands,
                users,
                dumpsters,
                events,
                invitations,
                messages
            }))
        }

        const rawDb = this.mmkvStorage.getString(MockupAPI.MMKV_KEY)!

        let { currentUser, dumpsters, wastelands, events, invitations, users, messages } = JSON.parse(rawDb) as DB

        this.db = {
            messages,
            wastelands: new Map([...wastelands].map(([id, it]) => [
                id,
                {
                    ...it,
                    creationDate: new Date(it.creationDate),
                    afterCleaningData: it.afterCleaningData != null ? {
                        ...it.afterCleaningData,
                        date: new Date(it.afterCleaningData?.date)
                    } : undefined
                }])),
            currentUser,
            dumpsters,
            users,
            invitations,
            events: new Map([...events].map(([id, it]) => [
                id,
                {
                    ...it,
                    event: {
                        ...it,
                        dateRange: [new Date(it.dateRange[0]), new Date(it.dateRange[1])],
                    },
                }]))
        }
    }

    // ref: Ref<T>
    // location?: unknown
    // action: CRUD.Updated
    // updatedFields: { [key in keyof TypeMap<T>]?: TypeMap<T>[key] }
    @api_endpoint({ checkLogin: true, altersData: true, notification: (_, event) => [{ ref: { type: WisbObjectType.Event, id: event.id }, action: CRUD.Updated, type: WisbObjectType.Event }] })
    async updateMemberType(event: WisbEvent, user: Ref<WisbObjectType.User>, isAdmin: boolean): Promise<APIResponse<GeneralError, {}>> {
        const actualEvent = this.db.events.get(event.id)

        if (actualEvent == null) {
            return {
                error: GeneralError.InvalidDataProvided,
                description: "Event of provided id does not exist"
            }
        }

        const memberInfo = actualEvent.members.get(user.id)

        if (memberInfo == null) {
            return {
                error: GeneralError.InvalidDataProvided,
                description: "User of provided id os not a member of provided event"
            }
        }

        actualEvent.members.set(user.id, { ...memberInfo, isAdmin })

        return {
            data: {}
        }
    }

    @api_endpoint({ checkLogin: true, altersData: true, notification: (_, type, object) => [{ action: CRUD.Created, type }] })
    async createOne<T extends WisbObjectType.Dumpster | WisbObjectType.Event | WisbObjectType.Wasteland>(type: T, object: CreateMap<T>): Promise<APIResponse<GeneralError, Ref<T>>> {
        const currentUser = this.getCurrentUser()!

        const collection = {
            [WisbObjectType.Dumpster]: this.db.dumpsters,
            [WisbObjectType.Event]: this.db.events,
            [WisbObjectType.Wasteland]: this.db.wastelands
        }[type]

        const defaultObject = {
            [WisbObjectType.Dumpster]: {
                addedBy: { type: WisbObjectType.User, id: currentUser.id },
            },
            [WisbObjectType.Event]: {
            },
            [WisbObjectType.Wasteland]: {
                creationDate: new Date(),
                reportedBy: { type: WisbObjectType.User, id: currentUser.id },
            }
        }[type]

        const newId = Math.max(...collection.keys()) + 1

        const newObject: TypeMap<T> = {
            ...defaultObject,
            ...object,
            id: newId
        } as any

        collection.set(newId, newObject as any)

        return {
            data: {
                type: type as T,
                id: newId
            }
        }
    }

    @api_endpoint({ checkLogin: true })
    async getOne<T extends WisbObjectType.Dumpster | WisbObjectType.Event | WisbObjectType.Wasteland>(ref: Ref<T>): Promise<APIResponse<GeneralError, TypeMap<T>>> {
        const map = {
            [WisbObjectType.Dumpster]: this.db.dumpsters,
            [WisbObjectType.Event]: this.db.events,
            [WisbObjectType.Wasteland]: this.db.wastelands,
        }

        const item = map[ref.type].get(ref.id)

        if (item != null) {
            return {
                data: item as TypeMap<T>
            }
        } else {
            return {
                error: GeneralError.InvalidDataProvided,
                description: "No item of provided id and type found"
            }
        }
    }

    @api_endpoint({ checkLogin: true })
    async getMany<T extends WisbObjectType>(type: T, query: QueryMap<T>, range: [number, number]): Promise<APIResponse<GeneralError, TypeMap<T>[]>> {
        let list: TypeMap<T>[] = []

        if (type == WisbObjectType.User) {
            list = [...this.db.users.values()]
                .map(it => ({ ...it, password: "", email: "", points: this.calculateUserRank(it) }))
                .sort((a, b) => b.points - a.points)
                .filter(user => {
                    if ((query.phrase != null && query.phrase.length != 0) && (!user.email.includes(query.phrase) && !user.userName.includes(query.phrase))) {
                        return false
                    }

                    return true
                }) as any
        } else if (type == WisbObjectType.Dumpster) {
            const q = query as QueryMap<WisbObjectType.Dumpster>

            list = [...this.db.dumpsters.values()]
                .filter(dumpster => {
                    if ((query.phrase != null && query.phrase.length != 0) && !dumpster.description.includes(query.phrase)) {
                        return false
                    }

                    if (q.region != null && !isLatLngInRegion(q.region, dumpster.place.coords)) {
                        return false
                    }

                    return true
                }) as any
        } else if (type == WisbObjectType.Wasteland) {
            const q = query as QueryMap<WisbObjectType.Wasteland>

            list = [...this.db.wastelands.values()].filter(({ place, description, reportedBy, afterCleaningData }) => {
                if ((query.phrase != null && query.phrase.length != 0) && !place.asText.includes(query.phrase) && !description.includes(query.phrase)) {
                    return false
                }

                if (q.region != null && !isLatLngInRegion(q.region, place.coords)) {
                    return false
                }

                if (q.activeOnly === true && afterCleaningData != null) {
                    return false
                }

                return true
            }) as any
        } else if (type == WisbObjectType.Event) {
            const q = query as QueryMap<WisbObjectType.Event>

            const currentUser = this.getCurrentUser()!

            list = [...this.db.events.values()].filter((event) => {
                if (q.onlyOwn && ![...event.members.values()].some(member => member.id == currentUser.id)) {
                    return false
                }

                if (q.phrase !== undefined && q.phrase?.length !== 0 && !event.name.includes(q.phrase)) {
                    return false
                }

                if (q.region != null && !isLatLngInRegion(q.region, event.place.coords)) {
                    return false
                }

                if (q.activeOnly != null && event.dateRange[1] < new Date()) {
                    return false
                }

                if (q.dateRange != null) {
                    if (q.dateRange[0] != null && event.dateRange[0] < q.dateRange[0]) {
                        return false
                    }

                    if (q.dateRange[1] != null && event.dateRange[1] > q.dateRange[1]) {
                        return false
                    }
                }

                return true
            })
                .sort((a, b) => a.dateRange[0] > b.dateRange[1] ? -1 : +1) as any
        }

        return {
            data: list.slice(range[0], range[1])
        }
    }

    @api_endpoint({ checkLogin: true, altersData: true, notification: (api, ref) => [{ action: CRUD.Deleted, ref }] })
    async deleteOne<T extends WisbObjectType.Dumpster | WisbObjectType.Event | WisbObjectType.Wasteland>(ref: Ref<T>): Promise<APIResponse<GeneralError, {}>> {
        const map = {
            [WisbObjectType.Dumpster]: this.db.dumpsters,
            [WisbObjectType.Event]: this.db.events,
            [WisbObjectType.Wasteland]: this.db.wastelands,
        }

        const currentUser = this.getCurrentUser()!

        if(ref.type == WisbObjectType.Dumpster) {
            const dumpster = this.db.dumpsters.get(ref.id)

            if(dumpster == null) {
                return {
                    error: GeneralError.InvalidDataProvided,
                    description: "Item of provided id does not exist"
                }
            }

            if(dumpster.addedBy.id != currentUser.id) {
                return {
                    error: GeneralError.UserNotAuthorized,
                    description: "Only user who reported Wasteland may delete it"
                }
            }
        } else if(ref.type == WisbObjectType.Wasteland) {
            const wasteland = this.db.wastelands.get(ref.id)

            if(wasteland == null) {
                return {
                    error: GeneralError.InvalidDataProvided,
                    description: "Item of provided id does not exist"
                }
            }

            if(wasteland.reportedBy.id != currentUser.id) {
                return {
                    error: GeneralError.UserNotAuthorized,
                    description: "Only user who reported Wasteland may delete it"
                }
            }
        } else if(ref.type == WisbObjectType.Event) {
            const event = this.db.events.get(ref.id)

            if(event == null) {
                return {
                    error: GeneralError.InvalidDataProvided,
                    description: "Item of provided id does not exist"
                }
            }

            if(![...event.members.values()].some(it => it.id == currentUser.id && it.isAdmin)) {
                return {
                    error: GeneralError.UserNotAuthorized,
                    description: "Only administrator of event may delete it"
                }
            }
        }

        map[ref.type].delete(ref.id)

        return {
            data: {}
        }
    }

    @api_endpoint({ checkLogin: true, altersData: true, notification: (api, ref, update) => [{ action: CRUD.Updated, ref, updatedFields: update }] })
    async updateOne<T extends WisbObjectType>(ref: Ref<T>, update: Partial<CreateMap<T>>): Promise<APIResponse<GeneralError, {}>> {
        const currentUser = this.getCurrentUser()!

        if (ref.type == WisbObjectType.Dumpster) {
            const dumpster = this.db.dumpsters.get(ref.id)

            if (dumpster == null) {
                return {
                    error: GeneralError.InvalidDataProvided,
                    description: "Item of provided id does not exist"
                }
            }

            if(currentUser.id != dumpster.addedBy.id) {
                return {
                    error: GeneralError.UserNotAuthorized,
                    description: "Only user who reported the dumpster may report it"
                }
            }

            this.db.dumpsters.set(ref.id, { ...this.db.dumpsters.get(ref.id)!, ...update })
        } else if (ref.type == WisbObjectType.Wasteland) {
            const wasteland = this.db.wastelands.get(ref.id)

            if (wasteland == null) {
                return {
                    error: GeneralError.InvalidDataProvided,
                    description: "Item of provided id does not exist"
                }
            }

            if(currentUser.id != wasteland.reportedBy.id) {
                return {
                    error: GeneralError.UserNotAuthorized,
                    description: "Only user who reported the wasteland may report it"
                }
            }

            this.db.wastelands.set(ref.id, { ...this.db.wastelands.get(ref.id)!, ...update })
        } else if (ref.type == WisbObjectType.Event) {
            const event = this.db.events.get(ref.id)

            if (event == null) {
                return {
                    error: GeneralError.InvalidDataProvided,
                    description: "Item of provided id does not exist"
                }
            }

            if([...event.members.values()].some(it => it.id == currentUser.id && it.isAdmin)) {
                return {
                    error: GeneralError.UserNotAuthorized,
                    description: "Only user who reported the wasteland may report it"
                }
            }

            this.db.events.set(ref.id, { ...this.db.events.get(ref.id)!, ...update })
        } else if (ref.type == WisbObjectType.User) {
            const user = this.db.users.get(ref.id)

            if (user == null) {
                return {
                    error: GeneralError.InvalidDataProvided,
                    description: "Item of provided id does not exist"
                }
            }

            if(currentUser.id != user.id) {
                return {
                    error: GeneralError.UserNotAuthorized,
                    description: "User may only change own data"
                }
            }

            this.db.users.set(ref.id, { ...this.db.users.get(ref.id)!, ...update })
        }

        return {
            data: {}
        }
    }

    @api_endpoint({ checkLogin: true, altersData: true, notification: (api, event, users) => users.map(({ id, asAdmin }) => ({ invitation: { event: { type: WisbObjectType.Event, id: event.id }, user: { type: WisbObjectType.User, id }, asAdmin } })) })
    async sendEventInvitations(event: WisbEvent, users: (Ref<WisbObjectType.User> & { asAdmin: boolean })[]): Promise<APIResponse<GeneralError, {}>> {
        for (const user of users) {
            const invitations = this.db.invitations.get(user.id) ?? []

            if (invitations.some(it => it.event.id == event.id)) {
                continue
            }

            invitations.push({
                event: { type: WisbObjectType.Event, id: event.id },
                user: { type: WisbObjectType.User, id: user.id },
                asAdmin: user.asAdmin
            })

            this.db.invitations.set(user.id, invitations)
        }

        return {
            data: {}
        }
    }

    @api_endpoint({ checkLogin: true, altersData: true, notification: (api, event) => [{ action: CRUD.Updated, ref: { type: WisbObjectType.Event, id: isEvent(event) ? event.id : event.event.id }, updatedFields: "members" }] })
    async joinEvent(obj: WisbEvent | Invitation): Promise<APIResponse<GeneralError, {}>> {
        const currentUser = this.getCurrentUser()!

        let eventId: number
        let asAdmin: boolean
        if ((obj as Invitation).asAdmin != undefined) {
            const invitation = obj as Invitation

            const userInvitations = this.db.invitations.get(currentUser.id) ?? []
            this.db.invitations.set(currentUser.id, userInvitations.filter(it => it.event.id != invitation.event.id))
            //usuń zaproszenie, dolacz do eventu

            eventId = invitation.event.id
            asAdmin = invitation.asAdmin
        } else {
            const event = obj as WisbEvent

            eventId = event.id
            asAdmin = false
        }

        const event = this.db.events.get(eventId)!
        event.members.set(currentUser.id, { type: WisbObjectType.User, id: currentUser.id, isAdmin: asAdmin })

        return {
            data: {
                updatedItem: {}
            }
        }
    }

    @api_endpoint({ checkLogin: true, altersData: true, notification: (api, event) => [{ action: CRUD.Updated, ref: { type: WisbObjectType.Event, id: event.id }, updatedFields: "members" }] })
    async leaveEvent(event: WisbEvent): Promise<APIResponse<GeneralError, {}>> {
        const currentUser = this.getCurrentUser()!

        const currentEvent = this.db.events.get(event.id)!
        currentEvent.members.delete(currentUser.id)

        return {
            data: {}
        }
    }

    @api_endpoint({ checkLogin: true, altersData: true })
    async removeInvitation(invitation: Invitation): Promise<APIResponse<GeneralError, {}>> {
        const user = this.getCurrentUser()!

        this.db.invitations.delete(user.id)

        return {
            data: {}
        }
    }

    @api_endpoint({ checkLogin: true })
    async getEventWastelands(event: WisbEvent): Promise<APIResponse<GeneralError, WisbWasteland[]>> {
        return {
            data: [...event.wastelands.values()].map(it => this.db.wastelands.get(it.id)!)
        }
    }

    @api_endpoint({ checkLogin: true })
    async getEventMembers(event: WisbEvent): Promise<APIResponse<GeneralError, WisbUser[]>> {
        return {
            data: [...event.members.values()].map(it => this.db.users.get(it.id)!)
        }
    }

    @api_endpoint({ checkLogin: true })
    async getMyInvitations(): Promise<APIResponse<GeneralError, Invitation[]>> {
        const currentUser = this.getCurrentUser()!

        return {
            data: this.db.invitations.get(currentUser.id) ?? []
        }
    }

    @api_endpoint({ checkLogin: true, altersData: true, notification: (api, message) => [{ message }] })
    async sendEventMessage(message: Omit<Message, "date" | "sender">): Promise<APIResponse<GeneralError, {}>> {
        const currentUser = this.getCurrentUser()!
        const messages = this.db.messages.get(message.event.id) ?? []

        this.db.messages.set(message.event.id, [
            ...messages,
            {
                ...message,
                sender: { type: WisbObjectType.User, id: currentUser.id },
                date: new Date()
            }
        ])

        return {
            data: {}
        }
    }

    @api_endpoint({ checkLogin: true })
    async getEventMessages(event: WisbEvent, query: { phrase?: string | undefined }, indices: [number, number]): Promise<APIResponse<{}, Message[]>> {
        const messages = this.db.messages.get(event.id)?.filter(message => {
            if (query.phrase != null && message.content.toLocaleLowerCase().includes(query.phrase.toLocaleLowerCase())) {
                return true
            }

            return true
        })

        return {
            data: messages?.slice(indices[0], indices[1]) ?? []
        }
    }

    @api_endpoint({ checkLogin: true, altersData: true, notification: (api, { id }) => [{ action: CRUD.Updated, ref: { type: WisbObjectType.Wasteland, id }, updatedFields: "afterCleaningData" }] })
    async clearWasteland(wasteland: WisbWasteland, cleaningData: WastelandCleaningData): Promise<APIResponse<GeneralError, {}>> {
        const currentWasteland = this.db.wastelands.get(wasteland.id)!
        this.db.wastelands.set(wasteland.id, {
            ...currentWasteland,
            afterCleaningData: cleaningData
        })

        return {
            data: {}
        }
    }

    getCurrentUser(): WisbUser | null {
        return this.db.currentUser
    }


    @api_endpoint({ checkLogin: true, altersData: true })
    async login(email: string, password: string): Promise<APIResponse<LoginError, WisbUser>> {
        const fittingUser = [...this.db.users.values()].find(it => it.email == email)

        if (fittingUser == null) {
            return {
                error: LoginError.UserDoesNotExist
            }
        }

        if (fittingUser.password != password) {
            return {
                error: LoginError.InvalidPassword
            }
        }

        this.db.currentUser = fittingUser

        return {
            data: fittingUser
        }
    }

    @api_endpoint({ checkLogin: true, altersData: true })
    async logout(): Promise<APIResponse<LogoutError, {}>> {
        this.db.currentUser = null

        return {
            data: {}
        }
    }

    @api_endpoint({ checkLogin: true, altersData: true, notification: (api, user) => [{ action: CRUD.Created, type: WisbObjectType.User }] })
    async signUp(user: Pick<WisbUser, "photoUrl" | "email" | "userName" | "password">): Promise<APIResponse<SignUpError, {}>> {
        const usersList = [...this.db.users.values()]

        //checking if userName is unique
        if (usersList.some(existing => existing.userName == user.userName)) {
            return {
                error: SignUpError.InvalidDataProvided,
                description: "Username already registered"
            }
        }

        //checking if email is unique
        if (usersList.some(existing => existing.email == user.email)) {
            return {
                error: SignUpError.InvalidDataProvided,
                description: "Email already registered"
            }
        }

        const newId = Math.max(...usersList.map(user => user.id)) + 1

        this.db.users.set(newId, {
            ...user,
            id: newId,
            nrOfClearedWastelands: 0,
            addedDumpsters: 0,
            deletedDumpsters: 0
        })

        return {
            data: {}
        }
    }

    @api_endpoint({ checkLogin: true, altersData: true })
    async resetPassword(email: string): Promise<APIResponse<GeneralError, {}>> {
        throw new Error("Method not implemented.");
    }

    @api_endpoint({ checkLogin: true, altersData: true })
    async changePassword(currentPassword: string, newPassword: string): Promise<APIResponse<GeneralError, {}>> {
        throw new Error("Method not implemented.");
    }
}