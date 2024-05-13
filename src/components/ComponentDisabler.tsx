import React, { Component } from "react";
import {
  Animated,
  ViewStyle,
  TouchableOpacity
} from "react-native";

//properties provided to component
interface Props {
  enable: boolean;
  style?: ViewStyle | Array<ViewStyle | undefined>;
  disabledOpacity?: number;
  onPress?: () => void;
  onLongPress?: () => void;
}

interface State {
  opacity: Animated.Value;
}

export default class ComponentDisabler extends Component<Props, State> {
  disabledOpacity: number = 0.7;

  constructor(props: Props) {
    super(props);

    if (this.props.disabledOpacity != undefined)
      this.disabledOpacity = this.props.disabledOpacity;

    this.state = {
      opacity: new Animated.Value(this.props.enable ? 1 : this.disabledOpacity)
    };
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.disabledOpacity != undefined)
      this.disabledOpacity = this.props.disabledOpacity;

    if (prevProps.enable !== this.props.enable)
      Animated.timing(this.state.opacity, {
        toValue: this.props.enable ? 1 : this.disabledOpacity,
        duration: 600,
        useNativeDriver: false
      }).start();
  }

  render() {
    let { enable, style, onPress, onLongPress, children } = this.props;
    const { opacity } = this.state;

    return (
      <Animated.View
        pointerEvents={enable ? "auto" : "none"}
        style={[{ opacity: opacity }, style]}
      >
        {onPress ? (
          <TouchableOpacity onLongPress={onLongPress} onPress={onPress}>
            {children}
          </TouchableOpacity>
        ) : (
          children
        )}
      </Animated.View>
    );
  }
}
