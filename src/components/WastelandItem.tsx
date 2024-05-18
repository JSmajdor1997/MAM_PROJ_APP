import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import Wasteland from '../API/data_types/Wasteland';
import { Resources } from '../../res/Resources';

interface Props {
  item: Wasteland;
  onPress: (item: Wasteland) => void
}

export default function WastelandItem({ item, onPress }: Props) {
  const [isExpanded, setIsExpanded] = React.useState(false)

  return (
    <TouchableOpacity
      onPress={() => onPress(item)}
      style={{
        padding: 8,
        flexDirection: 'row',
        alignItems: 'center',
      }}>
      <View
        style={{
          borderColor: '#ad374f',
          borderWidth: 1,
          borderRadius: 50,
          aspectRatio: 1,
          padding: 6,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
      </View>
      <View style={{ flex: 1, marginLeft: 8 }}>
        <Text
          numberOfLines={1}
          style={{
            fontWeight: 'bold',
            fontSize: 14.5,
            maxWidth: '90%',
          }}>
          {item.place.asText}
        </Text>
        <Text
          numberOfLines={1}
          style={{
            fontSize: 12,
            marginLeft: 4,
            maxWidth: '90%',
          }}>
          {item.description}
        </Text>

        <View
          style={{
            flexDirection: 'row',
            marginTop: 8,
            justifyContent: 'space-between',
            opacity: 0.2,
          }}>
          <Text
            style={{
              alignSelf: 'flex-end',
              fontSize: 12,
            }}>
            {item.creationDate.toLocaleDateString(Resources.Locale.LanguageCode, { year: "numeric", month: "short", day: "numeric" })}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}