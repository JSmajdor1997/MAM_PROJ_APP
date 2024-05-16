import { Linking, Platform } from "react-native";
import { LatLng } from "react-native-maps";

export default function openMapsAndNavigate(destination: LatLng) {
    const scheme = Platform.select({ ios: 'maps://0,0?q=', android: 'geo:0,0?q=' });
    const latLng = `${destination.latitude},${destination.longitude}`;
    const label = 'Custom Label';
    const url = Platform.select({
        ios: `${scheme}${label}@${latLng}`,
        android: `${scheme}${latLng}(${label})`
    });

    if (scheme == undefined || url == undefined) {
        throw new Error(`This platform (${Platform.OS}) is not supported!`)
    }

    Linking.openURL(url);
}