import { LatLng } from "react-native-maps";
import degreesToRadians from "./degreesToRadians";
import Constants from "./Constants";

export default function calcApproxDistanceBetweenLatLngInMeters(coords1: LatLng, coords2: LatLng): number {
    const dLat = degreesToRadians(coords2.latitude - coords1.longitude);
    const dLon = degreesToRadians(coords2.longitude - coords1.longitude);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(degreesToRadians(coords1.longitude)) * Math.cos(degreesToRadians(coords2.latitude)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return Constants.EarthRadiusMeters * c;
}