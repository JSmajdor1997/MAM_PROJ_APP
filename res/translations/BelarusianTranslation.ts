import WisbScreens from "../../src/screens/WisbScreens"
import Translation from "../Translation"

const BelarusianTranslation: Translation = {
    code: "be",
    nativeName: "Беларусь",
    flagEmoji: "🇧🇾",
    Screens: {
        [WisbScreens.ChatScreen]: {

        },
        [WisbScreens.LeaderBoardScreen]: {
            GoToSettings: "Перайдзіце да налад"
        },
        [WisbScreens.LoginScreen]: {
            LoginHeader: "УВАХОД",
            SignUpHeader: "РЭГІСТРАЦЫЯ",
            EmailLabel: "электронная пошта",
            PasswordLabel: "пароль",
            UserNameLabel: "імя карыстальніка",
            PhotoLabel: "фота",
            SignUpErrorInvalidDataProvidedMessage: "Уведзены няправільныя даныя :(",
            SignUpErrorUserAlreadyRegisteredMessage: "Гэты карыстальнік ужо існуе!",
            SignUpSuccessMessage: "Рэгістрацыя прайшла паспяхова - цяпер вы можаце ўвайсці",
            AlreadyHaveAccountQuestion: "У вас ёсць акаўнт?",
            DontYouHaveAccountQuestion: "У вас няма акаўнта?",
            LoginExclamation: "Увайдзіце!",
            SignUpExclamation: "Зарэгіструйцеся!",
            Or: "АБО",
            LoginErrorInvalidPasswordMessage: "Памылка! Няправільныя даныя",
            LoginErrorUserDoesntExistMessage: "Памылка! Карыстальнік не існуе",
        },
        [WisbScreens.MapScreen]: {
            ErrorToastMessage: "Адбылася памылка!",
            UserPositionMarkerFlyoutContent: "Вы тут!"
        },
        [WisbScreens.MyEventsScreen]: {

        },
        [WisbScreens.SettingsScreen]: {
            MapTypeLabel: "Тып карты",
            DefaultLocationOrGpsLabel: "GPS",
            ShowDumpstersOnMapLabel: "Паказваць сметніцы на карце",
            Show: "Паказваць",
            DontShow: "Не паказваць",
            AddsLabel: "Рэклама",
            ShowAdds: "Паказваць рэкламу",
            DontShowAnyAdds: "Не паказваць рэкламу",
            LanguageLabel: "Мова",
            ColorModeLabel: "Тэма",
            NotificationsLabel: "Апавяшчэнні",
        },
        [WisbScreens.SplashScreen]: {

        },
    },
    Components: {
        LocationInput: {
            UnknownPlaceMessage: "Невядомае месца",
            EnterPlaceMessage: "Увядзіце месца",
        },
        LocationItem: {
            ShortAboutMessage: "прыкладна",
            FromYouMessage: "ад вас"
        },
        MapQueryInput: {
            Placeholder: "Шукайце месцы і падзеі"
        }
    },
    Dialogs: {
        DumpsterDialog: {
            DeleteAction: "Выдаліць",
            EditAction: "Рэдагаваць",
            BasicDataLabel: "Асноўныя даныя",
            LocationLabel: "Месца",
        },
        EventDialog: {
            DeleteAction: "Выдаліць",
            EditAction: "Рэдагаваць",
            JoinAction: "Далучайцеся!",
            ShareAction: "Падзяліцца",
            LeaveAction: "Пакінуць :(",
            OpenChatAction: "Адкрыць чат",
            BasicDataLabel: "Асноўныя даныя",
            MeetPlaceLabel: "Месца сустрэчы",
            WastelandsLabel: "Звязаныя сметнікі",
            MembersLabel: "Удзельнікі",
            ThatsAllMessage: "Гэта ўсё!",
            InviteMorePeopleMessage: "Запрасіце больш людзей!",
        },
        WastelandDialog: {
            DeleteAction: "Выдаліць",
            EditAction: "Рэдагаваць",
            CleanAction: "Прыбраць!",
            ShareAction: "Падзяліцца",
            CreateEventAction: "Стварыць падзею",
            BasicDataLabel: "Асноўныя даныя",
            ReportedLabel: "Зарэгістравана",
            ByLabel: "кім",
            PhotosBeforeCleaningLabel: "Фота да прыбірання",
            PhotosAfterCleaningLabel: "Фота пасля прыбірання",
            PhotosAfterCleaningByLabel: "Фота пасля прыбірання ад",
        },
        ListDialog: {
            PlaceNotFoundMessage: "Месца не знойдзена",
            NoMoreDataMessage: "Гэта ўсё"
        },
    }
}

export default BelarusianTranslation