import { LatLng } from "react-native-maps"
import Ref from "./Ref"
import WisbObjectType from "./WisbObjectType"

export interface SimplePlace {
    coords: LatLng
    asText: string
}

export interface WisbMessage {
    event: Ref<WisbObjectType.Event>
    content: string
    date: Date
    sender: Ref<WisbObjectType.User>&{userName: string, photoUrl?: string}
}

export interface Invitation {
    event: Ref<WisbObjectType.Event> & { name: string }
    user: Ref<WisbObjectType.User>
    asAdmin: boolean
}

export interface WisbUser {
    readonly id: number
    readonly email: string
    readonly userName: string
    readonly password: string
    readonly photoUrl?: string
    readonly nrOfClearedWastelands: number
    readonly addedDumpsters: number
    readonly deletedDumpsters: number
}

export interface WisbEvent {
    readonly id: number
    readonly name: string
    readonly iconUrl: string
    readonly dateRange: [Date, Date]
    readonly place: SimplePlace
    readonly description: string
    readonly members: Map<string, Ref<WisbObjectType.User> & { isAdmin: boolean }>
    readonly wastelands: Ref<WisbObjectType.Wasteland>[]
}

export interface WisbDumpster {
    readonly id: number
    readonly place: SimplePlace
    readonly description: string
    readonly photos: string[]
    readonly addedBy: Ref<WisbObjectType.User>
}

export interface WastelandCleaningData {
    readonly cleanedBy: Ref<WisbObjectType.User>[]
    readonly date: Date
    readonly photos: string[]
}

export interface WisbWasteland {
    readonly id: number
    readonly place: SimplePlace
    readonly photos: string[]
    readonly description: string
    readonly creationDate: Date
    readonly reportedBy: Ref<WisbObjectType.User> & { userName: string }
    readonly afterCleaningData?: WastelandCleaningData
}