import User from "./data_types/User";
import Event from "./data_types/Event";
import APIResponse from "./responses_types/APIResponse";
import Message from "./data_types/Message";
import Wasteland from "./data_types/Wasteland";
import LeadershipRecord from "./data_types/LeadershipRecord";
import Dumpster from "./data_types/Dumpster";

export interface EventsWastelandsQuery {
    phrase?: string
    sortByDate?: boolean
    onlyOwn?: boolean
    place?: unknown
}

export interface LeadershipQuery {
    positionsRange: [number, number]
}

export enum ChangeSource {
    Events,
    Wastelands,
    Dumpsters
}

export type ChangeListener = (source: ChangeSource) => void

export default abstract class API {
    abstract isUserLoggedIn(): Promise<boolean>

    ////////////account lifecycle related functions
    abstract login(email: string, password: string): APIResponse<LoginError, User>
    abstract logout(): APIResponse<LogoutError, {}>
    abstract signUp(data: Omit<User, "id" | "photoUrl" | "nrOfClearedWastelands" | "addedDumpsters" | "deletedDumpsters"> & { photoFile?: File }): APIResponse<SignUpError, {}>
    abstract removeAccount(): APIResponse<RemoveAccountError, {}>
    abstract updateSelf(newData: Omit<User, "id" | "nrOfClearedWastelands" | "addedDumpsters" | "deletedDumpsters">): APIResponse<GeneralError, { newUser: User }>
    abstract resetPassword(): APIResponse<GeneralError, { newUser: User }>

    ////////////events related functions
    abstract getEvents(query: EventsWastelandsQuery): APIResponse<GeneralError, { events: Event[] }>
    abstract createEvent(newEvent: Omit<Event, "id">): APIResponse<GeneralError, { createdEvent: Event }>
    abstract deleteEvent(event: Event): APIResponse<GeneralError, {}>
    abstract updateEvent(event: Event): APIResponse<GeneralError, { updatedEvent: Event }>
    abstract joinEvent(event: Event): APIResponse<GeneralError, { updatedEvent: Event }>
    abstract leaveEvent(event: Event): APIResponse<GeneralError, { updatedEvent: Event }>
    abstract getEventMessages(event: Event, dateRange: [Date, Date]): APIResponse<GeneralError, { messages: Message[] }>
    abstract sendEventMessage(event: Event, message: Omit<Message, "id" | "date">): APIResponse<GeneralError, {}>

    ////////////wastelands related functions
    abstract getWastelands(query: EventsWastelandsQuery): APIResponse<GeneralError, { wastelands: Wasteland[] }>
    abstract createWasteland(newWasteland: Omit<Wasteland, "id">): APIResponse<GeneralError, { createdWasteland: Wasteland }>
    abstract clearWasteland(wasteland: Wasteland, otherCleaners: User[], photos: unknown[]): APIResponse<ClearingWastelandError, {}>

    ////////////dumpsters related functions
    abstract getDumpsters(query: {}): APIResponse<GeneralError, {dumpsters: Dumpster[]}>
    abstract updateDumpster(newDumpster: Omit<Dumpster, "id">): APIResponse<GeneralError, { updatedDumpster: Dumpster }>
    abstract deleteDumpster(dumpster: Dumpster): APIResponse<GeneralError, {}>

    ////////////leadership related functions
    abstract getLeadership(query: LeadershipQuery): APIResponse<GeneralError, { users: LeadershipRecord[], ownPosition: number }>

    ////////////WebSocket - changed stream
    abstract registerListener(listener: ChangeListener): APIResponse<GeneralError, {}>
    abstract removeListener(listener: ChangeListener): APIResponse<GeneralError, {}>
}

export enum LoginError {
    UserDoesNotExist,
    InvalidPassword
}

export enum LogoutError {
    UserNotAuthorized
}

export enum SignUpError {
    InvalidDataProvided,
    UserAlreadyRegistered
}

export enum RemoveAccountError {
    UserNotAuthorized
}

export enum GeneralError {
    UserNotAuthorized,
    InvalidDataProvided
}

export enum ClearingWastelandError {
    UserNotAuthorized,
    InvalidDataProvided,
    InvalidPhotosProvided
}