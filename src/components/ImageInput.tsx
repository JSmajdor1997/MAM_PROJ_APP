import { faCamera, faEdit, faPen, faPenAlt } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome"
import { Alert, TouchableOpacity, View, ViewStyle } from "react-native"
import FastImage from "react-native-fast-image"
import Resources from "../../res/Resources"
import { faker } from "@faker-js/faker"

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

            {image == null && !readonly ? (
                <TouchableOpacity onPress={() => onImageSelected(faker.image.avatar())} style={{ position: "absolute", width: "100%", height: "100%", borderRadius: 15, justifyContent: "center", alignItems: "center", flex: 1, borderColor: "white", borderWidth: 4, borderStyle: "dashed" }}>
                    <FontAwesomeIcon icon={faPen} style={{ color: "white" }} size={25} />
                </TouchableOpacity>
            ) : null}

            {image != null && !readonly ? (
                <TouchableOpacity onPress={() => onImageSelected(faker.image.avatar())} style={{ position: "absolute", width: "100%", height: "100%", borderRadius: 15, justifyContent: "center", alignItems: "center", flex: 1, borderColor: "white", borderWidth: 4, borderStyle: "dashed" }}>
                    <FontAwesomeIcon icon={faPen} style={{ color: "white" }} size={25} />
                </TouchableOpacity>
            ) : null}
        </View>
    )
}