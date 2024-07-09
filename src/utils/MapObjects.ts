import Type from "../API/Type"
import { WisbDumpster, WisbEvent, WisbUser, WisbWasteland } from "../API/interfaces"

export default interface MapObjects {
    [Type.Dumpster]: WisbDumpster[]
    [Type.Event]: WisbEvent[]
    [Type.Wasteland]: WisbWasteland[]
    [Type.User]: WisbUser[]
}