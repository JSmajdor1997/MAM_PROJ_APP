import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { clear_icon } from '../../res/icons/icons';

interface Props {
  item: any;
  onPress: (item: any) => void;
}

interface State {
  isExpanded: boolean;
}

export default class WastelandItem extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      isExpanded: false,
    };
  }

  formatDate(date: Date): string {
    const month = date.getUTCMonth() + 1; //months from 1-12
    const day = date.getUTCDate();
    const year = date.getUTCFullYear();

    return day + '.' + month + '.' + year;
  }

  render() {
    const {
      description,
      postedOn,
      placeName,
    } = this.props.item;
    return (
      <TouchableOpacity
        onPress={() => this.props.onPress(this.props.item)}
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
          <FastImage
            source={clear_icon}
            resizeMode="contain"
            style={{marginTop: 4, height: 30, width: 30}}
          />
        </View>
        <View style={{flex: 1, marginLeft: 8}}>
          <Text
            numberOfLines={1}
            style={{
              fontWeight: 'bold',
              fontSize: 14.5,
              maxWidth: '90%',
            }}>
            {placeName}
          </Text>
          <Text
            numberOfLines={1}
            style={{
              fontSize: 12,
              marginLeft: 4,
              maxWidth: '90%',
            }}>
            {description}
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
              {this.formatDate(postedOn)}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}
