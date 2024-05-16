import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { Resources } from "../../res/Resources";

export interface Props {
    withMotto: boolean
}

export default function Logo({ withMotto }: Props) {
    return (
        <View style={styles.root}>
            <Text style={styles.text}>Wisb</Text>
            {withMotto ? <Text style={styles.motto}>Let's clean up the planet</Text> : null}
        </View>
    )
}

const styles = StyleSheet.create({
    root: {
        justifyContent: "center",
        alignItems: "center"
    },
    text: {
        fontFamily: Resources.Fonts.Primary,
        color: Resources.Colors.White,
        fontSize: 80
    },
    motto: {
        fontFamily: Resources.Fonts.Primary,
        color: Resources.Colors.White,
    }
})