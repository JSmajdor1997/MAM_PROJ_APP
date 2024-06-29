import React, { Component, Fragment } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  Alert,
  StatusBar,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { MenuItem, Menu } from 'react-native-material-menu';
import FastImage from 'react-native-fast-image';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import WisbIcon from './WisbIcon/WisbIcon';
import { faCalendar, faCalendarAlt, faCrown, faEdit, faMapPin, faMobileRetro, faUnlock } from '@fortawesome/free-solid-svg-icons';
import { faMessage } from '@fortawesome/free-regular-svg-icons';
import Event from '../API/data_types/Event';
import Resources from '../../res/Resources';
import IconType from './WisbIcon/IconType';
import { Neomorph } from 'react-native-neomorph-shadows-fixes';

interface Props {
  item: Event;
  onPress: (item: Event) => void
  isAdmin: boolean
}

function EventItem({ item, onPress, isAdmin }: Props) {
  return (
    <TouchableOpacity
      activeOpacity={0.6}
      onPress={() => onPress(item)}
      style={styles.root}>
      <Neomorph
        style={{
          shadowRadius: 10,
          borderRadius: 15,
          backgroundColor: '#DDDDDD',
          width: Dimensions.get("window").width * 0.9,
          height: 150,
          overflow: "hidden",
          flexDirection: "column"
        }}
      >

        <View style={{ flex: 1 }}>
          {
            item.iconUrl
              ? <FastImage
                style={{
                  flex: 1,
                }}
                resizeMode="cover"
                source={{
                  uri: item.iconUrl,
                }}
              />
              : <WisbIcon size={22} icon={IconType.Earth} />
          }

          <View style={{ position: "absolute", borderRadius: 15, padding: 3, flexDirection: "row", bottom: 10, left: 10, backgroundColor: "white", alignItems: "center" }}>
            <FontAwesomeIcon icon={faMapPin} size={10} />
            <Text style={{ fontSize: 8, marginLeft: 5, fontWeight: 500 }}>{item.meetPlace.asText}</Text>
          </View>

          {isAdmin ? (
            <Fragment>
              <View style={{ position: "absolute", borderRadius: 15, padding: 3, flexDirection: "row", top: 10, right: 10, backgroundColor: "white", alignItems: "center" }}>
                <FontAwesomeIcon icon={faUnlock} size={10} color={Resources.get().getColors().Red} />
                <Text style={{ fontSize: 8, marginLeft: 5, fontWeight: 900, letterSpacing: 1, color: Resources.get().getColors().Red }}>jesteś administratorem</Text>
              </View>

              <View style={{ position: "absolute", borderRadius: 15, padding: 10, flexDirection: "row", bottom: 10, right: 10, backgroundColor: "white", alignItems: "center" }}>
                <FontAwesomeIcon icon={faEdit} size={20} color={Resources.get().getColors().Red} />
              </View>
            </Fragment>
          ) : null}
        </View>

        <View style={{ height: 40, width: "100%", backgroundColor: "white", justifyContent: "space-between", flexDirection: "row", alignItems: "center", paddingHorizontal: 10 }}>
          <Text style={{ letterSpacing: 1, flex: 1, fontWeight: "400", fontSize: 14, textTransform: "capitalize" }} numberOfLines={1} ellipsizeMode="tail">{item.name}</Text>

          <View style={{ flexDirection: "row", alignItems: "center", marginLeft: 5 }}>
            <Text style={{ fontSize: 8, marginRight: 5, fontWeight: 500 }}>{item.dateRange[0].toLocaleDateString(Resources.get().getLocale(), { year: "numeric", month: "long", day: "2-digit" })}</Text>
            <FontAwesomeIcon icon={faCalendarAlt} size={10} color={Resources.get().getColors().DarkBeige} />
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

    shadowColor: Resources.get().getColors().Black,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 12,
  }
})