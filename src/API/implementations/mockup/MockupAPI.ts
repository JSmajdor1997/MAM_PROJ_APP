import API, { GeneralError, SignUpError, LoginError, LogoutError, RemoveAccountError } from "../../API";
import type { ChangeListener, ClearingWastelandError, DumpstersQuery, EventsQuery, UsersQuery, WastelandsQuery } from "../../API";
import type Dumpster from "../../data_types/Dumpster";
import type Event from "../../data_types/Event";
import type { EventUser } from "../../data_types/Event";
import Message from "../../data_types/Message";
import User from "../../data_types/User";
import getMockupUsers from "./mockup_users"
import type Wasteland from "../../data_types/Wasteland";
import APIResponse from "../../APIResponse";
import getMockupDumpsters from "./mockup_dumpsters";
import getMockupEvents from "./mockup_events";
import getMockupWastelands from "./mockup_wastelands";
import { faker } from '@faker-js/faker';
import isLatLngInRegion from "../../../utils/isLatLngInRegion";
import type { Notification, NotificationFilter } from "../../data_types/notifications";
import calcApproxDistanceBetweenLatLngInMeters from "../../../utils/calcApproxDistanceBetweenLatLng";
import { LatLng } from "react-native-maps";
import type { Invitation } from "../../data_types/Invitation";
import getMockupInvitations from "./getMockupInvitations";

function api_endpoint(checkLogin: boolean) {
    return function <T extends (...args: any[]) => Promise<any>>(target: any, key: string, descriptor: TypedPropertyDescriptor<any>): TypedPropertyDescriptor<T> | void {
        const originalMethod = descriptor.value!;
        descriptor.value = async function (...args: Parameters<T>): Promise<ReturnType<T>> {
            if (checkLogin && (this as any).loggedInUser == null) {
                return {
                    error: GeneralError.UserNotAuthorized
                } as any;
            }
            const delay = Math.floor(Math.random() * 400);
            await new Promise(resolve => setTimeout(resolve, delay));
            return await originalMethod.apply(this, args);
        };

        return descriptor;
    };
}

export default class MockupAPI extends API {
    private users = [...getMockupUsers(), {
        id: 0,
        email: "aaa@bbb.com",
        userName: "Zeriusz",
        password: "abc",
        nrOfClearedWastelands: 0,
        addedDumpsters: 0,
        deletedDumpsters: 0
    }]
    private dumpsters = getMockupDumpsters(this.users)
    private wastelands = getMockupWastelands(this.users)
    private events = getMockupEvents(this.users, this.wastelands)
    private invitations = getMockupInvitations(this.events, this.users)

    constructor() {
        super()

        //creating random invitations
        setInterval(() => {
            return
            const user = this.loggedInUser
            if (user == null) {
                return
            }

            const allEventsWithoutUser = this.events.filter(it => !it.members.some(it => it.id == user.id) && !it.admins.some(it => it.id == user.id))

            if(allEventsWithoutUser.length == 0) {
                return
            }

            const event = faker.helpers.arrayElement(allEventsWithoutUser).event
            const invitation: Invitation = {
                event,
                user
            }

            this.invitations.push(invitation)

            this.callAllListeners({
                event,
                sender: faker.helpers.arrayElement(this.users)
            })
        }, 1000 * 30)

        //sending random messages
        setInterval(() => {
            return
            const user = this.loggedInUser
            if (user == null) {
                return
            }

            const allEventsWithUser = this.events.filter(it => it.members.some(it => it.id == user.id) || it.admins.some(it => it.id == user.id))
            if(allEventsWithUser.length == 0) {
                return
            }

            const foundEvent = faker.helpers.arrayElement(allEventsWithUser).event

            const message = {
                event: foundEvent,
                sender: faker.helpers.arrayElement(this.users),
                content: faker.word.sample(),
                date: new Date(),
                photosUrls: []
            }
    
            foundEvent.messages.push(message)
    
            this.callAllListeners({
                event: foundEvent,
                content: message.content
            })
        }, 1000 * 45)
    }

    private loggedInUser: User | null = this.users[this.users.length-1]

    async getCurrentUser(): Promise<APIResponse<GeneralError, User>> {
        if (this.loggedInUser == null) {
            return {
                error: GeneralError.UserNotAuthorized
            }
        }

        return {
            data: this.loggedInUser
        }
    }

    async isUserLoggedIn(): Promise<boolean> {
        return true
        return this.loggedInUser != null
    }

    async login(email: string, password: string): Promise<APIResponse<LoginError, User>> {
        const fittingUser = this.users.find(it => it.email == email)

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

        this.loggedInUser = fittingUser

        return {
            data: fittingUser
        }
    }

    @api_endpoint(true)
    async logout(): Promise<APIResponse<LogoutError, {}>> {
        this.loggedInUser = null

        this.onLogoutListeners.forEach(it => it())

        return {
            data: {}
        }
    }

    async signUp(data: Omit<User, "id" | "photoUrl" | "nrOfClearedWastelands" | "addedDumpsters" | "deletedDumpsters"> & { photoFile: File }): Promise<APIResponse<SignUpError, {}>> {
        //checking if userName is unique
        if (this.users.some(existing => existing.userName == data.userName)) {
            return {
                error: SignUpError.InvalidDataProvided,
                description: "Username already registered"
            }
        }

        //checking if email is unique
        if (this.users.some(existing => existing.email == data.email)) {
            return {
                error: SignUpError.InvalidDataProvided,
                description: "Email already registered"
            }
        }

        //checking if jpg or png
        if (!['image/jpeg', 'image/png'].includes(data.photoFile.type)) {
            return {
                error: SignUpError.InvalidDataProvided,
                description: "Provided photo must be jpg or png"
            }
        }

        this.users.push({
            ...data,
            id: Math.max(...this.users.map(user => user.id)) + 1,
            photoUrl: faker.image.avatar(),
            nrOfClearedWastelands: 0,
            addedDumpsters: 0,
            deletedDumpsters: 0
        })

        return {
            data: {}
        }
    }

    @api_endpoint(true)
    async removeAccount(): Promise<APIResponse<RemoveAccountError, {}>> {
        this.users = this.users.filter(user => user.id != this.loggedInUser?.id)
        this.logout()

        return {
            data: {}
        }
    }

    @api_endpoint(true)
    async updateSelf(newData: Partial<Omit<User, "id" | "nrOfClearedWastelands" | "addedDumpsters" | "deletedDumpsters">>): Promise<APIResponse<GeneralError, { newUser: User }>> {
        this.loggedInUser = {
            ...this.loggedInUser as User,
            ...newData
        }

        this.users = this.users.map(user => {
            if (user.id == this.loggedInUser?.id) {
                return this.loggedInUser
            } else {
                return user
            }
        })

        return {
            data: {
                newUser: this.loggedInUser
            }
        }
    }

    async resetPassword(): Promise<APIResponse<GeneralError, { newUser: User; }>> {
        throw new Error("Method not implemented.");
    }

    @api_endpoint(true)
    async getEvents<WithMembers extends boolean>(query: EventsQuery, range: [number, number] | null, withMembers: WithMembers): Promise<APIResponse<GeneralError, WithMembers extends false ? { items: Event[] } : { items: (Event & { members: EventUser[], admins: EventUser[] })[] }>> {
        const events = this.events.filter(({ event, members, admins }) => {
            if (query.onlyOwn && !members.some(member => member.id == this.loggedInUser!.id)) {
                return false
            }

            if ((query.phrase != null && query.phrase.length != 0) && !event.name.includes(query.phrase) && !event.description.includes(query.phrase)) {
                return false
            }

            if (query.region != null && !isLatLngInRegion(query.region, event.meetPlace.coords)) {
                return false
            }

            if (query.activeOnly != null && event.dateRange[1] < new Date()) {
                return false
            }

            if (query.dateRange != null) {
                if (query.dateRange[0] != null && event.dateRange[0] < query.dateRange[0]) {
                    return false
                }

                if (query.dateRange[1] != null && event.dateRange[1] > query.dateRange[1]) {
                    return false
                }
            }

            return true
        })
            .sort((a, b) => a.event.dateRange[0] > b.event.dateRange[1] ? -1 : +1)
            .map(({ event, members, admins }) => withMembers == true ? ({ ...event, members, admins }) : event)

        const from = range == null ? 0 : range[0]
        const to = range == null ? events.length : range[1]

        return {
            data: {
                items: events.slice(from, to) as any
            }
        }
    }

    @api_endpoint(true)
    async getEventById<WithMembers extends boolean>(id: number, withMembers: WithMembers): Promise<APIResponse<GeneralError, WithMembers extends false ? { item: Event } : { item: (Event & { members: EventUser[], admins: EventUser[] }) }>> {
        const foundEvent = this.events.find(it => it.event.id == id)

        if (foundEvent == null) {
            return {
                error: GeneralError.InvalidDataProvided
            }
        }

        return {
            data: { item: { ...foundEvent.event, members: foundEvent.members, admins: foundEvent.admins } } as any
        }
    }

    @api_endpoint(true)
    async getMyInvitations(): Promise<APIResponse<GeneralError, { items: Invitation[] }>> {
        return {
            data: {
                items: this.invitations.filter(it => it.user.id == this.loggedInUser!.id)
            }
        }
    }

    @api_endpoint(true)
    async sendInvitation(invitation: Invitation): Promise<APIResponse<GeneralError, {}>> {
        this.invitations = [
            ...this.invitations,
            invitation
        ]

        this.callAllListeners({
            event: invitation.event,
            sender: this.loggedInUser!
        })

        return {
            data: {}
        }
    }

    @api_endpoint(true)
    async createEvent(newEvent: Omit<Event, "id" | "isFinished" | "messages">, invitations: User[]): Promise<APIResponse<GeneralError, { createdItem: Event }>> {
        const createdEvent: Event = {
            ...newEvent,
            messages: [],
            id: Math.max(...this.events.map(event => event.event.id)) + 1
        }

        this.events = [
            ...this.events,
            {
                event: createdEvent,
                members: [this.loggedInUser as User],
                admins: [this.loggedInUser as User],
            }
        ]

        this.callAllListeners({
            newItem: createdEvent
        }, newEvent.meetPlace.coords)

        return {
            data: {
                createdItem: createdEvent
            }
        }
    }

    @api_endpoint(true)
    async deleteEvent(eventToDelete: Event): Promise<APIResponse<GeneralError, {}>> {
        if (this.events.find(it => it.event.id == eventToDelete.id)!.admins.some(admin => admin.id == this.loggedInUser?.id)) {
            return {
                error: GeneralError.UserNotAuthorized,
                description: "User must be admin of event"
            }
        }

        this.events = this.events.filter(event => eventToDelete.id != event.event.id)

        this.callAllListeners({
            deletedItem: eventToDelete
        }, eventToDelete.meetPlace.coords)

        return {
            data: {}
        }
    }

    @api_endpoint(true)
    async updateEvent(eventToUpdate: Event): Promise<APIResponse<GeneralError, { updatedItem: Event; }>> {
        if (this.events.find(it => it.event.id == eventToUpdate.id)!.admins.some(admin => admin.id == this.loggedInUser?.id)) {
            return {
                error: GeneralError.UserNotAuthorized,
                description: "User must be admin of event"
            }
        }

        this.events = this.events.map(event => {
            if (event.event.id == eventToUpdate.id) {
                return {
                    ...event,
                    ...eventToUpdate
                }
            }

            return event
        })

        this.callAllListeners({
            updatedItem: eventToUpdate
        }, eventToUpdate.meetPlace.coords)

        return {
            data: {
                updatedItem: eventToUpdate
            }
        }
    }

    @api_endpoint(true)
    async joinEvent(eventToJoin: Event): Promise<APIResponse<GeneralError, { updatedItem: Event; }>> {
        const foundEvent = this.events.find(it => it.event.id == eventToJoin.id)!

        if (foundEvent.members.some(member => member.id == this.loggedInUser!.id)) {
            return {
                error: GeneralError.InvalidDataProvided,
                description: "User already in event"
            }
        }

        this.events = this.events.map(event => {
            if (event.event.id == eventToJoin.id) {
                return {
                    ...event,
                    members: [
                        ...event.members,
                        this.loggedInUser!
                    ]
                }
            }

            return event
        })

        this.callAllListeners({
            updatedItem: eventToJoin
        }, eventToJoin.meetPlace.coords)

        return {
            data: {
                updatedItem: foundEvent.event
            }
        }
    }

    @api_endpoint(true)
    async leaveEvent(eventToLeave: Event): Promise<APIResponse<GeneralError, { updatedItem: Event; }>> {
        const foundEvent = this.events.find(it => it.event.id == eventToLeave.id)!

        if (!foundEvent.members.some(member => member.id == this.loggedInUser!.id)) {
            return {
                error: GeneralError.InvalidDataProvided,
                description: "User not in event"
            }
        }

        const updatedEvent = {
            event: eventToLeave,
            admins: foundEvent.admins.filter(admin => admin.id != this.loggedInUser!.id),
            members: foundEvent.members.filter(member => member.id != this.loggedInUser!.id),
        }

        this.events = this.events.map(event => {
            if (event.event.id == eventToLeave.id) {
                return updatedEvent
            }

            return event
        })

        return {
            data: {
                updatedItem: updatedEvent.event
            }
        }
    }

    @api_endpoint(true)
    async getEventMessages(event: Event, dateRange: [Date, Date]): Promise<APIResponse<GeneralError, { messages: Message[]; }>> {
        const foundEvent = this.events.find(it => it.event.id == event.id)!
        if (!foundEvent.members.some(member => member.id == this.loggedInUser!.id)) {
            return {
                error: GeneralError.InvalidDataProvided,
                description: "User not in event"
            }
        }

        return {
            data: {
                messages: event.messages.filter(ev => ev.date >= dateRange[0] && ev.date <= dateRange[1])
            }
        }
    }

    @api_endpoint(true)
    async sendEventMessage(event: Event, message: Omit<Message, "id" | "date" | "sender">): Promise<APIResponse<GeneralError, {}>> {
        const foundEvent = this.events.find(it => it.event.id == event.id)!
        if (!foundEvent.members.some(member => member.id == this.loggedInUser!.id)) {
            return {
                error: GeneralError.InvalidDataProvided,
                description: "User not in event"
            }
        }

        event.messages.push({
            ...message,
            sender: this.loggedInUser!,
            date: new Date()
        })

        this.events = this.events.map(ev => {
            if (ev.event.id == event.id) {
                return {
                    ...ev,
                    event
                }
            }

            return ev
        })

        this.callAllListeners({
            event,
            content: message.content
        })

        return {
            data: {}
        }
    }

    @api_endpoint(true)
    async getWastelands(query: WastelandsQuery, range?: [number, number]): Promise<APIResponse<GeneralError, { items: Wasteland[]; }>> {
        const wastelands = this.wastelands.filter(({ place, description, reportedBy, afterCleaningData }) => {
            if ((query.phrase != null && query.phrase.length != 0) && !place.asText.includes(query.phrase) && !description.includes(query.phrase)) {
                return false
            }

            if (query.region != null && !isLatLngInRegion(query.region, place.coords)) {
                return false
            }

            if (query.activeOnly === true && afterCleaningData != null) {
                return false
            }

            return true
        })

        const from = range == null ? 0 : range[0]
        const to = range == null ? wastelands.length : range[1]

        return {
            data: {
                items: wastelands.slice(from, to)
            }
        }
    }

    @api_endpoint(true)
    async createWasteland(newWasteland: Omit<Wasteland, "id" | "createdDate" | "afterCleaningData" | "reportedBy">): Promise<APIResponse<GeneralError, { createdItem: Wasteland; }>> {
        const createdWasteland: Wasteland = {
            ...newWasteland,
            id: Math.max(...this.wastelands.map(wasteland => wasteland.id)) + 1,
            creationDate: new Date(),
            reportedBy: this.loggedInUser!
        }

        this.wastelands = [
            ...this.wastelands,
            createdWasteland
        ]

        this.callAllListeners({
            newItem: createdWasteland
        }, newWasteland.place.coords)

        return {
            data: {
                createdItem: createdWasteland
            }
        }
    }

    @api_endpoint(true)
    async clearWasteland(wasteland: Wasteland, otherCleaners: User[], photos: string[]): Promise<APIResponse<ClearingWastelandError, {}>> {
        this.wastelands = this.wastelands.map(it => {
            if (it.id == wasteland.id) {
                return {
                    ...it,
                    afterCleaningData: {
                        photos,
                        date: new Date(),
                        cleanedBy: [...otherCleaners, this.loggedInUser!]
                    }
                }
            }

            return it
        })

        this.callAllListeners({
            clearedWasteland: wasteland
        }, wasteland.place.coords)

        return {
            data: {}
        }
    }

    @api_endpoint(true)
    async getDumpsters(query: DumpstersQuery, range?: [number, number]): Promise<APIResponse<GeneralError, { items: Dumpster[] }>> {
        const dumpsters = this.dumpsters.filter(dumpster => {
            if ((query.phrase != null && query.phrase.length != 0) && !dumpster.description.includes(query.phrase)) {
                return false
            }

            if (query.region != null && !isLatLngInRegion(query.region, dumpster.place.coords)) {
                return false
            }

            return true
        })

        const from = range == null ? 0 : range[0]
        const to = range == null ? dumpsters.length : range[1]

        return {
            data: {
                items: dumpsters.slice(from, to)
            }
        }
    }

    @api_endpoint(true)
    async getUsers(query: UsersQuery, range: [number, number]): Promise<APIResponse<GeneralError, { items: User[] }>> {
        const users = this.users.filter(user => {
            if ((query.phrase != null && query.phrase.length != 0) && (!user.email.includes(query.phrase) && !user.userName.includes(query.phrase))) {
                return false
            }

            return true
        })

        const from = range == null ? 0 : range[0]
        const to = range == null ? users.length : range[1]

        return {
            data: {
                items: users.map(it => ({ ...it, password: "", email: "", points: this.calculateUserRank(it) })).sort((a, b) => b.points - a.points).slice(from, to)
            }
        }
    }

    @api_endpoint(true)
    async createDumpster(newDumpster: Omit<Dumpster, "id">): Promise<APIResponse<GeneralError, { createdItem: Dumpster; }>> {
        const addedDumpster = {
            ...newDumpster,
            id: Math.max(...this.dumpsters.map(it => it.id)) + 1
        }

        this.dumpsters = [
            ...this.dumpsters,
            addedDumpster
        ]

        this.callAllListeners({
            newItem: addedDumpster
        }, addedDumpster.place.coords)

        return {
            data: {
                createdItem: addedDumpster
            }
        }
    }

    @api_endpoint(true)
    async deleteDumpster(dumpster: Dumpster): Promise<APIResponse<GeneralError, {}>> {
        this.dumpsters = this.dumpsters.filter(it => it.id != dumpster.id)

        this.callAllListeners({
            deletedItem: dumpster
        }, dumpster.place.coords)

        return {
            data: {}
        }
    }

    @api_endpoint(true)
    async updateDumpster(dumpster: Dumpster): Promise<APIResponse<GeneralError, { updatedItem: Dumpster; }>> {
        this.events = this.events.map(event => {
            if (event.event.id == dumpster.id) {
                return {
                    ...event,
                    ...dumpster
                }
            }

            return event
        })

        this.callAllListeners({
            updatedItem: dumpster
        }, dumpster.place.coords)

        return {
            data: {
                updatedItem: dumpster
            }
        }
    }

    private callAllListeners(notification: Notification, location?: LatLng) {
        this.listeners.forEach(it => {
            if (location == null || calcApproxDistanceBetweenLatLngInMeters(it.filter.location, location) > 5000) {
                return
            }

            it.listener(notification)
        })
    }

    private listeners = new Map<number, { filter: NotificationFilter, listener: ChangeListener }>()

    @api_endpoint(true)
    async updateListener(listenerId: number, filter: NotificationFilter): Promise<APIResponse<GeneralError, {}>> {
        if (this.listeners.has(listenerId)) {
            const listener = this.listeners.get(listenerId)!
            this.listeners.set(listenerId, { listener: listener?.listener, filter })

            return {
                data: {}
            }
        } else {
            return {
                error: GeneralError.InvalidDataProvided
            }
        }
    }

    @api_endpoint(true)
    async registerListener(filter: NotificationFilter, listener: ChangeListener): Promise<APIResponse<GeneralError, { listenerId: number }>> {
        const id = Math.max(...this.listeners.keys()) + 1

        this.listeners.set(id, { listener, filter })

        return {
            data: { listenerId: id }
        }
    }

    @api_endpoint(true)
    async removeListener(listenerId: number): Promise<APIResponse<GeneralError, {}>> {
        if (this.listeners.has(listenerId)) {
            this.listeners.delete(listenerId)

            return {
                data: {}
            }
        } else {
            return {
                error: GeneralError.InvalidDataProvided
            }
        }
    }

    private onLogoutListeners: (() => void)[] = []
    addOnLogoutListener(listener: () => void): void {
        this.onLogoutListeners.push(listener)
    }

    removeOnLogoutListener(listener: () => void): void {
        this.onLogoutListeners.splice(this.onLogoutListeners.indexOf(listener), 1)
    }
}