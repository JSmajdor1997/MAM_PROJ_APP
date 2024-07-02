import User from "./User"
import Event from "./Event"

export interface Invitation {
    event: Event
    user: User
}