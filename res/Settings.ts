import { SimplePlace } from "../src/API/interfaces";
import MapType from "./MapType";

export default interface Settings {
    mapType: MapType
    languageCode: string 
    showAdds: boolean
    defaultLocation: null | SimplePlace
    showDumpstersOnMap: boolean
}