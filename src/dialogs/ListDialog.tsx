import React from 'react';
import {
  Dimensions,
  StyleSheet,
  View,
} from 'react-native';
import { LatLng } from 'react-native-maps';
import Resources from '../../res/Resources';
import WisbObjectType from '../API/WisbObjectType';
import { SimplePlace, WisbDumpster, WisbEvent, WisbUser, WisbWasteland } from '../API/interfaces';
import { isUser } from '../API/type_guards';
import ObjectsList from '../components/ObjectsList';
import Dialog, { Position } from './Dialog';
import LocationsList from '../components/LocationsList';

const res = Resources.get()

export interface Query {
  type: WisbObjectType
  phrase: string
}

export interface Props {
  visible: boolean;
  onDismiss: () => void;
  onItemSelected: (item: WisbWasteland | WisbEvent | WisbDumpster) => void;
  onPlaceSelected: (place: SimplePlace) => void
  query: Query
  googleMapsApiKey: string
  userLocation: LatLng
  currentUser: WisbUser
}

export default function ListDialog({ visible, onDismiss, onItemSelected, query, googleMapsApiKey, userLocation, onPlaceSelected, currentUser }: Props) {
  return (
    <Dialog
      onDismiss={onDismiss}
      animationDuration={300}
      visible={visible}
      backdropStyle={styles.backdropStyle}
      position={Position.Bottom}
      dialogStyle={styles.dialogStyle}
      dismissOnBackdropPress={false}>
      <View style={styles.container}>
        <LocationsList
          userLocation={userLocation}
          maxNrOfPlaces={3}
          phrase={query.phrase}
          style={{ width: "100%", backgroundColor: "white", height: "100%" }}
          apiKey={googleMapsApiKey}
          onSelected={onPlaceSelected} />

        <ObjectsList
          type={query.type}
          multi={false}
          onPressed={(item: WisbEvent | WisbWasteland | WisbDumpster | WisbUser) => {
            if (!isUser(item)) {
              onItemSelected(item)
            }
          }}
          phrase={query.phrase}
          currentUser={currentUser}
          googleMapsAPIKey={googleMapsApiKey} />
      </View>
    </Dialog>
  );
}

const styles = StyleSheet.create({
  dialogStyle: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    top: 140,
    bottom: 0,
    height: Dimensions.get("screen").height - 140,
    backgroundColor: res.getColors().White,
    justifyContent: "space-between",
    width: "100%",
    flexDirection: "column"
  },
  container: {
    flex: 1
  },
  backdropStyle: {
    backgroundColor: undefined
  },
  dismissButton: {
    marginBottom: 5
  }
})
