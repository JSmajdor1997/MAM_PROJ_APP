import { LatLng } from "react-native-maps";
import Ref from "./Ref";
import WisbObjectType from "./WisbObjectType";
import { Invitation, SimplePlace, WisbDumpster, WisbEvent, WisbUser, WisbWasteland } from "./interfaces";
import GeoHelper from "../utils/GeoHelper";

export function isSimplePlace(obj: any | SimplePlace): obj is LatLng {
    if (obj == null) {
        return false
    }

    return typeof (obj as SimplePlace).asText == "string" && GeoHelper.isLatLng((obj as SimplePlace).coords)
}

export function isRef<T extends WisbObjectType>(obj: any | Ref<T>, type: T): obj is Ref<T> {
    if (obj == null) {
        return false
    }

    return (
        typeof (obj as Ref<WisbObjectType>).id == "number" &&
        (obj as Ref<WisbObjectType>).type == type
    )
}

export function isEvent(item: WisbEvent | WisbDumpster | WisbWasteland | WisbUser | Invitation | any): item is WisbEvent {
    if (item == null) {
        return false
    }

    const e = item as WisbEvent

    return (
        typeof e.id === "number" &&
        typeof e.name === "string" &&
        typeof e.iconUrl === "string" &&
        Array.isArray(e.dateRange) && e.dateRange.length == 2 && e.dateRange[0] instanceof Date && e.dateRange[1] instanceof Date &&
        isSimplePlace(e.place) &&
        typeof e.description === "string" &&
        e.members instanceof Map &&
        Array.isArray(e.wastelands)
    )
}

export function isDumpster(item: WisbEvent | WisbDumpster | WisbWasteland | WisbUser | Invitation | any): item is WisbDumpster {
    if (item == null) {
        return false
    }

    const e = item as WisbDumpster

    return (
        typeof e.id === "number" &&
        isSimplePlace(e.place) &&
        typeof e.description === "string" &&
        Array.isArray(e.photos) &&
        isRef(e.addedBy, WisbObjectType.User)
    )
}

export function isUser(item: WisbEvent | WisbDumpster | WisbWasteland | WisbUser | Invitation | any): item is WisbUser {
    if (item == null) {
        return false
    }

    const e = item as WisbUser

    return (
        typeof e.id === "number" &&
        typeof e.email === "string" &&
        typeof e.userName === "string" &&
        typeof e.password === "string" &&
        (typeof e.photoUrl === "string" || typeof e.photoUrl === "undefined") &&
        typeof e.nrOfClearedWastelands === "number" &&
        typeof e.addedDumpsters === "number" &&
        typeof e.deletedDumpsters === "number"
    )
}

export function isWasteland(item: WisbEvent | WisbDumpster | WisbWasteland | WisbUser | Invitation | any): item is WisbWasteland {
    if (item == null) {
        return false
    }

    const e = item as WisbWasteland

    return (
        typeof e.id === "number" &&
        isSimplePlace(e.place) &&
        Array.isArray(e.photos) &&
        typeof e.description === "string" &&
        e.creationDate instanceof Date &&
        isRef(e.reportedBy, WisbObjectType.User) &&
        (typeof e.afterCleaningData === "undefined" || (
            Array.isArray(e.afterCleaningData.cleanedBy) &&
            e.afterCleaningData.date instanceof Date &&
            Array.isArray(e.afterCleaningData.photos)
        ))
    )
}

export function isInvitation(item: WisbEvent | WisbDumpster | WisbWasteland | WisbUser | Invitation): item is Invitation {
    if (item == null) {
        return false
    }

    const e = item as Invitation

    return (
        typeof e.asAdmin == "boolean" &&
        isRef(e.user, WisbObjectType.User) &&
        isRef(e.event, WisbObjectType.Event)
    )
}