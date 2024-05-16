import { LatLng } from "react-native-maps"
import User from "./User"

export default interface Dumpster {
    id: number
    place: {
        coords: LatLng,
        asText: string
    }
    description: string
    photos: unknown[]
    addedBy: User
}