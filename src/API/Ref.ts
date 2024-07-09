import WisbObjectType from "./WisbObjectType"

type Ref<T extends WisbObjectType> = {
    id: number
    type: T
}

export default Ref

export function isRef(obj: any): obj is Ref<any> {
    return typeof (obj as Ref<any>).id == "number" && [
        WisbObjectType.User,
        WisbObjectType.Wasteland,
        WisbObjectType.Dumpster,
        WisbObjectType.Event
    ].includes((obj as Ref<any>).type)
}