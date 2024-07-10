import React from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Resources from '../../res/Resources';
import Dialog, { Position } from './Dialog';
import { Place } from '../utils/GooglePlacesAPI/searchPlaces';
import { LatLng } from 'react-native-maps';
import ObjectsList from '../components/ObjectsList';
import WisbObjectType from '../API/WisbObjectType';
import { WisbWasteland, WisbEvent, WisbDumpster, WisbUser } from '../API/interfaces';
import { isUser } from '../API/type_guards';

export interface Query {
  type: WisbObjectType
  phrase: string
}

export interface Props {
  visible: boolean;
  onDismiss: () => void;
  onItemSelected: (item: WisbWasteland | WisbEvent | WisbDumpster) => void;
  onPlaceSelected: (place: Place) => void
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
      backdropStyle={{ backgroundColor: undefined }}
      position={Position.Bottom}
      dialogStyle={styles.dialogStyle}
      dismissOnBackdropPress={false}>
      <View style={{ flex: 1 }}>
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