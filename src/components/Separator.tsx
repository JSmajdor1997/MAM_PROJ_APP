import { StyleSheet } from "react-native";
import { LinearGradient } from "react-native-linear-gradient";


export interface Props {

}

export default function Separator({ }: Props) {
    return (
        <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            colors={['#ffffff', '#bcbaba', '#ffffff']}
            style={{ width: '100%', height: StyleSheet.hairlineWidth }}
        />
    )
}