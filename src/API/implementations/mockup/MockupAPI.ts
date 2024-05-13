import API, { ChangeListener, ChangeSource, ClearingWastelandError, EventsWastelandsQuery, GeneralError, LeadershipQuery, LoginError, LogoutError, RemoveAccountError, SignUpError } from "../../API";
import Dumpster from "../../data_types/Dumpster";
import Event from "../../data_types/Event";
import LeadershipRecord from "../../data_types/LeadershipRecord";
import Message from "../../data_types/Message";
import User from "../../data_types/User";
import getMockupUsers from "./mockup_users"
import Wasteland from "../../data_types/Wasteland";
import APIResponse from "../../responses_types/APIResponse";
import getMockupDumpsters from "./mockup_dumpsters";
import getMockupEvents from "./mockup_events";
import getMockupWastelands from "./mockup_wastelands";
import { faker } from '@faker-js/faker';

export default class MockupAPI extends API {
    private users = getMockupUsers()
    private dumpsters = getMockupDumpsters(this.users)
    private wastelands = getMockupWastelands(this.users)
    private events = getMockupEvents(this.users, this.wastelands)

    private listeners: ChangeListener[] = []

    private loggedInUser: User | null = null

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

    async login(email: string, password: string): APIResponse<LoginError, User> {
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

    async logout(): APIResponse<LogoutError, {}> {
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

    async signUp(data: Omit<User, "id" | "photoUrl" | "nrOfClearedWastelands" | "addedDumpsters" | "deletedDumpsters"> & { photoFile: File }): APIResponse<SignUpError, {}> {
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

    async removeAccount(): APIResponse<RemoveAccountError, {}> {
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

    async updateSelf(newData: Omit<User, "id" | "nrOfClearedWastelands" | "addedDumpsters" | "deletedDumpsters">): APIResponse<GeneralError, { newUser: User }> {
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

    async resetPassword(): APIResponse<GeneralError, { newUser: User; }> {
        throw new Error("Method not implemented.");
    }

    async getEvents(query: EventsWastelandsQuery): APIResponse<GeneralError, { events: Event[]; }> {
        if (this.loggedInUser == null) {
            return {
                error: GeneralError.UserNotAuthorized
            }
        }

        return {
            data: {
                events: this.events.filter(event => {
                    if (query.onlyOwn && !event.members.some(member => member.id == this.loggedInUser!.id)) {
                        return false
                    }

                    if (query.phrase != null && (event.name.includes(query.phrase) || event.description.includes(query.phrase))) {
                        return true
                    }

                    return false
                }).sort((a, b) => a.dateRange[0] > b.dateRange[1] ? -1 : +1)
            }
        }
    }

    async createEvent(newEvent: Omit<Event, "id" | "isFinished" | "messages">): APIResponse<GeneralError, { createdEvent: Event }> {
        if (this.loggedInUser == null) {
            return {
                error: GeneralError.UserNotAuthorized
            }
        }

        const createdEvent: Event = {
            ...newEvent,
            isFinished: false,
            members: [this.loggedInUser],
            admins: [this.loggedInUser],
            messages: [],
            id: Math.max(...this.events.map(event => event.id)) + 1
        }

        this.events = [
            ...this.events,
            createdEvent
        ]

        this.callAllListeners(ChangeSource.Events)

        return {
            data: {
                createdEvent
            }
        }
    }

    async deleteEvent(eventToDelete: Event): APIResponse<GeneralError, {}> {
        if (this.loggedInUser == null) {
            return {
                error: GeneralError.UserNotAuthorized
            }
        }

        if (eventToDelete.admins.some(admin => admin.id == this.loggedInUser?.id)) {
            return {
                error: GeneralError.UserNotAuthorized,
                description: "User must be admin of event"
            }
        }

        this.events = this.events.filter(event => eventToDelete.id != event.id)

        this.callAllListeners(ChangeSource.Events)

        return {
            data: {}
        }
    }

    async updateEvent(eventToUpdate: Event): APIResponse<GeneralError, { updatedEvent: Event; }> {
        if (this.loggedInUser == null) {
            return {
                error: GeneralError.UserNotAuthorized
            }
        }

        if (eventToUpdate.admins.some(admin => admin.id == this.loggedInUser?.id)) {
            return {
                error: GeneralError.UserNotAuthorized,
                description: "User must be admin of event"
            }
        }

        this.events = this.events.map(event => {
            if (event.id == eventToUpdate.id) {
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
                updatedEvent: eventToUpdate
            }
        }
    }

    async joinEvent(eventToJoin: Event): APIResponse<GeneralError, { updatedEvent: Event; }> {
        if (this.loggedInUser == null) {
            return {
                error: GeneralError.UserNotAuthorized
            }
        }

        if (eventToJoin.members.some(member => member.id == this.loggedInUser!.id)) {
            return {
                error: GeneralError.InvalidDataProvided,
                description: "User already in event"
            }
        }

        const updatedEvent = {
            ...eventToJoin,
            members: [...eventToJoin.members, this.loggedInUser!]
        }

        this.events = this.events.map(event => {
            if (event.id == eventToJoin.id) {
                return updatedEvent
            }

            return event
        })

        this.callAllListeners(ChangeSource.Events)

        return {
            data: {
                updatedEvent: updatedEvent
            }
        }
    }

    async leaveEvent(eventToLeave: Event): APIResponse<GeneralError, { updatedEvent: Event; }> {
        if (this.loggedInUser == null) {
            return {
                error: GeneralError.UserNotAuthorized
            }
        }

        if (!eventToLeave.members.some(member => member.id == this.loggedInUser!.id)) {
            return {
                error: GeneralError.InvalidDataProvided,
                description: "User not in event"
            }
        }

        const updatedEvent = {
            ...eventToLeave,
            admins: eventToLeave.admins.filter(admin => admin.id != this.loggedInUser!.id),
            members: eventToLeave.members.filter(member => member.id != this.loggedInUser!.id),
        }

        this.events = this.events.map(event => {
            if (event.id == eventToLeave.id) {
                return updatedEvent
            }

            return event
        })

        this.callAllListeners(ChangeSource.Events)

        return {
            data: {
                updatedEvent: updatedEvent
            }
        }
    }

    async getEventMessages(event: Event, dateRange: [Date, Date]): APIResponse<GeneralError, { messages: Message[]; }> {
        if (this.loggedInUser == null) {
            return {
                error: GeneralError.UserNotAuthorized
            }
        }

        if (!event.members.some(member => member.id == this.loggedInUser!.id)) {
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

    async sendEventMessage(event: Event, message: Omit<Message, "id" | "date">): APIResponse<GeneralError, {}> {
        if (this.loggedInUser == null) {
            return {
                error: GeneralError.UserNotAuthorized
            }
        }

        if (!event.members.some(member => member.id == this.loggedInUser!.id)) {
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
            if (ev.id == event.id) {
                return event
            }

            return ev
        })

        this.callAllListeners(ChangeSource.Events)

        return {
            data: {}
        }
    }

    async getWastelands(query: EventsWastelandsQuery): APIResponse<GeneralError, { wastelands: Wasteland[]; }> {
        if (this.loggedInUser == null) {
            return {
                error: GeneralError.UserNotAuthorized
            }
        }

        return {
            data: {
                wastelands: this.wastelands.filter(wasteland => {
                    if (query.onlyOwn && wasteland.reportedBy.id == this.loggedInUser?.id) {
                        return false
                    }

                    return query.phrase == null || wasteland.description.includes(query.phrase)
                }).sort((a, b) => a.creationDate > b.creationDate ? -1 : +1)
            }
        }
    }

    async createWasteland(newWasteland: Omit<Wasteland, "id" | "createdDate" | "afterCleaningData" | "reportedBy">): APIResponse<GeneralError, { createdWasteland: Wasteland; }> {
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
                createdWasteland
            }
        }
    }

    async clearWasteland(wasteland: Wasteland, otherCleaners: User[], photos: unknown[]): APIResponse<ClearingWastelandError, {}> {
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

    async addDumpster(newDumpster: Omit<Dumpster, "id">): APIResponse<GeneralError, { addedDumpster: Dumpster; }> {
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
                addedDumpster
            }
        }
    }

    async deleteDumpster(dumpster: Dumpster): APIResponse<GeneralError, {}> {
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

    async updateDumpster(dumpster: Dumpster): APIResponse<GeneralError, { updatedDumpster: Dumpster; }> {
        if (this.loggedInUser == null) {
            return {
                error: GeneralError.UserNotAuthorized
            }
        }

        this.events = this.events.map(event => {
            if (event.id == dumpster.id) {
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
                updatedDumpster: dumpster
            }
        }
    }

    async getLeadership(query: LeadershipQuery): APIResponse<GeneralError, { users: LeadershipRecord[]; ownPosition: number; }> {
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

    async registerListener(listener: ChangeListener): APIResponse<GeneralError, {}> {
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

    async removeListener(listener: ChangeListener): APIResponse<GeneralError, {}> {
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