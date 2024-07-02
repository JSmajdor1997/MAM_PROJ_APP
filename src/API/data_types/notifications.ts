import Dumpster from "./Dumpster";
import Wasteland from "./Wasteland";
import Event from "./Event";
import User from "./User";
import { LatLng } from "react-native-maps";

export interface NotificationFilter {
    location: LatLng
}

export interface NewObjectNotification {
    newItem: Wasteland | Event | Dumpster
}

export interface ObjectDeletionNotification {
    deletedItem: Wasteland | Event | Dumpster
}

export interface ObjectUpdatedNotification {
    updatedItem: Wasteland | Event | Dumpster
}

export interface WastelandClearedNotification {
    clearedWasteland: Wasteland | Event | Dumpster
}

export interface NewMessageNotification {
    event: Event
    content: string
}

export interface NewEventInvitationNotification {
    event: Event
    sender: User
}

export enum NotificationType {
    NewObjectNotification,
    ObjectUpdatedNotification,
    WastelandClearedNotification,
    NewMessageNotification,
    NewEventInvitationNotification,
    ObjectDeletionNotification
}

export type Notification =
    | NewObjectNotification
    | ObjectUpdatedNotification
    | WastelandClearedNotification
    | NewMessageNotification
    | NewEventInvitationNotification
    | ObjectDeletionNotification

export function switchNotification<R = void>(item: Notification, switcher: {
    [NotificationType.NewObjectNotification]: (item: NewObjectNotification) => R,
    [NotificationType.ObjectUpdatedNotification]: (item: ObjectUpdatedNotification) => R,
    [NotificationType.WastelandClearedNotification]: (item: WastelandClearedNotification) => R,
    [NotificationType.NewMessageNotification]: (item: NewMessageNotification) => R,
    [NotificationType.NewEventInvitationNotification]: (item: NewEventInvitationNotification) => R,
    [NotificationType.ObjectDeletionNotification]: (item: ObjectDeletionNotification) => R,
}): R {
    if ((item as NewObjectNotification).newItem !== undefined) {
        return switcher[NotificationType.NewObjectNotification](item as NewObjectNotification)
    } else if ((item as ObjectUpdatedNotification).updatedItem !== undefined) {
        return switcher[NotificationType.ObjectUpdatedNotification](item as ObjectUpdatedNotification)
    } else if ((item as WastelandClearedNotification).clearedWasteland !== undefined) {
        return switcher[NotificationType.WastelandClearedNotification](item as WastelandClearedNotification)
    } else if ((item as NewMessageNotification).content !== undefined) {
        return switcher[NotificationType.NewMessageNotification](item as NewMessageNotification)
    } else if ((item as NewEventInvitationNotification).sender !== undefined) {
        return switcher[NotificationType.NewEventInvitationNotification](item as NewEventInvitationNotification)
    } else if ((item as ObjectDeletionNotification).deletedItem !== undefined) {
        return switcher[NotificationType.ObjectDeletionNotification](item as ObjectDeletionNotification)
    } else {
        throw new Error("Unexpected notification item received!")
    }
}