import React, { Component, ReactElement } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Dimensions,
  ScrollView,
} from 'react-native';
import EventItem from '../components/EventItem';
import WastelandItem from '../components/WastelandItem';
import { Resources } from '../../res/Resources';
import Dialog, { Position } from './Dialog';
import FAB from '../components/FAB';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import Wasteland from '../API/data_types/Wasteland';
import Event from '../API/data_types/Event';
import Dumpster from '../API/data_types/Dumpster';
import { MapObjects, Query, Type } from '../API/helpers';
import { GeneralError } from '../API/API';
import APIResponse from '../API/APIResponse';
import getAPI from '../API/getAPI';
import Toast from 'react-native-simple-toast';
import { isDumpster, isEvent, isWasteland } from '../API/data_types/type_guards';
import DumpsterItem from '../components/DumpsterItem';
import Separator from '../components/Separator';
import searchPlaces, { Place } from '../utils/GooglePlacesAPI/searchPlaces';
import { LatLng } from 'react-native-maps';
import LocationItem from '../components/LocationItem';

export interface Props {
  visible: boolean;
  onDismiss: () => void;
  onItemSelected: (item: Wasteland | Event | Dumpster) => void;
  onPlaceSelected: (place: Place)=>void
  query: Query
  googleMapsApiKey: string
  userLocation: LatLng
}

const PageSize = 10

export default function ListDialog({ visible, onDismiss, onItemSelected, query, googleMapsApiKey, userLocation, onPlaceSelected }: Props) {
  const [index, setIndex] = React.useState(0)
  const [isLoading, setIsLoading] = React.useState(false)
  const [hasMore, setHasMore] = React.useState<Type[]>([Type.Dumpster, Type.Event, Type.Wasteland])

  const [mapObjects, setMapObjects] = React.useState<MapObjects>({
    [Type.Dumpster]: [],
    [Type.Event]: [],
    [Type.Wasteland]: []
  })

  const updateMapObjects = () => {
    if (isLoading || !hasMore) {
      return
    }

    setIsLoading(true)

    getAPI().getObjects(query.type, { phrase: query.phrase }).then(rsp => {
      console.log(rsp)
      setIsLoading(false)

      if (rsp.error == null) {
        setHasMore([
          ...(mapObjects[Type.Dumpster].length > 0 ? [] : [Type.Dumpster]),
          ...(mapObjects[Type.Event].length > 0 ? [] : [Type.Event]),
          ...(mapObjects[Type.Wasteland].length > 0 ? [] : [Type.Wasteland])
        ])

        setMapObjects(mapObjects => ({
          ...mapObjects,
          ...rsp.data
        }))
      } else {
        Toast.showWithGravityAndOffset(rsp.description ?? "Error", Toast.SHORT, Toast.CENTER, 0, 10)
      }
    })
  }

  const [places, setPlaces] = React.useState<Place[]>([])

  const searchPlacesTimeoutId = React.useRef<NodeJS.Timeout | null>(null)
  React.useEffect(() => {
    if (searchPlacesTimeoutId.current != null) {
      clearTimeout(searchPlacesTimeoutId.current)
    }

    searchPlacesTimeoutId.current = setTimeout(() => {
      searchPlaces(googleMapsApiKey, query.phrase, Resources.Locale.LanguageCode, userLocation, 3).then(places => {
        if (places != null) {
          setPlaces(places)
        }
      })
    }, 200)
  }, [query.phrase])

  React.useEffect(() => {
    setIndex(0)

    if (visible) {
      // updateMapObjects()
    } else {
      setMapObjects({
        [Type.Dumpster]: [],
        [Type.Event]: [],
        [Type.Wasteland]: [],
      })
    }
  }, [query, visible])

  React.useEffect(() => {
    // updateMapObjects()
  }, [index])

  return (
    <Dialog
      onDismiss={onDismiss}
      animationDuration={300}
      visible={visible}
      backdropStyle={{ backgroundColor: undefined }}
      position={Position.Bottom}
      dialogStyle={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0, top: 140, bottom: 0, height: Dimensions.get("screen").height - 140, backgroundColor: "white", justifyContent: "space-between", width: "100%", flexDirection: "column" }}
      dismissOnBackdropPress={false}>
      <ScrollView>
        {places.map(place => (
          <LocationItem onPress={() => onPlaceSelected(place)} userLocation={userLocation} location={{
            coords: place.location,
            asText: place.formattedAddress
          }} />
        ))}

        <FlatList
          onEndReachedThreshold={0.5}
          onEndReached={() => setIndex(index + PageSize)}
          style={{ flex: 1 }}
          renderItem={({ item }) => (
            isWasteland(item) ? <WastelandItem key={`${Type.Wasteland}-${item.id}`} item={item} onPress={onItemSelected} /> :
              isEvent(item) ? <EventItem key={`${Type.Event}-${item.id}`} item={item} onPress={onItemSelected} /> :
                isDumpster(item) ? <DumpsterItem key={`${Type.Dumpster}-${item.id}`} item={item} onPress={onItemSelected} /> :
                  null
          )}
          keyExtractor={item => item.id.toString()}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => (
            <Separator />
          )}
          data={[
            ...mapObjects[Type.Dumpster],
            ...mapObjects[Type.Event],
            ...mapObjects[Type.Wasteland]
          ]}
        />
      </ScrollView>

      <FAB
        color={Resources.Colors.Red}
        icon={<FontAwesomeIcon icon={faClose} color={Resources.Colors.White} size={25} />}
        style={{ marginBottom: 5 }}
        onPress={onDismiss} />
    </Dialog>
  );
}