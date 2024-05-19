import { LatLng } from "react-native-maps"
import Message from "./Message"
import User from "./User"
import Wasteland from "./Wasteland"
import SimplePlace from "./SimplePlace"

export default interface Event {
    id: number
    name: string
    iconUrl?: string
    dateRange: [Date, Date]
    meetPlace: SimplePlace
    description: string
    messages: Message[]
    wastelands: Wasteland[]
}

export interface EventUser {
    id: number
    userName: string
    photoUrl?: string
}