import React, { Component, ReactElement, Fragment } from 'react';
import {
  View,
  Text,
  StatusBar,
  ViewStyle,
  ToastAndroid,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import MapView, { Marker, Region, LatLng } from 'react-native-maps';
import SearchBar from '../components/MapQueryInput';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import NavigationParamsList from './NavigationParamsList';
import WisbScreens from './WisbScreens';
import Geolocation from '@react-native-community/geolocation';
import ListDialog from '../dialogs/ListDialog';
import getAPI from '../API/getAPI';
import Toast from 'react-native-simple-toast';
import Wasteland from '../API/data_types/Wasteland';
import Dumpster from '../API/data_types/Dumpster';
import Event from '../API/data_types/Event';
import WisbIcon, { IconType } from '../components/WisbIcon';
import getRandomLatLngInPoland from '../API/implementations/mockup/getRandomLatLngInPoland';
import metersToLatLngDelta from '../utils/metersToDelta';
import scaleRegion from '../utils/scaleRegion';
import APIResponse from '../API/APIResponse';
import { GeneralError } from '../API/API';
import doesRegionInclude from '../utils/doesRegionInclude';
import calcRegionAreaInMeters from '../utils/calcRegionAreaInMeters';
import { MapObjects, Query, Type } from '../API/helpers';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowUp, faChevronDown, faMapPin } from '@fortawesome/free-solid-svg-icons';
import MapQueryInput from '../components/MapQueryInput';
import isLatLngInRegion from '../utils/isLatLngInRegion';
import { Resources } from '../../res/Resources';
import { Place } from '../utils/GooglePlacesAPI/searchPlaces';
import { useLocation } from '../hooks/LocationContext';
const map_style = require('../../res/map_style.json');

const TrackingIconRadius = 150
const TrackingIconSize = 35

const MarkerIdSeparator = '-'

const UserMarkerId = 'USER-MARKER'

interface Props extends NativeStackScreenProps<NavigationParamsList, WisbScreens.MapScreen> {

}

const InitialRegion = {
  ...getRandomLatLngInPoland(),
  latitudeDelta: 1,
  longitudeDelta: 1,
}

export default function MapScreen({ route: { params: { onItemSelected } } }: Props) {
  const trackingIconRef = React.useRef<TouchableOpacity>(null)

  const mapRef = React.useRef<MapView>(null)
  const [displayedRegion, setDisplayedRegion] = React.useState(InitialRegion)

  const [query, setQuery] = React.useState<Query>({ phrase: "", type: Type.Event })
  const [isSearchDialogVisible, setIsSearchDialogVisible] = React.useState(false)

  const [searchedPlace, setSearchedPlace] = React.useState<Place | null>(null)

  const [userPosition, setUserPosition] = React.useState(getRandomLatLngInPoland())
  
  const cleanup = useLocation(setUserPosition)

  React.useEffect(()=>{
    return ()=> {
      cleanup()
    }
  })

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

  const [mapObjects, setMapObjects] = React.useState<MapObjects & { region: Region }>({
    [Type.Dumpster]: [],
    [Type.Event]: [],
    [Type.Wasteland]: [],
    region: InitialRegion
  })

  const updateMapObjects = (region: Region) => {
    getAPI().getObjects([Type.Dumpster, Type.Event, Type.Wasteland], { phrase: query.phrase, region }).then(rsp => {
      if (rsp.error == null) {
        setMapObjects(mapObjects => ({
          ...mapObjects,
          ...rsp.data
        }))
      } else {
        Toast.showWithGravityAndOffset(rsp.description ?? Resources.Strings.get().Screens.MapScreen.ErrorToastMessage, Toast.SHORT, Toast.CENTER, 0, 10)
      }
    })
  }

  return (
    <View
      style={{
        flex: 1,
      }}>
      <MapView
        ref={mapRef}
        onRegionChangeComplete={newRegion => {
          if (!doesRegionInclude(mapObjects.region, newRegion) && calcRegionAreaInMeters(newRegion) < 100000) {
            updateMapObjects(scaleRegion(newRegion, 1.5))
          }

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
        style={{ height: '100%', width: '100%' }}
        customMapStyle={map_style}>
        <Fragment>
          {userPosition == null ?
            null :
            <Marker
              id={UserMarkerId}
              title={Resources.Strings.get().Screens.MapScreen.UserPositionMarkerFlyoutContent}
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
              style={{ alignItems: "center" }}
              coordinate={searchedPlace.location}>
              <Text style={{ marginBottom: 5, backgroundColor: Resources.Colors.Primary, color: Resources.Colors.White, padding: 5, borderRadius: 5, overflow: "hidden", borderColor: Resources.Colors.White, borderWidth: 2, fontWeight: "500", letterSpacing: 1, maxWidth: 200 }}>{searchedPlace.formattedAddress}</Text>
              <FontAwesomeIcon icon={faMapPin} size={30} />
            </Marker>
          )}

          {mapObjects[Type.Wasteland].map(wasteland => (
            <Marker
              key={`${Type.Wasteland}${MarkerIdSeparator}${wasteland.id}`}
              onPress={() => onItemSelected(wasteland)}
              coordinate={wasteland.place.coords}>
              <WisbIcon size={30} icon={IconType.WastelandIcon} />
            </Marker>
          ))}

          {mapObjects[Type.Event].map(event => (
            <Marker
              key={`${Type.Event}${MarkerIdSeparator}${event.id}`}
              onPress={() => onItemSelected(event)}
              coordinate={event.meetPlace.coords}>
              <WisbIcon size={30} icon={IconType.Calendar} />
            </Marker>
          ))}

          {mapObjects[Type.Dumpster].map(dumpster => (
            <Marker
              key={`${Type.Dumpster}${MarkerIdSeparator}${dumpster.id}`}
              onPress={() => onItemSelected(dumpster)}
              coordinate={dumpster.place.coords}>
              <WisbIcon size={30} icon={IconType.Dumpster} />
            </Marker>
          ))}
        </Fragment>
      </MapView>

      <View style={{ width: "100%", height: "100%", position: "absolute", justifyContent: "center", alignItems: "center", pointerEvents: "box-none" }}>
        <View ref={trackingIconRef} style={{
          position: "absolute",
          justifyContent: "center", alignItems: "center", pointerEvents: "box-none", width: TrackingIconRadius * 2, height: TrackingIconRadius * 2, borderRadius: TrackingIconRadius
        }}>
          <TouchableOpacity
            onPress={() => {
              if (userPosition != null) {
                mapRef.current?.animateToRegion({ ...userPosition, latitudeDelta: 0.1, longitudeDelta: 0.1 })
              }
            }}
            style={{
              position: "absolute",
              backgroundColor: Resources.Colors.White,
              borderRadius: 100,
              justifyContent: "center",
              alignItems: "center",
              height: TrackingIconSize,
              width: TrackingIconSize,
              transform: [
                { translateX: TrackingIconRadius }
              ],
              shadowColor: Resources.Colors.Black,
              shadowOpacity: 0.2,
              shadowOffset: { width: 0, height: 0 },
              shadowRadius: 10
            }}>
            <FontAwesomeIcon icon={faArrowUp} color={Resources.Colors.Primary} style={{ transform: [{ rotate: "90deg" }] }} />
          </TouchableOpacity>
        </View>
      </View>

      <View
        style={{
          shadowColor: Resources.Colors.Black,
          shadowOffset: {
            width: 0,
            height: 10,
          },
          shadowOpacity: 0.51,
          shadowRadius: 13.16,

          elevation: 20,
          backgroundColor: Resources.Colors.White,
          borderRadius: 10,
          marginHorizontal: 10,
          flexDirection: 'row',
          alignItems: 'center',
          position: 'absolute',
          marginTop: (StatusBar.currentHeight ?? 20) + 5,
        }}>
        <MapQueryInput
          onClear={() => {
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
          query={query}
          isFocused={isSearchDialogVisible}
          onQueryChanged={newQuery => setQuery(newQuery)}
          onPress={() => setIsSearchDialogVisible(true)}
        />
      </View>

      <ListDialog
        googleMapsApiKey={Resources.Env.GOOGLE_MAPS_API_KEY}
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