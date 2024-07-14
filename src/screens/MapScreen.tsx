import { faArrowUp, faMapPin } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { Fragment } from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import MapView, { LatLng, Marker, Region } from 'react-native-maps';
import MapType from '../../res/MapType';
import Resources from '../../res/Resources';
import WisbObjectType from '../API/WisbObjectType';
import getAPI from '../API/getAPI';
import { SimplePlace, WisbDumpster, WisbEvent, WisbWasteland } from '../API/interfaces';
import { Notification } from '../API/notifications';
import IconType from '../components/WisbIcon/IconType';
import WisbIcon from '../components/WisbIcon/WisbIcon';
import QueryInput from '../components/inputs/QueryInput';
import NotificationsList from '../components/lists/NotificationsList';
import ListDialog from '../dialogs/ListDialog';
import GeoHelper from '../utils/GeoHelper';
import reverseGeoCode from '../utils/GooglePlacesAPI/reverseGeoCode';
import NavigationParamsList, { WisbScreens } from './NavigationParamsList';
const map_style = require('../../res/map_style.json');

const api = getAPI()
const res = Resources.get()

const TrackingIconRadius = 150
const TrackingIconSize = 35

const MarkerIdSeparator = '-'

const UserMarkerId = 'USER-MARKER'

interface Props extends NativeStackScreenProps<NavigationParamsList, WisbScreens.MapScreen> { }

const InitialRegion = {
  ...res.getLastLocation(),
  latitudeDelta: 0.1,
  longitudeDelta: 0.1,
}

interface Query {
  phrase: string
  type: WisbObjectType.Dumpster | WisbObjectType.Event | WisbObjectType.Wasteland
}

export default function MapScreen({ route: { params: { onItemSelected, getCurrentUser, navigate } } }: Props) {
  const trackingIconRef = React.useRef<TouchableOpacity>(null)
  const mapRef = React.useRef<MapView>(null)
  const [isNotificationsListExpanded, setIsNotificationsListExpanded] = React.useState(false)
  const [displayedRegion, setDisplayedRegion] = React.useState(InitialRegion)
  const [isReverseGeocoding, setIsReverseGeocoding] = React.useState(true)
  const [currentLocationAsText, setCurrentLocationAsText] = React.useState<string | null>(null)
  const [query, setQuery] = React.useState<Query>({ phrase: "", type: WisbObjectType.Event })
  const [isSearchDialogVisible, setIsSearchDialogVisible] = React.useState(false)
  const [searchedPlace, setSearchedPlace] = React.useState<SimplePlace | null>(null)
  const [userPosition, setUserPosition] = React.useState<LatLng>(InitialRegion)

  const setCurrentRegionName = (region: Region) => {
    setIsReverseGeocoding(true)
    reverseGeoCode(res.getEnv().GOOGLE_MAPS_API_KEY, region).then(formattedAddress => {
      setCurrentLocationAsText(formattedAddress ?? "??")
      setIsReverseGeocoding(false)
    })
  }

  const onNewNotification = (n: Notification) => { }

  React.useEffect(() => {
    api.notifications.registerListener(onNewNotification, { location: InitialRegion })
    setCurrentRegionName(InitialRegion)

    const unregister = res.registerUserLocationListener(newLocation => {
      setUserPosition(newLocation)
      api.notifications.updateListener(onNewNotification, { location: newLocation })
    })

    return () => {
      unregister()
      updateMapObjects(InitialRegion)
    }
  }, [])

  const getTrackingIconPosition = (region: Region) => {
    if (userPosition != null && !GeoHelper.isLatLngInRegion(region, userPosition)) {
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
    Promise.all([
      api.getMany(WisbObjectType.Wasteland, { region, activeOnly: true }, [0, NaN]),
      api.getMany(WisbObjectType.Dumpster, { region }, [0, NaN]),
      api.getMany(WisbObjectType.Event, { region, activeOnly: true }, [0, NaN])
    ]).then(result => ({
      [WisbObjectType.Wasteland]: result[0].data!.items,
      [WisbObjectType.Dumpster]: result[1].data!.items,
      [WisbObjectType.Event]: result[2].data!.items
    })).then(result => {
      setMapObjects(mapObjects => ({ ...mapObjects, ...result }))
    })
  }

  return (
    <View style={styles.root}>
      <MapView
        ref={mapRef}
        mapType={res.getSettings().mapType == MapType.Default ? "standard" : "hybrid"}
        initialRegion={InitialRegion}
        onRegionChangeComplete={newRegion => {
          if (!GeoHelper.doesRegionInclude(mapObjects.region, newRegion) && GeoHelper.calcRegionAreaInMeters(newRegion) < 100000) {
            updateMapObjects(GeoHelper.scaleRegion(newRegion, 1.5))
          }

          setCurrentRegionName(newRegion)
          setDisplayedRegion(newRegion)
        }}
        onRegionChange={newRegion => {
          const trackingIconPosition = getTrackingIconPosition(newRegion)

          if (trackingIconPosition == null) {
            trackingIconRef.current?.setNativeProps({
              style: styles.hiddenTrackingIcon
            })
          } else {
            trackingIconRef.current?.setNativeProps({
              style: {
                ...styles.visibleTrackingIcon,
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
              title={res.getStrings().Screens.MapScreen.UserPositionMarkerFlyoutContent}
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
              coordinate={searchedPlace.coords}>
              <Text style={styles.searchedPlaceMarkerLabel}>{searchedPlace.asText}</Text>
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
            <FontAwesomeIcon icon={faArrowUp} color={res.getColors().Primary} style={styles.trackingIconChild} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={[styles.mapQueryInputContainer, { marginTop: (StatusBar.currentHeight ?? 35) + 5 }]}>
        <QueryInput
          loading={!isSearchDialogVisible && query.phrase.length == 0 && isReverseGeocoding}
          placeholder={res.getStrings().Components.MapQueryInput.Placeholder}
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

            const deltas = GeoHelper.metersToLatLngDelta(2000, userPosition.latitude)
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
        {!isSearchDialogVisible ? <NotificationsList
          expanded={isNotificationsListExpanded}
          onExpandedChange={setIsNotificationsListExpanded}
          userPosition={userPosition}
          style={{ marginBottom: 4, marginTop: -6, width: "100%" }}
          onOpenChat={async id=>{
            const event = await api.getOne(id)
            navigate.go(WisbScreens.ChatScreen, {event: event.data})
          }}
          onItemSelected={async id=>{
            const event = await api.getOne(id)

            onItemSelected(event.data!)
          }} /> : null}
      </View>

      <ListDialog
        currentUser={getCurrentUser()}
        googleMapsApiKey={res.getEnv().GOOGLE_MAPS_API_KEY}
        onPlaceSelected={selectedPlace => {
          setIsSearchDialogVisible(false)
          setSearchedPlace(selectedPlace)
          mapRef.current?.animateToRegion({
            ...selectedPlace.coords,
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
    shadowColor: res.getColors().Black,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.51,
    shadowRadius: 13.16,
    elevation: 20,
    backgroundColor: res.getColors().White,
    borderRadius: 10,
    marginHorizontal: 10,
    alignItems: 'center',
    position: 'absolute',
  },
  trackingIconSubContainer: {
    position: "absolute",
    backgroundColor: res.getColors().White,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    height: TrackingIconSize,
    width: TrackingIconSize,
    shadowColor: res.getColors().Black,
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
  hiddenTrackingIcon: {
    display: "none"
  },
  visibleTrackingIcon: {
    display: "flex"
  },
  searchedPlaceMarker: {
    alignItems: "center"
  },
  searchedPlaceMarkerLabel: {
    marginBottom: 5,
    backgroundColor: res.getColors().Primary,
    fontFamily: res.getFonts().Secondary,
    color: res.getColors().White,
    padding: 5,
    borderRadius: 5,
    overflow: "hidden",
    borderColor: res.getColors().White,
    borderWidth: 2,
    fontWeight: "500",
    letterSpacing: 1,
    maxWidth: 200
  },
  mapView: {
    height: '100%', width: '100%'
  }
})
