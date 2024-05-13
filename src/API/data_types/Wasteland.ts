import { LatLng } from "react-native-maps"
import Event from "./Event"
import User from "./User"

export default interface Wasteland {
    id: number
    placeCoords: LatLng
    placeDescription: string
    photos: unknown[]
    description: string
    creationDate: Date
    reportedBy: User
    afterCleaningData?: {
        cleanedBy: User[]
        date: Date
        photos: unknown[]
    }
}