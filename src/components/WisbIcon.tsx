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
        <View style={{ justifyContent: "center", alignItems: "center", ...(style as any) }}>
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

            {modificator == ModificatorType.Add ? <AddIcon size={size / 4} /> :
                modificator == ModificatorType.Delete ? <DeleteIcon size={size / 4} /> :
                    null}
        </View>
    )
}

interface ModificatorProps {
    size: number
}

function AddIcon({ size }: ModificatorProps) {
    return (
        <View style={{ position: "absolute", top: -22, width: 20, height: 20, justifyContent: "center", alignItems: "center", backgroundColor: "white", borderTopStartRadius: 100, borderTopEndRadius: 100 }}>
            <View style={{ position: "absolute", backgroundColor: Resources.Colors.Primary, width: 12, height: 3 }} />
            <View style={{ position: "absolute", backgroundColor: Resources.Colors.Primary, width: 12, height: 3, transform: [{ rotate: "90deg" }] }} />
        </View>
    )
}

function DeleteIcon({ size }: ModificatorProps) {
    return (
        <View>
            <View style={{ position: "absolute", backgroundColor: Resources.Colors.Red, width: 30, height: 5, transform: [{ rotate: "-45deg" }] }} />
            <View style={{ position: "absolute", backgroundColor: Resources.Colors.Red, width: 30, height: 5, transform: [{ rotate: "+45deg" }] }} />
        </View>
    )
}