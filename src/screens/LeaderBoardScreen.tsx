import { faArrowLeft, faArrowRight, faAt, faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import {
  Animated,
  Easing,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { Menu, MenuItem } from 'react-native-material-menu';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-simple-toast';
import Spinner from 'react-native-spinkit';
import Resources from '../../res/Resources';
import WisbObjectType from '../API/WisbObjectType';
import getAPI from '../API/getAPI';
import { WisbUser } from '../API/interfaces';
import Avatar from '../components/Avatar';
import UserItem from '../components/UserItem';
import IconType from '../components/WisbIcon/IconType';
import WisbIcon from '../components/WisbIcon/WisbIcon';
import InvitationsDialog from '../dialogs/InvitationsDialog';
import NavigationParamsList, { WisbScreens } from './NavigationParamsList';

const res = Resources.get()

interface Props extends NativeStackScreenProps<NavigationParamsList, WisbScreens.LeaderBoardScreen> { }

const api = getAPI()

const RecordsPerPage = 20

export default function LeaderboardScreen({ route: { params: { navigate } } }: Props) {
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
    <SafeAreaView style={styles.safeAreaView}>
      <Animated.View style={[styles.avatarSection, {
        marginTop: StatusBar.currentHeight,
        maxHeight: avatarSectionSize.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 150]
        })
      }]}>
        <View style={styles.flexOne} >
          <TouchableOpacity style={styles.marginLeft10} onPress={() => navigate.goBack()}>
            <FontAwesomeIcon icon={faArrowLeft} size={20} />
          </TouchableOpacity>
        </View>
        <View style={styles.avatarContainer}>
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
            style={styles.userNameInput}>
            {updatedSelfData?.userName ?? user.userName}
          </TextInput>
        </View>
        <View style={styles.menuContainer}>
          <Menu
            visible={isMoreMenuVisible}
            anchor={<TouchableOpacity onPress={() => setIsMoreMenuVisible(true)}>
              <FontAwesomeIcon icon={faEllipsisV} size={20} />
            </TouchableOpacity>}
            onRequestClose={() => setIsMoreMenuVisible(false)}
            style={styles.menu}>
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

      <View style={styles.emailContainer}>
        <View style={styles.emailSubContainer}>
          <FontAwesomeIcon icon={faAt} size={18} />
          <Text style={styles.emailText}>
            {user.email}
          </Text>
        </View>
        <View style={styles.rankContainer}>
          <Text style={styles.rankText}>
            {api.calculateUserRank(user)}
          </Text>
          <WisbIcon icon={IconType.Crown} size={12} />
        </View>
      </View>

      <View style={[styles.flexOne, data.items.length == 0 ? styles.centeredContainer : undefined]}>
        <View style={styles.navigationContainer}>
          <TouchableOpacity onPress={() => setIndex(index => index - 1)} style={[styles.navigationButton, index > 0 ? undefined : styles.disabledNavigationButton]}>
            <FontAwesomeIcon icon={faArrowLeft} size={20} />
          </TouchableOpacity>

          <View style={styles.rangeTextContainer}>
            <Text style={{fontFamily: res.getFonts().Secondary}}>{index * RecordsPerPage + 1} .. {index * RecordsPerPage + RecordsPerPage}</Text>
          </View>

          <TouchableOpacity onPress={() => setIndex(index => index + 1)} style={[styles.navigationButton, data.hasMore ? undefined : styles.disabledNavigationButton]}>
            <FontAwesomeIcon icon={faArrowRight} size={20} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.flexOne} onScroll={e => Animated.timing(avatarSectionSize, { toValue: e.nativeEvent.contentOffset.y > 10 ? 0 : 1, easing: Easing.linear, duration: 100, useNativeDriver: false }).start()}>
          <View style={styles.itemsContainer}>
            {data.items.map((item, i) => (
              <UserItem 
                widthCoeff={0.9} style={styles.userItem} item={item} position={index * RecordsPerPage + i + 1} key={i} />
            ))}

            <View style={{ height: 100 }} />

            {isLoading ? (
              <View style={styles.spinnerContainer}>
                <Spinner
                  isVisible={isLoading}
                  color={res.getColors().Primary}
                  type="ChasingDots"
                  size={50}
                />
              </View>
            ) : null}
          </View>

          <View style={styles.bottomSpacer} />
        </ScrollView>

        {data.items.length == 0 ? <Text style={{fontFamily: res.getFonts().Secondary}}>Brak wpisów</Text> : null}
      </View>

      <InvitationsDialog visible={isInvitationDialogVisible} onDismiss={() => setIsInvitationDialogVisible(false)} />

      {updatedSelfData != null && updatedSelfData.userName != user.userName ? (
        <View style={styles.saveCancelButtonsContainer}>
          <TouchableOpacity
            style={styles.saveButton}
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
            <Text style={styles.buttonText}>Zapisz</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => setUpdatedSelfData(null)}>
            <Text style={styles.buttonText}>Anuluj</Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    paddingTop: 20,
    justifyContent: 'flex-start',
  },
  avatarSection: {
    flexDirection: 'row',
    overflow: "hidden",
  },
  flexOne: {
    flex: 1,
  },
  marginLeft10: {
    marginLeft: 10,
  },
  avatarContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  userNameInput: {
    fontSize: 20,
    fontFamily: res.getFonts().Secondary,
    letterSpacing: 1,
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: "center",
    backgroundColor: res.getColors().DarkBeige,
    borderRadius: 10,
    paddingVertical: 3,
    paddingHorizontal: 8,
    color: "white"
  },
  menuContainer: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingRight: 8,
    paddingBottom: 4,
  },
  menu: {
    marginTop: StatusBar.currentHeight,
  },
  emailContainer: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    justifyContent: 'center',
  },
  emailSubContainer: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'space-between',
  },
  emailText: {
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: res.getFonts().Secondary,
    marginLeft: 10,
  },
  rankContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rankText: {
    marginRight: 6,
    fontWeight: 'bold',
    fontFamily: res.getFonts().Secondary,
  },
  centeredContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  navigationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    width: "100%",
  },
  navigationButton: {
    opacity: 1,
    pointerEvents: "auto",
  },
  disabledNavigationButton: {
    opacity: 0.5,
    pointerEvents: "none",
  },
  rangeTextContainer: {
    flexDirection: "row",
  },
  itemsContainer: {
    alignItems: "center",
  },
  userItem: {
    marginTop: 10,
  },
  spinnerContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  bottomSpacer: {
    height: 50,
  },
  saveCancelButtonsContainer: {
    position: "absolute",
    right: 145,
    bottom: 200,
  },
  saveButton: {
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
  },
  cancelButton: {
    backgroundColor: res.getColors().Red,
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
  },
  buttonText: {
    color: "white",
    fontFamily: res.getFonts().Secondary,
    fontSize: 20,
    fontWeight: "900",
  },
})
