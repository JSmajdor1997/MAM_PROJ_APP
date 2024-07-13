import { LatLng } from "react-native-maps";

enum AddressComponentType {
    StreetAddress = "street_address",
    Route = "route",
    Intersection = "intersection",
    Political = "political",
    Country = "country",
    AdministrativeAreaLevel1 = "administrative_area_level_1",
    AdministrativeAreaLevel2 = "administrative_area_level_2",
    AdministrativeAreaLevel3 = "administrative_area_level_3",
    AdministrativeAreaLevel4 = "administrative_area_level_4",
    AdministrativeAreaLevel5 = "administrative_area_level_5",
    ColloquialArea = "colloquial_area",
    Locality = "locality",
}

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