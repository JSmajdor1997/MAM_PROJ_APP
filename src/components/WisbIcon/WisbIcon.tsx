import { StyleSheet, View, ViewStyle } from "react-native";
import FastImage from 'react-native-fast-image';
import Resources from "../../../res/Resources";
import {
    Grayscale,
    Sepia,
    Tint,
    ColorMatrix,
    concatColorMatrices,
    invert,
    contrast,
    saturate
} from 'react-native-color-matrix-image-filters'
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faAdd, faClose } from "@fortawesome/free-solid-svg-icons";
import ModificatorType from "./ModificatorType";
import IconType from "./IconType";
import Modificator from "./Modificator";

export interface Props {
    style?: ViewStyle
    icon: IconType
    modificator?: ModificatorType
    size: number
    greyOut?: boolean
}

export default function WisbIcon({ style, size, icon, modificator, greyOut }: Props) {
    return (
        <View style={{ ...styles.root, ...style }}>
            {greyOut ? (
                <Grayscale amount={greyOut ? 1 : 0}>
                    <FastImage
                        style={{ ...styles.image, width: size, height: size}}
                        resizeMode="cover"
                        source={icon} />
                </Grayscale>
            ) : (
                <FastImage
                    style={{ ...styles.image, width: size, height: size }}
                    resizeMode="cover"
                    source={icon} />
            )}



            {modificator == null ? null : <Modificator modificator={modificator} />}
        </View>
    )
}

const styles = StyleSheet.create({
    root: {
        justifyContent: "center", alignItems: "center"
    },
    image: {
        aspectRatio: 1
    }
})