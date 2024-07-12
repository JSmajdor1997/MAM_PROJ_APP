import { LatLng } from "react-native-maps";
import MapType from "./MapType";

export default interface Settings {
    mapType: MapType
    languageCode: string 
    defaultLocation: null | LatLng
    notifications: {
        newMessage: boolean
        newInvitation: boolean
        newDumpsterInArea: boolean
        newWastelandInArea: boolean
        newEventInArea: boolean
    }
}