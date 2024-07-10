import React, { Component } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  Alert,
  StatusBar,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCalendarAlt, faMessage } from '@fortawesome/free-regular-svg-icons';
import Resources from '../../res/Resources';
import { GoogleStaticMapNext } from 'react-native-google-static-map-next';
import { Neomorph } from 'react-native-neomorph-shadows-fixes';
import { faMapPin } from '@fortawesome/free-solid-svg-icons';
import { WisbDumpster } from '../API/interfaces';

interface Props {
  item: WisbDumpster;
  onOpen: (item: WisbDumpster) => void
  googleMapsAPIKey: string
  widthCoeff: number
}

function DumpsterItem({ item, onOpen, googleMapsAPIKey, widthCoeff }: Props) {
  return (
    <TouchableOpacity
      onPress={() => onOpen(item)}
      activeOpacity={0.6}
      style={styles.root}>
      <Neomorph
        style={{
          shadowRadius: 10,
          borderRadius: 15,
          backgroundColor: Resources.get().getColors().Primary,
          width: Dimensions.get("window").width * widthCoeff,
          height: 150,
          overflow: "hidden",
          flexDirection: "row"
        }}
      >
        <GoogleStaticMapNext
          style={{
            height: "100%",
            aspectRatio: 1
          }}
          mapType='hybrid'
          zoom={18}
          location={{
            latitude: item.place.coords.latitude.toString(),
            longitude: item.place.coords.longitude.toString()
          }}
          size={{ width: 400, height: 400 }}
          apiKey={googleMapsAPIKey}
        />

        <View style={{ flex: 1, flexDirection: "column", padding: 5 }}>
          <Text style={{ flex: 1, fontSize: 14, fontFamily: "Avenir", fontWeight: "900", letterSpacing: 1, textAlign: "right", marginTop: 10, marginRight: 10 }}>{item.description}</Text>

          <View style={{flexDirection: "row", justifyContent: "space-between"}}>
            <Text style={{ fontSize: 8, marginRight: 5, fontWeight: 500 }}>{item.place.asText}</Text>
            <FontAwesomeIcon icon={faMapPin} size={10} color={Resources.get().getColors().Red} />
          </View>
        </View>
      </Neomorph>
    </TouchableOpacity>
  );
}

export default React.memo(DumpsterItem)

const styles = StyleSheet.create({
  root: {
    flex: 1,
    marginVertical: 10,
    minHeight: 120,
    marginHorizontal: 16,
    borderRadius: 10,
    justifyContent: 'space-between',

    shadowColor: Resources.get().getColors().Black,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,

    elevation: 5,
  }
})