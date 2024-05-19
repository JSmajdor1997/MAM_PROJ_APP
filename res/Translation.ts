import WisbScreens from "../src/screens/WisbScreens"

export default interface Translation {
    code: string
    nativeName: string
    flagEmoji: string
    Screens: {
        [WisbScreens.ChatScreen]: {

        },
        [WisbScreens.LeaderBoardScreen]: {
            GoToSettings: string
        },
        [WisbScreens.LoginScreen]: {
            LoginHeader: string,
            SignUpHeader: string,
            EmailLabel: string,
            PasswordLabel: string,
            UserNameLabel: string,
            PhotoLabel: string,
            SignUpErrorInvalidDataProvidedMessage: string,
            SignUpErrorUserAlreadyRegisteredMessage: string,
            LoginErrorInvalidPasswordMessage: string,
            LoginErrorUserDoesntExistMessage: string,
            SignUpSuccessMessage: string,
            AlreadyHaveAccountQuestion: string,
            DontYouHaveAccountQuestion: string,
            LoginExclamation: string,
            SignUpExclamation: string,
            Or: string
        },
        [WisbScreens.MapScreen]: {
            ErrorToastMessage: string,
            UserPositionMarkerFlyoutContent: string
        },
        [WisbScreens.MyEventsScreen]: {

        },
        [WisbScreens.SettingsScreen]: {
            MapTypeLabel: string,
            DefaultLocationOrGpsLabel: string,
            ShowDumpstersOnMapLabel: string,
            Show: string,
            DontShow: string,
            AddsLabel: string,
            ShowAdds: string,
            DontShowAnyAdds: string,
            LanguageLabel: string,
            ColorModeLabel: string,
            NotificationsLabel: string,
        },
        [WisbScreens.SplashScreen]: {

        },
    },
    Components: {
        LocationInput: {
            UnknownPlaceMessage: string,
            EnterPlaceMessage: string,
        },
        LocationItem: {
            ShortAboutMessage: string,
            FromYouMessage: string
        },
        MapQueryInput: {
            Placeholder: string
        }
    },
    Dialogs: {
        DumpsterDialog: {
            DeleteAction: string,
            EditAction: string,
            BasicDataLabel: string,
            LocationLabel: string,
        },
        EventDialog: {
            DeleteAction: string,
            EditAction: string,
            JoinAction: string,
            ShareAction: string,
            LeaveAction: string,
            OpenChatAction: string,
            BasicDataLabel: string,
            MeetPlaceLabel: string,
            WastelandsLabel: string,
            MembersLabel: string,
            ThatsAllMessage: string,
            InviteMorePeopleMessage: string,
        },
        WastelandDialog: {
            DeleteAction: string,
            EditAction: string,
            CleanAction: string,
            ShareAction: string,
            CreateEventAction: string,
            BasicDataLabel: string,
            ReportedLabel: string,
            ByLabel: string,
            PhotosBeforeCleaningLabel: string,
            PhotosAfterCleaningLabel: string,
            PhotosAfterCleaningByLabel: string,
        },
        ListDialog: {
            PlaceNotFoundMessage: string,
            NoMoreDataMessage: string
        },
    }
}