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
import { MenuItem, Menu } from 'react-native-material-menu';
import FastImage from 'react-native-fast-image';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import WisbIcon from './WisbIcon/WisbIcon';
import { faCalendar, faCalendarAlt, faCrown, faMapPin, faMobileRetro } from '@fortawesome/free-solid-svg-icons';
import { faMessage } from '@fortawesome/free-regular-svg-icons';
import Event from '../API/data_types/Event';
import Resources from '../../res/Resources';
import IconType from './WisbIcon/IconType';
import { Neomorph } from 'react-native-neomorph-shadows-fixes';

interface Props {
  item: Event;
  onPress: (item: Event) => void
}

function EventItem({ item, onPress }: Props) {
  return (
    <TouchableOpacity
      activeOpacity={0.6}
      onPress={() => onPress(item)}
      style={styles.root}>
      <Neomorph
        //inner // <- enable shadow inside of neomorph
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

          <View style={{position: "absolute", borderRadius: 15, padding: 3, flexDirection: "row", bottom: 10, left: 10, backgroundColor: "white", alignItems: "center"}}>
            <FontAwesomeIcon icon={faMapPin} size={10}/>
            <Text style={{fontSize: 8, marginLeft: 5, fontWeight: 500}}>{item.meetPlace.asText}</Text>
          </View>

          <Neomorph
            inner
            style={{
              shadowRadius: 10,
              borderRadius: 100,
              backgroundColor: Resources.get().getColors().Lime,
              width: 40,
              height: 40,
              overflow: "hidden",
              position: "absolute",
              justifyContent: 'center',
              alignItems: "center",
              right: 10,
              top: "35%"
            }}
          >
            <FontAwesomeIcon color={Resources.get().getColors().White} icon={faMessage} />

          </Neomorph>
        </View>

        <View style={{ height: 40, width: "100%", backgroundColor: "white", justifyContent: "space-between", flexDirection: "row", alignItems: "center", paddingHorizontal: 10 }}>
          <Text style={{ letterSpacing: 1, fontWeight: "400", fontSize: 14, textTransform: "capitalize" }}>{item.name}</Text>

          <View style={{flexDirection: "row", alignItems: "center"}}>
            <Text style={{fontSize: 8, marginRight: 5, fontWeight: 500}}>{item.dateRange[0].toLocaleDateString(Resources.get().getLocale(), {year: "numeric", month: "long", day: "2-digit"})}</Text>
            <FontAwesomeIcon icon={faCalendarAlt} size={10} color={Resources.get().getColors().DarkBeige}/>
          </View>
        </View>

        {/* <View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 6,
            marginHorizontal: 6,
          }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View
              style={{
                height: 39,
                width: 39,
                borderRadius: 50,
                backgroundColor: "red",
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              {
                item.iconUrl
                  ? <FastImage
                    style={{
                      height: item.iconUrl ? 36 : 26,
                      width: "100%",
                      // borderRadius: item.iconUrl ? 50 : 0,
                    }}
                    resizeMode="cover"
                    source={{
                      uri: item.iconUrl,
                    }}
                  />
                  : <WisbIcon size={22} icon={IconType.Earth} />
              }
            </View>
            <Text
              numberOfLines={1}
              style={{
                color: Resources.get().getColors().Black,
                marginLeft: 8,
                fontWeight: 'bold',
                fontSize: 16,
              }}>
              {item.name}
            </Text>
          </View>
        </View>

        <Text
          style={{
            color: Resources.get().getColors().Black,
            marginLeft: 52,
            marginRight: 40,
            marginTop: 5,
          }}
          numberOfLines={2}>
          {item.description}
        </Text>
      </View>


      </View> */}
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