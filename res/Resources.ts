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
import getRandomLatLngInPoland from "../src/API/generators/getRandomLatLngInPoland";
import { LatLng } from "react-native-maps";
import Geolocation, { GeolocationResponse, GeolocationError } from "@react-native-community/geolocation";

const MMKVSettingsKey = "settings"

type UserPositionListener = (userPosition: LatLng) => void
type UserPositionCleanUp = () => void

export default class Resources {
    private static readonly FallBackLanguage = EnglishTranslation
    private static readonly SupportedLanguages = [
        PolishTranslation,
        EnglishTranslation,
        BelarusianTranslation
    ]
    private static readonly FallBackLocation = getRandomLatLngInPoland()

    private static getDefaultSettings(): Settings {
        return {
            mapType: MapType.Default,
            languageCode: RNLocalize.findBestLanguageTag(Resources.SupportedLanguages.map(it => it.code))?.languageTag ?? Resources.FallBackLanguage.code,
            showAdds: true,
            enabledNotifications: [NotificationType.MessagesFromCreators, NotificationType.NewEventNearby, NotificationType.NewWastelandNearby],
            colorMode: ColorMode.Light,
            defaultLocation: null,
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

        if (stringifiedSettings == null) {
            this.settingsCache = Resources.getDefaultSettings()
            this.storage.set(MMKVSettingsKey, JSON.stringify(this.settingsCache))
        } else {
            this.settingsCache = JSON.parse(stringifiedSettings)
        }

        //last position i listeners
        Geolocation.watchPosition(
            (position) => {
                this.lastUserLocation = position.coords
                this.userLocationListeners.forEach(listener => listener(position.coords))
            },
            (error) => {
                console.log(error)
            },
            { enableHighAccuracy: true, distanceFilter: 0, interval: 10000, fastestInterval: 5000 }
        );
    }

    getSupportedLanguages() {
        return Resources.SupportedLanguages
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
        const defaultLanguage = EnglishTranslation

        const supportedLanguages = {
            [EnglishTranslation.code]: defaultLanguage,
            [PolishTranslation.code]: PolishTranslation,
            [BelarusianTranslation.code]: BelarusianTranslation
        }

        return supportedLanguages[this.settingsCache.languageCode]
    }

    getLocale() {
        return this.settingsCache.languageCode
    }

    getZIndices() {
        return {
            NavBarContainer: 1
        }
    }

    private lastUserLocation: LatLng | null = null
    getLastLocation(): LatLng {
        if (this.lastUserLocation == null) {
            return Resources.FallBackLocation
        }

        return this.lastUserLocation
    }

    private userLocationListeners: UserPositionListener[] = []
    registerUserLocationListener(listener: UserPositionListener): UserPositionCleanUp {
        if (this.userLocationListeners.includes(listener)) {
            throw new Error("Listener already registered!")
        }

        this.userLocationListeners.push(listener)
        return () => {
            const index = this.userLocationListeners.indexOf(listener)

            if (!this.userLocationListeners.includes(listener)) {
                throw new Error("Listener already unregistered!")
            }

            this.userLocationListeners.splice(index, 1)
        }
    }
}