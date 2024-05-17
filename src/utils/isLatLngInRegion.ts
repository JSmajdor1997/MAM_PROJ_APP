import { LatLng, Region } from "react-native-maps";

export default function isLatLngInRegion(region: Region, latLng: LatLng) {
    const { latitude, longitude, latitudeDelta, longitudeDelta } = region;
    const latMin = latitude - latitudeDelta / 2;
    const latMax = latitude + latitudeDelta / 2;
    const lngMin = longitude - longitudeDelta / 2;
    const lngMax = longitude + longitudeDelta / 2;

    return (
        latLng.latitude >= latMin &&
        latLng.latitude <= latMax &&
        latLng.longitude >= lngMin &&
        latLng.longitude <= lngMax
    );
}