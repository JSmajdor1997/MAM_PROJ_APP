import { LatLng } from "react-native-maps"
import User from "./User"
import SimplePlace from "./SimplePlace"

export default interface Dumpster {
    id: number
    place: SimplePlace
    description: string
    photos: string[]
    addedBy: User
}