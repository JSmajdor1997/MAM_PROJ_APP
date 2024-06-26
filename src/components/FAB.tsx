import React, { ReactElement } from "react";
import { StyleSheet, ViewStyle } from "react-native";
import { View, Text } from "react-native";
import Ripple from 'react-native-material-ripple';
import Resources from "../../res/Resources";

export interface Props {
    style?: ViewStyle
    icon: React.ReactNode
    color: string
    onPress: () => void
    label?: string
    size?: number
}

export default function FAB({ icon, color, onPress, label, size, style }: Props): ReactElement {
    return (
        <View style={{ ...styles.root, ...style }}>
            <Ripple
                rippleCentered={true}
                rippleSize={45}
                onPress={onPress}
                style={{
                    width: size || 54,
                    backgroundColor: color,
                    ...styles.ripple
                }}>
                {icon}
            </Ripple>
            {label && label != '' ? (
                <View
                    style={{
                        ...styles.labelContainer
                    }}>
                    <Text style={styles.label}>{label}</Text>
                </View>
            ) : null}
        </View>
    );
}

const styles = StyleSheet.create({
    root: {
        justifyContent: 'center', alignItems: 'center'
    },
    ripple: {
        aspectRatio: 1,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',

        shadowColor: Resources.get().getColors().Black,
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.5,
        shadowRadius: 4,

        elevation: 10,
    },
    labelContainer: {
        backgroundColor: Resources.get().getColors().White,
        paddingHorizontal: 5,
        paddingVertical: 3,
        borderRadius: 5,
        marginTop: 8,

        shadowColor: Resources.get().getColors().Black,
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 1,
        shadowRadius: 16,

        elevation: 20,
    },
    label: {
        textAlign: 'center',
        letterSpacing: 1
    }
})