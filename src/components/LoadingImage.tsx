import React, { Component } from 'react';
import FastImage from 'react-native-fast-image';
import Spinner from 'react-native-spinkit';
import { ImageStyle } from 'react-native';
import { Resources } from '../../res/Resources';

interface Props {
  isLoading: boolean;
  image: string;
  style?: ImageStyle
}

interface State {}

export default class LoadingImage extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    return this.props.isLoading ? (
      <Spinner type="Circle" color={Resources.Colors.Primary} size={20} />
    ) : (
      <FastImage
        style={this.props.style as any}
        resizeMode="cover"
        source={{
          uri: this.props.image,
        }}
      />
    );
  }
}
