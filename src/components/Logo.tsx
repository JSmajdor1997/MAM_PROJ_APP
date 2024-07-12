import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Resources from "../../res/Resources";

const res = Resources.get()

export interface Props {
    withMotto: boolean
}

export default function Logo({ withMotto }: Props) {
    return (
        <View style={styles.root}>
            <Text style={styles.text}>Wisb</Text>
            {withMotto ? <Text style={styles.motto}>Let's clean up the planet!</Text> : null}
        </View>
    )
}

const styles = StyleSheet.create({
    root: {
        justifyContent: "center",
        alignItems: "center"
    },
    text: {
        fontFamily: res.getFonts().Primary,
        color: res.getColors().White,
        fontSize: 80
    },
    motto: {
        fontFamily: res.getFonts().Primary,
        color: res.getColors().White,
    }
})