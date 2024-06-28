import React from "react";
import { Animated } from "react-native";

export interface Props {
    offset: number
    durationMs: number
}

export default function useShaky({ offset, durationMs }: Props): { shake: () => void, translationX: Animated.Value } {
    const translationX = React.useRef(new Animated.Value(0)).current;

    return {
        shake: () => {
            Animated.sequence([
                Animated.loop(
                    Animated.sequence([
                        Animated.timing(translationX, {
                            toValue: offset,
                            duration: durationMs,
                            useNativeDriver: false
                        }),
                        Animated.timing(translationX, {
                            toValue: -offset,
                            duration: 2 * durationMs,
                            useNativeDriver: false
                        }),
                    ]),
                    {
                        iterations: 3,
                    },
                ),
                Animated.timing(translationX, {
                    toValue: 0,
                    duration: durationMs,
                    useNativeDriver: false
                })
            ]).start();
        },
        translationX
    }
}