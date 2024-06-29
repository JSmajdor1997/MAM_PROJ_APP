import { LatLng } from "react-native-maps"
import User from "./User"
import SimplePlace from "./SimplePlace"

export default interface Wasteland {
    id: number
    place: SimplePlace
    photos: string[]
    description: string
    creationDate: Date
    reportedBy: User
    afterCleaningData?: {
        cleanedBy: User[]
        date: Date
        photos: string[]
    }
}