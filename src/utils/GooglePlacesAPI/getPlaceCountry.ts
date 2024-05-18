import AddressComponentType from "./AddressComponentType";
import { Place } from "./searchPlaces";

export default function getPlaceCountry(place: Place): { long: string, short: string } | null {
    const component = place.addressComponents.find(it => it.types.includes(AddressComponentType.Country))

    if(component == null) {
        return null
    }

    return {
        long: component.longText,
        short: component.shortText
    }
}