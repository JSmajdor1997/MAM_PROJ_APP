import { LatLng } from "react-native-maps"
import GeoHelper from "../utils/GeoHelper"
import API from "./API"
import Ref, { isRef } from "./Ref"
import { Notification, isNewInvitationNotification, isNewMessageNotification, isObjectCRUDNotification } from "./notifications"

export type ChangeListener = (n: Notification) => void

export interface Filter {
    location?: LatLng
    observedIds?: Ref<any>[]
    allowFromSelf?: boolean
}

export enum NotificationType {
    ObjectCRUDNotification,
    WastelandClearedNotification,
    NewMessageNotification,
    NewInvitationNotification
}

export default class ListenersManager {
    private listeners = new Map<ChangeListener, Filter>()

    constructor(private readonly api: API, getController: (g: (notification: Notification) => void) => void) {
        getController(async (notification: Notification) => {
            const currentUser = this.api.getCurrentUser()

            if (currentUser == null) {
                return
            }

            for (const [listener, filter] of this.listeners) {
                if (filter.allowFromSelf === false && currentUser.id === notification.author.id) {
                    return
                }

                if (isObjectCRUDNotification(notification)) {
                    const { location, ref } = notification

                    if (filter.location != undefined && GeoHelper.isLatLng(location) && GeoHelper.calcApproxDistanceBetweenLatLngInMeters(location, filter.location)) {
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
        if (this.listeners.has(listener)) {
            this.listeners.delete(listener)
        }
    }

    updateListener(listener: ChangeListener, filter: Filter) {
        if (this.listeners.has(listener)) {
            this.listeners.set(listener, { ...this.listeners.get(listener), ...filter })
        }
    }
}