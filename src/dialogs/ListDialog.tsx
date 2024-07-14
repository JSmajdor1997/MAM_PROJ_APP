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
import LocationsList from '../components/lists/LocationsList';
import ObjectsList from '../components/lists/ObjectsList';
import Dialog, { Position } from './Dialog';

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
        <ObjectsList
          ListHeaderComponent={(
            <LocationsList
              userLocation={userLocation}
              maxNrOfPlaces={4}
              phrase={query.phrase}
              style={{ width: "100%", height: 150, maxHeight: 150 }}
              apiKey={googleMapsApiKey}
              onSelected={onPlaceSelected} />
          )}
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
    borderRadius: 25,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    overflow: "hidden",
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
