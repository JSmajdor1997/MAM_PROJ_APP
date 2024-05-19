export enum SupportedLanguages {
    Polish = "pl",
    English = "en",
    Belarusian = "be",
}

export const SupportedLanguagesList = [SupportedLanguages.English, SupportedLanguages.Polish]

export const LanguageInfo = {
    [SupportedLanguages.English]: {
        nativeName: "English",
        flagEmoji: "🇺🇸"
    },
    [SupportedLanguages.Polish]: {
        nativeName: "Polski",
        flagEmoji: "🇵🇱"
    },
    [SupportedLanguages.Belarusian]: {
        nativeName: "Беларусь",
        flagEmoji: "🇧🇾"
    }
}