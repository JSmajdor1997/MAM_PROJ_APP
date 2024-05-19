import { TouchableOpacity, View, Text, StyleSheet } from "react-native"
import { LatLng } from "react-native-maps"
import calcApproxDistanceBetweenLatLngInMeters from "../utils/calcApproxDistanceBetweenLatLng"
import formatDistance from "../utils/formatDistance"
import Resources from "../../res/Resources"
import IconType from "./WisbIcon/IconType"
import WisbIcon from "./WisbIcon/WisbIcon"

export interface Props {
    onPress: () => void
    userLocation: LatLng
    location: {
        coords: LatLng
        asText: string
    }
}

export default function LocationItem({ onPress, userLocation, location }: Props) {
    return (
        <TouchableOpacity
            style={styles.root}
            onPress={onPress}>
            <View style={styles.nameContainer}>
                <WisbIcon icon={IconType.MapPin} size={15} />
                <Text style={styles.name}>{location.asText}</Text>
            </View>

            <Text style={styles.distanceInfo}>{Resources.get().getStrings().Components.LocationItem.ShortAboutMessage} {formatDistance(calcApproxDistanceBetweenLatLngInMeters(location.coords, userLocation))} {Resources.get().getStrings().Components.LocationItem.FromYouMessage}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    root: {
        padding: 8, alignItems: "flex-end", justifyContent: "space-between"
    },
    nameContainer: {
        flexDirection: "row", padding: 8, alignItems: "center", justifyContent: "space-between", width: "100%"
    },
    name: {
        color: "blue", fontWeight: "bold", letterSpacing: 1, textAlign: "center"
    },
    distanceInfo: {
        color: Resources.get().getColors().Black, textAlign: "center", fontSize: 10
    }
})