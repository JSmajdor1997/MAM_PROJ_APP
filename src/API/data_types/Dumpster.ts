import { LatLng } from "react-native-maps"
import User from "./User"

export default interface Dumpster {
    id: number
    placeCoords: LatLng
    placeDescription: string
    description: string
    photos: unknown[]
    addedBy: User
}