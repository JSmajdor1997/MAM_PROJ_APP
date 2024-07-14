import { LatLng } from "react-native-maps"
import type { TypeMap } from "./API"
import Ref from "./Ref"
import WisbObjectType from "./WisbObjectType"
import { Invitation, WisbMessage } from "./interfaces"

export enum CRUD {
    Created,
    Updated,
    Deleted
}

export type ObjectCRUDNotification<T extends WisbObjectType, Action extends CRUD> = Action extends CRUD.Deleted ?{
    author: Ref<WisbObjectType.User>
    type?: never
    ref: Ref<T>
    location?: never
    action: CRUD.Deleted
    updatedFields?: never
} : Action extends CRUD.Updated ? {
    author: Ref<WisbObjectType.User>
    type?: never
    ref: Ref<T>
    location?: never
    action: CRUD.Updated
    updatedFields: { [key in keyof TypeMap<T>]?: TypeMap<T>[key] }
} : {
    author: Ref<WisbObjectType.User>
    ref?: never
    type: WisbObjectType
    location?: LatLng
    action: CRUD.Created
    updatedFields?: never
}

export interface NewMessageNotification {
    author: Ref<WisbObjectType.User>
    message: WisbMessage
}

export interface NewInvitationNotification {
    author: Ref<WisbObjectType.User>
    invitation: Invitation
}

export function isObjectCRUDNotification(n: ObjectCRUDNotification<any, CRUD> | NewMessageNotification | NewInvitationNotification | any): n is ObjectCRUDNotification<any, CRUD> {
    return (n as ObjectCRUDNotification<any, CRUD>).action != null
}

export function isNewMessageNotification(n: ObjectCRUDNotification<any, CRUD> | NewMessageNotification | NewInvitationNotification | any): n is NewMessageNotification {
    return (n as NewMessageNotification).message != null
}

export function isNewInvitationNotification(n: ObjectCRUDNotification<any, CRUD> | NewMessageNotification | NewInvitationNotification | any): n is NewInvitationNotification {
    return (n as NewInvitationNotification).invitation != null
}

export type Notification = NewInvitationNotification | NewMessageNotification | ObjectCRUDNotification<any, CRUD>