import { SupportedLanguages } from "../localization/SupportedLanguages";
import Translation from "../localization/Translation";
import BelarusianTranslation from "../localization/translations/BelarusianTranslation";
import EnglishTranslation from "../localization/translations/EnglishTranslation";
import PolishTranslation from "../localization/translations/PolishTranslation";
import * as RNLocalize from 'react-native-localize';

export enum MapType {
    Default,
    Satellite
}

export enum ColorMode {
    Dark,
    Light,
    Auto
}

export enum NotificationType {
    MessagesFromCreators,
    NewWastelandNearby,
    NewEventNearby,
}

export const Resources = {
    Colors: {
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
    } as const,
    Fonts: {
        Primary: "leafy"
    } as const,
    Locale: {
        LanguageCode: "pl-PL",
        findBestLanguageTag: () => RNLocalize.findBestLanguageTag(
            Object.values(SupportedLanguages)
        )
    } as const,
    Strings: {
        [SupportedLanguages.English]: EnglishTranslation,
        [SupportedLanguages.Polish]: PolishTranslation,
        [SupportedLanguages.Belarusian]: BelarusianTranslation,
        get(): Translation {
            return BelarusianTranslation
        }
    } as const,
    Env: {
        GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY as string
    } as const,
    zIndices: {
        NavBarContainer: 1
    },
    Settings: {
        mapType: MapType.Default,
        language: SupportedLanguages.Polish,
        showAdds: false,
        enabledNotifications: [NotificationType.MessagesFromCreators, NotificationType.NewEventNearby, NotificationType.NewWastelandNearby],
        colorMode: ColorMode.Light,
        defaultLocations: null,
        showDumpstersOnMap: true
    }
}