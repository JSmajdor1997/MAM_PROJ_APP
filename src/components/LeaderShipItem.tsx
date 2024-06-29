import { View, Text, StyleSheet, Dimensions, StyleProp } from "react-native";
import Resources from "../../res/Resources";
import LeadershipRecord from "../API/data_types/LeadershipRecord";
import Avatar from "./Avatar";
import { Neomorph } from "react-native-neomorph-shadows-fixes";

export interface Props {
    record: LeadershipRecord
    position: number
    style?: React.CSSProperties
}

export default function LeaderShipItem({ record, position, style }: Props) {
    return (
        <View
            style={{ flexDirection: "row", borderRadius: 15, alignItems: "center" }}>
            <Text style={{ ...styles.placeText, paddingRight: 10, marginTop: 10, fontFamily: "Avenir", fontWeight: "500" }}>
                {position}
            </Text>
            <Neomorph
                inner
                style={{
                    ...style as any,
                    shadowRadius: 10,
                    borderRadius: 15,
                    paddingLeft: 10,
                    flex: 1,
                    padding: 5,
                    width: Dimensions.get("window").width * 0.9,
                    height: 50,
                    overflow: "hidden",
                    flexDirection: "row",
                    backgroundColor: "#EEE",
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}
            >
                <View
                    style={{
                        flexDirection: 'row',
                        marginVertical: 10,
                        alignItems: 'center',
                    }}>
                    <Avatar
                        colors={Resources.get().getColors().AvatarColors}
                        image={record.userPhoto}
                        size={30}
                        fontSize={12}
                        username={record.userName}
                        style={{ shadowOpacity: 0 }}
                    />
                    <Text style={styles.nameText}>{record.userName}</Text>
                </View>
                <Text
                    style={{
                        marginRight: 15,
                        fontSize: 17,
                        fontWeight: 'bold',
                    }}>
                    {record.points}
                </Text>
            </Neomorph>
        </View>
    )
}

const styles = StyleSheet.create({
    elementOfList: {
        marginHorizontal: 15,
    },
    nameText: {
        marginHorizontal: 15,
        fontSize: 17,
    },
    placeText: {
        fontSize: 15,
        fontWeight: '300',
        color: Resources.get().getColors().DarkBeige,
    },
    avatar: {
        height: 30,
        width: 30,
        borderRadius: 30 / 2,
        shadowColor: Resources.get().getColors().Black,
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.34,
        shadowRadius: 6.27,

        elevation: 10,
    },
    dropdownMenu: {
        flex: 1,
    },
    itemLabel: {
        marginLeft: 8,
    },
});