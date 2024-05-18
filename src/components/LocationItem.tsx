import { TouchableOpacity, View, Text } from "react-native"
import { LatLng } from "react-native-maps"
import calcApproxDistanceBetweenLatLngInMeters from "../utils/calcApproxDistanceBetweenLatLng"
import formatDistance from "../utils/formatDistance"
import WisbIcon, { IconType } from "./WisbIcon"

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
            style={{ padding: 8, alignItems: "flex-end", justifyContent: "space-between" }}
            onPress={onPress}>
            <View style={{ flexDirection: "row", padding: 8, alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                <WisbIcon icon={IconType.MapPin} size={15} />
                <Text style={{ color: "blue", fontWeight: "bold", letterSpacing: 1, textAlign: "center" }}>{location.asText}</Text>
            </View>

            <Text style={{ color: "black", textAlign: "center", fontSize: 10 }}>ok. {formatDistance(calcApproxDistanceBetweenLatLngInMeters(location.coords, userLocation))} od ciebie</Text>
        </TouchableOpacity>
    )
}