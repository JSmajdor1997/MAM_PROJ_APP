import { faChevronDown, faChevronUp, faEarth, faExpand, faLocationArrow } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import React from "react";
import { Animated, Dimensions, Easing, FlatList, StyleSheet, TouchableOpacity, View, ViewStyle } from "react-native";
import { useClickOutside } from "react-native-click-outside";
import { GoogleStaticMapNext } from "react-native-google-static-map-next";
import MapView, { LatLng, Marker } from "react-native-maps";
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import Resources from "../../../res/Resources";
import reverseGeoCode from "../../utils/GooglePlacesAPI/reverseGeoCode";
import searchPlaces, { Place } from "../../utils/GooglePlacesAPI/searchPlaces";
import openMapsAndNavigate from "../../utils/openMapsAndNavigate";
import FAB from "../FAB";
import LocationItem from "./LocationItem";
import IconType from "../WisbIcon/IconType";
import WisbIcon from "../WisbIcon/WisbIcon";
import SearchBar from "./SearchBar";
import LocationsList from "../LocationsList";
import { SimplePlace } from "../../API/interfaces";

const res = Resources.get()

export interface Props {
    style?: ViewStyle
    readonly: boolean
    userLocation: LatLng
    onLocationChanged?: (location: SimplePlace) => void
    location: {
        coords: LatLng,
        asText: string
    }
    apiKey: string
    showNavigateButton?: boolean
    iconColor?: string
}

const UserMarkerId = "user-marker"

const InputBarHeight = 40
const InputBarMargin = 5

export default function LocationInput({ style, readonly, onLocationChanged, userLocation, location, apiKey, showNavigateButton, iconColor }: Props) {
    const mapViewRef = React.useRef<MapView>(null)
    const [containerHeight, setContainerHeight] = React.useState(0)
    const [expanded, setExpanded] = React.useState(false)

    const heightAnim = React.useRef(new Animated.Value(InputBarHeight + 2 * InputBarMargin)).current;
    const [phrase, setPhrase] = React.useState<string>("")

    const outsideClickRef = useClickOutside<View>(() => {
        if (expanded) {
            setExpanded(false)
        }
    });

    React.useEffect(() => {
        if (expanded) {
            Animated.timing(heightAnim, {
                toValue: containerHeight / 5 * 4,
                duration: 100,
                useNativeDriver: false,
                easing: Easing.linear
            }).start()
        } else {
            Animated.timing(heightAnim, {
                toValue: InputBarHeight + 2 * InputBarMargin,
                duration: 100,
                useNativeDriver: false,
                easing: Easing.linear
            }).start()
        }
    }, [expanded, containerHeight])

    const previousCoords = React.useRef(location.coords)
    React.useEffect(() => {
        if (previousCoords.current.latitude != location.coords.latitude || previousCoords.current.longitude != location.coords.longitude) {
            mapViewRef.current?.animateToRegion({
                ...location.coords,
                latitudeDelta: 0.5,
                longitudeDelta: 0.5,
            })
        }

        setExpanded(false)

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
                                        onLocationChanged?.({ coords: newRegion, asText: formattedAddress ?? res.getStrings().Components.LocationInput.UnknownPlaceMessage })
                                    })
                                }}
                                showsScale={false}
                                showsIndoors={false}
                                showsTraffic={false}
                                showsMyLocationButton={false}
                                showsUserLocation={false}
                                toolbarEnabled={false}
                                showsCompass={false}
                                provider="google"
                                showsPointsOfInterest={false}
                                style={{ ...styles.map, width: '100%', height: "100%" }} >
                                <Marker
                                    id={UserMarkerId}
                                    coordinate={userLocation}>
                                    <WisbIcon size={25}
                                        icon={IconType.MapPin} />
                                </Marker>
                            </MapView>
                            <View style={{
                                position: "absolute",
                                pointerEvents: "none",
                                alignSelf: "center",
                                justifyContent: "center",
                                alignItems: "center",
                                borderColor: "white",
                                borderWidth: 6,
                                borderRadius: 5,
                                width: 27,
                                height: 27,
                            }}>
                                <FontAwesomeIcon
                                    size={28}
                                    color={res.getColors().Red}
                                    icon={faExpand} />
                            </View>
                        </View>
                    )
                }
            </View>

            <Animated.View style={{ position: "absolute", bottom: 0, backgroundColor: res.getColors().White, maxHeight: heightAnim, height: heightAnim, alignItems: "center", }}>
                <SearchBar
                    style={{ height: InputBarHeight, marginVertical: InputBarMargin, maxWidth: "100%" }}
                    leftIcon={<FontAwesomeIcon icon={faEarth} color={iconColor ?? res.getColors().Black} size={16} />}
                    onPhraseChanged={setPhrase}
                    phrase={expanded ? phrase : location.asText}
                    readonly={readonly}
                    onPress={() => {
                        if (!readonly) {
                            setExpanded(true)
                        }
                    }}
                    rightIcon={readonly ? undefined : (
                        <TouchableOpacity onPress={() => setExpanded(!expanded)}>
                            <FontAwesomeIcon icon={expanded ? faChevronDown : faChevronUp} color={iconColor ?? res.getColors().Black} size={16} />
                        </TouchableOpacity>
                    )}
                    placeholder={res.getStrings().Components.LocationInput.EnterPlaceMessage} />

                {readonly ? null : (
                    <LocationsList
                        userLocation={userLocation}
                        phrase={phrase}
                        style={{ width: "100%", backgroundColor: "white", height: "100%" }}
                        apiKey={apiKey}
                        onSelected={location => {
                            setPhrase("")
                            onLocationChanged?.(location)
                            setExpanded(false)
                        }} />
                )}
            </Animated.View>
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
        marginBottom: 48
    },
    map: {
        flex: 1,
    }
})
