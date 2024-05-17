import Dumpster from "./Dumpster";
import Wasteland from "./Wasteland";
import Event from "./Event";

export function isEvent(item: Event | Dumpster | Wasteland): item is Event {
    return (item as Event).meetPlace !== undefined;
}

export function isDumpster(item: Event | Dumpster | Wasteland): item is Dumpster {
    return (item as Dumpster).addedBy !== undefined;
}

export function isWasteland(item: Event | Dumpster | Wasteland): item is Wasteland {
    return !isDumpster(item) && !isEvent(item) && item != null
}