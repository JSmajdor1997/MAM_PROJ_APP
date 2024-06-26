import React, { Component } from 'react';
import FastImage, { ImageStyle } from 'react-native-fast-image';
import Spinner from 'react-native-spinkit';
import Resources from '../../res/Resources';

interface Props {
  isLoading: boolean;
  image: string;
  style?: ImageStyle
}

export default function LoadingImage({ isLoading, image, style }: Props) {
  return isLoading ? (
    <Spinner type="Circle" color={Resources.get().getColors().Primary} size={20} />
  ) : (
    <FastImage
      style={style}
      resizeMode="cover"
      source={{
        uri: image,
      }}
    />
  );
}