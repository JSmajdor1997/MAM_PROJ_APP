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
import { isDumpster, isEvent, isUser, isWasteland } from '../API/data_types/type_guards';
import DumpsterItem from '../components/DumpsterItem';
import Separator from '../components/Separator';
import searchPlaces, { Place } from '../utils/GooglePlacesAPI/searchPlaces';
import { LatLng } from 'react-native-maps';
import LocationItem from '../components/LocationItem';
import Spinner from 'react-native-spinkit';
import User from '../API/data_types/User';
import ObjectsList from '../components/ObjectsList';

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
        <ObjectsList
          type={query.type}
          multi={false}
          onPressed={(item: Event | Wasteland | Dumpster | User) => {
            if (!isUser(item)) {
              onItemSelected(item)
            }
          }}
          phrase={query.phrase}
          currentUser={currentUser}
          googleMapsApiKey={googleMapsApiKey}
          placesConfig={{
            userLocation,
            onPlaceSelected
          }} />
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