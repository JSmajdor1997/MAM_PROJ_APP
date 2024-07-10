import { LatLng } from "react-native-maps"
import Ref from "./Ref"
import { Invitation, Message, WisbDumpster, WisbEvent, WisbUser, WisbWasteland } from "./interfaces"
import WisbObjectType from "./WisbObjectType"
import type { TypeMap } from "./API"

export enum CRUD {
    Created,
    Updated,
    Deleted
}

export type ObjectCRUDNotification<T extends WisbObjectType> = {
    author: Ref<WisbObjectType.User>
    type?: never
    ref: Ref<T>
    location?: never
    action: CRUD.Deleted
    updatedFields?: never
} | {
    author: Ref<WisbObjectType.User>
    type?: never
    ref: Ref<T>
    location?: never
    action: CRUD.Updated
    updatedFields: { [key in keyof TypeMap<T>]?: TypeMap<T>[key] }
} | {
    author: Ref<WisbObjectType.User>
    ref?: never
    type: WisbObjectType
    location?: LatLng
    action: CRUD.Created
    updatedFields?: never
}

export interface NewMessageNotification {
    author: Ref<WisbObjectType.User>
    message: Message
}

export interface NewInvitationNotification {
    author: Ref<WisbObjectType.User>
    invitation: Invitation
}

export function isObjectCRUDNotification(n: ObjectCRUDNotification<any> | NewMessageNotification | NewInvitationNotification): n is ObjectCRUDNotification<any> {
    return (n as ObjectCRUDNotification<any>).action != null
}

export function isNewMessageNotification(n: ObjectCRUDNotification<any> | NewMessageNotification | NewInvitationNotification): n is NewMessageNotification {
    return (n as NewMessageNotification).message != null
}

export function isNewInvitationNotification(n: ObjectCRUDNotification<any> | NewMessageNotification | NewInvitationNotification): n is NewInvitationNotification {
    return (n as NewInvitationNotification).invitation != null
}

export type Notification = NewInvitationNotification | NewMessageNotification | ObjectCRUDNotification<any>