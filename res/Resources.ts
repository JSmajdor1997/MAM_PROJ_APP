import { SupportedLanguages, SupportedLanguagesList } from "./SupportedLanguages";
import Translation from "./Translation";
import BelarusianTranslation from "./translations/BelarusianTranslation";
import EnglishTranslation from "./translations/EnglishTranslation";
import PolishTranslation from "./translations/PolishTranslation";
import * as RNLocalize from 'react-native-localize';
import ColorMode from "./ColorMode";
import MapType from "./MapType";
import NotificationType from "./NotificationType";
import Settings from "./Settings";
import { MMKV } from 'react-native-mmkv'

const MMKVSettingsKey = "settings"

export default class Resources {
    private static getDefaultSettings(): Settings {
        return {
            mapType: MapType.Default,
            language: RNLocalize.findBestLanguageTag(SupportedLanguagesList)?.languageTag ?? SupportedLanguages.English,
            showAdds: true,
            enabledNotifications: [NotificationType.MessagesFromCreators, NotificationType.NewEventNearby, NotificationType.NewWastelandNearby],
            colorMode: ColorMode.Light,
            defaultLocations: null,
            showDumpstersOnMap: true
        }
    }

    private static _instance: Resources | null = null
    static get() {
        if (Resources._instance == null) {
            Resources._instance = new Resources()
        }

        return Resources._instance
    }

    private readonly storage = new MMKV()
    private settingsCache: Settings

    constructor() {
        const stringifiedSettings = this.storage.getString(MMKVSettingsKey)

        if(stringifiedSettings == null) {
            this.settingsCache = Resources.getDefaultSettings()
            this.storage.set(MMKVSettingsKey, JSON.stringify(this.settingsCache))
        } else {
            this.settingsCache = JSON.parse(stringifiedSettings)
        }
    }

    getSettings(): Settings {
        return this.settingsCache
    }

    setSettings(setObject: Partial<Settings>) {
        this.settingsCache = {
            ...this.settingsCache,
            ...setObject
        }

        this.storage.set(MMKVSettingsKey, JSON.stringify(setObject))
    }

    getColors() {
        return {
            Primary: "#00bfa5",
            White: "#FFFFFF",
            Black: "#000000",
            Green: "#8ae364",
            Golden: "#ffb005",
            LightBeige: "#f0f0f0",
            Beige: "#eee",
            DarkBeige: "#919191",
            Grey: "#00000055",
            Red: "#ad3a28",
            Blue: "#3886c2",
            OceanBlue: "#00bfa5",
            Yellow: "#ded264",
            Lime: "#cde340",
            Purple: "#cde340",
            Transparent: "transparent",
            BackdropWhite: "#FFFFFF55",
            BackdropBlack: "#00000055",
            AvatarColors: [
                '#4caf50',
                '#ff9800',
                '#ffc107',
                '#607d8b',
                '#3f51b5',
                '#673ab7',
                '#ad1457',
            ]
        }
    }

    getEnv() {
        return {
            GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY as string
        }
    }

    getFonts() {
        return {
            Primary: "leafy"
        }
    }

    getStrings() {
        const supportedLanguages = {
            [SupportedLanguages.English]: EnglishTranslation,
            [SupportedLanguages.Polish]: PolishTranslation,
            [SupportedLanguages.Belarusian]: BelarusianTranslation
        }

        return supportedLanguages[SupportedLanguages.Polish]
    }

    getZIndices() {
        return {
            NavBarContainer: 1
        }
    }
}