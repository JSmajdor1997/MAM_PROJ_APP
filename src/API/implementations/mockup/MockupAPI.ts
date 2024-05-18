import API, { ChangeListener, ChangeSource, ClearingWastelandError, DumpstersQuery, EventsQuery, GeneralError, LeadershipQuery, LoginError, LogoutError, RemoveAccountError, SignUpError, WastelandsQuery } from "../../API";
import Dumpster from "../../data_types/Dumpster";
import Event, { EventUser } from "../../data_types/Event";
import LeadershipRecord from "../../data_types/LeadershipRecord";
import Message from "../../data_types/Message";
import User from "../../data_types/User";
import getMockupUsers from "./mockup_users"
import Wasteland from "../../data_types/Wasteland";
import APIResponse from "../../APIResponse";
import getMockupDumpsters from "./mockup_dumpsters";
import getMockupEvents from "./mockup_events";
import getMockupWastelands from "./mockup_wastelands";
import { faker } from '@faker-js/faker';
import isLatLngInRegion from "../../../utils/isLatLngInRegion";

export default class MockupAPI extends API {
    private users = getMockupUsers()
    private dumpsters = getMockupDumpsters(this.users)
    private wastelands = getMockupWastelands(this.users)
    private events = getMockupEvents(this.users, this.wastelands)

    private listeners: ChangeListener[] = []

    private loggedInUser: User | null = {
        id: 0,
        email: "aaa@bbb.com",
        userName: "Zeriusz",
        password: "zaq1@WSX",
        nrOfClearedWastelands: 0,
        addedDumpsters: 0,
        deletedDumpsters: 0
    }

    private calculateUserRank(user: User) {
        return 10 * user.nrOfClearedWastelands + 2 * user.addedDumpsters + user.deletedDumpsters
    }

    private callAllListeners(source: ChangeSource) {
        this.listeners.forEach(listener => listener(source))
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

    async logout(): Promise<APIResponse<LogoutError, {}>> {
        if (this.loggedInUser == null) {
            return {
                error: LogoutError.UserNotAuthorized
            }
        }

        this.loggedInUser = null

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

    async removeAccount(): Promise<APIResponse<RemoveAccountError, {}>> {
        if (this.loggedInUser == null) {
            return {
                error: RemoveAccountError.UserNotAuthorized
            }
        }

        this.users = this.users.filter(user => user.id != this.loggedInUser?.id)
        this.logout()

        return {
            data: {}
        }
    }

    async updateSelf(newData: Omit<User, "id" | "nrOfClearedWastelands" | "addedDumpsters" | "deletedDumpsters">): Promise<APIResponse<GeneralError, { newUser: User }>> {
        if (this.loggedInUser == null) {
            return {
                error: GeneralError.UserNotAuthorized
            }
        }

        this.loggedInUser = {
            ...this.loggedInUser,
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

    async getEvents(query: EventsQuery, range?: [number, number]): Promise<APIResponse<GeneralError, { items: Event[]; }>> {
        if (this.loggedInUser == null) {
            return {
                error: GeneralError.UserNotAuthorized
            }
        }

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

            return true
        }).sort((a, b) => a.event.dateRange[0] > b.event.dateRange[1] ? -1 : +1).map(it => it.event)

        const from = range == null ? 0 : range[0]
        const to = range == null ? events.length : range[1]

        return {
            data: {
                items: events.slice(from, to)
            }
        }
    }

    async getEventMembers(event: Event, range: [number, number]): Promise<APIResponse<GeneralError, { members: EventUser[]; admins: EventUser[]; }>> {
        if (this.loggedInUser == null) {
            return {
                error: GeneralError.UserNotAuthorized
            }
        }

        const item = this.events.find(it => it.event.id == event.id)

        if (item == null) {
            return {
                error: GeneralError.InvalidDataProvided
            }
        }

        return {
            data: {
                members: item.members.slice(range[0], range[1]),
                admins: item.admins,
            }
        }
    }

    async createEvent(newEvent: Omit<Event, "id" | "isFinished" | "messages">): Promise<APIResponse<GeneralError, { createdItem: Event }>> {
        if (this.loggedInUser == null) {
            return {
                error: GeneralError.UserNotAuthorized
            }
        }

        const createdEvent: Event = {
            ...newEvent,
            messages: [],
            id: Math.max(...this.events.map(event => event.event.id)) + 1
        }

        this.events = [
            ...this.events,
            {
                event: createdEvent,
                members: [this.loggedInUser],
                admins: [this.loggedInUser],
            }
        ]

        this.callAllListeners(ChangeSource.Events)

        return {
            data: {
                createdItem: createdEvent
            }
        }
    }

    async deleteEvent(eventToDelete: Event): Promise<APIResponse<GeneralError, {}>> {
        if (this.loggedInUser == null) {
            return {
                error: GeneralError.UserNotAuthorized
            }
        }

        if (this.events.find(it => it.event.id == eventToDelete.id)!.admins.some(admin => admin.id == this.loggedInUser?.id)) {
            return {
                error: GeneralError.UserNotAuthorized,
                description: "User must be admin of event"
            }
        }

        this.events = this.events.filter(event => eventToDelete.id != event.event.id)

        this.callAllListeners(ChangeSource.Events)

        return {
            data: {}
        }
    }

    async updateEvent(eventToUpdate: Event): Promise<APIResponse<GeneralError, { updatedItem: Event; }>> {
        if (this.loggedInUser == null) {
            return {
                error: GeneralError.UserNotAuthorized
            }
        }

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

        this.callAllListeners(ChangeSource.Events)

        return {
            data: {
                updatedItem: eventToUpdate
            }
        }
    }

    async joinEvent(eventToJoin: Event): Promise<APIResponse<GeneralError, { updatedItem: Event; }>> {
        if (this.loggedInUser == null) {
            return {
                error: GeneralError.UserNotAuthorized
            }
        }

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

        this.callAllListeners(ChangeSource.Events)

        return {
            data: {
                updatedItem: foundEvent.event
            }
        }
    }

    async leaveEvent(eventToLeave: Event): Promise<APIResponse<GeneralError, { updatedItem: Event; }>> {
        if (this.loggedInUser == null) {
            return {
                error: GeneralError.UserNotAuthorized
            }
        }

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

        this.callAllListeners(ChangeSource.Events)

        return {
            data: {
                updatedItem: updatedEvent.event
            }
        }
    }

    async getEventMessages(event: Event, dateRange: [Date, Date]): Promise<APIResponse<GeneralError, { messages: Message[]; }>> {
        if (this.loggedInUser == null) {
            return {
                error: GeneralError.UserNotAuthorized
            }
        }

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

    async sendEventMessage(event: Event, message: Omit<Message, "id" | "date">): Promise<APIResponse<GeneralError, {}>> {
        if (this.loggedInUser == null) {
            return {
                error: GeneralError.UserNotAuthorized
            }
        }

        const foundEvent = this.events.find(it => it.event.id == event.id)!
        if (!foundEvent.members.some(member => member.id == this.loggedInUser!.id)) {
            return {
                error: GeneralError.InvalidDataProvided,
                description: "User not in event"
            }
        }

        event.messages.push({
            ...message,
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

        this.callAllListeners(ChangeSource.Events)

        return {
            data: {}
        }
    }

    async getWastelands(query: WastelandsQuery, range?: [number, number]): Promise<APIResponse<GeneralError, { items: Wasteland[]; }>> {
        if (this.loggedInUser == null) {
            return {
                error: GeneralError.UserNotAuthorized
            }
        }

        const wastelands = this.wastelands.filter(wasteland => {
            if ((query.phrase != null && query.phrase.length != 0) && !wasteland.description.includes(query.phrase)) {
                return false
            }

            if (query.region != null && !isLatLngInRegion(query.region, wasteland.place.coords)) {
                return false
            }

            return true
        }).sort((a, b) => a.creationDate > b.creationDate ? -1 : +1)

        const from = range == null ? 0 : range[0]
        const to = range == null ? wastelands.length : range[1]

        return {
            data: {
                items: wastelands.slice(from, to)
            }
        }
    }

    async createWasteland(newWasteland: Omit<Wasteland, "id" | "createdDate" | "afterCleaningData" | "reportedBy">): Promise<APIResponse<GeneralError, { createdItem: Wasteland; }>> {
        if (this.loggedInUser == null) {
            return {
                error: GeneralError.UserNotAuthorized
            }
        }

        const createdWasteland: Wasteland = {
            ...newWasteland,
            id: Math.max(...this.wastelands.map(wasteland => wasteland.id)) + 1,
            creationDate: new Date(),
            reportedBy: this.loggedInUser
        }

        this.wastelands = [
            ...this.wastelands,
            createdWasteland
        ]

        this.callAllListeners(ChangeSource.Wastelands)

        return {
            data: {
                createdItem: createdWasteland
            }
        }
    }

    async clearWasteland(wasteland: Wasteland, otherCleaners: User[], photos: unknown[]): Promise<APIResponse<ClearingWastelandError, {}>> {
        if (this.loggedInUser == null) {
            return {
                error: ClearingWastelandError.UserNotAuthorized
            }
        }

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

        this.callAllListeners(ChangeSource.Wastelands)

        return {
            data: {}
        }
    }

    async getDumpsters(query: DumpstersQuery, range?: [number, number]): Promise<APIResponse<GeneralError, { items: Dumpster[] }>> {
        if (this.loggedInUser == null) {
            return {
                error: GeneralError.UserNotAuthorized
            }
        }

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

    async createDumpster(newDumpster: Omit<Dumpster, "id">): Promise<APIResponse<GeneralError, { createdItem: Dumpster; }>> {
        if (this.loggedInUser == null) {
            return {
                error: GeneralError.UserNotAuthorized
            }
        }

        const addedDumpster = {
            ...newDumpster,
            id: Math.max(...this.dumpsters.map(it => it.id)) + 1
        }

        this.dumpsters = [
            ...this.dumpsters,
            addedDumpster
        ]

        this.callAllListeners(ChangeSource.Dumpsters)

        return {
            data: {
                createdItem: addedDumpster
            }
        }
    }

    async deleteDumpster(dumpster: Dumpster): Promise<APIResponse<GeneralError, {}>> {
        if (this.loggedInUser == null) {
            return {
                error: GeneralError.UserNotAuthorized
            }
        }

        this.dumpsters = this.dumpsters.filter(it => it.id != dumpster.id)

        this.callAllListeners(ChangeSource.Dumpsters)

        return {
            data: {}
        }
    }

    async updateDumpster(dumpster: Dumpster): Promise<APIResponse<GeneralError, { updatedItem: Dumpster; }>> {
        if (this.loggedInUser == null) {
            return {
                error: GeneralError.UserNotAuthorized
            }
        }

        this.events = this.events.map(event => {
            if (event.event.id == dumpster.id) {
                return {
                    ...event,
                    ...dumpster
                }
            }

            return event
        })

        this.callAllListeners(ChangeSource.Dumpsters)

        return {
            data: {
                updatedItem: dumpster
            }
        }
    }

    async getLeadership(query: LeadershipQuery): Promise<APIResponse<GeneralError, { users: LeadershipRecord[]; ownPosition: number; }>> {
        if (this.loggedInUser == null) {
            return {
                error: GeneralError.UserNotAuthorized
            }
        }

        const userRecords = this.users
            .map(user => ({
                ...user,
                position: this.calculateUserRank(user),
                points: this.calculateUserRank(user)
            }))
            .sort((a, b) => a.points - b.points)
            .map((user, index) => ({
                id: user.id,
                points: user.points,
                userName: user.userName,
                position: index + 1
            }))

        return {
            data: {
                users: userRecords.filter(it => query == null || (it.position >= query.positionsRange[0] && it.position <= query.positionsRange[1])),
                ownPosition: userRecords.find(it => it.id == this.loggedInUser?.id)!.position
            }
        }
    }

    async registerListener(listener: ChangeListener): Promise<APIResponse<GeneralError, {}>> {
        if (this.loggedInUser == null) {
            return {
                error: GeneralError.UserNotAuthorized
            }
        }

        this.listeners.push(listener)

        return {
            data: {}
        }
    }

    async removeListener(listener: ChangeListener): Promise<APIResponse<GeneralError, {}>> {
        if (this.loggedInUser == null) {
            return {
                error: GeneralError.UserNotAuthorized
            }
        }

        this.listeners.splice(this.listeners.indexOf(listener), 1)

        return {
            data: {}
        }
    }
}