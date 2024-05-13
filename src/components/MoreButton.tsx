import React from 'react';
import {View, TouchableOpacity, ViewStyle} from 'react-native';

interface Props {
  onPress: () => void;
  color?: string;
  style?: ViewStyle;
}

export default (props: Props) => (
  <TouchableOpacity
    onPress={props.onPress}
    style={[
      {
        paddingHorizontal: 4,
        marginRight: 6,
        alignItems: 'center',
      },
      props.style,
    ]}>
    <View
      style={{
        aspectRatio: 1,
        borderRadius: 50,
        width: 5,
        backgroundColor: props.color,
      }}
    />
    <View
      style={{
        aspectRatio: 1,
        borderRadius: 50,
        width: 5,
        backgroundColor: props.color,
        marginTop: 2,
      }}
    />
    <View
      style={{
        aspectRatio: 1,
        borderRadius: 50,
        width: 5,
        backgroundColor: props.color,
        marginTop: 2,
      }}
    />
  </TouchableOpacity>
);
