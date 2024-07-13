import { StyleSheet, View, ViewStyle } from "react-native";
import {
    Grayscale
} from 'react-native-color-matrix-image-filters';
import FastImage from 'react-native-fast-image';
import Resources from "../../../res/Resources";
import IconType from "./IconType";
import Modificator from "./Modificator";
import ModificatorType from "./ModificatorType";

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
                        style={{ ...styles.image, width: size, height: size }}
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