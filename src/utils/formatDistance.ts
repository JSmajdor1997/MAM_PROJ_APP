export default function formatDistance(distanceMeters: number) {
    if (distanceMeters < 1000) {
        return `${distanceMeters}m`
    }

    return `${(distanceMeters / 1000).toFixed(1)}m`
}