import React, { Fragment } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import Spinner from 'react-native-spinkit';
import { Menu, MenuItem, MenuDivider } from 'react-native-material-menu';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import NavigationParamsList from './NavigationParamsList';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import WisbScreens from './WisbScreens';
import { faAt, faCrown, faEllipsisV, faPerson } from '@fortawesome/free-solid-svg-icons';
import Avatar from '../components/Avatar';
import { SafeAreaView } from 'react-native-safe-area-context';
import Separator from '../components/Separator';
import Resources from '../../res/Resources';

interface Props extends NativeStackScreenProps<NavigationParamsList, WisbScreens.LeaderBoardScreen> { }

interface State {
  data: Array<any>;
  userID: string;
  isLoading: boolean;
  userPoints: number;
  userName: string;
  userInitials: string;
  userArrayIndex: any;
  userImage: string;
  userEmail: string;

  isV: boolean;
}

export default function LeaderboardScreen({ navigation }: Props) {
  const [isMoreMenuVisible, setIsMoreMenuVisible] = React.useState(false)
  const [state, setState] = React.useState<State>({
    data: [],
    isLoading: true,
    userPoints: 0,
    userName: '',
    userInitials: '',
    userID: '',
    userArrayIndex: '',
    userImage: '',
    userEmail: '',
    isV: true,
  })

  const logout = () => {
    fetch('https://moczala.com:2053/users/logout', {
      method: 'GET',
    });
  }

  const myPlace = () => {
    for (let i: any; i < state.data.length; i++) {
      if (state.data[i]._id == state.userID) {
        setState({
          ...state,
          userArrayIndex: i,
        });
      }
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: 'flex-start' }}>
      <View
        style={{
          marginTop: StatusBar.currentHeight,
          flexDirection: 'row',
          height: 120,
        }}>
        <View style={{ flex: 1 }} />
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Avatar
            colors={Resources.get().getColors().AvatarColors}
            size={100}
            fontSize={52}
            username={state.userName}
            image={state.userImage}
            onPress={() => { }}
          />
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
              <FontAwesomeIcon icon={faEllipsisV} size={25} />
            </TouchableOpacity>}
            onRequestClose={() => setIsMoreMenuVisible(false)}
            style={{ marginTop: StatusBar.currentHeight }}>
            <MenuItem onPress={() => {
              logout()
              setIsMoreMenuVisible(false)
            }}>Wyloguj</MenuItem>
            <MenuItem onPress={() => {
              navigation.push(WisbScreens.SettingsScreen, {})
              setIsMoreMenuVisible(false)
            }}>{Resources.get().getStrings().Screens.LeaderBoardScreen.GoToSettings}</MenuItem>
          </Menu>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ marginRight: 6, fontWeight: 'bold' }}>
              {state.userPoints}
            </Text>
            <FontAwesomeIcon icon={faCrown} color={Resources.get().getColors().Green} />
          </View>
        </View>
      </View>

      <View
        style={{
          paddingHorizontal: 12,
          paddingVertical: 10,
          justifyContent: 'center',
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <FontAwesomeIcon icon={faPerson} size={18} />
          <Text
            style={{
              fontSize: 16,
              fontWeight: 'bold',
              marginLeft: 10,
            }}>
            {state.userName}
          </Text>
        </View>

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
                fontSize: 16,
                fontWeight: 'bold',
                marginLeft: 10,
              }}>
              {state.userEmail}
            </Text>
          </View>
        </View>
      </View>

      <FlatList
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        data={state.data}
        onScroll={e => {
          if (e.nativeEvent.contentOffset.y > 10) {
            setState({ ...state, isV: false });
          } else {
            setState({ ...state, isV: true });
          }
        }}
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'center',
          alignItems: state.data.length == 0 ? 'center' : undefined,
        }}
        ItemSeparatorComponent={() => (
          <Separator backgroundColor={Resources.get().getColors().White} color={Resources.get().getColors().Beige} />
        )}
        ListEmptyComponent={() => (
          <Spinner
            isVisible={true}
            color={Resources.get().getColors().Primary}
            type="ChasingDots"
            size={50}
          />
        )}
        style={{ marginBottom: 75 }}
        renderItem={({ item, index, separators }) => (
          <View
            style={{
              flexDirection: 'row',
              backgroundColor: Resources.get().getColors().White,
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <View
              style={{
                flexDirection: 'row',
                backgroundColor: Resources.get().getColors().White,
                marginVertical: 10,
                alignItems: 'center',
              }}>
              <Text style={[styles.placeText]}>
                {index < 9 ? index + 1 : '○'}
              </Text>
              <Avatar
                colors={Resources.get().getColors().AvatarColors}
                image={item.avatar.scaledImageSrc}
                size={30}
                fontSize={12}
                username={item.name}
              />
              <Text style={styles.nameText}>{item.name}</Text>
            </View>
            <Text
              style={{
                marginRight: 15,
                fontSize: 17,
                fontWeight: 'bold',
              }}>
              {item.points}
            </Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'center',
    paddingBottom: 80,
  },
  header: {
    backgroundColor: Resources.get().getColors().Primary,
    alignItems: 'center',
    padding: 20,
    paddingTop: StatusBar.currentHeight,
  },
  headerText: {
    color: Resources.get().getColors().White,
    fontSize: 20,
    fontWeight: 'bold',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '50%',
  },
  viewWithName: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  elementOfList: {
    marginHorizontal: 15,
  },
  nameText: {
    marginHorizontal: 15,
    fontSize: 17,
  },
  placeText: {
    marginHorizontal: 15,
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
