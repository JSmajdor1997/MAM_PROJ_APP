import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  ViewStyle
} from 'react-native';
import FastImage from 'react-native-fast-image';
import Resources from '../../res/Resources';

const res = Resources.get()

interface Props {
  size: number;
  fontSize: number;
  username: string;
  image?: string | undefined;
  style?: ViewStyle;
  onPress?: () => void;
  colors: string[]
}

function getInitials(username: string) {
  const splittedWords = username.split(' ');

  if (splittedWords && splittedWords[0] != null && splittedWords[1] != null) {
    const firstLetter = splittedWords[0][0] || '';
    const secondLetter = splittedWords[1][0] || '';

    return firstLetter.toUpperCase() + secondLetter.toUpperCase();
  } else if (splittedWords[0] != null) {
    return splittedWords[0][0]
  }

  return '';
}

function getHashColor(colors: string[], str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  return colors[Math.abs(hash % colors.length)];
}

export default function Avatar({ colors, onPress, size, fontSize, image, style, username }: Props) {
  return (
    <TouchableOpacity
      disabled={!onPress}
      onPress={onPress}
      activeOpacity={0.7}
      style={[
        styles.container,
        {
          ...style,
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: getHashColor(colors, username),
        },
      ]}>
      {image == null || image == '' ? (
        <Text
          style={{
            ...styles.initialsText,
            fontSize: fontSize,
            fontFamily: res.getFonts().Secondary
          }}>
          {getInitials(username)}
        </Text>
      ) : (
        <FastImage
          style={{
            ...styles.image,
            borderRadius: size / 2,
          }}
          source={{ uri: image! }}
        />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: res.getColors().Black,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.34,
    shadowRadius: 3,

    elevation: 10,
  },
  initialsText: {
    color: res.getColors().White,
    fontWeight: 'bold',
  },
  image: {
    width: '100%',
    height: '100%',
  }
});
