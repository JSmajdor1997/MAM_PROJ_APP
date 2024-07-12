import { faAdd, faClose, faEdit } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome"
import { StyleSheet, View } from "react-native"
import Resources from "../../../res/Resources"
import ModificatorType from "./ModificatorType"

const res = Resources.get()

export interface Props {
    modificator: ModificatorType
}

export default function Modificator({ modificator }: Props) {
    return (
        <View style={styles.root}>
            {modificator == ModificatorType.Add ? <FontAwesomeIcon icon={faAdd} color={res.getColors().Primary} /> :
                modificator == ModificatorType.Edit ? <FontAwesomeIcon icon={faEdit} color={res.getColors().Primary} /> :
                    <FontAwesomeIcon icon={faClose} color={res.getColors().Primary} />}
        </View>
    )
}

const styles = StyleSheet.create({
    root: {
        position: "absolute", top: -22, width: 20, height: 20, justifyContent: "center", alignItems: "center", backgroundColor: "white", borderTopStartRadius: 100, borderTopEndRadius: 100
    }
})