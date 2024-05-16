import { faLocationArrow } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { StyleSheet, Text, View, ViewStyle } from "react-native";
import { GoogleStaticMapNext } from "react-native-google-static-map-next";
import { LatLng } from "react-native-maps";
import { Resources } from "../../res/Resources";
import FAB from "./FAB";
import openMapsAndNavigate from "../utils/openMapsAndNavigate";

export interface Props {
    style?: ViewStyle
    apiKey: string
    latLng: LatLng
    locationName: string
}

export default function StaticMap({ style, apiKey, latLng, locationName }: Props) {
    return (
        <View style={{ ...styles.root, ...style }}>
            <GoogleStaticMapNext
                style={styles.map}
                location={{
                    latitude: latLng.latitude.toString(),
                    longitude: latLng.longitude.toString()
                }}
                size={{ width: 400, height: 400 }}
                apiKey={apiKey}
            />

            <FAB
                color={Resources.Colors.White}
                icon={<FontAwesomeIcon icon={faLocationArrow} size={20} color={"black"} />}
                style={{
                    position: "absolute",
                    right: 10,
                    bottom: 10
                }}
                size={40}
                onPress={() => openMapsAndNavigate(latLng)} />

            <Text>{locationName}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    root: {
    },
    map: {
        flex: 1,
    }
})