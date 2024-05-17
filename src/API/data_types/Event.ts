import { LatLng } from "react-native-maps"
import Message from "./Message"
import User from "./User"
import Wasteland from "./Wasteland"

export default interface Event {
    id: number
    name: string
    iconUrl?: string
    dateRange: [Date, Date]
    meetPlace: {
        coords: LatLng,
        asText: string
    }
    description: string
    messages: Message[]
    wastelands: Wasteland[]
}

export interface EventUser {
    id: number
    userName: string
    photoUrl?: string
}