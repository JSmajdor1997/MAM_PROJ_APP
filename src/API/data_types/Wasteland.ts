import { LatLng } from "react-native-maps"
import User from "./User"

export default interface Wasteland {
    id: number
    place: {
        coords: LatLng
        asText: string
    }
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