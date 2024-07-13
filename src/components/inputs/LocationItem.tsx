import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { LatLng } from "react-native-maps";
import { Neomorph } from "react-native-neomorph-shadows-fixes";
import Resources from "../../../res/Resources";
import GeoHelper from "../../utils/GeoHelper";
import formatDistance from "../../utils/formatDistance";
import IconType from "../WisbIcon/IconType";
import WisbIcon from "../WisbIcon/WisbIcon";

const res = Resources.get();

export interface Props {
    onPress: () => void;
    userLocation: LatLng;
    location: {
        coords: LatLng;
        asText: string;
    };
}

export default function LocationItem({ onPress, userLocation, location }: Props) {
    return (
        <TouchableOpacity
            style={styles.root}
            onPress={onPress}>
            <Neomorph
                inner
                style={{
                    shadowRadius: 10,
                    borderRadius: 15,
                    backgroundColor: res.getColors().Beige,
                    width: Dimensions.get("window").width * 0.9,
                    height: 50,
                    overflow: "hidden",
                    flexDirection: "row"
                }}>
                <View style={styles.nameContainer}>
                    <WisbIcon icon={IconType.MapPin} size={15} />
                    <Text style={styles.name}>{location.asText}</Text>
                </View>
                <Text style={styles.distanceInfo}>{res.getStrings().Components.LocationItem.ShortAboutMessage} {formatDistance(GeoHelper.calcApproxDistanceBetweenLatLngInMeters(location.coords, userLocation))} {res.getStrings().Components.LocationItem.FromYouMessage}</Text>
            </Neomorph>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    root: {
        padding: 8, 
        alignItems: "center", 
        justifyContent: "space-between",
    },
    nameContainer: {
        flexDirection: "row", 
        padding: 8, 
        alignItems: "center", 
        justifyContent: "space-between", 
        width: "100%"
    },
    name: {
        color: "blue", 
        fontWeight: "bold", 
        letterSpacing: 1, 
        textAlign: "center",
        fontFamily: res.getFonts().Secondary
    },
    distanceInfo: {
        color: res.getColors().Black, 
        textAlign: "center", 
        fontSize: 10
    }
});
