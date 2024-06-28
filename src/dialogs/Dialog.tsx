import { Portal } from '@gorhom/portal';
import React, { useEffect, useRef } from 'react';
import {
    Animated,
    Modal,
    SafeAreaView,
    Pressable,
    ViewStyle,
    StyleSheet,
    View,
    TouchableOpacity,
    Dimensions,
    Easing
} from 'react-native';
import Resources from '../../res/Resources';

export enum Position {
    Center,
    Left,
    Right,
    Top,
    Bottom
}

export interface Props {
    position: Position;
    visible: boolean;
    onDismiss: () => void;
    children: React.ReactNode;
    backdropStyle?: ViewStyle;
    dialogStyle?: ViewStyle;
    dismissOnBackdropPress?: boolean;
    animationDuration: number
}

export default function Dialog({
    position,
    visible,
    onDismiss,
    children,
    backdropStyle,
    dialogStyle,
    dismissOnBackdropPress,
    animationDuration
}: Props) {
    const prevVisible = React.useRef(visible)
    const translateValue = useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        if(prevVisible.current == visible) {
            translateValue.setValue(getTranslation(visible, position))
            return
        }

        prevVisible.current = visible

        if (visible) {
            Animated.timing(translateValue, {
                toValue: getTranslation(true, position),
                duration: animationDuration,
                useNativeDriver: true,
                easing: Easing.quad
            }).start();
        } else {
            Animated.timing(translateValue, {
                toValue:  getTranslation(false, position),
                duration: animationDuration,
                useNativeDriver: true,
                easing: Easing.quad
            }).start();
        }
    }, [visible]);

    const getTranslation = (visible: boolean, position: Position) => {
        if (visible) {
            return 0
        }

        const screenDimensions = Dimensions.get("screen")

        if (position == Position.Bottom) {
            return screenDimensions.height
        } else if (position == Position.Top) {
            return -screenDimensions.height
        } else if (position == Position.Left) {
            return -screenDimensions.width
        } else {
            return screenDimensions.width
        }
    }

    const transform = position == Position.Left || position == Position.Right ? 
        [{ translateX: translateValue }, { translateY: 0 }] :
        [{ translateX: 0 }, { translateY: translateValue }]

    return (
        <Portal>
            <Pressable pointerEvents={dismissOnBackdropPress && !visible ? "auto" : "box-none"} style={{ ...styles.backdrop, ...backdropStyle }} onPress={dismissOnBackdropPress ? onDismiss : undefined}>
                <Animated.View pointerEvents="auto" style={{ ...styles.dialog, ...dialogStyle, transform }}>
                    {children}
                </Animated.View>
            </Pressable>
        </Portal>
    );
}

const styles = StyleSheet.create({
    backdrop: {
        backgroundColor: Resources.get().getColors().BackdropBlack,
        position: "absolute",
        width: "100%",
        height: "100%",
    },
    dialog: {
        position: "absolute",
        borderRadius: 15,
        flexDirection: "column",
        backgroundColor: Resources.get().getColors().White,
        shadowColor: Resources.get().getColors().Black,
        shadowOpacity: 0.2,
        shadowRadius: 2,
        shadowOffset: {
            width: 0,
            height: -2
        }
    }
});
