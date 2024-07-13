import React, { Fragment } from "react";
import { Animated, Easing, Pressable, StyleSheet, View, ViewStyle } from "react-native";
import Resources from "../../../res/Resources";

const res = Resources.get()

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
    const { circlesDiameter, trackPadHeight, circleBorderWidth, maxIndicatorScale, minIndicatorScale, translationAnimationTime, scalingAnimationTime } = {
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

    React.useEffect(() => {
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
                duration: translationAnimationTime + scalingAnimationTime,
                useNativeDriver: false,
                easing: Easing.quad
            }),
        ]).start();
    }, [selectedOptionIndex])

    return (
        <View
            onLayout={e => setContainerWidth(e.nativeEvent.layout.width)}
            style={[styles.root, style]}>
            {options.map((option, index) => (
                <Fragment key={index}>
                    {index == 0 ? null : <View style={[styles.optionContainer, { height: trackPadHeight, marginTop: circlesDiameter / 2 - trackPadHeight / 2 }]} />}

                    <Pressable disabled={option.disabled} style={[styles.optionPressable, { opacity: option.disabled ? 0.4 : 1 }]} onPress={() => onSelectedOptionChanged?.(index)}>
                        <View style={[styles.optionContent, { borderWidth: circleBorderWidth, height: circlesDiameter, width: circlesDiameter }]} />
                        {option.icon == null ? null : <View style={[styles.optionIcon, { top: circlesDiameter + circleBorderWidth * 2 }]}>{option.icon}</View>}
                    </Pressable>
                </Fragment>
            ))}

            <Animated.View
                style={[styles.movingCircle, {
                    height: circlesDiameter,
                    width: circlesDiameter,
                    top: circleBorderWidth,
                    backgroundColor: indicatorColor.interpolate({
                        inputRange: options.map((_, index) => index),
                        outputRange: options.map((item) => item.color)
                    }),
                    transform: [{ translateX: indicatorPosition }, { scale: indicatorScale }]
                }]} />
        </View>
    )
}

const styles = StyleSheet.create({
    root: {
        width: "100%", height: 100, justifyContent: "space-between", flexDirection: "row"
    },
    optionContainer: {
        flex: 1, backgroundColor: res.getColors().Black
    },
    optionPressable: {
        alignItems: "center"
    },
    optionContent: {
        borderRadius: 100, transformOrigin: "center center"
    },
    optionIcon: {
        position: "absolute", width: "100%", justifyContent: "center", alignItems: "center"
    },
    movingCircle: {
        position: "absolute",
        left: 0,
        borderRadius: 100,
        transformOrigin: "center center",
    }
})
