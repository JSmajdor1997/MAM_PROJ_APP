import User from "./data_types/User";
import Event, { EventUser } from "./data_types/Event";
import APIResponse from "./APIResponse";
import Message from "./data_types/Message";
import Wasteland from "./data_types/Wasteland";
import Dumpster from "./data_types/Dumpster";
import { Region } from "react-native-maps";
import { MapObjects, Type } from "./helpers";
import { Notification, NotificationFilter } from "./data_types/notifications";
import { Invitation } from "./data_types/Invitation";

export type ChangeListener = (notification: Notification) => void

export interface EventsQuery {
    region?: Region
    phrase?: string
    onlyOwn?: boolean
    dateRange?: [Date | null, Date | null]
    activeOnly?: boolean
}

export interface WastelandsQuery {
    region?: Region
    phrase?: string
    activeOnly?: boolean
}

export interface DumpstersQuery {
    region?: Region
    phrase?: string
}

export interface UsersQuery {
    phrase?: string
}

export default abstract class API {
    private static readonly WisbEventQrCodePrefix = "Wisb-Event"
    abstract isUserLoggedIn(): Promise<boolean>

    ////////////account lifecycle related functions
    abstract getCurrentUser(): Promise<APIResponse<GeneralError, User>>
    abstract login(email: string, password: string): Promise<APIResponse<LoginError, User>>
    abstract logout(): Promise<APIResponse<LogoutError, {}>>
    abstract signUp(data: Omit<User, "id" | "photoUrl" | "nrOfClearedWastelands" | "addedDumpsters" | "deletedDumpsters"> & { photoFile?: File }): Promise<APIResponse<SignUpError, {}>>
    abstract removeAccount(): Promise<APIResponse<RemoveAccountError, {}>>
    abstract updateSelf(newData: Partial<Omit<User, "id" | "nrOfClearedWastelands" | "addedDumpsters" | "deletedDumpsters">>): Promise<APIResponse<GeneralError, { newUser: User }>>
    abstract resetPassword(): Promise<APIResponse<GeneralError, { newUser: User }>>

    abstract getUsers(query: UsersQuery, range: [number, number]): Promise<APIResponse<GeneralError, { items: User[] }>>

    ////////////events related functions
    abstract getEvents<WithMembers extends true | false>(query: EventsQuery, range: [number, number] | null, withMembers: WithMembers): Promise<APIResponse<GeneralError, WithMembers extends false ? { items: Event[] } : { items: (Event & { members: EventUser[], admins: EventUser[] })[] }>>;

    abstract getEventById<WithMembers extends true | false>(id: number, withMembers: WithMembers): Promise<APIResponse<GeneralError, WithMembers extends false ? { item: Event } : { item: (Event & { members: EventUser[], admins: EventUser[] }) }>>;

    abstract getMyInvitations(): Promise<APIResponse<GeneralError, { items: Invitation[] }>>
    abstract createEvent(newEvent: Omit<Event, "id">, invitations: User[]): Promise<APIResponse<GeneralError, { createdItem: Event }>>
    abstract sendInvitation(invitation: Invitation): Promise<APIResponse<GeneralError, { }>>
    abstract deleteEvent(event: Event): Promise<APIResponse<GeneralError, {}>>
    abstract updateEvent(event: Event): Promise<APIResponse<GeneralError, { updatedItem: Event }>>
    abstract joinEvent(event: Event): Promise<APIResponse<GeneralError, { updatedItem: Event }>>
    abstract leaveEvent(event: Event): Promise<APIResponse<GeneralError, { updatedItem: Event }>>
    abstract getEventMessages(event: Event, dateRange: [Date, Date]): Promise<APIResponse<GeneralError, { messages: Message[] }>>
    abstract sendEventMessage(event: Event, message: Omit<Message, "id" | "date" | "sender">): Promise<APIResponse<GeneralError, {}>>
    getQRCode(event: Event): string {
        return `${API.WisbEventQrCodePrefix}-${event.id}`
    }

    getEventByQrCode(qrCode: string): Promise<APIResponse<GeneralError, { item: Event }>> {
        const parsedId = parseInt(qrCode.substring(API.WisbEventQrCodePrefix.length + 1))

        return this.getEventById(parsedId, false)
    }

    ////////////wastelands related functions
    abstract getWastelands(query: WastelandsQuery, range?: [number, number]): Promise<APIResponse<GeneralError, { items: Wasteland[] }>>
    abstract createWasteland(newWasteland: Omit<Wasteland, "id">): Promise<APIResponse<GeneralError, { createdItem: Wasteland }>>
    abstract clearWasteland(wasteland: Wasteland, otherCleaners: User[], photos: string[]): Promise<APIResponse<ClearingWastelandError, {}>>

    ////////////dumpsters related functions
    abstract getDumpsters(query: DumpstersQuery, range?: [number, number]): Promise<APIResponse<GeneralError, { items: Dumpster[] }>>
    abstract createDumpster(newDumpster: Omit<Dumpster, "id">): Promise<APIResponse<GeneralError, { createdItem: Dumpster; }>>
    abstract updateDumpster(newDumpster: Omit<Dumpster, "id">): Promise<APIResponse<GeneralError, { updatedItem: Dumpster }>>
    abstract deleteDumpster(dumpster: Dumpster): Promise<APIResponse<GeneralError, {}>>

    ////////////WebSocket - changed stream
    abstract registerListener(filter: NotificationFilter, listener: ChangeListener): Promise<APIResponse<GeneralError, { listenerId: number }>>
    abstract updateListener(listenerId: number, filter: NotificationFilter): Promise<APIResponse<GeneralError, {}>>
    abstract removeListener(listenerId: number): Promise<APIResponse<GeneralError, {}>>

    calculateUserRank(user: { nrOfClearedWastelands: number, addedDumpsters: number, deletedDumpsters: number }) {
        return 10 * user.nrOfClearedWastelands + 2 * user.addedDumpsters + user.deletedDumpsters
    }

    abstract addOnLogoutListener(listener: ()=>void): void;
    abstract removeOnLogoutListener(listener: ()=>void): void;
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