import { Notification } from "../../notifications"
import Storage from "../Storage"

export default interface Config {
    storage: Storage
    broadcastNotifications: (n: Notification) => void
    interval: number
}