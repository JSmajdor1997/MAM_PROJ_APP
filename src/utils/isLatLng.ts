import { LatLng } from "react-native-maps";

export default function isLatLng(obj: any): obj is LatLng {
    return typeof (obj as LatLng).latitude == "number" && typeof (obj as LatLng).longitude == "number"
}