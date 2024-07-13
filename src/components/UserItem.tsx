import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Neomorph } from "react-native-neomorph-shadows-fixes";
import Resources from "../../res/Resources";
import getAPI from "../API/getAPI";
import { WisbUser } from "../API/interfaces";
import Avatar from "./Avatar";

const res = Resources.get()

export interface Props {
  item: WisbUser
  position?: number
  onPress?: () => void
  style?: React.CSSProperties
  widthCoeff: number
}

const api = getAPI()

export default function UserItem({ item, position, style, onPress, widthCoeff }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{ flexDirection: "row", borderRadius: 15, alignItems: "center" }}>
      {position != null ? <Text style={{ ...styles.placeText, paddingRight: 10, marginTop: 10, fontFamily: "Avenir", fontWeight: "500" }}>
        {position}
      </Text> : null}
      <Neomorph
        inner
        style={{
          shadowRadius: 10,
          borderRadius: 15,
          paddingLeft: 10,
          padding: 5,
          height: 50,
          overflow: "hidden",
          flexDirection: "row",
          backgroundColor: "#EEE",
          alignItems: 'center',
          justifyContent: 'space-between',
          width: Dimensions.get("window").width * widthCoeff
        }}
      >
        <View style={styles.userInfo}>
          <Avatar
            colors={res.getColors().AvatarColors}
            image={item.photoUrl}
            size={30}
            fontSize={12}
            username={item.userName}
            style={{ shadowOpacity: 0 }}
          />
          <Text style={styles.nameText}>{item.userName}</Text>
        </View>
        <Text style={styles.rankText}>
          {api.calculateUserRank(item)}
        </Text>
      </Neomorph>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  userInfo: {
    flexDirection: 'row',
    marginVertical: 10,
    alignItems: 'center',
  },
  nameText: {
    marginHorizontal: 15,
    fontSize: 17,
  },
  placeText: {
    fontSize: 15,
    fontWeight: '300',
    color: res.getColors().DarkBeige,
  },
  rankText: {
    marginRight: 15,
    fontSize: 17,
    fontWeight: 'bold',
  },
  avatar: {
    height: 30,
    width: 30,
    borderRadius: 30 / 2,
    shadowColor: res.getColors().Black,
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
