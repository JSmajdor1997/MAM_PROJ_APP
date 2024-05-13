import React, {Component, ReactElement, Fragment} from 'react';
import {
  View,
  TouchableOpacity,
  ViewStyle,
  Text,
  StyleSheet,
  FlatList,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import ImagesPicker from './ImagesPicker';
import { Icon } from '@rneui/base';

interface Props {
  containerStyle?: ViewStyle;
  images: Array<{image: string; ID: number}>;
  onImagesChanged: (image: Array<{image: string; ID: number}>) => void;
  readonly: boolean;
}

interface State {
  isImagesPickerVisible: boolean;
}

export default class ImagesList extends Component<Props, State> {
  private list: FlatList<{image: string; ID: number}> | null = null;

  constructor(props: Props) {
    super(props);

    this.state = {
      isImagesPickerVisible: false,
    };
  }

  private renderAddingButton(): ReactElement | null {
    const {readonly} = this.props;

    if (readonly) {
      return null;
    } else {
      return (
        <TouchableOpacity
          onPress={() => {
            this.setState({isImagesPickerVisible: true});
          }}
          style={{
            aspectRatio: 1,
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            opacity: 0.3,
            borderWidth: 2,            
          }}>
          <Icon type="material" name="add" />
        </TouchableOpacity>
      );
    }
  }

  render() {
    const {isImagesPickerVisible} = this.state;
    const {containerStyle, readonly} = this.props;

    return (
      <Fragment>
        <FlatList
          ref={ref => (this.list = ref)}
          style={containerStyle}
          data={this.props.images}
          renderItem={item => (
            <TouchableOpacity style={{flex: 1, aspectRatio: 1}}>
              <FastImage
                resizeMode="cover"
                style={{
                  flex: 1,
                  aspectRatio: 1,
                }}
                source={{
                  uri: item.item.image,
                }}
              />
              {!readonly && (
                <TouchableOpacity
                  onPress={() => {
                    this.props.onImagesChanged(
                      this.props.images.filter(it => it.ID != item.item.ID),
                    );
                  }}
                  style={{
                    position: 'absolute',
                    opacity: 0.68,
                    right: 0,
                    top: 0,
                  }}>
                  <Icon
                    type="material"
                    name="close"
                    color="white"
                    reverse
                    reverseColor={'black'}
                    size={8}
                  />
                </TouchableOpacity>
              )}
            </TouchableOpacity>
          )}
          ListFooterComponentStyle={{padding: 4}}
          ListFooterComponent={this.renderAddingButton.bind(this)}
        />
        <ImagesPicker
          onDismiss={() => this.setState({isImagesPickerVisible: false})}
          visible={isImagesPickerVisible}
          onImage={(base64, uri) => {
            if (base64 != undefined) {
              this.props.onImagesChanged(
                this.props.images.concat([
                  {
                    image: 'data:image/jpeg;base64,' + base64,
                    ID: Math.random()*100,
                  },
                ]),
              );

              this.list && this.list.scrollToEnd();
            }
          }}
        />
      </Fragment>
    );
  }
}
