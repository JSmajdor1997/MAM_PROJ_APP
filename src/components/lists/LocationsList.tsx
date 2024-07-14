import React from "react"
import { ViewStyle } from "react-native"
import { LatLng } from "react-native-maps"
import Resources from "../../../res/Resources"
import { SimplePlace } from "../../API/interfaces"
import GeoHelper from "../../utils/GeoHelper"
import searchPlaces, { Place } from "../../utils/GooglePlacesAPI/searchPlaces"
import LocationItem from "../inputs/LocationItem"
import WisbFlatList from "./WisbFlatList"

const res = Resources.get()

export interface Props {
    style?: ViewStyle
    phrase: string
    apiKey: string
    userLocation: LatLng
    onSelected: (place: SimplePlace) => void
    maxNrOfPlaces?: number
}

export default function LocationsList({ phrase, style, apiKey, userLocation, onSelected, maxNrOfPlaces }: Props) {
    const [places, setPlaces] = React.useState<Place[]>([])
    const [isLoading, setIsLoading] = React.useState(false)

    const searchPlacesTimeoutId = React.useRef<NodeJS.Timeout | null>(null)
    React.useEffect(() => {
        if (searchPlacesTimeoutId.current != null) {
            clearTimeout(searchPlacesTimeoutId.current)
        }

        if (phrase.length == 0) {
            setPlaces([])
            return
        }

        searchPlacesTimeoutId.current = setTimeout(() => {
            setIsLoading(true)
            searchPlaces(apiKey, phrase, res.getSettings().languageCode, userLocation)
                .then(places => {
                    setIsLoading(false)

                    setPlaces(
                        places
                            .sort((a, b) => GeoHelper.calcApproxDistanceBetweenLatLngInMeters(userLocation, b.location) - GeoHelper.calcApproxDistanceBetweenLatLngInMeters(userLocation, a.location))
                            .slice(0, maxNrOfPlaces ?? places.length)
                    )
                })
        }, 200)
    }, [phrase])

    return (
        <WisbFlatList<Place>
            isLoading={true}
            hasMore={true}
            style={{ width: "100%", backgroundColor: "white", ...style }}
            data={places}
            keyExtractor={place => place.id}
            renderItem={({ item }) => (
                <LocationItem
                    onPress={() => onSelected({ coords: item.location, asText: item.formattedAddress })}
                    userLocation={userLocation}
                    location={{
                        asText: item.formattedAddress,
                        coords: item.location
                    }} />
            )} />
    )
}