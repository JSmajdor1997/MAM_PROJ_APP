import SimplePlace from "../src/API/data_types/SimplePlace";
import ColorMode from "./ColorMode";
import MapType from "./MapType";
import NotificationType from "./NotificationType";

export default interface Settings {
    mapType: MapType
    languageCode: string 
    showAdds: boolean
    enabledNotifications: NotificationType[]
    colorMode: ColorMode
    defaultLocation: null | SimplePlace
    showDumpstersOnMap: boolean
}