import User from "./data_types/User";
import Event, { EventUser } from "./data_types/Event";
import APIResponse from "./APIResponse";
import Message from "./data_types/Message";
import Wasteland from "./data_types/Wasteland";
import LeadershipRecord from "./data_types/LeadershipRecord";
import Dumpster from "./data_types/Dumpster";
import { Region } from "react-native-maps";

export interface EventsQuery {
    region?: Region
    phrase?: string
    onlyOwn?: boolean
}

export interface WastelandsQuery {
    region?: Region
    phrase?: string
}

export interface DumpstersQuery {
    region?: Region
    phrase?: string
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
    abstract login(email: string, password: string): Promise<APIResponse<LoginError, User>>
    abstract logout(): Promise<APIResponse<LogoutError, {}>>
    abstract signUp(data: Omit<User, "id" | "photoUrl" | "nrOfClearedWastelands" | "addedDumpsters" | "deletedDumpsters"> & { photoFile?: File }): Promise<APIResponse<SignUpError, {}>>
    abstract removeAccount(): Promise<APIResponse<RemoveAccountError, {}>>
    abstract updateSelf(newData: Omit<User, "id" | "nrOfClearedWastelands" | "addedDumpsters" | "deletedDumpsters">): Promise<APIResponse<GeneralError, { newUser: User }>>
    abstract resetPassword(): Promise<APIResponse<GeneralError, { newUser: User }>>

    ////////////events related functions
    abstract getEvents(query: EventsQuery, range?: [number, number]): Promise<APIResponse<GeneralError, { events: Event[] }>>
    abstract createEvent(newEvent: Omit<Event, "id">): Promise<APIResponse<GeneralError, { createdEvent: Event }>>
    abstract deleteEvent(event: Event): Promise<APIResponse<GeneralError, {}>>
    abstract updateEvent(event: Event): Promise<APIResponse<GeneralError, { updatedEvent: Event }>>
    abstract joinEvent(event: Event): Promise<APIResponse<GeneralError, { updatedEvent: Event }>>
    abstract leaveEvent(event: Event): Promise<APIResponse<GeneralError, { updatedEvent: Event }>>
    abstract getEventMessages(event: Event, dateRange: [Date, Date]): Promise<APIResponse<GeneralError, { messages: Message[] }>>
    abstract sendEventMessage(event: Event, message: Omit<Message, "id" | "date">): Promise<APIResponse<GeneralError, {}>>
    abstract getEventMembers(event: Event, range: [number, number]): Promise<APIResponse<GeneralError, {members: EventUser[], admins: EventUser[]}>>

    ////////////wastelands related functions
    abstract getWastelands(query: WastelandsQuery, range?: [number, number]): Promise<APIResponse<GeneralError, { wastelands: Wasteland[] }>>
    abstract createWasteland(newWasteland: Omit<Wasteland, "id">): Promise<APIResponse<GeneralError, { createdWasteland: Wasteland }>>
    abstract clearWasteland(wasteland: Wasteland, otherCleaners: User[], photos: unknown[]): Promise<APIResponse<ClearingWastelandError, {}>>

    ////////////dumpsters related functions
    abstract getDumpsters(query: DumpstersQuery, range?: [number, number]): Promise<APIResponse<GeneralError, {dumpsters: Dumpster[]}>>
    abstract updateDumpster(newDumpster: Omit<Dumpster, "id">): Promise<APIResponse<GeneralError, { updatedDumpster: Dumpster }>>
    abstract deleteDumpster(dumpster: Dumpster): Promise<APIResponse<GeneralError, {}>>

    ////////////leadership related functions
    abstract getLeadership(query: LeadershipQuery): Promise<APIResponse<GeneralError, { users: LeadershipRecord[], ownPosition: number }>>

    ////////////WebSocket - changed stream
    abstract registerListener(listener: ChangeListener): Promise<APIResponse<GeneralError, {}>>
    abstract removeListener(listener: ChangeListener): Promise<APIResponse<GeneralError, {}>>
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