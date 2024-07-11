import { Region } from "react-native-maps";
import { WisbDumpster, WisbWasteland, WisbUser, WisbEvent, WastelandCleaningData, SimplePlace, Invitation, WisbMessage } from "./interfaces";
import WisbObjectType from "./WisbObjectType";
import Ref from "./Ref";
import { Notification } from "./notifications";
import ListenersManager from "./ListenersManager";

export type TypeMap<ItemType extends WisbObjectType> = (
    ItemType extends WisbObjectType.Dumpster ? WisbDumpster :
    ItemType extends WisbObjectType.Wasteland ? WisbWasteland :
    ItemType extends WisbObjectType.User ? WisbUser :
    ItemType extends WisbObjectType.Event ? WisbEvent :
    {}
)

export type QueryMap<ItemType extends WisbObjectType> = (
    ItemType extends WisbObjectType.Dumpster ? {
        region?: Region
        phrase?: string
    } :
    ItemType extends WisbObjectType.Wasteland ? {
        region?: Region
        phrase?: string
        activeOnly?: boolean
    } :
    ItemType extends WisbObjectType.User ? {
        phrase?: string
    } :
    ItemType extends WisbObjectType.Event ? {
        region?: Region
        phrase?: string
        onlyOwn?: boolean
        dateRange?: [Date | null, Date | null]
        activeOnly?: boolean
    } :
    {}
)

export type CreateMap<ItemType extends WisbObjectType> = (
    ItemType extends WisbObjectType.Dumpster ? {
        place: SimplePlace
        description: string
        photos: string[]
    } :
    ItemType extends WisbObjectType.Wasteland ? {
        place: SimplePlace
        photos: string[]
        description: string
    } :
    ItemType extends WisbObjectType.User ? {
        email: string
        userName: string
        photoUrl: string | null
    } :
    ItemType extends WisbObjectType.Event ? {
        name: string
        iconUrl: string
        dateRange: [Date, Date]
        place: SimplePlace
        description: string
        wastelands: Ref<WisbObjectType.Wasteland>[]
    } :
    {}
)

export enum LogoutError {
    UserNotAuthorized
}

export enum SignUpError {
    InvalidDataProvided,
    UserAlreadyRegistered
}

export enum GeneralError {
    UserNotAuthorized,
    InvalidDataProvided
}

export type APIResponse<ErrorType, DataType> = {
    error: ErrorType
    description?: string
    data?: never
} | {
    error?: never
    data: DataType
}

export default abstract class API {
    protected broadcastNotifications!: (n: Notification) => void
    public readonly notifications: ListenersManager = new ListenersManager(this, (controller) => this.broadcastNotifications = controller)

    private static readonly WisbEventQrCodePrefix = "Wisb-Event"

    abstract getOne<T extends WisbObjectType.Dumpster | WisbObjectType.Event | WisbObjectType.Wasteland>(ref: Ref<T>): Promise<APIResponse<GeneralError, TypeMap<T>>>
    abstract getMany<T extends WisbObjectType.Dumpster | WisbObjectType.Event | WisbObjectType.User | WisbObjectType.Wasteland>(type: T, query: QueryMap<T>, range: [number, number]): Promise<APIResponse<GeneralError, {items: TypeMap<T>[], totalLength: number}>>
    abstract deleteOne<T extends WisbObjectType.Dumpster | WisbObjectType.Event | WisbObjectType.Wasteland>(ref: Ref<T>): Promise<APIResponse<GeneralError, {}>>
    abstract createOne<T extends WisbObjectType.Dumpster | WisbObjectType.Event | WisbObjectType.Wasteland>(type: T, update: CreateMap<T>): Promise<APIResponse<GeneralError, Ref<T>>>
    abstract updateOne<T extends WisbObjectType.Dumpster | WisbObjectType.Event | WisbObjectType.Wasteland | WisbObjectType.User>(ref: Ref<T>, update: Partial<CreateMap<T>>): Promise<APIResponse<GeneralError, {}>>

    abstract sendEventInvitations(event: WisbEvent, users: (Ref<WisbObjectType.User> & { asAdmin: boolean })[]): Promise<APIResponse<GeneralError, {}>>

    abstract joinEvent(event: WisbEvent | Invitation): Promise<APIResponse<GeneralError, {}>>

    abstract leaveEvent(event: WisbEvent): Promise<APIResponse<GeneralError, {}>>

    abstract removeInvitation(invitation: Invitation): Promise<APIResponse<GeneralError, {}>>

    abstract getEventWastelands(event: WisbEvent): Promise<APIResponse<GeneralError, WisbWasteland[]>>

    abstract getEventMembers(event: WisbEvent): Promise<APIResponse<GeneralError, WisbUser[]>>

    abstract getMyInvitations(): Promise<APIResponse<GeneralError, Invitation[]>>

    abstract sendEventMessage(message: Omit<WisbMessage, "date" | "sender">): Promise<APIResponse<GeneralError, {}>>

    abstract getEventMessages(event: WisbEvent, indices: [number, number]): Promise<APIResponse<{}, {items: WisbMessage[], totalLength: number}>>

    abstract clearWasteland(wasteland: WisbWasteland, cleaningData: WastelandCleaningData): Promise<APIResponse<GeneralError, {}>>

    abstract getCurrentUser(): WisbUser | null

    abstract updateMemberType(event: WisbEvent, user: Ref<WisbObjectType.User>, isAdmin: boolean): Promise<APIResponse<GeneralError, {}>>;

    abstract login(email: string, password: string): Promise<APIResponse<GeneralError, WisbUser>>
    abstract logout(): Promise<APIResponse<LogoutError, {}>>
    abstract signUp(user: Pick<WisbUser, "email" | "userName" | "photoUrl" | "password">): Promise<APIResponse<SignUpError, {}>>
    abstract resetPassword(email: string): Promise<APIResponse<GeneralError, {}>>
    abstract changePassword(currentPassword: string, newPassword: string): Promise<APIResponse<GeneralError, {}>>

    getQRCode(event: WisbEvent): string {
        return `${API.WisbEventQrCodePrefix}-${event.id}`
    }

    getEventByQrCode(qrCode: string): Promise<APIResponse<GeneralError, WisbEvent>> {
        const parsedId = parseInt(qrCode.substring(API.WisbEventQrCodePrefix.length + 1))

        return this.getOne({ id: parsedId, type: WisbObjectType.Event })
    }

    calculateUserRank(user: { nrOfClearedWastelands: number, addedDumpsters: number, deletedDumpsters: number }) {
        return 10 * user.nrOfClearedWastelands + 2 * user.addedDumpsters + user.deletedDumpsters
    }
}