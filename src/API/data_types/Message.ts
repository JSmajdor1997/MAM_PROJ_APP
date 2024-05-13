import User from "./User";

export default interface Message {
    sender: User
    content: string
    photosUrls: string[]
    date: Date
}