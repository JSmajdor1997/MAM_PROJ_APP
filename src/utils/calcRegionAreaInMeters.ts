import { LatLng, Region } from "react-native-maps";
import degreesToRadians from "./degreesToRadians";
import Constants from "./Constants";

const haversineDistance = (point1: LatLng, point2: LatLng): number => {
    const lat1 = degreesToRadians(point1.latitude);
    const lon1 = degreesToRadians(point1.longitude);
    const lat2 = degreesToRadians(point2.latitude);
    const lon2 = degreesToRadians(point2.longitude);

    const dLat = lat2 - lat1;
    const dLon = lon2 - lon1;

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1) * Math.cos(lat2) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return Constants.EarthRadiusMeters * c;
};

export default function calcRegionAreaInMeters(region: Region) {
    const point1: LatLng = {
        latitude: region.latitude - region.latitudeDelta / 2,
        longitude: region.longitude,
    };
    const point2: LatLng = {
        latitude: region.latitude + region.latitudeDelta / 2,
        longitude: region.longitude,
    };
    const point3: LatLng = {
        latitude: region.latitude,
        longitude: region.longitude - region.longitudeDelta / 2,
    };
    const point4: LatLng = {
        latitude: region.latitude,
        longitude: region.longitude + region.longitudeDelta / 2,
    };

    const height = haversineDistance(point1, point2);
    const width = haversineDistance(point3, point4);

    return height * width;
}