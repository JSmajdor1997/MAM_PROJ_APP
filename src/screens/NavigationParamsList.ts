import { WisbDumpster, WisbEvent, WisbUser, WisbWasteland } from "../API/interfaces"

export enum WisbScreens {
    ChatScreen = "ChatScreen",
    LeaderBoardScreen = "LeaderBoardScreen",
    LoginScreen = "LoginScreen",
    MapScreen = "MapScreen",
    MyEventsScreen = "MyEventsScreen",
    SettingsScreen = "SettingsScreen",
    SplashScreen = "SplashScreen"
}

export type WisbNavigateFunction<T extends WisbScreens> = (screen: T, data: T extends WisbScreens.ChatScreen ? { event: WisbEvent } : {}) => void

interface Navigation {
    go: WisbNavigateFunction<any>
    goBack(): void
}

type NavigationParamsList = {
    [WisbScreens.ChatScreen]: {
        event: WisbEvent
        navigate: Navigation
    },
    [WisbScreens.LeaderBoardScreen]: {
        navigate: Navigation
    },
    [WisbScreens.LoginScreen]: {
        onUserLoggedIn: (user: WisbUser) => void
        navigate: Navigation
    },
    [WisbScreens.MapScreen]: {
        onItemSelected: (item: WisbWasteland | WisbEvent | WisbDumpster) => void
        getCurrentUser(): WisbUser
        navigate: Navigation
    },
    [WisbScreens.MyEventsScreen]: {
        getCurrentUser(): WisbUser
        navigate: Navigation
        onItemSelected: (event: WisbEvent) => void
    },
    [WisbScreens.SettingsScreen]: {
        navigate: Navigation
    },
    [WisbScreens.SplashScreen]: {
        navigate: Navigation
    },
}

export default NavigationParamsList