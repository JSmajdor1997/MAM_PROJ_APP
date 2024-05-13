import React, {Fragment} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  Image,
  TouchableOpacity,
} from 'react-native';
import FastImage from 'react-native-fast-image';

interface Props {
  size: any;
  fontSize: any;
  username: string;
  image?: string | undefined;
  style?: ViewStyle;
  onPress?: () => void;
}

function getInitials(username: string) {
  const splittedWords = username.split(' ');

  if (splittedWords && splittedWords[0] && splittedWords[1]) {
    const firstLetter = splittedWords[0][0] || '';
    const secondLetter = splittedWords[1][0] || '';

    return firstLetter.toUpperCase() + secondLetter.toUpperCase();
  }

  return '';
}

function getHashColor(str: string) {
  const colors = [
    '#4caf50',
    '#ff9800',
    '#ffc107',
    '#607d8b',
    '#3f51b5',
    '#673ab7',
    '#ad1457',
  ];

  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  return colors[Math.abs(hash % colors.length)];
}

export default function Avatar(props: Props) {
  return (
    <TouchableOpacity
      disabled={!props.onPress}
      onPress={props.onPress}
      activeOpacity={0.7}
      style={[
        styles.container,
        {
          ...props.style,
          width: props.size,
          height: props.size,
          borderRadius: props.size / 2,
          backgroundColor: getHashColor(props.username),
        },
      ]}>
      {props.image == null || props.image == '' ? (
        <Text
          style={{
            color: 'white',
            fontSize: props.fontSize,
            fontWeight: 'bold',
          }}>
          {getInitials(props.username)}
        </Text>
      ) : (
        <FastImage
          style={{
            width: '100%',
            height: '100%',
            borderRadius: props.size / 2,
          }}
          source={{uri: props.image!}}
        />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 1,

    elevation: 10,
  },
});
