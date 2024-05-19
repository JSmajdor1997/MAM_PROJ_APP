import React from "react";
import { ViewStyle, Animated, TouchableOpacity } from "react-native";
import Resources from "../../../res/Resources";

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
          ...style,
  
          backgroundColor: Resources.get().getColors().White,
          width: 40,
          aspectRatio: 1,
          borderRadius: 50,
          position: 'absolute',
          justifyContent: 'center',
          alignItems: 'center',
          alignSelf: 'center',
  
          shadowColor: Resources.get().getColors().Black,
          shadowOffset: {
            width: 0,
            height: 10,
          },
          shadowOpacity: 0.2,
          shadowRadius: 13.16,
          elevation: 8,
        }}>
        {component}
      </AnimatedTouchable>
    );
  }