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
} from 'react-native';
import Spinner from 'react-native-spinkit';
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
import User from '../API/data_types/User';
import LeadershipRecord from '../API/data_types/LeadershipRecord';
import LeaderShipItem from '../components/LeaderShipItem';

interface Props extends NativeStackScreenProps<NavigationParamsList, WisbScreens.LeaderBoardScreen> { }

const api = getAPI()

const RecordsPerPage = 20

export default function LeaderboardScreen({ navigation }: Props) {
  const [isMoreMenuVisible, setIsMoreMenuVisible] = React.useState(false)

  const avatarSectionSize = React.useRef(new Animated.Value(200)).current;
  const [hasMore, setHasMore] = React.useState(true)
  const [isLoading, setIsLoading] = React.useState(true)
  const [index, setIndex] = React.useState(0)

  const [user, setUser] = React.useState<User | null>(null)

  const [leadership, setLeadership] = React.useState<LeadershipRecord[]>([])

  React.useEffect(() => {
    Promise.all([
      api.getCurrentUser().then(result => setUser(result.data ?? null)),
      api.getLeadership({ positionsRange: [index, index + RecordsPerPage] }).then(result => setLeadership(result.data?.users ?? []))
    ]).then(() => setIsLoading(false))
  }, [])

  React.useEffect(() => {
    setIsLoading(true)
    api.getLeadership({ positionsRange: [index * RecordsPerPage, index * RecordsPerPage + RecordsPerPage] })
      .then(result => {
        const users = result.data?.users ?? []
        setLeadership(users)
        setHasMore(users.length > 0)
      })
    setIsLoading(false)
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
        <View style={{ flex: 1 }} />
        <View
          style={{ justifyContent: 'center', alignItems: 'center' }}>
          <Avatar
            colors={Resources.get().getColors().AvatarColors}
            size={70}
            fontSize={52}
            username={user.userName}
            image={user.photoUrl}
            onPress={() => { }}
          />

          <Text
            style={{
              fontSize: 20,
              fontFamily: "Avenir",
              letterSpacing: 1,
              fontWeight: 'bold',
              marginTop: 10,
              textAlign: "center"
            }}>
            {user.userName}
          </Text>
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
              api.logout().then(() => { navigation.navigate(WisbScreens.LoginScreen, {}) })
            }}>Wyloguj</MenuItem>
            <MenuItem onPress={() => {
              navigation.push(WisbScreens.SettingsScreen, {})
              setIsMoreMenuVisible(false)
            }}>{Resources.get().getStrings().Screens.LeaderBoardScreen.GoToSettings}</MenuItem>
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

      <View style={{ flex: 1, justifyContent: leadership.length == 0 ? "center" : undefined, alignItems: leadership.length == 0 ? "center" : undefined }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 10, width: "100%" }}>
          <TouchableOpacity onPress={() => setIndex(index => index - 1)} style={{ opacity: index > 0 ? 1 : 0.5, pointerEvents: index > 0 ? "auto" : "none" }}>
            <FontAwesomeIcon icon={faArrowLeft} size={20} />
          </TouchableOpacity>

          <View style={{ flexDirection: "row" }}>
            <Text>{index*RecordsPerPage+1} .. {index*RecordsPerPage+RecordsPerPage}</Text>
          </View>

          <TouchableOpacity onPress={() => setIndex(index => index + 1)} style={{ opacity: hasMore ? 1 : 0.5, pointerEvents: hasMore ? "auto" : "none" }}>
            <FontAwesomeIcon icon={faArrowRight} size={20} />
          </TouchableOpacity>
        </View>

        <ScrollView style={{ flex: 1, }} onScroll={e => Animated.timing(avatarSectionSize, {toValue: e.nativeEvent.contentOffset.y > 10 ? 0 : 1, easing: Easing.linear, duration: 100, useNativeDriver: false}).start()}>
          <View style={{alignItems: "center"}}>
            {leadership.map((record, i) => <LeaderShipItem style={{marginTop: 10}} record={record} position={index * RecordsPerPage + i + 1}/>)}

            {isLoading ? (
              <View style={{ ...StyleSheet.absoluteFillObject, justifyContent: "center", alignItems: "center" }}>
                <Spinner
                  isVisible={true}
                  color={Resources.get().getColors().Primary}
                  type="ChasingDots"
                  size={50}
                />
              </View>
            ) : null}
          </View>

          <View style={{height: 50}}/>
        </ScrollView>

        {leadership.length == 0 ? <Text>Brak wpisów</Text> : null}
      </View>
    </SafeAreaView>
  );
}
