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
import NavigationParamsList, { WisbNavigateFunction } from './src/screens/NavigationParamsList';
import WisbIcon from './src/components/WisbIcon/WisbIcon';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faQrcode } from '@fortawesome/free-solid-svg-icons';
import DumpsterDialog from './src/dialogs/DumpsterDialog';
import EventDialog from './src/dialogs/EventDialog';
import WastelandDialog from './src/dialogs/WastelandDialog';
import { Mode } from './src/dialogs/WisbDialog';
import { PortalProvider } from '@gorhom/portal';
import { ClickOutsideProvider } from 'react-native-click-outside';
import { isDumpster, isEvent, isWasteland } from './src/API/type_guards';
import { LogBox } from 'react-native';
import IconType from './src/components/WisbIcon/IconType';
import ModificatorType from './src/components/WisbIcon/ModificatorType';
import QRCodeDialog from './src/components/QRCodeDialog';
import getAPI from './src/API/getAPI';
import WisbObjectType from './src/API/WisbObjectType';
import { NotificationType } from './src/API/ListenersManager';
import { WisbEvent, WisbDumpster, WisbWasteland, WisbUser } from './src/API/interfaces';
import { CRUD, NewMessageNotification, Notification, isNewInvitationNotification, isNewMessageNotification, isObjectCRUDNotification } from './src/API/notifications';
import Snackbar from 'react-native-snackbar';

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
  [WisbObjectType.Event]?: DialogDataItem<WisbEvent>
  [WisbObjectType.Dumpster]?: DialogDataItem<WisbDumpster>
  [WisbObjectType.Wasteland]?: DialogDataItem<WisbWasteland>
}

const navigationRef = createNavigationContainerRef<NavigationParamsList>()

const Stack = createNativeStackNavigator<NavigationParamsList>();

const res = Resources.get()

export default function App() {
  const [dialogData, setDialogData] = React.useState<DialogData>({})
  const [currentScreen, setCurrentScreen] = React.useState<WisbScreens>(WisbScreens.LoginScreen)
  const [isQrCodeDialogVisible, setIsQrCodeDialogVisible] = React.useState(false)
  const [userLocation, setUserLocation] = React.useState(res.getLastLocation())
  const [currentUser, setCurrentUser] = React.useState<WisbUser | null>()

  const onNotification = async (n: Notification) => {
    if (![WisbScreens.MapScreen, WisbScreens.MyEventsScreen].includes(currentScreen) || isQrCodeDialogVisible) {
      return
    }

    if (
      dialogData[WisbObjectType.Dumpster] != null ||
      dialogData[WisbObjectType.Wasteland] != null ||
      dialogData[WisbObjectType.Event] != null
    ) {
      return
    }

    const settings = res.getSettings()
    if (isObjectCRUDNotification(n) && n.action == CRUD.Created) {

      if (
        (settings.notifications.newDumpsterInArea && n.type == WisbObjectType.Dumpster) ||
        (settings.notifications.newEventInArea && n.type == WisbObjectType.Event) ||
        (settings.notifications.newWastelandInArea && n.type == WisbObjectType.Wasteland)
      ) {
        Snackbar.show({
          text: (
            n.type == WisbObjectType.Dumpster ? "Nowy śmietnik w twojej okolicy" :
              n.type == WisbObjectType.Event ? "Nowe wydarzenie w twojej okolicy" :
                n.type == WisbObjectType.Wasteland ? "Nowe wysypisko w twojej okolicy" :
                  ""
          ),
          duration: Snackbar.LENGTH_SHORT,
          backgroundColor: res.getColors().Blue,
          textColor: res.getColors().Primary,
          marginBottom: 180,
          action: {
            text: 'POKAŻ',
            textColor: res.getColors().Primary,
            onPress: async () => {
              setDialogData({
                [n.type]: {
                  mode: Mode.Viewing,
                  item: (await api.getOne(n.ref!)).data! as any
                }
              })
            },
          },
        });
      }
    } else if (isNewMessageNotification(n)) {
      if (settings.notifications.newMessage) {
        Snackbar.show({
          text: `Nowa wiadomość w wydarzeniu: ${n.message.content}`,
          duration: Snackbar.LENGTH_SHORT,
          backgroundColor: res.getColors().Beige,
          textColor: res.getColors().Primary,
          marginBottom: 180,
          action: {
            text: 'POKAŻ',
            textColor: res.getColors().Primary,
            onPress: async () => {
              navigate(WisbScreens.ChatScreen, { event: (await api.getOne(n.message.event)).data! })
            },
          },
        });
      }
    } else if (isNewInvitationNotification(n)) {
      if (settings.notifications.newInvitation) {
        Snackbar.show({
          text: `Otrzymałeś zaproszenie do wydarzenia: ${n.invitation.event.name}`,
          duration: Snackbar.LENGTH_SHORT,
          backgroundColor: res.getColors().Yellow,
          textColor: res.getColors().Primary,
          marginBottom: 180,
          action: {
            text: 'POKAŻ',
            textColor: res.getColors().Primary,
            onPress: async () => {
              setDialogData({
                [WisbObjectType.Event]: {
                  mode: Mode.Viewing,
                  item: (await api.getOne(n.invitation.event)).data!
                }
              })
            },
          },
        });
      }
    }
  }

  const onUserLoggedIn = (user: WisbUser) => {
    res.registerUserLocationListener(newLocation => {
      setUserLocation(newLocation)
      api.notifications.updateListener(onNotification, { location: newLocation })
    })

    setCurrentUser(user)

    navigate(WisbScreens.MapScreen, {})
  }

  React.useEffect(() => {
    api.notifications.registerListener(onNotification, { location: userLocation })

    return () => {
      api.notifications.unregisterListener(onNotification)
    }
  }, [])

  const onItemSelected = (item: WisbEvent | WisbWasteland | WisbDumpster) => {
    if (isDumpster(item)) {
      setDialogData({
        [WisbObjectType.Dumpster]: {
          mode: Mode.Viewing,
          item: item
        }
      })
    } else if (isEvent(item)) {
      setDialogData({
        [WisbObjectType.Event]: {
          mode: Mode.Viewing,
          item: item
        }
      })
    } else if (isWasteland(item)) {
      setDialogData({
        [WisbObjectType.Wasteland]: {
          mode: Mode.Viewing,
          item: item
        }
      })
    }
  }

  const goBack = () => {
    if (navigationRef.canGoBack()) {
      navigationRef.goBack()
    } else {
      navigationRef.navigate(WisbScreens.MapScreen, { onItemSelected, getCurrentUser: () => api.getCurrentUser()!, navigate: { go: navigate, goBack } })
    }
  }

  const navigate: WisbNavigateFunction<WisbScreens> = function <T extends WisbScreens>(screen: T, data: T extends WisbScreens.ChatScreen ? { event: WisbEvent } : {}) {
    navigationRef.navigate(screen as WisbScreens,
      screen == WisbScreens.ChatScreen ? { ...data, navigate: { go: navigate, goBack } } :
        screen == WisbScreens.LeaderBoardScreen ? { navigate: { go: navigate, goBack } } :
          screen == WisbScreens.LoginScreen ? { onUserLoggedIn, navigate: { go: navigate, goBack } } :
            screen == WisbScreens.MyEventsScreen ? { getCurrentUser: () => api.getCurrentUser()!, navigate: { go: navigate, goBack }, onItemSelected } :
              screen == WisbScreens.SettingsScreen ? { navigate: { go: navigate, goBack } } :
                screen == WisbScreens.MapScreen ? { onItemSelected, getCurrentUser: () => api.getCurrentUser()!, navigate: { go: navigate, goBack } } :
                  screen == WisbScreens.SplashScreen ? { navigate: { go: navigate, goBack } } :
                    {} as any
    )
  }

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
                getCurrentUser: () => api.getCurrentUser()!,
                onItemSelected
              }} />
              <Stack.Screen name={WisbScreens.SplashScreen} component={SplashScreen} />
              <Stack.Screen name={WisbScreens.MapScreen} component={MapScreen} initialParams={{
                onItemSelected,
                getCurrentUser: () => api.getCurrentUser()!
              }} />
              <Stack.Screen name={WisbScreens.SettingsScreen} component={SettingsScreen} />
              <Stack.Screen name={WisbScreens.LeaderBoardScreen} component={LeaderboardScreen} />
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
                  navigate(WisbScreens.MyEventsScreen, {})
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
                  navigate(WisbScreens.MapScreen, {})
                },
                bubbles: [
                  {
                    component: (
                      <WisbIcon style={{ width: 28, height: 28, borderRadius: 100 }} icon={IconType.Calendar} size={22} modificator={ModificatorType.Add} />
                    ),
                    onPress: () => {
                      setDialogData({
                        [WisbObjectType.Event]: {
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
                        [WisbObjectType.Dumpster]: {
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
                        [WisbObjectType.Wasteland]: {
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
                  navigate(WisbScreens.LeaderBoardScreen, {})
                },
              },
            ]} />

          {
            currentUser == null ? null : (
              <>
                {dialogData[WisbObjectType.Event] != null ? <EventDialog
                  visible={dialogData[WisbObjectType.Event] != null}
                  googleMapsApiKey={res.getEnv().GOOGLE_MAPS_API_KEY}
                  event={dialogData[WisbObjectType.Event]?.item}
                  mode={dialogData[WisbObjectType.Event]?.mode ?? Mode.Viewing}
                  userLocation={userLocation}
                  currentUser={currentUser}
                  onDismiss={() => setDialogData({})}
                  onOpenChat={event => {
                    navigate(WisbScreens.ChatScreen, { event })
                    setDialogData({})
                  }} /> : null}
                {dialogData[WisbObjectType.Wasteland] != null ? <WastelandDialog
                  visible={dialogData[WisbObjectType.Wasteland] != null}
                  wasteland={dialogData[WisbObjectType.Wasteland]?.item}
                  mode={dialogData[WisbObjectType.Wasteland]?.mode ?? Mode.Viewing}
                  userLocation={userLocation}
                  currentUser={currentUser}
                  onDismiss={() => setDialogData({})} /> : null}
                {dialogData[WisbObjectType.Dumpster] != null ? <DumpsterDialog
                  currentUser={currentUser}
                  visible={dialogData[WisbObjectType.Dumpster] != null}
                  dumpster={dialogData[WisbObjectType.Dumpster]?.item}
                  mode={dialogData[WisbObjectType.Dumpster]?.mode ?? Mode.Viewing}
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
                [WisbObjectType.Event]: {
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
    backgroundColor: res.getColors().Primary,
    flexDirection: "column",
    justifyContent: "space-between"
  },
});