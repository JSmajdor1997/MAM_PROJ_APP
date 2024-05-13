import React, {Fragment} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  StatusBar,
} from 'react-native';
import Spinner from 'react-native-spinkit';
import LinearGradient from 'react-native-linear-gradient';
import {Menu, MenuItem, MenuDivider} from 'react-native-material-menu';
import { Avatar, Icon } from '@rneui/base';
import MoreButton from '../components/MoreButton';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import NavigationParamsList from './NavigationParamsList';
import WisbScreens from './WisbScreens';

interface Props extends NativeStackScreenProps<NavigationParamsList, WisbScreens.LeaderBoardScreen> {}

interface State {
  data: Array<any>;
  userID: any;
  isLoading: boolean;
  userPoints: number;
  userName: string;
  userInitials: string;
  userArrayIndex: any;
  userImage: string;
  userEmail: string;

  isV: boolean;
}

export default class LeaderboardScreen extends React.Component<Props, State> {
  private menu: any = null;

  constructor(props: Props) {
    super(props);

    this.state = {
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
    };
  }

  componentDidMount() {
    // fetch('https://moczala.com:2053/leaderboard/', {
    //   method: 'GET',
    // })
    //   .then(response => response.json())
    //   .then(responseJson => {
    //     this.setState({
    //       data: responseJson,
    //       isLoading: false,
    //     });
    //   })
    //   .catch(error => {
    //     console.error(error);
    //   });

    // fetch('https://moczala.com:2053/users/whoami', {
    //   method: 'GET',
    // })
    //   .then(response => response.json())
    //   .then(responseJson => {
    //     this.setState({
    //       userName: responseJson.name,
    //       userPoints: responseJson.points,
    //       userID: responseJson._id,
    //       userEmail: responseJson.mail,
    //     });
    //   })
    //   .catch(error => {
    //     console.error(error);
    //   });

    // this.myPlace();
  }

  logout() {
    fetch('https://moczala.com:2053/users/logout', {
      method: 'GET',
    });
  }

  myPlace() {
    for (let i: any; i < this.state.data.length; i++) {
      if (this.state.data[i]._id == this.state.userID) {
        this.setState({
          userArrayIndex: i,
        });
      }
    }
  }

  render() {
    return (
      <View style={{flex: 1, justifyContent: 'flex-start'}}>
        <View
          style={{
            marginTop: StatusBar.currentHeight,
            flexDirection: 'row',
            height: 120,
          }}>
          <View style={{flex: 1}} />
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Avatar
              size={100}
              fontSize={52}
              username={this.state.userName}
              image={this.state.userImage}
              onPress={() => {}}
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
            <MoreButton
              style={{marginRight: -0.1}}
              onPress={() => {
                if (this.menu) {
                  this.menu.show();
                }
              }}
              color="black"
            />
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={{marginRight: 6, fontWeight: 'bold'}}>
                {this.state.userPoints}
              </Text>
              <Icon name="crown" type="foundation" color="#ffb005" />
            </View>
          </View>
          <Menu
            style={{marginTop: StatusBar.currentHeight}}
            ref={(ref: any) => (this.menu = ref)}>
            <MenuItem onPress={this.logout}>Wyloguj</MenuItem>
          </Menu>
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
            <Icon name="user" type="antdesign" size={18} />
            <Text
              style={{
                fontSize: 16,
                fontWeight: 'bold',
                marginLeft: 10,
              }}>
              {this.state.userName}
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
              <Icon name="email" type="entypo" size={18} />
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: 'bold',
                  marginLeft: 10,
                }}>
                {this.state.userEmail}
              </Text>
            </View>
          </View>
        </View>

        <FlatList
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          data={this.state.data}
          onScroll={e => {
            if (e.nativeEvent.contentOffset.y > 10) {
              this.setState({isV: false});
            } else {
              this.setState({isV: true});
            }
          }}
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'center',
            alignItems: this.state.data.length == 0 ? 'center' : undefined,
          }}
          ItemSeparatorComponent={() => (
            <LinearGradient
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              colors={['#ffffff', '#bcbaba', '#ffffff']}
              style={{width: '100%', height: StyleSheet.hairlineWidth}}
            />
          )}
          ListEmptyComponent={() => (
            <Spinner
              isVisible={true}
              color="#00bfa5"
              type="ChasingDots"
              size={50}
            />
          )}
          style={{marginBottom: 75}}
          renderItem={({item, index, separators}) => (
            <View
              style={{
                flexDirection: 'row',
                backgroundColor: 'white',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  backgroundColor: 'white',
                  marginVertical: 10,
                  alignItems: 'center',
                }}>
                <Text style={[styles.placeText]}>
                  {index < 9 ? index + 1 : '○'}
                </Text>
                <Avatar
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
      </View>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'center',
    paddingBottom: 80,
  },
  header: {
    backgroundColor: '#00bfa5',
    alignItems: 'center',
    padding: 20,
    paddingTop: StatusBar.currentHeight,
  },
  headerText: {
    color: 'white',
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
    color: '#919191',
  },
  avatar: {
    height: 30,
    width: 30,
    borderRadius: 30 / 2,
    shadowColor: '#000',
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
