import Dumpster from "../API/data_types/Dumpster"
import Wasteland from "../API/data_types/Wasteland"
import Event from "../API/data_types/Event"
import WisbScreens from "./WisbScreens"
import User from "../API/data_types/User"

type NavigationParamsList = {
    [WisbScreens.ChatScreen]: {
        event: Event
    },
    [WisbScreens.LeaderBoardScreen]: {},
    [WisbScreens.LoginScreen]: {},
    [WisbScreens.MapScreen]: {
        onItemSelected: (item: Wasteland | Event | Dumpster) => void
        getCurrentUser(): User
    },
    [WisbScreens.MyEventsScreen]: {
        getCurrentUser(): User
    },
    [WisbScreens.SettingsScreen]: {},
    [WisbScreens.SplashScreen]: {},
}

export default NavigationParamsList