import React, { Component, ReactElement, Fragment } from 'react';
import {
  View,
  Text,
  StatusBar,
  ViewStyle,
  ToastAndroid,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
} from 'react-native';
import MapView, { Marker, Region, LatLng } from 'react-native-maps';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import NavigationParamsList from './NavigationParamsList';
import WisbScreens from './WisbScreens';
import Geolocation from '@react-native-community/geolocation';
import ListDialog from '../dialogs/ListDialog';
import getAPI from '../API/getAPI';
import Toast from 'react-native-simple-toast';
import WisbIcon from '../components/WisbIcon/WisbIcon';
import metersToLatLngDelta from '../utils/metersToDelta';
import scaleRegion from '../utils/scaleRegion';
import doesRegionInclude from '../utils/doesRegionInclude';
import calcRegionAreaInMeters from '../utils/calcRegionAreaInMeters';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowUp, faChevronDown, faMapPin } from '@fortawesome/free-solid-svg-icons';
import isLatLngInRegion from '../utils/isLatLngInRegion';
import Resources from '../../res/Resources';
import { Place } from '../utils/GooglePlacesAPI/searchPlaces';
import IconType from '../components/WisbIcon/IconType';
import QueryInput from '../components/QueryInput/QueryInput';
import reverseGeoCode from '../utils/GooglePlacesAPI/reverseGeoCode';
import getFirstTodayTime from '../utils/getFirstTodayTime';
import MapType from '../../res/MapType';
import WisbObjectType from '../API/WisbObjectType';
import { WisbDumpster, WisbEvent, WisbWasteland } from '../API/interfaces';
const map_style = require('../../res/map_style.json');

const TrackingIconRadius = 150
const TrackingIconSize = 35

const MarkerIdSeparator = '-'

const UserMarkerId = 'USER-MARKER'

interface Props extends NativeStackScreenProps<NavigationParamsList, WisbScreens.MapScreen> {

}

const InitialRegion = {
  ...Resources.get().getLastLocation(),
  latitudeDelta: 0.1,
  longitudeDelta: 0.1,
}

interface Query {
  phrase: string
  type: WisbObjectType.Dumpster |WisbObjectType.Event |WisbObjectType.Wasteland
}

export default function MapScreen({ route: { params: { onItemSelected, getCurrentUser } } }: Props) {
  const trackingIconRef = React.useRef<TouchableOpacity>(null)

  const mapRef = React.useRef<MapView>(null)
  const [displayedRegion, setDisplayedRegion] = React.useState(InitialRegion)
  const [isReverseGeocoding, setIsReverseGeocoding] = React.useState(true)
  const [currentLocationAsText, setCurrentLocationAsText] = React.useState<string | null>(null)

  const [query, setQuery] = React.useState<Query>({ phrase: "", type: WisbObjectType.Event })
  const [isSearchDialogVisible, setIsSearchDialogVisible] = React.useState(false)

  const [searchedPlace, setSearchedPlace] = React.useState<Place | null>(null)

  const [userPosition, setUserPosition] = React.useState<LatLng>(InitialRegion)

  const setCurrentRegionName = (region: Region) => {
    setIsReverseGeocoding(true)
    reverseGeoCode(Resources.get().getEnv().GOOGLE_MAPS_API_KEY, region).then(formattedAddress => {
      setCurrentLocationAsText(formattedAddress ?? "??")
      setIsReverseGeocoding(false)
    })
  }

  React.useEffect(() => {
    setCurrentRegionName(InitialRegion)
    return Resources.get().registerUserLocationListener(setUserPosition)
  }, [])

  const getTrackingIconPosition = (region: Region) => {
    if (userPosition != null && !isLatLngInRegion(region, userPosition)) {
      const visibleMapCenter = {
        latitude: region.latitude,
        longitude: region.longitude
      };

      const correctedUserMarkerPosition = {
        latitude: userPosition.latitude - visibleMapCenter.latitude,
        longitude: userPosition.longitude - visibleMapCenter.longitude
      };

      let userMarkerAngle = Math.atan2(
        correctedUserMarkerPosition.latitude,
        correctedUserMarkerPosition.longitude
      );

      if (userMarkerAngle < 0) {
        userMarkerAngle += 2 * Math.PI;
      }

      return {
        angle: userMarkerAngle
      }
    }

    return null
  }

  const [mapObjects, setMapObjects] = React.useState<{ 
    [WisbObjectType.Dumpster]: WisbDumpster[],
    [WisbObjectType.Event]: WisbEvent[],
    [WisbObjectType.Wasteland]: WisbWasteland[],
    region: Region 
  }>({
    [WisbObjectType.Dumpster]: [],
    [WisbObjectType.Event]: [],
    [WisbObjectType.Wasteland]: [],
    region: InitialRegion
  })

  const updateMapObjects = (region: Region) => {
    const api = getAPI()

      Promise.all([
        api.getMany(WisbObjectType.Wasteland, {region, activeOnly: true}, [0, NaN]),
        api.getMany(WisbObjectType.Dumpster, {region}, [0, NaN]),
        api.getMany(WisbObjectType.Event, {region, dateRange: [getFirstTodayTime(new Date()), null]}, [0, NaN])
      ]).then(result => ({
        [WisbObjectType.Wasteland]: result[0].data!,
        [WisbObjectType.Dumpster]: result[1].data!,
        [WisbObjectType.Event]: result[2].data!
      })).then(result =>  setMapObjects(mapObjects => ({...mapObjects, ...result})))
  }

  return (
    <View
      style={styles.root}>
      <MapView
        ref={mapRef}
        mapType={Resources.get().getSettings().mapType == MapType.Default ? "standard" : "hybrid"}
        initialRegion={InitialRegion}
        onRegionChangeComplete={newRegion => {
          if (!doesRegionInclude(mapObjects.region, newRegion) && calcRegionAreaInMeters(newRegion) < 100000) {
            updateMapObjects(scaleRegion(newRegion, 1.5))
          }

          setCurrentRegionName(newRegion)

          setDisplayedRegion(region => newRegion)
        }}
        onRegionChange={newRegion => {
          const trackingIconPosition = getTrackingIconPosition(newRegion)

          if (trackingIconPosition == null) {
            trackingIconRef.current?.setNativeProps({
              style: {
                display: "none"
              }
            })
          } else {
            trackingIconRef.current?.setNativeProps({
              style: {
                display: "flex",
                transform: [
                  { rotate: `${-trackingIconPosition.angle}rad` },
                ]
              }
            })
          }
        }}
        showsScale={false}
        showsIndoors={false}
        showsTraffic={false}
        showsMyLocationButton={false}
        toolbarEnabled={false}
        showsCompass={false}
        provider="google"
        showsPointsOfInterest={false}
        style={styles.mapView}
        customMapStyle={map_style}>
        <Fragment>
          {userPosition == null ?
            null :
            <Marker
              id={UserMarkerId}
              title={Resources.get().getStrings().Screens.MapScreen.UserPositionMarkerFlyoutContent}
              coordinate={userPosition}>
              <WisbIcon size={25}
                icon={IconType.MapPin} />
            </Marker>}

          {searchedPlace == null ? null : (
            <Marker
              key={`searched-place`}
              onPress={() => {
                setIsSearchDialogVisible(true)
                setSearchedPlace(null)
              }}
              style={styles.searchedPlaceMarker}
              coordinate={searchedPlace.location}>
              <Text style={styles.searchedPlaceMarkerLabel}>{searchedPlace.formattedAddress}</Text>
              <FontAwesomeIcon icon={faMapPin} size={30} />
            </Marker>
          )}

          {mapObjects[WisbObjectType.Wasteland].map(wasteland => (
            <Marker
              key={`${WisbObjectType.Wasteland}${MarkerIdSeparator}${wasteland.id}`}
              onPress={() => onItemSelected(wasteland)}
              coordinate={wasteland.place.coords}>
              <WisbIcon size={30} icon={IconType.WastelandIcon} />
            </Marker>
          ))}

          {mapObjects[WisbObjectType.Event].map(event => (
            <Marker
              key={`${WisbObjectType.Event}${MarkerIdSeparator}${event.id}`}
              onPress={() => onItemSelected(event)}
              coordinate={event.place.coords}>
              <WisbIcon size={30} icon={IconType.Calendar} />
            </Marker>
          ))}

          {mapObjects[WisbObjectType.Dumpster].map(dumpster => (
            <Marker
              key={`${WisbObjectType.Dumpster}${MarkerIdSeparator}${dumpster.id}`}
              onPress={() => onItemSelected(dumpster)}
              coordinate={dumpster.place.coords}>
              <WisbIcon size={30} icon={IconType.Dumpster} />
            </Marker>
          ))}
        </Fragment>
      </MapView>

      <View style={styles.trackingIconContainer}>
        <View ref={trackingIconRef} style={styles.trackingIcon}>
          <TouchableOpacity
            onPress={() => {
              if (userPosition != null) {
                mapRef.current?.animateToRegion({ ...userPosition, latitudeDelta: 0.1, longitudeDelta: 0.1 })
              }
            }}
            style={styles.trackingIconSubContainer}>
            <FontAwesomeIcon icon={faArrowUp} color={Resources.get().getColors().Primary} style={styles.trackingIconChild} />
          </TouchableOpacity>
        </View>
      </View>

      <View
        style={{
          ...styles.mapQueryInputContainer,
          marginTop: (StatusBar.currentHeight ?? 35) + 5,
        }}>
        <QueryInput
          loading={!isSearchDialogVisible && query.phrase.length == 0 && isReverseGeocoding}
          placeholder={Resources.get().getStrings().Components.MapQueryInput.Placeholder}
          onPress={() => setIsSearchDialogVisible(true)}
          onPhraseChanged={phrase => setQuery({ ...query, phrase })}
          isFocused={isSearchDialogVisible}
          onClear={() => {
            setIsSearchDialogVisible(false)

            if (userPosition == null) {
              return
            }

            setQuery({
              ...query,
              phrase: ""
            })

            const deltas = metersToLatLngDelta(2000, userPosition.latitude)
            const region: Region = {
              ...userPosition,
              latitudeDelta: deltas.latitudeDelta,
              longitudeDelta: deltas.longitudeDelta,
            }

            mapRef.current?.animateToRegion(region, 100)
          }}
          phrase={!isSearchDialogVisible && query.phrase.length == 0 && currentLocationAsText != null && !isReverseGeocoding ? currentLocationAsText : query.phrase}
          items={[
            {
              isSelected: query.type.includes(WisbObjectType.Dumpster),
              component: <WisbIcon icon={IconType.Dumpster} size={20} greyOut={query.type != WisbObjectType.Dumpster} />,
              onClick: () => {
                setQuery({
                  ...query,
                  type: WisbObjectType.Dumpster
                })
              }
            },
            {
              isSelected: query.type.includes(WisbObjectType.Event),
              component: <WisbIcon icon={IconType.Calendar} size={20} greyOut={query.type != WisbObjectType.Event} />,
              onClick: () => {
                setQuery({
                  ...query,
                  type: WisbObjectType.Event
                })
              }
            },
            {
              isSelected: query.type.includes(WisbObjectType.Wasteland),
              component: <WisbIcon icon={IconType.WastelandIcon} size={20} greyOut={query.type != WisbObjectType.Wasteland} />,
              onClick: () => {
                setQuery({
                  ...query,
                  type: WisbObjectType.Wasteland
                })
              }
            }
          ]}
        />
      </View>

      <ListDialog
        currentUser={getCurrentUser()}
        googleMapsApiKey={Resources.get().getEnv().GOOGLE_MAPS_API_KEY}
        onPlaceSelected={selectedPlace => {
          setIsSearchDialogVisible(false)
          setSearchedPlace(selectedPlace)
          mapRef.current?.animateToRegion({
            ...selectedPlace.location,
            latitudeDelta: 0.1,
            longitudeDelta: 0.1,
          })
        }}
        userLocation={userPosition}
        query={query}
        visible={isSearchDialogVisible}
        onDismiss={() => setIsSearchDialogVisible(false)}
        onItemSelected={item => {
          setIsSearchDialogVisible(false)
          onItemSelected(item)
        }} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  mapQueryInputContainer: {
    shadowColor: Resources.get().getColors().Black,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.51,
    shadowRadius: 13.16,

    elevation: 20,
    backgroundColor: Resources.get().getColors().White,
    borderRadius: 10,
    marginHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
  },
  trackingIconSubContainer: {
    position: "absolute",
    backgroundColor: Resources.get().getColors().White,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    height: TrackingIconSize,
    width: TrackingIconSize,
    shadowColor: Resources.get().getColors().Black,
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 10,
    transform: [
      { translateX: TrackingIconRadius }
    ]
  },
  trackingIconContainer: {
    width: "100%",
    height: "100%",
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    pointerEvents: "box-none"
  },
  trackingIcon: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    pointerEvents: "box-none",
    width: TrackingIconRadius * 2,
    height: TrackingIconRadius * 2,
    borderRadius: TrackingIconRadius
  },
  trackingIconChild: {
    transform: [{ rotate: "90deg" }]
  },
  searchedPlaceMarker: {
    alignItems: "center"
  },
  searchedPlaceMarkerLabel: {
    marginBottom: 5,
    backgroundColor: Resources.get().getColors().Primary,
    color: Resources.get().getColors().White,
    padding: 5,
    borderRadius: 5,
    overflow: "hidden",
    borderColor: Resources.get().getColors().White,
    borderWidth: 2,
    fontWeight: "500",
    letterSpacing: 1,
    maxWidth: 200
  },
  mapView: {
    height: '100%', width: '100%'
  }
})