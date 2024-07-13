import { faImage, faMapPin } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { Neomorph } from 'react-native-neomorph-shadows-fixes';
import Resources from '../../res/Resources';
import { WisbWasteland } from '../API/interfaces';
import IconType from './WisbIcon/IconType';
import WisbIcon from './WisbIcon/WisbIcon';

const res = Resources.get();

interface Props {
  item: WisbWasteland;
  onOpen: (item: WisbWasteland) => void;
  widthCoeff: number;
}

const WastelandItem: React.FC<Props> = ({ item, onOpen, widthCoeff }) => {
  return (
    <TouchableOpacity
      onPress={() => onOpen(item)}
      activeOpacity={0.6}
      style={[
        styles.root,
        item.afterCleaningData == null ? styles.activeItem : styles.inactiveItem
      ]}
    >
      <Neomorph
        style={{
          shadowRadius: 10,
          borderRadius: 15,
          backgroundColor: res.getColors().Primary,
          height: 150,
          overflow: "hidden",
          flexDirection: "row",
          width: Dimensions.get("window").width * widthCoeff,
        }}
      >
        <View style={styles.imageContainer}>
          <FastImage
            style={styles.image}
            source={{ uri: item.photos[0] }}
          />
          <View style={styles.imageOverlay}>
            <Text style={styles.imageCount}>{item.photos.length}</Text>
            <FontAwesomeIcon icon={faImage} size={12} />
          </View>
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.description}>{item.description}</Text>
          <View style={styles.locationContainer}>
            <Text style={styles.locationText}>{item.place.asText}</Text>
            <FontAwesomeIcon icon={faMapPin} size={10} color={res.getColors().Red} />
          </View>
        </View>

        {item.afterCleaningData != null && (
          <View style={styles.cleanedBanner}>
            <WisbIcon icon={IconType.Broom} size={10} />
            <Text style={styles.cleanedText}>Posprzątane!</Text>
            <WisbIcon icon={IconType.Broom} size={10} />
          </View>
        )}
      </Neomorph>
    </TouchableOpacity>
  );
}

export default React.memo(WastelandItem);

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
  activeItem: {
    opacity: 1,
  },
  inactiveItem: {
    opacity: 0.3,
    shadowOpacity: 0,
  },
  imageContainer: {
    height: "100%",
    aspectRatio: 1,
  },
  image: {
    flex: 1,
  },
  imageOverlay: {
    position: "absolute",
    right: 10,
    bottom: 10,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  imageCount: {
    marginRight: 10,
    fontWeight: "bold",
    fontSize: 10,
  },
  textContainer: {
    flex: 1,
    flexDirection: "column",
    padding: 5,
  },
  description: {
    fontSize: 14,
    flex: 1,
    fontFamily: "Avenir",
    fontWeight: "900",
    letterSpacing: 1,
    textAlign: "right",
    marginTop: 10,
    marginRight: 10,
  },
  locationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  locationText: {
    fontSize: 8,
    marginRight: 5,
    fontWeight: "500",
  },
  cleanedBanner: {
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    width: "100%",
    backgroundColor: "white",
    height: 20,
    top: 65,
    transformOrigin: "center center",
    transform: [{ rotate: "22deg" }, { scale: 1.2 }],
  },
  cleanedText: {
    fontFamily: "Avenir",
    letterSpacing: 1,
    fontWeight: "400",
    marginHorizontal: 10,
  },
});
