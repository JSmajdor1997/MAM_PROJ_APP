import { faCalendarAlt, faMapPin, faUnlock } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { Neomorph } from 'react-native-neomorph-shadows-fixes';
import Resources from '../../res/Resources';
import { WisbEvent } from '../API/interfaces';
import IconType from './WisbIcon/IconType';
import WisbIcon from './WisbIcon/WisbIcon';

const res = Resources.get()

interface Props {
  item: WisbEvent;
  onOpen: (item: WisbEvent) => void
  isAdmin: boolean
  widthCoeff: number
}

function EventItem({ item, onOpen, isAdmin, widthCoeff }: Props) {
  return (
    <TouchableOpacity
      activeOpacity={0.6}
      onPress={() => onOpen(item)}
      style={styles.root}>
      <Neomorph
        style={{
          shadowRadius: 10,
          borderRadius: 15,
          backgroundColor: '#DDDDDD',
          width: Dimensions.get("window").width * widthCoeff,
          height: 150,
          overflow: "hidden",
          flexDirection: "column"
        }}
      >
        <View style={styles.imageContainer}>
          {
            item.iconUrl
              ? <FastImage
                style={styles.image}
                resizeMode="cover"
                source={{
                  uri: item.iconUrl,
                }}
              />
              : <WisbIcon size={22} icon={IconType.Earth} />
          }

          <View style={styles.mapPinContainer}>
            <FontAwesomeIcon icon={faMapPin} size={10} />
            <Text style={styles.mapPinText}>{item.place.asText}</Text>
          </View>

          {isAdmin ? (
            <View style={styles.adminContainer}>
              <FontAwesomeIcon icon={faUnlock} size={10} color={res.getColors().Red} />
              <Text style={styles.adminText}>jesteś administratorem</Text>
            </View>
          ) : null}
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.eventName} numberOfLines={1} ellipsizeMode="tail">{item.name}</Text>

          <View style={styles.dateContainer}>
            <Text style={styles.dateText}>{item.dateRange[0].toLocaleDateString(res.getLocale(), { year: "numeric", month: "long", day: "2-digit" })}</Text>
            <FontAwesomeIcon icon={faCalendarAlt} size={10} color={res.getColors().DarkBeige} />
          </View>
        </View>
      </Neomorph>
    </TouchableOpacity>
  );
}

export default React.memo(EventItem)

const styles = StyleSheet.create({
  root: {
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 10,
    justifyContent: 'space-between',

    shadowColor: res.getColors().Black,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
  imageContainer: {
    flex: 1
  },
  image: {
    flex: 1
  },
  mapPinContainer: {
    position: "absolute",
    borderRadius: 15,
    padding: 3,
    flexDirection: "row",
    bottom: 10,
    left: 10,
    backgroundColor: "white",
    alignItems: "center"
  },
  mapPinText: {
    fontSize: 8,
    marginLeft: 5,
    fontWeight: '500',
    fontFamily: res.getFonts().Secondary
  },
  adminContainer: {
    position: "absolute",
    borderRadius: 15,
    padding: 3,
    flexDirection: "row",
    top: 10,
    right: 10,
    backgroundColor: "white",
    alignItems: "center"
  },
  adminText: {
    fontSize: 8,
    marginLeft: 5,
    fontWeight: '900',
    letterSpacing: 1,
    color: res.getColors().Red,
    fontFamily: res.getFonts().Secondary
  },
  infoContainer: {
    height: 40,
    width: "100%",
    backgroundColor: "white",
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10
  },
  eventName: {
    letterSpacing: 1,
    flex: 1,
    fontWeight: '400',
    fontSize: 14,
    textTransform: "capitalize",
    fontFamily: res.getFonts().Secondary
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 5
  },
  dateText: {
    fontSize: 8,
    marginRight: 5,
    fontWeight: '500',
    fontFamily: res.getFonts().Secondary
  }
})
