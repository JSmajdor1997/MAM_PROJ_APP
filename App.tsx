import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Resources from './res/Resources';
import SplashScreen from './src/screens/SplashScreen';
import MapScreen from './src/screens/MapScreen';
import NavBar from './src/components/NavBar/NavBar';
import LoginScreen from './src/screens/LoginScreen';
import Toast from 'react-native-simple-toast';
import ChatScreen from './src/screens/ChatScreen';
import { NavigationContainer, createNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WisbScreens from './src/screens/WisbScreens';
import LeaderboardScreen from './src/screens/LeaderBoardScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import MyEventsScreen from './src/screens/MyEventsScreen';
import NavigationParamsList from './src/screens/NavigationParamsList';
import WisbIcon from './src/components/WisbIcon/WisbIcon';
import Wasteland from './src/API/data_types/Wasteland';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faQrcode } from '@fortawesome/free-solid-svg-icons';
import DumpsterDialog from './src/dialogs/DumpsterDialog';
import EventDialog from './src/dialogs/EventDialog';
import WastelandDialog from './src/dialogs/WastelandDialog';
import DateTimePickerModal from "react-native-modal-datetime-picker"
import { Mode } from './src/dialogs/WisbDialog';
import { PortalProvider } from '@gorhom/portal';
import { ClickOutsideProvider } from 'react-native-click-outside';
import { LatLng } from 'react-native-maps';
import Dumpster from './src/API/data_types/Dumpster';
import Event from './src/API/data_types/Event';
import { isDumpster, isEvent, isWasteland } from './src/API/type_guards';
import { LogBox } from 'react-native';
import IconType from './src/components/WisbIcon/IconType';
import ModificatorType from './src/components/WisbIcon/ModificatorType';
import QRCodeDialog from './src/components/QRCodeDialog';
import { Type } from './src/API/helpers';
import getAPI from './src/API/getAPI';
import User from './src/API/data_types/User';
import Spinner from 'react-native-spinkit';
import { NewEventInvitationNotification, NewMessageNotification, NewObjectNotification, NotificationType, ObjectDeletionNotification, ObjectUpdatedNotification, WastelandClearedNotification, switchNotification } from './src/API/data_types/notifications';

LogBox.ignoreAllLogs();

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
  'FontAwesomeIcon: ',
  'Sending `geolocationDidChange` with no listeners registered.'
]);

const api = getAPI()

const ScreensNavbarMap = {
  [WisbScreens.ChatScreen]: {
    navBarIndex: null
  },
  [WisbScreens.LeaderBoardScreen]: {
    navBarIndex: 2
  },
  [WisbScreens.LoginScreen]: {
    navBarIndex: null
  },
  [WisbScreens.MapScreen]: {
    navBarIndex: 1
  },
  [WisbScreens.MyEventsScreen]: {
    navBarIndex: 0
  },
  [WisbScreens.SettingsScreen]: {
    navBarIndex: null
  },
  [WisbScreens.SplashScreen]: {
    navBarIndex: null
  },
}

type DialogDataItem<T> = {
  mode: Mode.Adding
  item?: never
} | {
  mode: Mode.Viewing
  item: T
}

type DialogData = {
  [Type.Event]?: DialogDataItem<Event>
  [Type.Dumpster]?: DialogDataItem<Dumpster>
  [Type.Wasteland]?: DialogDataItem<Wasteland>
}

const navigationRef = createNavigationContainerRef<NavigationParamsList>()

const Stack = createNativeStackNavigator<NavigationParamsList>();

export default function App() {
  const [dialogData, setDialogData] = React.useState<DialogData>({})

  const [currentScreen, setCurrentScreen] = React.useState<WisbScreens>(WisbScreens.LoginScreen)

  const [isQrCodeDialogVisible, setIsQrCodeDialogVisible] = React.useState(false)

  const [userLocation, setUserLocation] = React.useState(Resources.get().getLastLocation())

  const [currentUser, setCurrentUser] = React.useState<User | null>()

  const onUserLoggedIn = (user: User) => {
    Resources.get().registerUserLocationListener(newLocation => {
      setUserLocation(newLocation)
      api.updateListener(apiListenerId, { location: newLocation })
    })

    setCurrentUser(user)
  }

  let apiListenerId = -1

  const onLogout = () => {
    navigationRef.navigate(WisbScreens.LoginScreen, {
      onUserLoggedIn
    })
  }

  React.useEffect(() => {
    api.registerListener({ location: userLocation }, (e) => {
      switchNotification(e, {
        [NotificationType.NewObjectNotification]: (item: NewObjectNotification) => {
          if (isEvent(item.newItem)) {
            Toast.show(`New event in your area ${item.newItem.name}`, Toast.SHORT);
          }
        },
        [NotificationType.NewMessageNotification]: (item: NewMessageNotification) => {
          Toast.show(`You've got new message in event ${item.event.name}`, Toast.SHORT);
        },
        [NotificationType.NewEventInvitationNotification]: (item: NewEventInvitationNotification) => {
          Toast.show("You've got new invitation to event!", Toast.SHORT);
        },
      })
    }).then(result => {
      if (result.data != null) {
        apiListenerId = result.data.listenerId
      }
    })

    api.addOnLogoutListener(onLogout)

    return () => {
      api.removeOnLogoutListener(onLogout)

      if (apiListenerId != -1) {
        api.removeListener(apiListenerId)
      }
    }
  }, [])

  const onItemSelected = (item: Event | Wasteland | Dumpster) => {
    if (isDumpster(item)) {
      setDialogData({
        [Type.Dumpster]: {
          mode: Mode.Viewing,
          item: item
        }
      })
    } else if (isEvent(item)) {
      setDialogData({
        [Type.Event]: {
          mode: Mode.Viewing,
          item: item
        }
      })
    } else if (isWasteland(item)) {
      setDialogData({
        [Type.Wasteland]: {
          mode: Mode.Viewing,
          item: item
        }
      })
    }
  }

  React.useEffect(() => {
    if (currentUser != null) {
      navigationRef.navigate(WisbScreens.MapScreen, {
        onItemSelected,
        getCurrentUser
      })
    }
  }, [currentUser])

  const getCurrentUser = () => currentUser as User

  return (
    <ClickOutsideProvider>
      <PortalProvider>
        <View style={styles.root}>
          <NavigationContainer ref={navigationRef} onStateChange={state => {
            const currentScreen = state?.routes[state.index].name

            if (currentScreen == null) {
              return
            }

            setCurrentScreen(currentScreen as WisbScreens)
          }}>
            <Stack.Navigator
              initialRouteName={currentScreen}
              screenOptions={{ headerShown: false, animation: "fade_from_bottom", animationDuration: 500, gestureEnabled: false }}>
              <Stack.Screen name={WisbScreens.ChatScreen} component={ChatScreen} />
              <Stack.Screen name={WisbScreens.LoginScreen} component={LoginScreen} initialParams={{
                onUserLoggedIn
              }} />
              <Stack.Screen name={WisbScreens.MyEventsScreen} component={MyEventsScreen} initialParams={{
                getCurrentUser
              }} />
              <Stack.Screen name={WisbScreens.MapScreen} component={MapScreen} initialParams={{
                onItemSelected,
                getCurrentUser
              }} />
              <Stack.Screen name={WisbScreens.LeaderBoardScreen} component={LeaderboardScreen} />
              <Stack.Screen name={WisbScreens.SettingsScreen} component={SettingsScreen} />
              <Stack.Screen name={WisbScreens.SplashScreen} component={SplashScreen} />
            </Stack.Navigator>
          </NavigationContainer>

          <NavBar
            enabled
            selectedIndex={ScreensNavbarMap[currentScreen].navBarIndex ?? 1}
            visible={ScreensNavbarMap[currentScreen].navBarIndex != null}
            items={[
              {
                render: (isActive) => <WisbIcon icon={IconType.Calendar} size={isActive ? 30 : 25} />,
                onPress: () => {
                  navigationRef.navigate(WisbScreens.MyEventsScreen, { getCurrentUser })
                },
                bubbles: [
                  {
                    component: <FontAwesomeIcon icon={faQrcode} />,
                    onPress: () => setIsQrCodeDialogVisible(true),
                  },
                ],
              },
              {
                render: () => <WisbIcon icon={IconType.Earth} size={30} />,
                onPress: () => {
                  navigationRef.navigate(WisbScreens.MapScreen, { onItemSelected, getCurrentUser })
                },
                bubbles: [
                  {
                    component: (
                      <WisbIcon style={{ width: 28, height: 28, borderRadius: 100 }} icon={IconType.Calendar} size={22} modificator={ModificatorType.Add} />
                    ),
                    onPress: () => {
                      setDialogData({
                        [Type.Event]: {
                          mode: Mode.Adding,
                        }
                      })
                    },
                  },
                  {
                    component: (
                      <WisbIcon style={{ width: 28, height: 28, borderRadius: 100 }} icon={IconType.Dumpster} size={22} modificator={ModificatorType.Add} />
                    ),
                    onPress: () => {
                      setDialogData({
                        [Type.Dumpster]: {
                          mode: Mode.Adding,
                        }
                      })
                    },
                  },
                  {
                    component: (
                      <WisbIcon style={{ width: 28, height: 28, borderRadius: 100 }} icon={IconType.WastelandIcon} size={50} modificator={ModificatorType.Add} />
                    ),
                    onPress: () => {
                      setDialogData({
                        [Type.Wasteland]: {
                          mode: Mode.Adding,
                        }
                      })
                    },
                  },
                ],
              },
              {
                render: () => <WisbIcon icon={IconType.Chevron} size={30} />,
                onPress: () => {
                  navigationRef.navigate(WisbScreens.LeaderBoardScreen, { onItemSelected })
                },
              },
            ]} />

          {
            currentUser == null ? null : (
              <>
                {dialogData[Type.Event] != null ? <EventDialog
                  visible={dialogData[Type.Event] != null}
                  googleMapsApiKey={Resources.get().getEnv().GOOGLE_MAPS_API_KEY}
                  event={dialogData[Type.Event]?.item}
                  mode={dialogData[Type.Event]?.mode ?? Mode.Viewing}
                  userLocation={userLocation}
                  currentUser={currentUser}
                  onDismiss={() => setDialogData({})}
                  onOpenChat={event => {
                    navigationRef.navigate(WisbScreens.ChatScreen, { event })
                    setDialogData({})
                  }} /> : null}
                {dialogData[Type.Wasteland] != null ? <WastelandDialog
                  visible={dialogData[Type.Wasteland] != null}
                  wasteland={dialogData[Type.Wasteland]?.item}
                  mode={dialogData[Type.Wasteland]?.mode ?? Mode.Viewing}
                  userLocation={userLocation}
                  currentUser={currentUser}
                  onDismiss={() => setDialogData({})} /> : null}
                {dialogData[Type.Dumpster] != null ? <DumpsterDialog
                  currentUser={currentUser}
                  visible={dialogData[Type.Dumpster] != null}
                  dumpster={dialogData[Type.Dumpster]?.item}
                  mode={dialogData[Type.Dumpster]?.mode ?? Mode.Viewing}
                  userLocation={userLocation}
                  onDismiss={() => setDialogData({})} /> : null}
              </>
            )
          }

          {isQrCodeDialogVisible ? <QRCodeDialog
            visible={isQrCodeDialogVisible}
            onDismiss={() => setIsQrCodeDialogVisible(false)}
            onEvent={event => {
              setIsQrCodeDialogVisible(false)
              setDialogData({
                [Type.Event]: {
                  mode: Mode.Viewing,
                  item: event
                }
              })
            }} /> : null}
        </View>
      </PortalProvider>
    </ClickOutsideProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Resources.get().getColors().Primary,
    flexDirection: "column",
    justifyContent: "space-between"
  },
});