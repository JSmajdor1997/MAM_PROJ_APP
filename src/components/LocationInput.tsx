import { faChevronDown, faChevronUp, faEarth, faLocationArrow } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import React from "react";
import { Animated, Dimensions, Easing, StyleSheet, TouchableOpacity, View, ViewStyle } from "react-native";
import { useClickOutside } from "react-native-click-outside";
import { GoogleStaticMapNext } from "react-native-google-static-map-next";
import MapView, { LatLng } from "react-native-maps";
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import Resources from "../../res/Resources";
import reverseGeoCode from "../utils/GooglePlacesAPI/reverseGeoCode";
import searchPlaces, { Place } from "../utils/GooglePlacesAPI/searchPlaces";
import openMapsAndNavigate from "../utils/openMapsAndNavigate";
import FAB from "./FAB";
import LocationItem from "./LocationItem";
import SearchBar from "./SearchBar";
import Separator from "./Separator";
import IconType from "./WisbIcon/IconType";
import WisbIcon from "./WisbIcon/WisbIcon";

const res = Resources.get()

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
    showNavigateButton?: boolean
    iconColor?: string
}

export default function LocationInput({ style, readonly, onLocationChanged, userLocation, location, apiKey, showNavigateButton, iconColor }: Props) {
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
            searchPlaces(apiKey, phrase, res.getSettings().languageCode, userLocation).then(setPlaces)
        }, 200)
    }, [phrase])

    React.useEffect(() => {
        if (isDropdownVisible) {
            Animated.timing(heightAnim, {
                toValue: containerHeight - searchBarHeight,
                duration: 100,
                useNativeDriver: false,
                easing: Easing.linear
            }).start()
        } else {
            Animated.timing(heightAnim, {
                toValue: 0,
                duration: 100,
                useNativeDriver: false,
                easing: Easing.linear
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
        <View ref={outsideClickRef} style={{ ...styles.root, ...style, backgroundColor: res.getColors().DarkBeige }} onLayout={e => {
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

                            {showNavigateButton == undefined || showNavigateButton ? <FAB
                                color={res.getColors().White}
                                icon={<FontAwesomeIcon icon={faLocationArrow} size={20} color={iconColor ?? res.getColors().Black} />}
                                style={{
                                    position: "absolute",
                                    right: 10,
                                    top: 10
                                }}
                                size={40}
                                onPress={() => openMapsAndNavigate(location.coords)} /> : null}
                        </React.Fragment>
                    ) : (
                        <View style={{ width: '100%', height: "100%", justifyContent: "center", alignItems: "center", overflow: "hidden" }}>
                            <MapView
                                ref={mapViewRef}
                                onRegionChangeComplete={newRegion => {
                                    previousCoords.current = newRegion
                                    reverseGeoCode(res.getEnv().GOOGLE_MAPS_API_KEY, newRegion).then(formattedAddress => {
                                        onLocationChanged?.(newRegion, formattedAddress ?? res.getStrings().Components.LocationInput.UnknownPlaceMessage)
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
                leftIcon={<FontAwesomeIcon icon={faEarth} color={iconColor ?? res.getColors().Black} size={16} />}
                onPhraseChanged={setPhrase}
                phrase={isDropdownVisible ? phrase : location.asText}
                readonly={readonly}
                onPress={() => {
                    if (!readonly) {
                        setIsDropdownVisible(true)
                    }
                }}
                rightIcon={readonly ? undefined : (
                    <TouchableOpacity onPress={() => isDropdownVisible ? setIsDropdownVisible(false) : setIsDropdownVisible(true)}>
                        {isDropdownVisible ? <FontAwesomeIcon icon={faChevronUp} color={iconColor ?? res.getColors().Black} size={16} /> : <FontAwesomeIcon icon={faChevronDown} color={iconColor ?? res.getColors().Black} size={16} />}
                    </TouchableOpacity>
                )}
                placeholder={res.getStrings().Components.LocationInput.EnterPlaceMessage} />

            {readonly ? null : <Animated.FlatList
                style={{ width: "100%", backgroundColor: res.getColors().DarkBeige, maxHeight: heightAnim, height: "100%" }}
                data={places}
                ItemSeparatorComponent={Separator}
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
                )} />}
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