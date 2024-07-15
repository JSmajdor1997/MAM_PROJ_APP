import { faMapPin } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { GoogleStaticMapNext } from 'react-native-google-static-map-next';
import { Neomorph } from 'react-native-neomorph-shadows-fixes';
import Resources from '../../res/Resources';
import { WisbDumpster } from '../API/interfaces';

const res = Resources.get()

interface Props {
  item: WisbDumpster;
  onPress: (item: WisbDumpster) => void
  googleMapsAPIKey: string
  widthCoeff: number
}

function DumpsterItem({ item, onPress, googleMapsAPIKey, widthCoeff }: Props) {
  return (
    <TouchableOpacity
      onPress={() => onPress(item)}
      activeOpacity={0.6}
      style={styles.root}>
      <Neomorph
        style={{
          shadowRadius: 10,
          borderRadius: 15,
          backgroundColor: res.getColors().Primary,
          width: Dimensions.get("window").width * widthCoeff,
          height: 150,
          overflow: "hidden",
          flexDirection: "row"
        }}
      >
        <GoogleStaticMapNext
          style={styles.map}
          mapType='hybrid'
          zoom={18}
          location={{
            latitude: item.place.coords.latitude.toString(),
            longitude: item.place.coords.longitude.toString()
          }}
          size={{ width: 400, height: 400 }}
          apiKey={googleMapsAPIKey}
        />

        <View style={styles.infoContainer}>
          <Text style={styles.description}>{item.description}</Text>

          <View style={styles.locationContainer}>
            <Text style={styles.locationText}>{item.place.asText}</Text>
            <FontAwesomeIcon icon={faMapPin} size={10} color={res.getColors().Red} />
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

    shadowColor: res.getColors().Black,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,

    elevation: 5,
  },
  map: {
    height: "100%",
    aspectRatio: 1
  },
  infoContainer: {
    flex: 1,
    flexDirection: "column",
    padding: 5
  },
  description: {
    flex: 1,
    fontSize: 14,
    fontFamily: res.getFonts().Secondary,
    fontWeight: "900",
    letterSpacing: 1,
    textAlign: "right",
    marginTop: 10,
    marginRight: 10
  },
  locationContainer: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  locationText: {
    fontSize: 8,
    marginRight: 5,
    fontWeight: '500',
    fontFamily: res.getFonts().Secondary
  }
})
