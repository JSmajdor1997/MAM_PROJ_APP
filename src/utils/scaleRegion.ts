import { Region } from "react-native-maps";

export default function scaleRegion(region: Region, scale: number) {
    const newLatitudeDelta = region.latitudeDelta * scale;
    const newLongitudeDelta = region.longitudeDelta * scale;

    return {
        ...region,
        latitudeDelta: newLatitudeDelta,
        longitudeDelta: newLongitudeDelta,
    };
}