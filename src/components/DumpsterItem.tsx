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
import Dumpster from '../API/data_types/Dumpster';
import { Resources } from '../../res/Resources';

interface Props {
  item: Dumpster;
  onPress: (item: Dumpster) => void
}

export default function DumpsterItem({ item, onPress }: Props) {
  return (
    <TouchableOpacity
      onPress={()=>onPress(item)}
      activeOpacity={0.6}
      style={{
        flex: 1,
        backgroundColor: Resources.Colors.Primary,
        marginVertical: 10,
        minHeight: 120,
        marginHorizontal: 16,
        borderRadius: 10,
        justifyContent: 'space-between',

        shadowColor: '#000',
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
                justifyContent: 'center',
                alignItems: 'center',
              }}>

            </View>
            <Text
              numberOfLines={1}
              style={{
                color: 'black',
                marginLeft: 8,
                fontWeight: 'bold',
                fontSize: 16,
              }}>
              {item.description}
            </Text>
          </View>
        </View>

        <Text
          style={{
            color: 'black',
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