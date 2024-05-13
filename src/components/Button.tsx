import React, {Component, ReactElement} from 'react';
import {View, Text} from 'react-native';
import Ripple from 'react-native-material-ripple';
import Spinner from 'react-native-spinkit';

interface Props {
  icon: ReactElement;
  label?: string;
  backgroundColor: string;
  onPress: () => void;
  isLoading: boolean;
  size?: number;
}

interface State {}

export default class Button extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {};
  }

  render() {
    const {icon, label, backgroundColor, onPress, isLoading, size} = this.props;

    return (
      <View style={{justifyContent: 'center', alignItems: 'center'}}>
        <Ripple
          rippleCentered={true}
          rippleSize={45}
          disabled={isLoading}
          onPress={onPress}
          style={{
            aspectRatio: 1,
            width: size || 54,
            backgroundColor,
            borderRadius: 50,
            justifyContent: 'center',
            alignItems: 'center',

            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 5,
            },
            shadowOpacity: 1,
            shadowRadius: 16,

            elevation: 20,
          }}>
          {isLoading ? <Spinner type="FadingCircleAlt" color="white" /> : icon}
        </Ripple>
        {label && label != '' ? (
          <View
            style={{
              width: '100%',
              backgroundColor: 'white',
              paddingHorizontal: 5,
              paddingVertical: 3,
              borderRadius: 5,
              marginTop: 8,

              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 5,
              },
              shadowOpacity: 1,
              shadowRadius: 16,

              elevation: 20,
            }}>
            <Text style={{textAlign: 'center'}}>{label}</Text>
          </View>
        ) : null}
      </View>
    );
  }
}
