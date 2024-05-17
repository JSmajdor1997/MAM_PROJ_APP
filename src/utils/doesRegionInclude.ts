import { Region } from "react-native-maps";

export default function doesRegionInclude(largerRegion: Region, smallerRegion: Region) {
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