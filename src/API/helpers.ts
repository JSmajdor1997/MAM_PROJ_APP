import Dumpster from "./data_types/Dumpster"
import Wasteland from "./data_types/Wasteland"
import Event from "./data_types/Event"
import User from "./data_types/User"

export enum Type {
    Wasteland = "Wasteland",
    Dumpster = "Dumpster",
    Event = "Event",
    User = "User"
}

export interface Query {
    type: Type
    phrase: string
}

export interface MapObjects {
    [Type.Dumpster]: Dumpster[]
    [Type.Event]: Event[]
    [Type.Wasteland]: Wasteland[]
    [Type.User]: User[]
}