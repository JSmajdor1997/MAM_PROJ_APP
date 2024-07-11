import Translation from "./Translation";
import BelarusianTranslation from "./translations/BelarusianTranslation";
import EnglishTranslation from "./translations/EnglishTranslation";
import PolishTranslation from "./translations/PolishTranslation";
import * as RNLocalize from 'react-native-localize';
import MapType from "./MapType";
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
    private lastLocation: LatLng = getRandomLatLngInPoland()

    private static getDefaultSettings(): Settings {
        return {
            mapType: MapType.Default,
            languageCode: RNLocalize.findBestLanguageTag(Resources.SupportedLanguages.map(it => it.code))?.languageTag ?? Resources.FallBackLanguage.code,
            defaultLocation: null,
            notifications: {
                newMessage: true,
                newInvitation: true,
                newDumpsterInArea: true,
                newWastelandInArea: true,
                newEventInArea: true
            }
        }
    }

    private static _instance: Resources | null = null
    static get() {
        if (Resources._instance == null) {
            Resources._instance = new Resources()
        }

        return Resources._instance
    }

    private static readonly MMKV_ID = "resources"
    private static readonly MMKV_KEY = "resources"
    private storage = new MMKV({
        id: Resources.MMKV_ID,
        encryptionKey: 'hunter2'
    })

    private settingsCache: Settings

    private geolocationWatcherId: number = -1

    private startGeolocation() {
        this.geolocationWatcherId = Geolocation.watchPosition(
            position => {
                this.lastLocation = position.coords
                this.userLocationListeners.forEach(listener => listener(position.coords))
            },
            error => {
                console.log(error)
            },
            { enableHighAccuracy: true, distanceFilter: 0, interval: 10000, fastestInterval: 5000 }
        );
    }

    private stopGeolocation() {
        if (this.geolocationWatcherId != -1) {
            Geolocation.clearWatch(this.geolocationWatcherId)
            this.geolocationWatcherId = -1
        }
    }

    constructor() {
        if (!this.storage.contains(Resources.MMKV_KEY)) {
            this.storage.set(Resources.MMKV_KEY, JSON.stringify(Resources.getDefaultSettings()))
        }

        this.settingsCache = JSON.parse(this.storage.getString(Resources.MMKV_KEY)!)

        if (this.settingsCache.defaultLocation != null) {
            this.lastLocation = this.settingsCache.defaultLocation.coords
        }

        //last position i listeners
        if (this.settingsCache.defaultLocation == null) {
            this.startGeolocation()
        }
    }

    getSupportedLanguages() {
        return Resources.SupportedLanguages
    }

    getSettings(): Settings {
        return this.settingsCache
    }

    setSettings(setObject: Partial<Omit<Settings, "notifications"> & { notifications?: Partial<Settings["notifications"]> }>) {
        if (setObject.defaultLocation != this.settingsCache.defaultLocation) {
            if (this.settingsCache.defaultLocation == null) {
                this.startGeolocation()
            } else {
                this.stopGeolocation()
            }
        }

        this.settingsCache = {
            ...this.settingsCache,
            ...setObject,
            notifications: {
                ...this.settingsCache.notifications,
                ...(setObject.notifications ?? {})
            }
        }

        this.storage.set(Resources.MMKV_KEY, JSON.stringify(this.settingsCache))
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
        const supportedLanguages = {
            [EnglishTranslation.code]: EnglishTranslation,
            [PolishTranslation.code]: PolishTranslation,
            [BelarusianTranslation.code]: BelarusianTranslation
        }


        return supportedLanguages[this.settingsCache.languageCode] ?? EnglishTranslation
    }

    getLocale() {
        return this.settingsCache.languageCode
    }

    getZIndices() {
        return {
            NavBarContainer: 1
        }
    }

    getLastLocation(): LatLng {
        return this.lastLocation
    }

    private userLocationListeners: UserPositionListener[] = []
    registerUserLocationListener(listener: UserPositionListener): UserPositionCleanUp {
        if (this.userLocationListeners.includes(listener)) {
            throw new Error("Listener already registered!")
        }

        this.userLocationListeners.push(listener)
        listener(this.lastLocation)
        return () => {
            const index = this.userLocationListeners.indexOf(listener)

            if (!this.userLocationListeners.includes(listener)) {
                throw new Error("Listener already unregistered!")
            }

            this.userLocationListeners.splice(index, 1)
        }
    }
}