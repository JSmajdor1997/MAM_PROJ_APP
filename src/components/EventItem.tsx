import React, { Component } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  Alert,
  StatusBar,
} from 'react-native';
import { MenuItem, Menu } from 'react-native-material-menu';
import FastImage from 'react-native-fast-image';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import WisbIcon, { IconType } from './WisbIcon';
import { faCrown, faMobileRetro } from '@fortawesome/free-solid-svg-icons';
import { faMessage } from '@fortawesome/free-regular-svg-icons';
import Event from '../API/data_types/Event';
import { Resources } from '../../res/Resources';

interface Props {
  item: Event;
  onPress: (item: Event) => void
}

function EventItem({ item, onPress }: Props) {
  return (
    <TouchableOpacity
      activeOpacity={0.6}
      onPress={() => onPress(item)}
      style={{
        flex: 1,
        backgroundColor: Resources.Colors.Primary,
        marginVertical: 10,
        minHeight: 120,
        marginHorizontal: 16,
        borderRadius: 10,
        justifyContent: 'space-between',

        shadowColor: Resources.Colors.Black,
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 12,

        elevation: 5,
      }}>
      <View>
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
                backgroundColor: item.iconUrl ? Resources.Colors.Black : Resources.Colors.White,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              {
                item.iconUrl
                  ? <FastImage
                    style={{
                      height: item.iconUrl ? 36 : 26,
                      width: item.iconUrl ? 36 : 26,
                      borderRadius: item.iconUrl ? 50 : 0,
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
                color: Resources.Colors.Black,
                marginLeft: 8,
                fontWeight: 'bold',
                fontSize: 16,
              }}>
              {item.name}
            </Text>
          </View>

          <Menu
            style={{ marginTop: StatusBar.currentHeight }}
            anchor={
              <TouchableOpacity
                style={{ marginRight: -6 }}>
                <FontAwesomeIcon color={Resources.Colors.White} icon={faMobileRetro} />
              </TouchableOpacity>
            }>
            <MenuItem
              onPress={() => {

              }}>
              Uczestnicy
            </MenuItem>
            <MenuItem
              onPress={() => {
              }}>
              Udostępnij
            </MenuItem>
            <MenuItem
              onPress={() => {
              }}>
              Edytuj
            </MenuItem>
          </Menu>
        </View>

        <Text
          style={{
            color: Resources.Colors.Black,
            marginLeft: 52,
            marginRight: 40,
            marginTop: 5,
          }}
          numberOfLines={2}>
          {item.description}
        </Text>
      </View>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginHorizontal: 6,
          marginBottom: 2,
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <TouchableOpacity
            style={{
              alignSelf: 'flex-start',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <FontAwesomeIcon color={Resources.Colors.White} icon={faMessage} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default React.memo(EventItem)