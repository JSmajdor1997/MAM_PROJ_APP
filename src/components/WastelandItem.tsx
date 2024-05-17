import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import Wasteland from '../API/data_types/Wasteland';

interface Props {
  item: Wasteland;
}

export default function WastelandItem({ item }: Props) {
  const [isExpanded, setIsExpanded] = React.useState(false)

  return (
    <TouchableOpacity
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
            {item.creationDate.toLocaleDateString("pl-PL", { year: "numeric", month: "short", day: "numeric" })}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}