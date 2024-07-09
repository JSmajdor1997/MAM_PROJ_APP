import { WisbEvent, WisbDumpster, WisbWasteland, WisbUser, Invitation } from "./interfaces";


export function isEvent(item: WisbEvent | WisbDumpster | WisbWasteland | WisbUser | Invitation): item is WisbEvent {
    return (item as WisbEvent).place !== undefined;
}

export function isDumpster(item: WisbEvent | WisbDumpster | WisbWasteland | WisbUser | Invitation): item is WisbDumpster {
    return (item as WisbDumpster).addedBy !== undefined;
}

export function isUser(item: WisbEvent | WisbDumpster | WisbWasteland | WisbUser | Invitation): item is WisbUser {
    return (item as WisbUser).userName !== undefined
}

export function isWasteland(item: WisbEvent | WisbDumpster | WisbWasteland | WisbUser | Invitation): item is WisbWasteland {
    return !isDumpster(item) && !isEvent(item) && !isUser(item) && (item as Invitation).asAdmin === undefined && item != null
}

export function isInvitation(item: WisbEvent | WisbDumpster | WisbWasteland | WisbUser | Invitation): item is Invitation {
    return (item as Invitation).asAdmin === undefined && item != null
}