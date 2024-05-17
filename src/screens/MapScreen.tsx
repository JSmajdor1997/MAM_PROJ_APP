import React, { Component, ReactElement, Fragment } from 'react';
import {
  View,
  Text,
  StatusBar,
  ViewStyle,
  ToastAndroid,
} from 'react-native';
import MapView, { Marker, Region, LatLng } from 'react-native-maps';
import SearchBar from '../components/SearchBar';
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
const map_style = require('../../res/map_style.json');

const MarkerIdSeparator = '-'

const UserMarkerId = 'USER-MARKER'

interface Props extends NativeStackScreenProps<NavigationParamsList, WisbScreens.MapScreen> {

}

const InitialRegion = {
  ...getRandomLatLngInPoland(),
  latitudeDelta: 1,
  longitudeDelta: 1,
}

export default function MapScreen({ }: Props) {
  const [selectedItem, setSelectedItem] = React.useState<Wasteland | Dumpster | Event | null>(null)

  const mapRef = React.useRef<MapView>(null)
  const [displayedRegion, setDisplayedRegion] = React.useState(InitialRegion)

  const [userPosition, setUserPosition] = React.useState<LatLng | null>(null)

  const [query, setQuery] = React.useState<Query>({ phrase: "", type: [Type.Dumpster, Type.Event, Type.Wasteland] })
  const [isSearchDialogVisible, setIsSearchDialogVisible] = React.useState(false)

  const [mapObjects, setMapObjects] = React.useState<MapObjects&{region: Region}>({
    [Type.Dumpster]: [],
    [Type.Event]: [],
    [Type.Wasteland]: [],
    region: InitialRegion
  })

  const updateMapObjects = (region: Region) => {
    function handleUpdate<T>(type: Type, getter: (wrapper: any) => T[]): (rsp: APIResponse<GeneralError, T>) => void {
      return (rsp: APIResponse<GeneralError, T>) => {
        if (rsp.error) {
          Toast.showWithGravityAndOffset(rsp.description ?? "Error", Toast.SHORT, Toast.CENTER, 0, 10)
        } else {
          setMapObjects(mapObjects => ({
            ...mapObjects,
            [type]: getter(rsp.data)
          }))
        }
      }
    }

    const api = getAPI()
    const commonQuery = { phrase: query.phrase, region: region }
    const promises: Promise<unknown>[] = []
    if (query.type.includes(Type.Dumpster)) {
      api.getDumpsters(commonQuery).then(handleUpdate(Type.Dumpster, wrapper => wrapper.dumpsters))
    }
    if (query.type.includes(Type.Event)) {
      api.getEvents(commonQuery).then(handleUpdate(Type.Event, wrapper => wrapper.events))
    }
    if (query.type.includes(Type.Wasteland)) {
      api.getWastelands(commonQuery).then(handleUpdate(Type.Wasteland, wrapper => wrapper.wastelands))
    }

    Promise.allSettled(promises)
  }

  React.useEffect(() => {
    Geolocation.watchPosition(location => {
      const deltas = metersToLatLngDelta(2000, location.coords.latitude)
      const region: Region = {
        ...location.coords,
        latitudeDelta: deltas.latitudeDelta,
        longitudeDelta: deltas.longitudeDelta,
      }

      setUserPosition(location.coords)
      setMapObjects(mapObjects => ({
        ...mapObjects,
        region: region
      }));

      (mapRef.current as any)?.animateToRegion(region, 100)

      updateMapObjects(region)
    })
  }, [])

  const renderUser = () => {
    return userPosition == null ?
      null :
      <Marker
        id={UserMarkerId}
        title="Tu jesteś!"
        coordinate={userPosition}>
        <WisbIcon size={25}
          icon={IconType.MapPin} />
      </Marker>
  }

  return (
    <View
      style={{
        flex: 1,
      }}>
      <MapView
        ref={mapRef}
        region={displayedRegion}
        onRegionChangeComplete={region => {
          if (!doesRegionInclude(mapObjects.region, region) && calcRegionAreaInMeters(region) < 100000) {
            updateMapObjects(scaleRegion(region, 1.5))
          }

          setDisplayedRegion(region => region)
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
          {renderUser()}

          {mapObjects[Type.Wasteland].map(wasteland => (
            <Marker
              key={`${Type.Wasteland}${MarkerIdSeparator}${wasteland.id}`}
              onPress={() => setSelectedItem(wasteland)}
              tracksViewChanges={false}
              coordinate={wasteland.place.coords}>
              <WisbIcon size={30} icon={IconType.WastelandIcon} />
            </Marker>
          ))}

          {mapObjects[Type.Event].map(event => (
            <Marker
              key={`${Type.Event}${MarkerIdSeparator}${event.id}`}
              onPress={() => setSelectedItem(event)}
              tracksViewChanges={false}
              coordinate={event.meetPlace.coords}>
              <WisbIcon size={30} icon={IconType.Calendar} />
            </Marker>
          ))}

          {mapObjects[Type.Dumpster].map(dumpster => (
            <Marker
              key={`${Type.Dumpster}${MarkerIdSeparator}${dumpster.id}`}
              onPress={() => setSelectedItem(dumpster)}
              tracksViewChanges={false}
              coordinate={dumpster.place.coords}>
              <WisbIcon size={30} icon={IconType.Dumpster} />
            </Marker>
          ))}
        </Fragment>
      </MapView>

      <View
        style={{
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 10,
          },
          shadowOpacity: 0.51,
          shadowRadius: 13.16,

          elevation: 20,
          backgroundColor: 'white',
          borderRadius: 10,
          marginHorizontal: 10,
          flexDirection: 'row',
          alignItems: 'center',
          position: 'absolute',
          marginTop: (StatusBar.currentHeight ?? 20) + 5,
        }}>
        <SearchBar
          query={query}
          isFocused={isSearchDialogVisible}
          onQueryChanged={newQuery => setQuery(newQuery)}
          onPress={() => setIsSearchDialogVisible(true)}
        />
      </View>

      <ListDialog
        query={query}
        visible={isSearchDialogVisible}
        onDismiss={() => setIsSearchDialogVisible(false)}
        onItemSelected={item => { }} />
    </View>
  );
}