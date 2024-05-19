import React, { ReactElement } from "react";
import { ViewStyle } from "react-native";
import { View, Text } from "react-native";
import Ripple from 'react-native-material-ripple';
import { Resources } from "../../res/Resources";

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
        <View style={{ justifyContent: 'center', alignItems: 'center', ...style }}>
            <Ripple
                rippleCentered={true}
                rippleSize={45}
                onPress={onPress}
                style={{
                    aspectRatio: 1,
                    width: size || 54,
                    backgroundColor: color,
                    borderRadius: 50,
                    justifyContent: 'center',
                    alignItems: 'center',

                    shadowColor: Resources.Colors.Black,
                    shadowOffset: {
                        width: 0,
                        height: 1,
                    },
                    shadowOpacity: 0.5,
                    shadowRadius: 4,

                    elevation: 10,
                }}>
                {icon}
            </Ripple>
            {label && label != '' ? (
                <View
                    style={{
                        backgroundColor: Resources.Colors.White,
                        paddingHorizontal: 5,
                        paddingVertical: 3,
                        borderRadius: 5,
                        marginTop: 8,

                        shadowColor: Resources.Colors.Black,
                        shadowOffset: {
                            width: 0,
                            height: 5,
                        },
                        shadowOpacity: 1,
                        shadowRadius: 16,

                        elevation: 20,
                    }}>
                    <Text style={{ textAlign: 'center' }}>{label}</Text>
                </View>
            ) : null}
        </View>
    );
}
