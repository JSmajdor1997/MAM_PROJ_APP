import React from "react";
import { Animated, StyleSheet, TouchableOpacity, ViewStyle } from "react-native";
import Resources from "../../../res/Resources";

const res = Resources.get();

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export default function BubbleItem({ style, onPress, component, bubbleAnim }: { onPress: () => void, style: ViewStyle, component: React.ReactNode, bubbleAnim: Animated.Value }) {
  return (
    <AnimatedTouchable
      onPress={onPress}
      style={{
        bottom: bubbleAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 90],
        }),
        ...styles.root,
        ...style
      }}>
      {component}
    </AnimatedTouchable>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: res.getColors().White,
    width: 40,
    aspectRatio: 1,
    borderRadius: 50,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    shadowColor: res.getColors().Black,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.2,
    shadowRadius: 13.16,
    elevation: 8,
  }
});
