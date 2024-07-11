import { WisbDumpster, WisbEvent, WisbUser, WisbWasteland } from "../API/interfaces"
import WisbScreens from "./WisbScreens"

type NavigationParamsList = {
    [WisbScreens.ChatScreen]: {
        event: WisbEvent
    },
    [WisbScreens.LeaderBoardScreen]: {},
    [WisbScreens.LoginScreen]: {
        onUserLoggedIn: (user: WisbUser) => void
    },
    [WisbScreens.MapScreen]: {
        onItemSelected: (item: WisbWasteland | WisbEvent | WisbDumpster) => void
        getCurrentUser(): WisbUser
    },
    [WisbScreens.MyEventsScreen]: {
        getCurrentUser(): WisbUser
    },
    [WisbScreens.SettingsScreen]: {},
    [WisbScreens.SplashScreen]: {},
}

export default NavigationParamsList