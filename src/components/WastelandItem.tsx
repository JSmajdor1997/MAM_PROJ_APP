import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Resources from '../../res/Resources';
import { faImage, faMapPin } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { GoogleStaticMapNext } from 'react-native-google-static-map-next';
import { Neomorph } from 'react-native-neomorph-shadows-fixes';
import FastImage from 'react-native-fast-image';
import WisbIcon from './WisbIcon/WisbIcon';
import IconType from './WisbIcon/IconType';
import { WisbWasteland } from '../API/interfaces';

const res = Resources.get()

interface Props {
  item: WisbWasteland;
  onOpen: (item: WisbWasteland) => void
  widthCoeff: number
}

function WastelandItem({ item, onOpen, widthCoeff }: Props) {
  return (
    <TouchableOpacity
      onPress={() => onOpen(item)}
      activeOpacity={0.6}
      style={[styles.root, item.afterCleaningData == null ? { opacity: 1 } : { opacity: 0.3, shadowOpacity: 0 }]}>
      <Neomorph
        style={{
          shadowRadius: 10,
          borderRadius: 15,
          backgroundColor: res.getColors().Primary,
          width: Dimensions.get("window").width * widthCoeff,
          height: 150,
          overflow: "hidden",
          flexDirection: "row",
        }}
      >
        <View style={{
          height: "100%",
          aspectRatio: 1,
        }}>
          <FastImage
            style={{
              flex: 1
            }}
            source={{ uri: item.photos[0] }}
          />

          <View style={{ position: "absolute", right: 10, bottom: 10, backgroundColor: "white", borderRadius: 10, padding: 5, flexDirection: "row", alignItems: "center" }}>
            <Text style={{ marginRight: 10, fontWeight: "bold", fontSize: 10 }}>{item.photos.length}</Text>
            <FontAwesomeIcon icon={faImage} size={12} />
          </View>
        </View>

        <View style={{ flex: 1, flexDirection: "column", padding: 5 }}>
          <Text style={{ fontSize: 14, flex: 1, fontFamily: "Avenir", fontWeight: "900", letterSpacing: 1, textAlign: "right", marginTop: 10, marginRight: 10 }}>{item.description}</Text>

          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={{ fontSize: 8, marginRight: 5, fontWeight: 500 }}>{item.place.asText}</Text>
            <FontAwesomeIcon icon={faMapPin} size={10} color={res.getColors().Red} />
          </View>
        </View>

        {item.afterCleaningData == null ? null : <View style={{ justifyContent: "center", flexDirection: "row", alignItems: "center", position: "absolute", width: "100%", backgroundColor: "white", height: 20, top: 65, transformOrigin: "center center", transform: [{ rotate: "22deg" }, { scale: 1.2 }] }}>
          <WisbIcon icon={IconType.Broom} size={10} />
          <Text style={{ fontFamily: "Avenir", letterSpacing: 1, fontWeight: 400, marginHorizontal: 10 }}>Posprzątane!</Text>
          <WisbIcon icon={IconType.Broom} size={10} />
        </View>}
      </Neomorph>
    </TouchableOpacity>
  );
}

export default React.memo(WastelandItem)

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
  }
})