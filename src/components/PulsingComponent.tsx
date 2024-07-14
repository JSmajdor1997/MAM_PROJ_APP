import React, { useEffect, useRef } from 'react';
import { Animated, ViewStyle, StyleProp } from 'react-native';

export interface Props {
    style?: StyleProp<ViewStyle>;
    children: React.ReactNode;
    isPulsing: boolean;
    onDuration: number;
    offDuration: number;
    numberOfPulses: number;
}

export default function PulsingComponent({ style, children, isPulsing, onDuration, offDuration, numberOfPulses }: Props) {
    const pulseAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        let animation: Animated.CompositeAnimation;
        if (isPulsing) {
            const pulseSequence = Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 0,
                    duration: onDuration,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: offDuration,
                    useNativeDriver: true,
                }),
            ]);

            if (numberOfPulses > 0) {
                animation = Animated.loop(pulseSequence, { iterations: numberOfPulses });
            } else {
                animation = Animated.loop(pulseSequence);
            }

            animation.start();
        }

        return () => {
            if (animation) {
                animation.stop();
            }
            pulseAnim.setValue(1);  // Reset the animation value
        };
    }, [isPulsing, onDuration, offDuration, numberOfPulses]);

    return (
        <Animated.View style={[style, { opacity: pulseAnim }]}>
            {children}
        </Animated.View>
    );
}
