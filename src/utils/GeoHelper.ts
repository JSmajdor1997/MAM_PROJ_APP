import { LatLng, Region } from "react-native-maps";
import degreesToRadians from "./degreesToRadians";

export default class GeoHelper {
    static EarthRadiusMeters = 111320
    static EarthRadiusPerLatitudeDegreeMeters = 111320

    static scaleRegion(region: Region, scale: number) {
        const newLatitudeDelta = region.latitudeDelta * scale;
        const newLongitudeDelta = region.longitudeDelta * scale;

        return {
            ...region,
            latitudeDelta: newLatitudeDelta,
            longitudeDelta: newLongitudeDelta,
        };
    }

    static isLatLngInRegion(region: Region, latLng: LatLng) {
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

    static isLatLng(obj: any): obj is LatLng {
        return typeof (obj as LatLng).latitude == "number" && typeof (obj as LatLng).longitude == "number"
    }

    static metersToLatLngDelta(distanceMeters: number, latitudeDegrees: number) {
        const latitudeRadians = latitudeDegrees * (Math.PI / 180);

        const latDelta = distanceMeters / GeoHelper.EarthRadiusPerLatitudeDegreeMeters;
        const lonDelta = distanceMeters / (GeoHelper.EarthRadiusPerLatitudeDegreeMeters * Math.cos(latitudeRadians));

        return {
            latitudeDelta: latDelta,
            longitudeDelta: lonDelta
        };
    }

    static calcApproxDistanceBetweenLatLngInMeters(coords1: LatLng, coords2: LatLng): number {
        const dLat = degreesToRadians(coords2.latitude - coords1.longitude);
        const dLon = degreesToRadians(coords2.longitude - coords1.longitude);

        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(degreesToRadians(coords1.longitude)) * Math.cos(degreesToRadians(coords2.latitude)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return GeoHelper.EarthRadiusMeters * c;
    }

    private static haversineDistance(point1: LatLng, point2: LatLng) {
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

        return GeoHelper.EarthRadiusMeters * c;
    };

    static calcRegionAreaInMeters(region: Region) {
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
    
        const height = GeoHelper.haversineDistance(point1, point2);
        const width = GeoHelper.haversineDistance(point3, point4);
    
        return height * width;
    }

    static doesRegionInclude(largerRegion: Region, smallerRegion: Region) {
        const largerRegionNorth = largerRegion.latitude + largerRegion.latitudeDelta / 2;
        const largerRegionSouth = largerRegion.latitude - largerRegion.latitudeDelta / 2;
        const largerRegionEast = largerRegion.longitude + largerRegion.longitudeDelta / 2;
        const largerRegionWest = largerRegion.longitude - largerRegion.longitudeDelta / 2;
    
        const smallerRegionNorth = smallerRegion.latitude + smallerRegion.latitudeDelta / 2;
        const smallerRegionSouth = smallerRegion.latitude - smallerRegion.latitudeDelta / 2;
        const smallerRegionEast = smallerRegion.longitude + smallerRegion.longitudeDelta / 2;
        const smallerRegionWest = smallerRegion.longitude - smallerRegion.longitudeDelta / 2;
    
        return (
            smallerRegionNorth <= largerRegionNorth &&
            smallerRegionSouth >= largerRegionSouth &&
            smallerRegionEast <= largerRegionEast &&
            smallerRegionWest >= largerRegionWest
        );
    }
}