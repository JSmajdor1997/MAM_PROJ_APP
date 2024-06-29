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
import Resources from '../../res/Resources';
import Dialog, { Position } from './Dialog';
import FAB from '../components/FAB';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import Wasteland from '../API/data_types/Wasteland';
import Event, { EventUser } from '../API/data_types/Event';
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
import Spinner from 'react-native-spinkit';
import User from '../API/data_types/User';

export interface Props {
  visible: boolean;
  onDismiss: () => void;
  onItemSelected: (item: Wasteland | Event | Dumpster) => void;
  onPlaceSelected: (place: Place) => void
  query: Query
  googleMapsApiKey: string
  userLocation: LatLng

  currentUser: User
}

const PageSize = 10

const api = getAPI()

export default function ListDialog({ visible, onDismiss, onItemSelected, query, googleMapsApiKey, userLocation, onPlaceSelected, currentUser }: Props) {
  const flatListRef = React.useRef<FlatList>(null)

  const [isLoading, setIsLoading] = React.useState(false)
  const [hasMore, setHasMore] = React.useState(true)

  const [items, setItems] = React.useState<{
    items: (Wasteland | (Event & { members: EventUser[], admins: EventUser[] }) | Dumpster)[]
    index: number
    type: Type
  }>({
    items: [],
    index: 0,
    type: Type.Event
  })

  const [places, setPlaces] = React.useState<Place[]>([])

  const updateItems = (append: boolean, index: number) => {
    if (isLoading || !visible || (!hasMore && query.type == items.type)) {
      return;
    }

    setIsLoading(true)

    Promise.all([
      api.getWastelands({phrase: query.phrase}, [index * PageSize, (index + 1) + PageSize]),
      api.getDumpsters({phrase: query.phrase}, [index * PageSize, (index + 1) + PageSize]),
      api.getEvents({phrase: query.phrase}, [index * PageSize, (index + 1) + PageSize], true)
    ]).then(result => ({
      [Type.Wasteland]: result[0],
      [Type.Dumpster]: result[1],
      [Type.Event]: result[2]
    })).then(rsp => {
      const typeRsp = rsp[query.type]

      if(typeRsp.error == null) {
        setHasMore(typeRsp.data.items.length > 0)

        setItems(current => ({
          items: append ? [...current.items, ...typeRsp.data.items] : typeRsp.data.items,
          index,
          type: query.type
        }) as any)

        setIsLoading(false);

        if (!append) {
          flatListRef.current?.scrollToOffset({ animated: true, offset: 0 })
        }
      } else {
        Toast.showWithGravityAndOffset("Unknown error", Toast.SHORT, Toast.CENTER, 0, 10)
      }
    })
  }

  React.useEffect(() => {
    if (visible) {
      updateItems(false, 0)
    } else if (items.items.length != 0) {
      setItems({
        items: [],
        type: Type.Event,
        index: 0
      })
    }
  }, [query.type, visible])

  const searchPlacesTimeoutId = React.useRef<NodeJS.Timeout | null>(null)
  React.useEffect(() => {
    if (searchPlacesTimeoutId.current != null) {
      clearTimeout(searchPlacesTimeoutId.current)
    }

    searchPlacesTimeoutId.current = setTimeout(() => {
      setIsLoading(true)
      searchPlaces(googleMapsApiKey, query.phrase, Resources.get().getSettings().languageCode, userLocation, 1).then(places => {
        setPlaces(places ?? [])
        setIsLoading(false)
      })
    }, 200)
  }, [query.phrase])

  return (
    <Dialog
      onDismiss={onDismiss}
      animationDuration={300}
      visible={visible}
      backdropStyle={{ backgroundColor: undefined }}
      position={Position.Bottom}
      dialogStyle={styles.dialogStyle}
      dismissOnBackdropPress={false}>
      <View style={{ flex: 1 }}>
        <FlatList
          ref={flatListRef}
          onEndReached={() => updateItems(true, items.index + 1)}
          onEndReachedThreshold={0.5}
          initialNumToRender={PageSize}
          maxToRenderPerBatch={PageSize}
          extraData={items.items}
          removeClippedSubviews
          ListHeaderComponent={
            <View>
              {places.length == 0 ? null : places.map(place => (
                <LocationItem key={place.id} onPress={() => onPlaceSelected(place)} userLocation={userLocation} location={{
                  coords: place.location,
                  asText: place.formattedAddress
                }} />
              ))}
            </View>
          }
          style={{ flex: 1 }}
          renderItem={({ item }) => (
            isWasteland(item) ? <WastelandItem key={`${Type.Wasteland}-${item.id}`} item={item} onPress={onItemSelected} /> :
              isEvent(item) ? <EventItem key={`${Type.Event}-${item.id}`} item={item} onPress={onItemSelected} isAdmin={(item as Event & { members: EventUser[], admins: EventUser[] }).admins.some(admin => admin.id == currentUser.id)} /> :
                isDumpster(item) ? <DumpsterItem googleMapsAPIKey={googleMapsApiKey} key={`${Type.Dumpster}-${item.id}`} item={item} onPress={onItemSelected} /> :
                  null
          )}
          keyExtractor={(item, index) => item.key}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<View style={{ width: "100%", height: "100%", justifyContent: "center", alignItems: "center" }}><Text>Brak wyników</Text></View>}
          ListFooterComponent={() => {
            if (isLoading) {
              return (
                <View style={{ width: "100%", height: 50, justifyContent: "center", alignItems: "center" }}>
                  <Spinner type="FadingCircle" color={Resources.get().getColors().Primary} />
                </View>
              );
            }

            if (!hasMore) {
              return (
                <View>
                  <Text>{Resources.get().getStrings().Dialogs.ListDialog.NoMoreDataMessage}</Text>
                </View>
              );
            }

            return null;
          }}
          data={items.items}
        />

        {isLoading ? <View style={{ backgroundColor: "#00000055", ...StyleSheet.absoluteFillObject, justifyContent: "center", alignItems: "center" }}>
          <Spinner type="FadingCircle" color={Resources.get().getColors().Primary} size={80} />
        </View> : null}
      </View>
    </Dialog>
  );
}

const styles = StyleSheet.create({
  dialogStyle: {
    borderBottomLeftRadius: 0, borderBottomRightRadius: 0, top: 140, bottom: 0, height: Dimensions.get("screen").height - 140, backgroundColor: Resources.get().getColors().White, justifyContent: "space-between", width: "100%", flexDirection: "column"
  },
  dismissButton: {
    marginBottom: 5
  }
})