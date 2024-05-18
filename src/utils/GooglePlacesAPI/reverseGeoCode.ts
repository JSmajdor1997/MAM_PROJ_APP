import { LatLng } from "react-native-maps";

export default async function reverseGeoCode(apiKey: string, location: LatLng): Promise<string | null> {
    return fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.latitude},${location.longitude}&key=${apiKey}`)
        .then(it => it.json())
        .then(it => {
            if (it.results == null) {
                return null
            }

            if (it.results.length == 0) {
                return null
            }

            let bestResult: any = it.results[0];

            for (const result of it.results) {
              if (result.types.includes("street_address") && result.geometry.location_type === "ROOFTOP") {
                bestResult = result;
                break;
              }
            }
          
            return bestResult.formatted_address;
        })
        .catch(e => {
            return null
        })
}