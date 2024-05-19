import React, { Fragment } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Animated, ViewStyle, Pressable, Easing } from "react-native";

export interface Option {
    icon: React.ReactNode;
    color: string;
    disabled?: boolean;
}

export interface Props {
    style?: ViewStyle
    selectedOptionIndex: number;
    options: Option[];
    onSelectedOptionChanged?: (newIndex: number) => void;

    circlesDiameter?: number
    trackPadHeight?: number
    circleBorderWidth?: number
    maxIndicatorScale?: number
    minIndicatorScale?: number
    translationAnimationTime?: number
    scalingAnimationTime?: number
}

const DefaultProps = {
    circlesDiameter: 30,
    trackPadHeight: 1,
    circleBorderWidth: 2,
    maxIndicatorScale: 0.7,
    minIndicatorScale: 0.5,
    translationAnimationTime: 200,
    scalingAnimationTime: 100
}

export default function ProgressInput({ style, selectedOptionIndex, options, onSelectedOptionChanged, ...restProps }: Props) {
    const {circlesDiameter, trackPadHeight, circleBorderWidth, maxIndicatorScale, minIndicatorScale, translationAnimationTime, scalingAnimationTime} = {
        ...DefaultProps,
        ...restProps
    }

    const [containerWidth, setContainerWidth] = React.useState(0)

    const getCircleMarginLeft = (index: number) => {
        const totalEmptySpace = containerWidth - options.length * circlesDiameter
        const emptySpaceWidth = totalEmptySpace / (options.length - 1)

        return (emptySpaceWidth + circlesDiameter) * index
    }

    const indicatorScale = React.useRef(new Animated.Value(maxIndicatorScale)).current;
    const indicatorPosition = React.useRef(new Animated.Value(getCircleMarginLeft(selectedOptionIndex))).current;
    const indicatorColor = React.useRef(new Animated.Value(selectedOptionIndex)).current;

    React.useEffect(()=>{
        Animated.parallel([
            Animated.sequence([
                // Shrink by scaling
                Animated.timing(indicatorScale, {
                  toValue: minIndicatorScale,
                  duration: scalingAnimationTime,
                  useNativeDriver: false,
                  easing: Easing.elastic(100)
                }),
                // Move by translation
                Animated.timing(indicatorPosition, {
                    toValue: getCircleMarginLeft(selectedOptionIndex),
                    duration: translationAnimationTime,
                    useNativeDriver: false,
                    easing: Easing.quad
                  }),
                // Return to original size by scaling
                Animated.timing(indicatorScale, {
                  toValue: maxIndicatorScale,
                  duration: scalingAnimationTime,
                  useNativeDriver: false,
                  easing: Easing.elastic(100)
                }),
              ]),
              Animated.timing(indicatorColor, {
                toValue: selectedOptionIndex,
                duration: translationAnimationTime+scalingAnimationTime,
                useNativeDriver: false,
                easing: Easing.quad
              }),
        ]).start();
    }, [selectedOptionIndex])

    return (
        <View
            onLayout={e => setContainerWidth(e.nativeEvent.layout.width)}
            style={{ width: "100%", height: 100, justifyContent: "space-between", flexDirection: "row", paddingTop: circleBorderWidth, ...style }}>
            {options.map((option, index) => (
                <Fragment>
                    {index == 0 ? null : <View key={`track-${index}`} style={{ flex: 1, backgroundColor: Resources.Colors.Black, height: trackPadHeight, marginTop: circlesDiameter / 2 - trackPadHeight / 2 }} />}

                    <Pressable disabled={option.disabled} key={`circle-${index}`} style={{ alignItems: "center", opacity: option.disabled ? 0.4 : 1 }} onPress={() => onSelectedOptionChanged?.(index)}>
                        <View style={{ borderRadius: 100, borderWidth: circleBorderWidth, height: circlesDiameter, width: circlesDiameter, transformOrigin: "center center" }} />
                        {option.icon == null ? null : <View style={{ position: "absolute", top: circlesDiameter + circleBorderWidth * 2, width: "100%", justifyContent: "center", alignItems: "center" }}>{option.icon}</View>}
                    </Pressable>
                </Fragment>
            ))}

            <Animated.View
                style={{
                    height: circlesDiameter,
                    width: circlesDiameter,
                    position: "absolute",
                    left: 0,
                    top: circleBorderWidth,
                    backgroundColor: indicatorColor.interpolate({
                        inputRange: options.map((_, index) => index),
                        outputRange: options.map((item) => item.color)
                    }),
                    borderRadius: 100,
                    transformOrigin: "center center",
                    transform: [{translateX: indicatorPosition}, { scale: indicatorScale }]
                }} />
        </View>
    )
}