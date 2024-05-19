import { SupportedLanguages } from "./SupportedLanguages";
import SimplePlace from "../src/API/data_types/SimplePlace";
import ColorMode from "./ColorMode";
import MapType from "./MapType";
import NotificationType from "./NotificationType";

export default interface Settings {
    mapType: MapType
    language: SupportedLanguages
    showAdds: boolean
    enabledNotifications: NotificationType[]
    colorMode: ColorMode
    defaultLocations: null | SimplePlace
    showDumpstersOnMap: boolean
}