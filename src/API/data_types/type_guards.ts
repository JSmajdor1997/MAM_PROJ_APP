import Dumpster from "./Dumpster";
import Wasteland from "./Wasteland";
import Event from "./Event";
import User from "./User";

export function isEvent(item: Event | Dumpster | Wasteland | User): item is Event {
    return (item as Event).meetPlace !== undefined;
}

export function isDumpster(item: Event | Dumpster | Wasteland | User): item is Dumpster {
    return (item as Dumpster).addedBy !== undefined;
}

export function isUser(item: Event | Dumpster | Wasteland | User): item is User {
    return (item as User).userName !== undefined
}

export function isWasteland(item: Event | Dumpster | Wasteland | User): item is Wasteland {
    return !isDumpster(item) && !isEvent(item) && !isUser(item) && item != null
}