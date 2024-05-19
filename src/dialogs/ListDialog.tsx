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
  onPlaceSelected: (place: Place) => void
  query: Query
  googleMapsApiKey: string
  userLocation: LatLng
}

const PageSize = 10

export default function ListDialog({ visible, onDismiss, onItemSelected, query, googleMapsApiKey, userLocation, onPlaceSelected }: Props) {
  const flatListRef = React.useRef<FlatList>(null)

  const [isLoadingPlaces, setIsLoadingPlaces] = React.useState(false)
  const [index, setIndex] = React.useState(0)
  const [isLoading, setIsLoading] = React.useState(false)
  const [hasMore, setHasMore] = React.useState(true)

  const [mapObjects, setMapObjects] = React.useState<MapObjects>({
    [Type.Dumpster]: [],
    [Type.Event]: [],
    [Type.Wasteland]: []
  })

  const updateMapObjects = (append: boolean, index: number) => {
    if (isLoading || !hasMore || !visible) {
      return;
    }

    setIsLoading(true)

    getAPI().getObjects([query.type], { phrase: query.phrase, range: [index * PageSize, (index + 1) + PageSize] }).then(rsp => {
      if (rsp.error == null) {
        setHasMore(rsp.data[query.type].length > 0)

        setMapObjects(mapObjects => ({
          [Type.Dumpster]: [...(append ? mapObjects[Type.Dumpster] : []), ...rsp.data[Type.Dumpster]],
          [Type.Event]: [...(append ? mapObjects[Type.Event] : []), ...rsp.data[Type.Event]],
          [Type.Wasteland]: (append ? mapObjects[Type.Wasteland] : []), ...rsp.data[Type.Wasteland],
        }))

        setIndex(index)

        setIsLoading(false);
        flatListRef.current?.scrollToOffset({animated: true, offset: 0})
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
      setIsLoading(true)
      searchPlaces(googleMapsApiKey, query.phrase, Resources.Locale.LanguageCode, userLocation, 1).then(places => {
        setPlaces(places ?? [])
        setIsLoading(false)
      })
    }, 200)
  }, [query.phrase])

  React.useEffect(() => {
    setHasMore(true)

    updateMapObjects(false, 0)
  }, [query.phrase, query.type, visible])

  return (
    <Dialog
      onDismiss={onDismiss}
      animationDuration={300}
      visible={visible}
      backdropStyle={{ backgroundColor: undefined }}
      position={Position.Bottom}
      dialogStyle={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0, top: 140, bottom: 0, height: Dimensions.get("screen").height - 140, backgroundColor: Resources.Colors.White, justifyContent: "space-between", width: "100%", flexDirection: "column" }}
      dismissOnBackdropPress={false}>
      <FlatList
        ref={flatListRef}
        onEndReached={()=>updateMapObjects(true, index+1)}
        onEndReachedThreshold={0.5}
        initialNumToRender={PageSize}
        maxToRenderPerBatch={PageSize}
        removeClippedSubviews
        ListHeaderComponent={
          <View>
            {places.length == 0 ? <Text>{Resources.Strings.get().Dialogs.ListDialog.PlaceNotFoundMessage}</Text> : null}
            {places.map(place => (
              <LocationItem key={place.id} onPress={() => onPlaceSelected(place)} userLocation={userLocation} location={{
                coords: place.location,
                asText: place.formattedAddress
              }} />
            ))}
            {isLoadingPlaces ? <View><Text>Ładowanie...</Text></View> : null}
          </View>
        }
        style={{ flex: 1 }}
        renderItem={({ item }) => (
          isWasteland(item) ? <WastelandItem key={`${Type.Wasteland}-${item.id}`} item={item} onPress={onItemSelected} /> :
            isEvent(item) ? <EventItem key={`${Type.Event}-${item.id}`} item={item} onPress={onItemSelected} /> :
              isDumpster(item) ? <DumpsterItem key={`${Type.Dumpster}-${item.id}`} item={item} onPress={onItemSelected} /> :
                null
        )}
        keyExtractor={item => `${isWasteland(item) ? Type.Wasteland : isEvent(item) ? Type.Event : Type.Dumpster}${item.id.toString()}`}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => (
          <Separator backgroundColor={Resources.Colors.White} color={Resources.Colors.Beige}/>
        )}
        ListFooterComponent={() => {
          if (isLoading) {
            return (
              <View>
                <Text>Loading...</Text>
              </View>
            );
          }

          if (!hasMore) {
            return (
              <View>
                <Text>{Resources.Strings.get().Dialogs.ListDialog.NoMoreDataMessage}</Text>
              </View>
            );
          }

          return null;
        }}
        data={[
          ...mapObjects[Type.Dumpster],
          ...mapObjects[Type.Event],
          ...mapObjects[Type.Wasteland]
        ]}
      />

      <FAB
        color={Resources.Colors.Red}
        icon={<FontAwesomeIcon icon={faClose} color={Resources.Colors.White} size={25} />}
        style={{ marginBottom: 5 }}
        onPress={onDismiss} />
    </Dialog>
  );
}