import React, {Component} from 'react';
import {
  StyleSheet,
  ViewStyle,
  Animated,
  Dimensions,
  StatusBar,
  ViewProps,
  Modal
} from 'react-native';;

interface Props {
  visible: boolean;
  onDismiss?: () => void;
  onPositive?: () => void;
  onNegative?: () => void;
  backdropOpacity?: number;
  positiveLabel?: string;
  negativeLabel?: string;
  labelsColor?: string;
  dialogStyle?: ViewStyle;
  shakingOffset?: number;
  shakingDuration?: number;
  containerProps?: ViewProps;
}

interface State {
  visible: boolean;
  shakeOffset: Animated.Value;
}

export default class ShakyDialog extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      visible: this.props.visible,
      shakeOffset: new Animated.Value(0),
    };
  }

  static getDerivedStateFromProps(nextProps: Props, prevState: Props) {
    return nextProps;
  }

  componentWillUnmount() {
    this.state.shakeOffset.stopAnimation();
  }

  shake() {
    const duration = this.props.shakingDuration || 15;
    const maxOffset = this.props.shakingOffset || 2;

    Animated.loop(
      Animated.sequence([
        Animated.timing(this.state.shakeOffset, {
          toValue: maxOffset,
          duration: duration,
          useNativeDriver: false
        }),
        Animated.timing(this.state.shakeOffset, {
          toValue: -maxOffset,
          duration: 2 * duration,
          useNativeDriver: false
        }),
      ]),
      {
        iterations: 3,
      },
    ).start();
  }

  render() {
    const backdropOpacity =
      this.props.backdropOpacity == null ? 0.5 : this.props.backdropOpacity;
    const positiveLabel = this.props.positiveLabel || 'OK';
    const negativeLabel = this.props.negativeLabel || 'CANCEL';

    const labelsColor = this.props.labelsColor || 'black';

    const {onNegative, onPositive} = this.props;
    const {left, right} = this.state;

    return (
      <Modal
        deviceHeight={Dimensions.get('screen').height}
        deviceWidth={Dimensions.get('screen').width}
        isVisible={this.state.visible}
        onBackdropPress={this.props.onDismiss}
        backdropOpacity={backdropOpacity}>
        <Animated.View
          {...this.props.containerProps}
          style={[
            {
              top: StatusBar.currentHeight,
              bottom: 0,
              position: 'absolute',
              backgroundColor: 'white',
              borderRadius: 10,
              overflow: 'hidden',
              translateX: left,
            },
            this.props.dialogStyle,
          ]}>
          {this.props.children}
        </Animated.View>
      </Modal>
    );
  }
}