import MapView, { LatLng, Marker, Region } from "react-native-maps"
import { faChevronDown, faChevronUp, faEarth, faLocationArrow } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { StyleSheet, Text, View, ViewStyle, Animated, Easing, TouchableOpacity } from "react-native";
import { GoogleStaticMapNext } from "react-native-google-static-map-next";
import Resources from "../../res/Resources";
import FAB from "./FAB";
import openMapsAndNavigate from "../utils/openMapsAndNavigate";
import React from "react";
import WisbIcon, { IconType } from "./WisbIcon";
import SearchBar from "./SearchBar";
import { useClickOutside } from "react-native-click-outside";
import searchPlaces, { Place } from "../utils/GooglePlacesAPI/searchPlaces";
import formatDistance from "../utils/formatDistance";
import calcApproxDistanceBetweenLatLngInMeters from "../utils/calcApproxDistanceBetweenLatLng";
import Separator from "./Separator";
import reverseGeoCode from "../utils/GooglePlacesAPI/reverseGeoCode";
import LocationItem from "./LocationItem";

export interface Props {
    style?: ViewStyle
    readonly: boolean
    userLocation: LatLng
    onLocationChanged?: (coords: LatLng, asText: string) => void
    location: {
        coords: LatLng,
        asText: string
    }
    apiKey: string
}

export default function LocationInput({ style, readonly, onLocationChanged, userLocation, location, apiKey }: Props) {
    const mapViewRef = React.useRef<MapView>(null)
    const [containerHeight, setContainerHeight] = React.useState(0)
    const [searchBarHeight, setSearchBarHeight] = React.useState(0)
    const [isDropdownVisible, setIsDropdownVisible] = React.useState(false)

    const heightAnim = React.useRef(new Animated.Value(0)).current;
    const [phrase, setPhrase] = React.useState<string>("")
    const [places, setPlaces] = React.useState<Place[]>()

    const outsideClickRef = useClickOutside<View>(() => {
        if (isDropdownVisible) {
            setIsDropdownVisible(false)
        }
    });

    const searchPlacesTimeoutId = React.useRef<NodeJS.Timeout | null>(null)
    React.useEffect(() => {
        if (searchPlacesTimeoutId.current != null) {
            clearTimeout(searchPlacesTimeoutId.current)
        }

        searchPlacesTimeoutId.current = setTimeout(() => {
            searchPlaces(apiKey, phrase, Resources.get().getSettings().language, userLocation).then(setPlaces)
        }, 200)
    }, [phrase])

    React.useEffect(() => {
        if (isDropdownVisible) {
            Animated.timing(heightAnim, {
                toValue: containerHeight - searchBarHeight,
                duration: 400,
                useNativeDriver: false,
                easing: Easing.quad
            }).start()
        } else {
            Animated.timing(heightAnim, {
                toValue: 0,
                duration: 400,
                useNativeDriver: false,
                easing: Easing.quad
            }).start()
        }
    }, [isDropdownVisible, containerHeight, searchBarHeight])

    const previousCoords = React.useRef(location.coords)
    React.useEffect(() => {
        if (previousCoords.current.latitude != location.coords.latitude || previousCoords.current.longitude != location.coords.longitude) {
            mapViewRef.current?.animateToRegion({
                ...location.coords,
                latitudeDelta: 0.5,
                longitudeDelta: 0.5,
            })
        }

        previousCoords.current = location.coords
    }, [location.coords])

    return (
        <View ref={outsideClickRef} style={{ ...styles.root, ...style, backgroundColor: Resources.get().getColors().White, width: 300, height: 200 }} onLayout={e => {
            const newHeight = e.nativeEvent.layout.height

            if (newHeight != containerHeight) {
                setContainerHeight(newHeight)
            }
        }}>
            <View style={styles.mapContainer}>
                {
                    readonly ? (
                        <React.Fragment>
                            <GoogleStaticMapNext
                                style={styles.map}
                                location={{
                                    latitude: location.coords.latitude.toString(),
                                    longitude: location.coords.longitude.toString()
                                }}
                                size={{ width: 400, height: 400 }}
                                apiKey={apiKey}
                            />

                            <FAB
                                color={Resources.get().getColors().White}
                                icon={<FontAwesomeIcon icon={faLocationArrow} size={20} color={Resources.get().getColors().Black} />}
                                style={{
                                    position: "absolute",
                                    right: 10,
                                    top: 10
                                }}
                                size={40}
                                onPress={() => openMapsAndNavigate(location.coords)} />
                        </React.Fragment>
                    ) : (
                        <View style={{ width: '100%', height: "100%", justifyContent: "center", alignItems: "center", overflow: "hidden" }}>
                            <MapView
                                ref={mapViewRef}
                                onRegionChangeComplete={newRegion => {
                                    previousCoords.current = newRegion
                                    reverseGeoCode(Resources.get().getEnv().GOOGLE_MAPS_API_KEY, newRegion).then(formattedAddress => {
                                        onLocationChanged?.(newRegion, formattedAddress ?? Resources.get().getStrings().Components.LocationInput.UnknownPlaceMessage)
                                    })
                                }}
                                showsScale={false}
                                showsIndoors={false}
                                showsTraffic={false}
                                showsMyLocationButton={false}
                                toolbarEnabled={false}
                                showsCompass={false}
                                provider="google"
                                showsPointsOfInterest={false}
                                style={{ ...styles.map, width: '100%', height: "100%" }} />
                            <WisbIcon size={28} icon={IconType.MapPin} style={{ position: "absolute", pointerEvents: "none", alignSelf: "center" }} />
                        </View>
                    )
                }
            </View>

            <SearchBar
                onLayout={e => {
                    const newHeight = e.nativeEvent.layout.height

                    if (newHeight != searchBarHeight) {
                        setSearchBarHeight(newHeight)
                    }
                }}
                onClear={() => {
                    setPhrase("")
                    setIsDropdownVisible(true)
                }}
                leftIcon={<FontAwesomeIcon icon={faEarth} color={Resources.get().getColors().Black} size={16} />}
                onPhraseChanged={setPhrase}
                phrase={isDropdownVisible ? phrase : location.asText}
                readonly={readonly}
                onPress={() => {
                    if (!readonly) {
                        setIsDropdownVisible(true)
                    }
                }}
                rightIcon={(
                    <TouchableOpacity onPress={() => isDropdownVisible ? setIsDropdownVisible(false) : setIsDropdownVisible(true)}>
                        {isDropdownVisible ? <FontAwesomeIcon icon={faChevronUp} color={Resources.get().getColors().Black} size={16} /> : <FontAwesomeIcon icon={faChevronDown} color={Resources.get().getColors().Black} size={16} />}
                    </TouchableOpacity>
                )}
                placeholder={Resources.get().getStrings().Components.LocationInput.EnterPlaceMessage} />

            <Animated.FlatList
                style={{ width: "100%", backgroundColor: Resources.get().getColors().White, maxHeight: heightAnim, height: "100%" }}
                data={places}
                ItemSeparatorComponent={Separator}
                keyExtractor={place => place.id}
                renderItem={({ item }) => (
                    <LocationItem
                        onPress={() => {
                            setPhrase("")
                            onLocationChanged?.(item.location, item.formattedAddress)
                            setIsDropdownVisible(false)
                        }}
                        userLocation={userLocation}
                        location={{
                            asText: item.formattedAddress,
                            coords: location.coords
                        }} />
                )} />
        </View>
    )
}

const styles = StyleSheet.create({
    root: {
        borderRadius: 15,
        overflow: "hidden"
    },
    mapContainer: {
        borderRadius: 15,
        flex: 1,
    },
    map: {
        flex: 1,
    }
})