import GeoHelper from "../../utils/GeoHelper";
import compareDates from "../../utils/dates/compareDates";
import type { APIResponse, CreateMap, QueryMap, TypeMap } from "../API";
import API, { GeneralError, LogoutError, SignUpError } from "../API";
import type Ref from "../Ref";
import WisbObjectType from "../WisbObjectType";
import type { Invitation, WastelandCleaningData, WisbEvent, WisbMessage, WisbUser, WisbWasteland } from "../interfaces";
import { CRUD } from "../notifications";
import { isEvent, isInvitation } from "../type_guards";
import Storage from "./Storage";
import api_endpoint from "./api_endpoint";
import startCRUDDaemon from "./deamons/startCRUDDaemon";
import startInvitationSendingDaemon from "./deamons/startInvitationSendingDaemon";
import startMessageSendingDaemon from "./deamons/startMessageSendingDaemon";
import startWastelandClearingDaemon from "./deamons/startWastelandClearingDaemon";

let crudTimeout: NodeJS.Timeout | null = null
let invitationsTimeout: NodeJS.Timeout | null = null
let messagesTimeout: NodeJS.Timeout | null = null
let wastelandClearingTimeout: NodeJS.Timeout | null = null

export default class MockupAPI extends API {
    protected storage = new Storage()

    constructor() {
        super()

        if(crudTimeout != null) {
            clearInterval(crudTimeout)
        }
        if(invitationsTimeout != null) {
            clearInterval(invitationsTimeout)
        }
        if(messagesTimeout != null) {
            clearInterval(messagesTimeout)
        }
        if(wastelandClearingTimeout != null) {
            clearInterval(wastelandClearingTimeout)
        }

        crudTimeout = startCRUDDaemon({ storage: this.storage, broadcastNotifications: this.broadcastNotifications, interval: 30 * 1000 })
        invitationsTimeout = startInvitationSendingDaemon({ storage: this.storage, broadcastNotifications: this.broadcastNotifications, interval: 20 * 1000 })
        messagesTimeout = startMessageSendingDaemon({ storage: this.storage, broadcastNotifications: this.broadcastNotifications, interval: 10 * 1000 })
        wastelandClearingTimeout = startWastelandClearingDaemon({ storage: this.storage, broadcastNotifications: this.broadcastNotifications, interval: 4000 * 5 + 10 * 1000 })
    }

    @api_endpoint({ checkLogin: true, altersData: true, notification: (_, event) => [{ ref: { type: WisbObjectType.Event, id: event.id }, action: CRUD.Updated, type: WisbObjectType.Event }] })
    async updateMemberType(event: WisbEvent, user: Ref<WisbObjectType.User>, isAdmin: boolean): Promise<APIResponse<GeneralError, {}>> {
        const actualEvent = this.storage.get().events.get(event.id.toString())

        if (actualEvent == null) {
            return {
                error: GeneralError.InvalidDataProvided,
                description: "Event of provided id does not exist"
            }
        }

        const memberInfo = actualEvent.members.get(user.id.toString())

        if (memberInfo == null) {
            return {
                error: GeneralError.InvalidDataProvided,
                description: "User of provided id os not a member of provided event"
            }
        }

        actualEvent.members.set(user.id.toString(), { ...memberInfo, isAdmin })

        return {
            data: {}
        }
    }

    @api_endpoint({ checkLogin: true, altersData: true, notification: (_, type, object) => [{ action: CRUD.Created, type }] })
    async createOne<T extends WisbObjectType.Dumpster | WisbObjectType.Event | WisbObjectType.Wasteland>(type: T, object: CreateMap<T>): Promise<APIResponse<GeneralError, Ref<T>>> {
        const currentUser = this.getCurrentUser()!

        const collection = {
            [WisbObjectType.Dumpster]: this.storage.get().dumpsters,
            [WisbObjectType.Event]: this.storage.get().events,
            [WisbObjectType.Wasteland]: this.storage.get().wastelands
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

        const newId = Math.max(...[...collection.keys()].map(it => parseInt(it))) + 1

        let newObject: TypeMap<T> = {
            ...defaultObject,
            ...object,
            id: newId
        } as any

        if (type == WisbObjectType.Event) {
            newObject = {
                ...newObject,
                members: new Map([[currentUser.id.toString(), { type: WisbObjectType.User, id: currentUser.id, isAdmin: true }]])
            }
        }

        collection.set(newId.toString(), newObject as any)

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
            [WisbObjectType.Dumpster]: this.storage.get().dumpsters,
            [WisbObjectType.Event]: this.storage.get().events,
            [WisbObjectType.Wasteland]: this.storage.get().wastelands,
        }

        const item = map[ref.type].get(ref.id.toString())

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
    async getMany<T extends WisbObjectType>(type: T, query: QueryMap<T>, range: [number, number]): Promise<APIResponse<GeneralError, { items: TypeMap<T>[], totalLength: number }>> {
        let list: TypeMap<T>[] = []

        if (type === WisbObjectType.User) {
            list = [...this.storage.get().users.values()]
                .map(it => ({ ...it, password: "", email: "", points: this.calculateUserRank(it) }))
                .sort((a, b) => b.points - a.points)
                .filter(user => {
                    if ((query.phrase != null && query.phrase.length != 0) && (!user.email.includes(query.phrase) && !user.userName.includes(query.phrase))) {
                        return false
                    }

                    return true
                }) as any
        } else if (type === WisbObjectType.Dumpster) {
            const q = query as QueryMap<WisbObjectType.Dumpster>

            list = [...this.storage.get().dumpsters.values()]
                .filter(dumpster => {
                    if ((query.phrase != null && query.phrase.length != 0) && !dumpster.description.includes(query.phrase)) {
                        return false
                    }

                    if (q.region != null && !GeoHelper.isLatLngInRegion(q.region, dumpster.place.coords)) {
                        return false
                    }

                    return true
                }) as any
        } else if (type === WisbObjectType.Wasteland) {
            const q = query as QueryMap<WisbObjectType.Wasteland>

            list = [...this.storage.get().wastelands.values()].filter(({ place, description, reportedBy, afterCleaningData }) => {
                if ((query.phrase != null && query.phrase.length != 0) && !place.asText.includes(query.phrase) && !description.includes(query.phrase)) {
                    return false
                }

                if (q.region != null && !GeoHelper.isLatLngInRegion(GeoHelper.scaleRegion(q.region, 1.1), place.coords)) {
                    return false
                }

                if (q.activeOnly === true && afterCleaningData != null) {
                    return false
                }

                return true
            }) as any
        } else if (type === WisbObjectType.Event) {
            const q = query as QueryMap<WisbObjectType.Event>

            const currentUser = this.getCurrentUser()!

            list = [...this.storage.get().events.values()].filter((event) => {
                if (q.onlyOwn && ![...event.members.values()].some(member => member.id == currentUser.id)) {
                    return false
                }

                if (q.phrase !== undefined && q.phrase?.length !== 0 && !event.name.toLocaleLowerCase().includes(q.phrase.toLocaleLowerCase())) {
                    return false
                }

                if (q.region != null && !GeoHelper.isLatLngInRegion(q.region, event.place.coords)) {
                    return false
                }

                if (typeof q.activeOnly == "boolean") {
                    const result = compareDates(event.dateRange[1], new Date(), { year: true, month: true, date: true })

                    return !(
                        (q.activeOnly && (result.firstBigger || result.equal)) ||
                        (!q.activeOnly && result.firstSmaller)
                    )
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
            }).sort((a, b) => a.dateRange[0] > b.dateRange[1] ? -1 : +1) as any
        }

        return {
            data: {
                totalLength: list.length,
                items: list.slice(range[0], isNaN(range[1]) ? list.length - 1 : range[1])
            }
        }
    }

    @api_endpoint({ checkLogin: true, altersData: true, notification: (api, ref) => [{ action: CRUD.Deleted, ref }] })
    async deleteOne<T extends WisbObjectType.Dumpster | WisbObjectType.Event | WisbObjectType.Wasteland>(ref: Ref<T>): Promise<APIResponse<GeneralError, {}>> {
        const map = {
            [WisbObjectType.Dumpster]: this.storage.get().dumpsters,
            [WisbObjectType.Event]: this.storage.get().events,
            [WisbObjectType.Wasteland]: this.storage.get().wastelands,
        }

        const currentUser = this.getCurrentUser()!

        if (ref.type == WisbObjectType.Dumpster) {
            const dumpster = this.storage.get().dumpsters.get(ref.id.toString())

            if (dumpster == null) {
                return {
                    error: GeneralError.InvalidDataProvided,
                    description: "Item of provided id does not exist"
                }
            }

            if (dumpster.addedBy.id != currentUser.id) {
                return {
                    error: GeneralError.UserNotAuthorized,
                    description: "Only user who reported Dumpster may delete it"
                }
            }
        } else if (ref.type == WisbObjectType.Wasteland) {
            const wasteland = this.storage.get().wastelands.get(ref.id.toString())

            if (wasteland == null) {
                return {
                    error: GeneralError.InvalidDataProvided,
                    description: "Item of provided id does not exist"
                }
            }

            if (wasteland.reportedBy.id != currentUser.id) {
                return {
                    error: GeneralError.UserNotAuthorized,
                    description: "Only user who reported Wasteland may delete it"
                }
            }
        } else if (ref.type == WisbObjectType.Event) {
            const event = this.storage.get().events.get(ref.id.toString())

            if (event == null) {
                return {
                    error: GeneralError.InvalidDataProvided,
                    description: "Item of provided id does not exist"
                }
            }

            if (![...event.members.values()].some(it => it.id == currentUser.id && it.isAdmin)) {
                return {
                    error: GeneralError.UserNotAuthorized,
                    description: "Only administrator of event may delete it"
                }
            }
        }

        map[ref.type].delete(ref.id.toString())

        return {
            data: {}
        }
    }

    @api_endpoint({ checkLogin: true, altersData: true, notification: (api, ref, update) => [{ action: CRUD.Updated, ref, updatedFields: update }] })
    async updateOne<T extends WisbObjectType>(ref: Ref<T>, update: Partial<CreateMap<T>>): Promise<APIResponse<GeneralError, {}>> {
        const currentUser = this.getCurrentUser()!

        if (ref.type == WisbObjectType.Dumpster) {
            const dumpster = this.storage.get().dumpsters.get(ref.id.toString())

            if (dumpster == null) {
                return {
                    error: GeneralError.InvalidDataProvided,
                    description: "Item of provided id does not exist"
                }
            }

            if (currentUser.id != dumpster.addedBy.id) {
                return {
                    error: GeneralError.UserNotAuthorized,
                    description: "Only user who reported the dumpster may report it"
                }
            }

            this.storage.get().dumpsters.set(ref.id.toString(), { ...this.storage.get().dumpsters.get(ref.id.toString())!, ...update })
        } else if (ref.type == WisbObjectType.Wasteland) {
            const wasteland = this.storage.get().wastelands.get(ref.id.toString())

            if (wasteland == null) {
                return {
                    error: GeneralError.InvalidDataProvided,
                    description: "Item of provided id does not exist"
                }
            }

            if (currentUser.id != wasteland.reportedBy.id) {
                return {
                    error: GeneralError.UserNotAuthorized,
                    description: "Only user who reported the wasteland may report it"
                }
            }

            this.storage.get().wastelands.set(ref.id.toString(), { ...this.storage.get().wastelands.get(ref.id.toString())!, ...update })
        } else if (ref.type == WisbObjectType.Event) {
            const event = this.storage.get().events.get(ref.id.toString())

            if (event == null) {
                return {
                    error: GeneralError.InvalidDataProvided,
                    description: "Item of provided id does not exist"
                }
            }

            if (event.members.get(currentUser.id.toString())?.isAdmin !== true) {
                return {
                    error: GeneralError.UserNotAuthorized,
                    description: "Only administrator may change event"
                }
            }

            this.storage.get().events.set(ref.id.toString(), { ...event, ...update })
        } else if (ref.type == WisbObjectType.User) {
            const user = this.storage.get().users.get(ref.id.toString())

            if (user == null) {
                return {
                    error: GeneralError.InvalidDataProvided,
                    description: "Item of provided id does not exist"
                }
            }

            if (currentUser.id != user.id) {
                return {
                    error: GeneralError.UserNotAuthorized,
                    description: "User may only change own data"
                }
            }

            const newUser = { ...this.storage.get().users.get(ref.id.toString())!, ...update }
            this.storage.get().currentUser = newUser
            this.storage.get().users.set(ref.id.toString(), newUser)
        }

        return {
            data: {}
        }
    }

    @api_endpoint({ checkLogin: true, altersData: true, notification: (api, event, users) => users.map(({ id, asAdmin }) => ({ invitation: { event: { type: WisbObjectType.Event, id: event.id }, user: { type: WisbObjectType.User, id }, asAdmin } })) })
    async sendEventInvitations(eventRef: Ref<WisbObjectType.Event>, users: (Ref<WisbObjectType.User> & { asAdmin: boolean })[]): Promise<APIResponse<GeneralError, {}>> {
        const event = this.storage.get().events.get(eventRef.id.toString())

        if (event == null) {
            return {
                error: GeneralError.InvalidDataProvided,
                description: "Event of provided id does not exist"
            }
        }

        for (const user of users) {
            const invitations = this.storage.get().invitations.get(user.id.toString()) ?? []

            if (invitations.some(it => it.event.id == event.id)) {
                continue
            }

            invitations.push({
                event: { type: WisbObjectType.Event, id: event.id, name: event.name },
                user: { type: WisbObjectType.User, id: user.id },
                asAdmin: user.asAdmin
            })

            this.storage.get().invitations.set(user.id.toString(), invitations)
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
        if (isInvitation(obj)) {
            const invitation = obj as Invitation

            const userInvitations = this.storage.get().invitations.get(currentUser.id.toString()) ?? []
            this.storage.get().invitations.set(currentUser.id.toString(), userInvitations.filter(it => it.event.id != invitation.event.id))

            eventId = invitation.event.id
            asAdmin = invitation.asAdmin
        } else if (isEvent(obj)) {
            eventId = obj.id
            asAdmin = false
        } else throw new Error("Invalid object sent, expected Invitation of Event")

        const event = this.storage.get().events.get(eventId.toString())!
        event.members.set(currentUser.id.toString(), { type: WisbObjectType.User, id: currentUser.id, isAdmin: asAdmin })

        return {
            data: {}
        }
    }

    @api_endpoint({ checkLogin: true, altersData: true, notification: (api, event) => [{ action: CRUD.Updated, ref: { type: WisbObjectType.Event, id: event.id }, updatedFields: "members" }] })
    async leaveEvent(event: WisbEvent): Promise<APIResponse<GeneralError, {}>> {
        const currentUser = this.getCurrentUser()!
        const currentEvent = this.storage.get().events.get(event.id.toString())!
        const asMember = currentEvent.members.get(currentUser.id.toString())

        if (asMember == null) {
            return {
                error: GeneralError.InvalidDataProvided,
                description: "User is not a member of event"
            }
        }

        if (asMember.isAdmin) {
            return {
                error: GeneralError.InvalidDataProvided,
                description: "User cannot leave event which he created"
            }
        }

        currentEvent.members.delete(currentUser.id.toString())

        return {
            data: {}
        }
    }

    @api_endpoint({ checkLogin: true, altersData: true })
    async removeInvitation(invitation: Invitation): Promise<APIResponse<GeneralError, {}>> {
        const user = this.getCurrentUser()!

        const invitations = this.storage.get().invitations.get(user.id.toString())?.filter(it => it.user.id != user.id) ?? []
        this.storage.get().invitations.set(user.id.toString(), invitations)

        return {
            data: {}
        }
    }

    @api_endpoint({ checkLogin: true })
    async getEventWastelands(event: WisbEvent): Promise<APIResponse<GeneralError, WisbWasteland[]>> {
        return {
            data: [...event.wastelands.values()].map(it => this.storage.get().wastelands.get(it.id.toString())!)
        }
    }

    @api_endpoint({ checkLogin: true })
    async getEventMembers(event: WisbEvent): Promise<APIResponse<GeneralError, WisbUser[]>> {
        return {
            data: [...event.members.values()].map(it => this.storage.get().users.get(it.id.toString())!)
        }
    }

    @api_endpoint({ checkLogin: true })
    async getMyInvitations(): Promise<APIResponse<GeneralError, Invitation[]>> {
        const currentUser = this.getCurrentUser()!

        return {
            data: this.storage.get().invitations.get(currentUser.id.toString()) ?? []
        }
    }

    @api_endpoint({ checkLogin: true, altersData: true, notification: (api, message) => {
        const currentUser = api.getCurrentUser()!

        return [
            { message: {...message, sender: {type: WisbObjectType.User, id: currentUser.id, userName: currentUser.userName, photoUrl: currentUser.photoUrl }} }
        ]
    } })
    async sendEventMessage(message: Omit<WisbMessage, "date" | "sender">): Promise<APIResponse<GeneralError, {}>> {
        const currentUser = this.getCurrentUser()!

        const event = this.storage.get().events.get(message.event.id.toString())
        if (event == null) {
            return {
                error: GeneralError.InvalidDataProvided,
                description: "Event of provided id does not exist"
            }
        }

        if (!event.members.has(currentUser.id.toString())) {
            return {
                error: GeneralError.UserNotAuthorized,
                description: "User must be member of event to send a message"
            }
        }

        const messages = this.storage.get().messages.get(message.event.id.toString()) ?? []

        this.storage.get().messages.set(message.event.id.toString(), [
            ...messages,
            {
                ...message,
                sender: { type: WisbObjectType.User, id: currentUser.id, userName: currentUser.userName, photoUrl: currentUser.photoUrl },
                date: new Date()
            }
        ])

        return {
            data: {}
        }
    }

    @api_endpoint({ checkLogin: true })
    async getEventMessages(event: WisbEvent, indices: [number, number]): Promise<APIResponse<{}, { items: WisbMessage[], totalLength: number }>> {
        if(!event.members.has(this.getCurrentUser()!.id.toString())) {
            return {
                error: GeneralError.UserNotAuthorized,
                description: "User must be member of an event to read messages"
            }
        }
        
        const messages = this.storage.get().messages
            .get(event.id.toString())
            ?.sort((a, b) => b.date.getTime() - a.date.getTime())

        return {
            data: {
                items: messages?.slice(indices[0], indices[1]) ?? [],
                totalLength: messages?.length ?? 0
            }
        }
    }

    @api_endpoint({ checkLogin: true, altersData: true, notification: (api, { id }) => [{ action: CRUD.Updated, ref: { type: WisbObjectType.Wasteland, id }, updatedFields: "afterCleaningData" }] })
    async clearWasteland(wasteland: WisbWasteland, cleaningData: WastelandCleaningData): Promise<APIResponse<GeneralError, {}>> {
        const currentWasteland = this.storage.get().wastelands.get(wasteland.id.toString())!
        this.storage.get().wastelands.set(wasteland.id.toString(), {
            ...currentWasteland,
            afterCleaningData: cleaningData
        })

        return {
            data: {}
        }
    }

    getCurrentUser(): WisbUser | null {
        return this.storage.get().currentUser
    }


    @api_endpoint({ altersData: true })
    async login(email: string, password: string): Promise<APIResponse<GeneralError, WisbUser>> {
        const fittingUser = [...this.storage.get().users.values()].find(it => it.email == email && it.password == password)

        if (fittingUser == null) {
            return {
                error: GeneralError.InvalidDataProvided
            }
        }

        this.storage.get().currentUser = fittingUser

        return {
            data: fittingUser
        }
    }

    @api_endpoint({ checkLogin: true, altersData: true })
    async logout(): Promise<APIResponse<LogoutError, {}>> {
        this.storage.get().currentUser = null

        return {
            data: {}
        }
    }

    @api_endpoint({ checkLogin: false, altersData: true, notification: (api, user) => [{ action: CRUD.Created, type: WisbObjectType.User }] })
    async signUp(user: Pick<WisbUser, "photoUrl" | "email" | "userName" | "password">): Promise<APIResponse<SignUpError, {}>> {
        const usersList = [...this.storage.get().users.values()]

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

        this.storage.get().users.set(newId.toString(), {
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