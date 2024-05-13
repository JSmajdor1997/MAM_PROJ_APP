import Message from "./Message"
import User from "./User"
import Wasteland from "./Wasteland"

export default interface Event {
    id: number
    name: string
    dateRange: [Date, Date]
    meetPlace: unknown
    admins: User[]
    members: User[]
    description: string
    messages: Message[]
    wastelands: Wasteland[]
    isFinished: boolean
}