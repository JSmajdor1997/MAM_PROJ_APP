import Constants from "./Constants";

export default function metersToLatLngDelta(distanceMeters: number, latitudeDegrees: number) {
    const latitudeRadians = latitudeDegrees * (Math.PI / 180);

    const latDelta = distanceMeters / Constants.EarthRadiusPerLatitudeDegreeMeters;
    const lonDelta = distanceMeters / (Constants.EarthRadiusPerLatitudeDegreeMeters * Math.cos(latitudeRadians));

    return {
        latitudeDelta: latDelta,
        longitudeDelta: lonDelta
    };
}