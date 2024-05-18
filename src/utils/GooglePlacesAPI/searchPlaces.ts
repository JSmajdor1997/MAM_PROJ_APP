import { LatLng } from "react-native-maps";
import AddressComponentType from "./AddressComponentType";

export interface Place {
    formattedAddress: string
    location: LatLng
    id: string
    addressComponents: {
        longText: string,
        shortText: string,
        types: AddressComponentType[],
        languageCode: string
    }[]
}

export interface PlacesResponse {
    results: Place[];
    status: "OK" | string;
}

export default async function searchPlaces(apiKey: string, query: string, languageCode: string, {latitude, longitude}: LatLng, nrOfResults: number = 30): Promise<Place[]> {
    return fetch("https://places.googleapis.com/v1/places:searchText", {
        method: "POST",
        body: JSON.stringify({
            textQuery: query, languageCode, pageSize: nrOfResults, locationBias: {
                "circle": {
                    "center": {latitude, longitude},
                    "radius": 5000.0
                }
            }
        }),
        headers: {
            "Content-Type": "application/json",
            "X-Goog-Api-Key": apiKey,
            "X-Goog-FieldMask": "places.formattedAddress,places.location,places.addressComponents,places.id",
        }
    }).then(res => res.json()).then(result => result.places).catch(() => [])
}