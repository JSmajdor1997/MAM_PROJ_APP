import React, { Component } from 'react';
import {
  StyleSheet,
  ViewStyle,
  Animated,
  Dimensions,
  StatusBar,
  ViewProps,
  Modal,
  View,
  TouchableHighlight,
  Text,
  TouchableWithoutFeedback,
  SafeAreaView,
  TouchableOpacity,
  Pressable
} from 'react-native';

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
  children: React.ReactNode
}

interface State {
  shakeOffset: Animated.Value;
}

export default class ShakyDialog extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
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
    const { onDismiss } = this.props;
    const { shakeOffset } = this.state;

    return (
      <Modal
        animationType='slide'
        transparent
        visible={this.props.visible}
        onDismiss={onDismiss}>

        <Pressable
          style={{ height: "100%", display: "flex" }}
          onPress={onDismiss} >
          <SafeAreaView style={{ backgroundColor: "#00000055", flex: 1, justifyContent: "flex-end", alignItems: "center" }}>
            <Animated.View
              onStartShouldSetResponder={(event) => true}
              onTouchEnd={(e) => {
                e.stopPropagation();
              }}
              style={[
                {
                  transform: [
                    { translateX: shakeOffset }
                  ],
                  minWidth: 50,
                  minHeight: 50,
                  width: "100%",
                  height: "95%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "white",
                  borderTopLeftRadius: 15,
                  borderTopRightRadius: 15,
                  overflow: "hidden",
                }
              ]}>
              {this.props.children}
            </Animated.View>
          </SafeAreaView>
        </Pressable>
      </Modal >
    );
  }
}