import React, { Fragment } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Animated,
  Easing,
  TextInput,
} from 'react-native';
import Spinner from 'react-native-spinkit';
import Toast from 'react-native-simple-toast';
import { Menu, MenuItem, MenuDivider } from 'react-native-material-menu';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import NavigationParamsList from './NavigationParamsList';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import WisbScreens from './WisbScreens';
import { faArrowLeft, faArrowRight, faAt, faCrown, faEllipsisH, faEllipsisV, faPerson } from '@fortawesome/free-solid-svg-icons';
import Avatar from '../components/Avatar';
import { SafeAreaView } from 'react-native-safe-area-context';
import Separator from '../components/Separator';
import Resources from '../../res/Resources';
import WisbIcon from '../components/WisbIcon/WisbIcon';
import IconType from '../components/WisbIcon/IconType';
import getAPI from '../API/getAPI';
import UserItem from '../components/UserItem';
import InvitationsDialog from '../dialogs/InvitationsDialog';
import ObjectsList from '../components/ObjectsList';
import WisbObjectType from '../API/WisbObjectType';
import { WisbUser } from '../API/interfaces';

const res = Resources.get()

interface Props extends NativeStackScreenProps<NavigationParamsList, WisbScreens.LeaderBoardScreen> { }

const api = getAPI()

const RecordsPerPage = 20

export default function LeaderboardScreen({ route: {params: {navigate}}  }: Props) {
  const [isMoreMenuVisible, setIsMoreMenuVisible] = React.useState(false)

  const avatarSectionSize = React.useRef(new Animated.Value(200)).current;
  const [isLoading, setIsLoading] = React.useState(true)
  const [index, setIndex] = React.useState(0)

  const [isInvitationDialogVisible, setIsInvitationDialogVisible] = React.useState(false)

  const [user, setUser] = React.useState<WisbUser | null>(api.getCurrentUser())

  const [data, setData] = React.useState<{ items: WisbUser[], hasMore: boolean }>({
    items: [],
    hasMore: true
  })

  const [updatedSelfData, setUpdatedSelfData] = React.useState<{ userName: string } | null>()

  React.useEffect(() => {
    setIsLoading(true)

    const range: [number, number] = [index, index + RecordsPerPage]

    api.getMany(WisbObjectType.User, {}, range).then(result => {
      if (result.data != null) {
        setData({
          items: result.data.items,
          hasMore: range[1] < result.data.totalLength
        })
      }

      setIsLoading(false)
    })
  }, [])

  React.useEffect(() => {
    setIsLoading(true)

    const range: [number, number] = [index * RecordsPerPage, index * RecordsPerPage + RecordsPerPage]

    api.getMany(WisbObjectType.User, {}, range)
      .then(result => {
        if (result.data != null) {
          setData({
            items: result.data.items,
            hasMore: range[1] < result.data.totalLength
          })
        }

        setIsLoading(false)
      })
  }, [index])

  if (user == null) {
    return null
  }

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: 'flex-start' }}>
      <Animated.View
        style={{
          marginTop: StatusBar.currentHeight,
          flexDirection: 'row',
          overflow: "hidden",
          maxHeight: avatarSectionSize.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 150]
          })
        }}>
        <View style={{ flex: 1 }} >
          <TouchableOpacity style={{ marginLeft: 10 }} onPress={() => navigate.goBack()}>
            <FontAwesomeIcon icon={faArrowLeft} size={20} />
          </TouchableOpacity>
        </View>
        <View
          style={{ justifyContent: 'center', alignItems: 'center' }}>
          <Avatar
            colors={res.getColors().AvatarColors}
            size={70}
            fontSize={52}
            username={user.userName}
            image={user.photoUrl}
            onPress={() => { }}
          />

          <TextInput
            onPress={() => setUpdatedSelfData({ userName: user.userName })}
            readOnly={updatedSelfData == null}
            onChange={e => {
              setUpdatedSelfData({ userName: e.nativeEvent.text })
            }}
            style={{
              fontSize: 20,
              fontFamily: "Avenir",
              letterSpacing: 1,
              fontWeight: 'bold',
              marginTop: 10,
              textAlign: "center",
              backgroundColor: res.getColors().DarkBeige,
              borderRadius: 10,
              paddingVertical: 3,
              paddingHorizontal: 8,
              color: "white"
            }}>
            {updatedSelfData?.userName ?? user.userName}
          </TextInput>
        </View>
        <View
          style={{
            flex: 1,
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            paddingRight: 8,
            paddingBottom: 4,
          }}>
      
          <Menu
            visible={isMoreMenuVisible}
            anchor={<TouchableOpacity onPress={() => setIsMoreMenuVisible(true)}>
              <FontAwesomeIcon icon={faEllipsisV} size={20} />
            </TouchableOpacity>}
            onRequestClose={() => setIsMoreMenuVisible(false)}
            style={{ marginTop: StatusBar.currentHeight }}>
            <MenuItem onPress={() => {
              setIsMoreMenuVisible(false)
            }}>Zmień hasło</MenuItem>
            <MenuItem onPress={() => {
              setIsMoreMenuVisible(false)
              api.logout()
              navigate.go(WisbScreens.LoginScreen, {})
            }}>Wyloguj</MenuItem>
            <MenuItem onPress={() => {
              navigate.go(WisbScreens.SettingsScreen, {})
              setIsMoreMenuVisible(false)
            }}>{res.getStrings().Screens.LeaderBoardScreen.GoToSettings}</MenuItem>
            <MenuItem onPress={() => {
              setIsInvitationDialogVisible(true)
              setIsMoreMenuVisible(false)
            }}>Zaproszenia</MenuItem>
          </Menu>
        </View>
      </Animated.View>

      <View
        style={{
          paddingHorizontal: 12,
          paddingVertical: 10,
          justifyContent: 'center',
        }}>
        <View
          style={{
            flexDirection: 'row',
            marginTop: 10,
            justifyContent: 'space-between',
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <FontAwesomeIcon icon={faAt} size={18} />
            <Text
              style={{
                fontSize: 12,
                fontWeight: 'bold',
                marginLeft: 10,
              }}>
              {user.email}
            </Text>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ marginRight: 6, fontWeight: 'bold' }}>
              {api.calculateUserRank(user)}
            </Text>
            <WisbIcon icon={IconType.Crown} size={12} />
          </View>
        </View>
      </View>

      <View style={{ flex: 1, justifyContent: data.items.length == 0 ? "center" : undefined, alignItems: data.items.length == 0 ? "center" : undefined }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 10, width: "100%" }}>
          <TouchableOpacity onPress={() => setIndex(index => index - 1)} style={{ opacity: index > 0 ? 1 : 0.5, pointerEvents: index > 0 ? "auto" : "none" }}>
            <FontAwesomeIcon icon={faArrowLeft} size={20} />
          </TouchableOpacity>

          <View style={{ flexDirection: "row" }}>
            <Text>{index * RecordsPerPage + 1} .. {index * RecordsPerPage + RecordsPerPage}</Text>
          </View>

          <TouchableOpacity onPress={() => setIndex(index => index + 1)} style={{ opacity: data.hasMore ? 1 : 0.5, pointerEvents: data.hasMore ? "auto" : "none" }}>
            <FontAwesomeIcon icon={faArrowRight} size={20} />
          </TouchableOpacity>
        </View>

        <ScrollView style={{ flex: 1, }} onScroll={e => Animated.timing(avatarSectionSize, { toValue: e.nativeEvent.contentOffset.y > 10 ? 0 : 1, easing: Easing.linear, duration: 100, useNativeDriver: false }).start()}>
          <View style={{ alignItems: "center" }}>
            {data.items.map((item, i) => <UserItem widthCoeff={0.9} style={{ marginTop: 10 }} item={item} position={index * RecordsPerPage + i + 1} />)}

            {isLoading ? (
              <View style={{ ...StyleSheet.absoluteFillObject, justifyContent: "center", alignItems: "center" }}>
                <Spinner
                  isVisible={isLoading}
                  color={res.getColors().Primary}
                  type="ChasingDots"
                  size={50}
                />
              </View>
            ) : null}
          </View>

          <View style={{ height: 50 }} />
        </ScrollView>

        {data.items.length == 0 ? <Text>Brak wpisów</Text> : null}
      </View>

      <InvitationsDialog visible={isInvitationDialogVisible} onDismiss={() => setIsInvitationDialogVisible(false)} />

      {updatedSelfData != null && updatedSelfData.userName != user.userName ? (
        <View
          style={{
            position: "absolute", right: 145, bottom: 200,
          }}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => {
              api.updateOne({ type: WisbObjectType.User, id: api.getCurrentUser()!.id }, { userName: updatedSelfData.userName }).then(result => {
                if (result.data != null) {
                  setUser({
                    ...user,
                    ...updatedSelfData
                  })
                } else {
                  Toast.show(`Unexpected Error!`, Toast.SHORT);
                }
              })
              setUpdatedSelfData(null)
            }} >
            <Text style={{ color: "white", fontFamily: "Avenir", fontSize: 20, fontWeight: "900" }}>Zapisz</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.editButton, {backgroundColor: res.getColors().Red}]}
            onPress={() => setUpdatedSelfData(null)}>
            <Text style={{ color: "white", fontFamily: "Avenir", fontSize: 20, fontWeight: "900" }}>Anuluj</Text>
          </TouchableOpacity>
        </View>
      ) : null} 
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  editButton: {
    backgroundColor: res.getColors().Primary,
    padding: 10,
    borderRadius: 10,
    shadowColor: res.getColors().Black,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.34,
    shadowRadius: 3, 
    marginTop: 10,

    elevation: 10,
  }
})