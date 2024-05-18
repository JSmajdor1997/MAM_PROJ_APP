import Dumpster from "../API/data_types/Dumpster"
import Wasteland from "../API/data_types/Wasteland"
import Event from "../API/data_types/Event"
import WisbScreens from "./WisbScreens"

type NavigationParamsList = {
    [WisbScreens.ChatScreen]: {},
    [WisbScreens.LeaderBoardScreen]: {},
    [WisbScreens.LoginScreen]: {},
    [WisbScreens.MapScreen]: {
        onItemSelected: (item: Wasteland | Event | Dumpster) => void
    },
    [WisbScreens.MyEventsScreen]: {},
    [WisbScreens.SettingsScreen]: {},
    [WisbScreens.SplashScreen]: {},
}

export default NavigationParamsList