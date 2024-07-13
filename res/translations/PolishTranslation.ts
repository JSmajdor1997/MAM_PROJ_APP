import { WisbScreens } from "../../src/screens/NavigationParamsList"
import Translation from "../Translation"

const PolishTranslation: Translation = {
    code: "pl",
    nativeName: "Polski",
    flagEmoji: "🇵🇱",
    Screens: {
        [WisbScreens.ChatScreen]: {

        },
        [WisbScreens.LeaderBoardScreen]: {
            GoToSettings: "Ustawienia"
        },
        [WisbScreens.LoginScreen]: {
            LoginHeader: "LOGOWANIE",
            SignUpHeader: "REJESTRACJA",
            EmailLabel: "email",
            PasswordLabel: "hasło",
            UserNameLabel: "nazwa użytkownika",
            PhotoLabel: "zdjęcie",
            SignUpErrorInvalidDataProvidedMessage: "Wprowadzono niepoprawne dane :(",
            SignUpErrorUserAlreadyRegisteredMessage: "Ten użytkownik już istnieje!",
            SignUpSuccessMessage: "Rejestracja poprawna - może się teraz zalogować",
            AlreadyHaveAccountQuestion: "Masz konto?",
            DontYouHaveAccountQuestion: "Nie masz konta?",
            LoginExclamation: "Zaloguj się!",
            SignUpExclamation: "Zarejestruj się!",
            Or: "LUB",
            LoginErrorInvalidPasswordMessage: "Błąd! Niepoprawne dane!",
            LoginErrorUserDoesntExistMessage: "Błąd! Użytkownik nie istnieje",
        },
        [WisbScreens.MapScreen]: {
            ErrorToastMessage: "Wystąpił błąd!",
            UserPositionMarkerFlyoutContent: "Tu jesteś!"
        },
        [WisbScreens.MyEventsScreen]: {

        },
        [WisbScreens.SettingsScreen]: {
            MapTypeLabel: "Typ mapy",
            DefaultLocationOrGpsLabel: "GPS",
            ShowDumpstersOnMapLabel: "Pokazuj śmietniki na mapie",
            Show: "Pokazuj",
            DontShow: "Nie pokazuj",
            AddsLabel: "Reklamy",
            ShowAdds: "Pokazuj reklamy",
            DontShowAnyAdds: "Nie pokazuj reklam",
            LanguageLabel: "Język",
            ColorModeLabel: "Motyw",
            NotificationsLabel: "Powiadomienia",
        },
        [WisbScreens.SplashScreen]: {

        },
    },
    Components: {
        LocationInput: {
            UnknownPlaceMessage: "Nieznane miejsce",
            EnterPlaceMessage: "Wpisz miejsce",
        },
        LocationItem: {
            ShortAboutMessage: "ok.",
            FromYouMessage: "od ciebie"
        },
        MapQueryInput: {
            Placeholder: "Szukaj miejsc i wydarzeń"
        }
    },
    Dialogs: {
        DumpsterDialog: {
            DeleteAction: "Usuń",
            EditAction: "Edytuj",
            BasicDataLabel: "Podst. informacje",
            LocationLabel: "Miejsce",
        },
        EventDialog: {
            DeleteAction: "Usuń",
            EditAction: "Edytuj",
            JoinAction: "Dołącz!",
            ShareAction: "Udostępnij",
            LeaveAction: "Opuść :(",
            OpenChatAction: "Otwórz czat",
            BasicDataLabel: "Podst. informacje",
            MeetPlaceLabel: "Miejsce spotkania",
            WastelandsLabel: "Związane wysypiska",
            MembersLabel: "Członkowie",
            ThatsAllMessage: "To wszystko!",
            InviteMorePeopleMessage: "Zaproś więcej osób!",
        },
        WastelandDialog: {
            DeleteAction: "Usuń",
            EditAction: "Edytuj",
            CleanAction: "Posprzątaj!",
            ShareAction: "Udostępnij",
            CreateEventAction: "Utwórz wydarzenie",
            BasicDataLabel: "Podst. informacje",
            ReportedLabel: "Zgłoszone",
            ByLabel: "przez",
            PhotosBeforeCleaningLabel: "Zdjęcia przed sprzątaniem",
            PhotosAfterCleaningLabel: "Zdjęcia po sprzątniu",
            PhotosAfterCleaningByLabel: "Zdjęcia po sprzątniu przez",
        },
        ListDialog: {
            PlaceNotFoundMessage: "Nie znaleziono miejsca",
            NoMoreDataMessage: "To wszystko"
        },
    }
}

export default PolishTranslation