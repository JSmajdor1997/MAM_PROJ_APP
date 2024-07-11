import { SimplePlace } from "../src/API/interfaces";
import MapType from "./MapType";

export default interface Settings {
    mapType: MapType
    languageCode: string 
    defaultLocation: null | SimplePlace
    notifications: {
        newMessage: boolean
        newInvitation: boolean
        newDumpsterInArea: boolean
        newWastelandInArea: boolean
        newEventInArea: boolean
    }
}