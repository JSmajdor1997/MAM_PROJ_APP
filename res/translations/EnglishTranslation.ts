import WisbScreens from "../../src/screens/WisbScreens"
import { SupportedLanguages } from "../SupportedLanguages"
import Translation from "../Translation"

const EnglishTranslation: Translation = {
    language: SupportedLanguages.English,
    Screens: {
        [WisbScreens.ChatScreen]: {

        },
        [WisbScreens.LeaderBoardScreen]: {
            GoToSettings: "Go to settings"
        },
        [WisbScreens.LoginScreen]: {
            LoginHeader: "LOGIN",
            SignUpHeader: "SIGN UP",
            EmailLabel: "email",
            PasswordLabel: "password",
            UserNameLabel: "username",
            PhotoLabel: "photo",
            SignUpErrorInvalidDataProvidedMessage: "Invalid data provided :(",
            SignUpErrorUserAlreadyRegisteredMessage: "This user already exists!",
            SignUpSuccessMessage: "Registration successful - you can now log in",
            AlreadyHaveAccountQuestion: "Do you have an account?",
            DontYouHaveAccountQuestion: "Don't have an account?",
            LoginExclamation: "Log in!",
            SignUpExclamation: "Sign up!",
            Or: "OR",
            LoginErrorInvalidPasswordMessage: "Error! Invalid data provided",
            LoginErrorUserDoesntExistMessage: "Error! User does not exist",
        },
        [WisbScreens.MapScreen]: {
            ErrorToastMessage: "An error occurred!",
            UserPositionMarkerFlyoutContent: "You are here!"
        },
        [WisbScreens.MyEventsScreen]: {

        },
        [WisbScreens.SettingsScreen]: {
            MapTypeLabel: "Map type",
            DefaultLocationOrGpsLabel: "GPS",
            ShowDumpstersOnMapLabel: "Show dumpsters on map",
            Show: "Show",
            DontShow: "Don't show",
            AddsLabel: "Ads",
            ShowAdds: "Show ads",
            DontShowAnyAdds: "Don't show ads",
            LanguageLabel: "Language",
            ColorModeLabel: "Theme",
            NotificationsLabel: "Notifications",
        },
        [WisbScreens.SplashScreen]: {

        },
    },
    Components: {
        LocationInput: {
            UnknownPlaceMessage: "Unknown place",
            EnterPlaceMessage: "Enter place",
        },
        LocationItem: {
            ShortAboutMessage: "approx.",
            FromYouMessage: "from you"
        },
        MapQueryInput: {
            Placeholder: "Search for places and events"
        }
    },
    Dialogs: {
        DumpsterDialog: {
            DeleteAction: "Delete",
            EditAction: "Edit",
            BasicDataLabel: "Basic info",
            LocationLabel: "Location",
        },
        EventDialog: {
            DeleteAction: "Delete",
            EditAction: "Edit",
            JoinAction: "Join!",
            ShareAction: "Share",
            LeaveAction: "Leave :(",
            OpenChatAction: "Open chat",
            BasicDataLabel: "Basic info",
            MeetPlaceLabel: "Meeting place",
            WastelandsLabel: "Related dumps",
            MembersLabel: "Members",
            ThatsAllMessage: "That's all!",
            InviteMorePeopleMessage: "Invite more people!",
        },
        WastelandDialog: {
            DeleteAction: "Delete",
            EditAction: "Edit",
            CleanAction: "Clean up!",
            ShareAction: "Share",
            CreateEventAction: "Create event",
            BasicDataLabel: "Basic info",
            ReportedLabel: "Reported",
            ByLabel: "by",
            PhotosBeforeCleaningLabel: "Photos before cleaning",
            PhotosAfterCleaningLabel: "Photos after cleaning",
            PhotosAfterCleaningByLabel: "Photos after cleaning by",
        },
        ListDialog: {
            PlaceNotFoundMessage: "Place not found",
            NoMoreDataMessage: "That's all"
        },
    }
}

export default EnglishTranslation