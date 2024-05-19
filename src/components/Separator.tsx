import { StyleSheet } from "react-native";
import { LinearGradient } from "react-native-linear-gradient";

export interface Props {
    backgroundColor: string
    color: string
}

export default function Separator({ backgroundColor, color }: Props) {
    return (
        <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            colors={[backgroundColor, color, backgroundColor]}
            style={styles.root}
        />
    )
}

const styles = StyleSheet.create({
    root: {
        width: '100%', 
        height: StyleSheet.hairlineWidth
    }
})