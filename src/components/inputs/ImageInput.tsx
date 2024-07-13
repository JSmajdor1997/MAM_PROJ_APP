import { faker } from "@faker-js/faker"
import { faPen } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome"
import React from "react"
import { StyleSheet, TouchableOpacity, View, ViewStyle } from "react-native"
import FastImage from "react-native-fast-image"
import Resources from "../../../res/Resources"

const res = Resources.get()

export interface Props {
    style?: ViewStyle
    image?: string
    onImageSelected: (image: string) => void
    readonly: boolean
}

export default function ImageInput({ style, image, onImageSelected, readonly }: Props) {
    return (
        <View style={[style, { backgroundColor: res.getColors().DarkBeige, borderRadius: 15, overflow: "hidden" }]}>
            <FastImage source={{ uri: image }} style={{ flex: 1 }} />

            {!image && !readonly ? (
                <TouchableOpacity onPress={() => onImageSelected(faker.image.avatar())} style={styles.overlay}>
                    <FontAwesomeIcon icon={faPen} style={styles.icon} size={25} />
                </TouchableOpacity>
            ) : null}

            {image && !readonly ? (
                <TouchableOpacity onPress={() => onImageSelected(faker.image.avatar())} style={styles.overlay}>
                    <FontAwesomeIcon icon={faPen} style={styles.icon} size={25} />
                </TouchableOpacity>
            ) : null}
        </View>
    )
}

const styles = StyleSheet.create({
    overlay: {
        position: "absolute",
        width: "100%",
        height: "100%",
        borderRadius: 15,
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
        borderColor: "white",
        borderWidth: 4,
        borderStyle: "dashed",
    },
    icon: {
        color: "white",
    },
})
