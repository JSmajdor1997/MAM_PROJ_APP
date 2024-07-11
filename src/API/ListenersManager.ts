import { LatLng } from "react-native-maps"
import { CRUD, Notification, isNewInvitationNotification, isNewMessageNotification, isObjectCRUDNotification } from "./notifications"
import Ref, { isRef } from "./Ref"
import API from "./API"
import { WisbUser } from "./interfaces"
import calcApproxDistanceBetweenLatLngInMeters from "../utils/calcApproxDistanceBetweenLatLng"
import isLatLng from "../utils/isLatLng"

export type ChangeListener = (n: Notification) => void

export interface Filter {
    location?: LatLng
    observedIds?: Ref<any>[]
}

export enum NotificationType {
    ObjectCRUDNotification,
    WastelandClearedNotification,
    NewMessageNotification,
    NewInvitationNotification
}

export default class ListenersManager {
    private static readonly MinDistance = 10000
    private listeners = new Map<ChangeListener, Filter>()

    constructor(private readonly api: API, getController: (g: (notification: Notification) => void) => void) {
        getController(async (notification: Notification) => {
            const currentUser = this.api.getCurrentUser()

            if (currentUser == null) {
                return
            }

            if (notification.author.id == currentUser.id) {
                return
            }

            for (const [listener, filter] of this.listeners) {
                if (isObjectCRUDNotification(notification)) {
                    const { location, ref } = notification

                    if (filter.location != undefined && isLatLng(location) && calcApproxDistanceBetweenLatLngInMeters(location, filter.location)) {
                        listener(notification)
                    }

                    if (filter.observedIds != undefined && isRef(ref) && filter.observedIds.some(it => it.id == ref.id && it.type == ref.type)) {
                        listener(notification)
                    }
                } else if (isNewMessageNotification(notification)) {
                    const event = (await this.api.getOne(notification.message.event)).data

                    if (event == null) {
                        return
                    }

                    if (event.members.has(currentUser.id.toString())) {
                        [...this.listeners].forEach(it => {
                            listener(notification)
                        })
                    }
                } else if (isNewInvitationNotification(notification)) {
                    if (notification.invitation.user.id == currentUser.id) {
                        [...this.listeners].forEach(it => {
                            listener(notification)
                        })
                    }
                }
            }
        })
    }

    registerListener(listener: ChangeListener, filter: Filter) {
        if (this.listeners.has(listener)) {
            throw new Error("Listener already registered!")
        }

        this.listeners.set(listener, filter)
    }

    unregisterListener(listener: ChangeListener) {
        if (!this.listeners.has(listener)) {
            throw new Error("Listener not registered!")
        }

        this.listeners.delete(listener)
    }

    updateListener(listener: ChangeListener, filter: Filter) {
        if (!this.listeners.has(listener)) {
            throw new Error("Listener not registered!")
        }

        this.listeners.set(listener, filter)
    }
}