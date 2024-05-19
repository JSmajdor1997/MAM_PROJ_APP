import { View, ViewStyle } from "react-native";
import FastImage from 'react-native-fast-image';
import { Resources } from "../../res/Resources";
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

export enum IconType {
    Chevron = require('../../res/images/chevron.png'),
    Earth = require('../../res/images/planet-earth.png'),
    BroomOutline = require('../../res/images//broom_outline.png'),
    Broom = require('../../res/images/broom.png'),
    BroomMono = require('../../res/images/broom_mono.png'),
    Calendar = require('../../res/images/calendar.png'),
    WastelandIcon = require('../../res/images/wasteland-icon.png'),
    Dumpster = require('../../res/images/recycle-bin.png'),
    MapPin = require('../../res/images/map-pin.png')
}

export enum ModificatorType {
    Add,
    Delete
}

export interface Props {
    style?: ViewStyle
    icon: IconType
    modificator?: ModificatorType
    size: number
    greyOut?: boolean
}

export default function WisbIcon({ style, size, icon, modificator, greyOut }: Props) {
    return (
        <View style={{ justifyContent: "center", alignItems: "center", ...style }}>
            {greyOut ? (
                <Grayscale amount={greyOut ? 1 : 0}>
                    <FastImage
                        style={{ width: size, height: size, aspectRatio: 1 }}
                        resizeMode="cover"
                        source={icon} />
                </Grayscale>
            ) : (
                <FastImage
                    style={{ width: size, height: size, aspectRatio: 1 }}
                    resizeMode="cover"
                    source={icon} />
            )}



            {modificator == null ? null : <Modificator modificator={modificator} />}
        </View>
    )
}

function Modificator({ modificator }: { modificator: ModificatorType }) {
    return (
        <View style={{ position: "absolute", top: -22, width: 20, height: 20, justifyContent: "center", alignItems: "center", backgroundColor: "white", borderTopStartRadius: 100, borderTopEndRadius: 100 }}>
            {modificator == ModificatorType.Add ?
                <FontAwesomeIcon icon={faAdd} color={Resources.Colors.Primary} /> :
                <FontAwesomeIcon icon={faClose} color={Resources.Colors.Primary} />}
        </View>
    )
}