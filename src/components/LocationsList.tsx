import React from "react"
import { Dimensions, FlatList, View, ViewStyle } from "react-native"
import SkeletonPlaceholder from "react-native-skeleton-placeholder"
import Resources from "../../res/Resources"
import { SimplePlace } from "../API/interfaces"
import searchPlaces, { Place } from "../utils/GooglePlacesAPI/searchPlaces"
import LocationItem from "./inputs/LocationItem"
import { LatLng } from "react-native-maps"
import GeoHelper from "../utils/GeoHelper"

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

    const searchPlacesTimeoutId = React.useRef<NodeJS.Timeout | null>(null)
    React.useEffect(() => {
        if (searchPlacesTimeoutId.current != null) {
            clearTimeout(searchPlacesTimeoutId.current)
        }

        if(phrase.length == 0) {
            setPlaces([])
            return
        }

        searchPlacesTimeoutId.current = setTimeout(() => {
            searchPlaces(apiKey, phrase, res.getSettings().languageCode, userLocation)
                .then(places => {
                    setPlaces(
                        places
                            .sort((a, b) => GeoHelper.calcApproxDistanceBetweenLatLngInMeters(userLocation, b.location) - GeoHelper.calcApproxDistanceBetweenLatLngInMeters(userLocation, a.location))
                            .slice(0, maxNrOfPlaces ?? places.length)
                )
                })
        }, 200)
    }, [phrase])

    return (
        <FlatList
            style={{ width: "100%", backgroundColor: "white", height: "100%", ...style }}
            data={places}
            keyExtractor={place => place.id}
            ListEmptyComponent={
                <View style={{ justifyContent: "center" }}>
                    {Array.from({ length: 3 }, () => (
                        <SkeletonPlaceholder borderRadius={4} backgroundColor="white">
                            <SkeletonPlaceholder.Item flexDirection="row" alignItems="center" width={"90%"} height={50}>
                                <SkeletonPlaceholder.Item width={20} height={20} borderRadius={100} left={10} />
                                <SkeletonPlaceholder.Item marginLeft={20}>
                                    <SkeletonPlaceholder.Item width={Dimensions.get("window").width - 100} height={20} />
                                    <SkeletonPlaceholder.Item marginTop={6} width={80} height={20} />
                                </SkeletonPlaceholder.Item>
                            </SkeletonPlaceholder.Item>
                        </SkeletonPlaceholder>
                    ))}
                </View>
            }
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