import { faQrcode } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { PortalProvider } from '@gorhom/portal';
import { NavigationContainer, createNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import {
  LogBox,
  StyleSheet,
  View
} from 'react-native';
import { ClickOutsideProvider } from 'react-native-click-outside';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Resources from './res/Resources';
import WisbObjectType from './src/API/WisbObjectType';
import getAPI from './src/API/getAPI';
import { WisbDumpster, WisbEvent, WisbUser, WisbWasteland } from './src/API/interfaces';
import { isDumpster, isEvent, isWasteland } from './src/API/type_guards';
import NavBar from './src/components/NavBar/NavBar';
import IconType from './src/components/WisbIcon/IconType';
import ModificatorType from './src/components/WisbIcon/ModificatorType';
import WisbIcon from './src/components/WisbIcon/WisbIcon';
import QRCodeDialog from './src/dialogs/QRCodeDialog';
import ChatScreen from './src/screens/ChatScreen';
import LeaderboardScreen from './src/screens/LeaderBoardScreen';
import LoginScreen from './src/screens/LoginScreen';
import MapScreen from './src/screens/MapScreen';
import MyEventsScreen from './src/screens/MyEventsScreen';
import NavigationParamsList, { WisbNavigateFunction, WisbScreens } from './src/screens/NavigationParamsList';
import SettingsScreen from './src/screens/SettingsScreen';
import SplashScreen from './src/screens/SplashScreen';
import DumpsterDialog from './src/dialogs/DumpsterDialog';
import EventDialog from './src/dialogs/EventDialog';
import WastelandDialog from './src/dialogs/WastelandDialog';
import { Mode } from './src/dialogs/WisbDialog';

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
  const [currentScreen, setCurrentScreen] = React.useState<WisbScreens>(WisbScreens.SplashScreen)
  const [isQrCodeDialogVisible, setIsQrCodeDialogVisible] = React.useState(false)
  const [userLocation, setUserLocation] = React.useState(res.getLastLocation())
  const [currentUser, setCurrentUser] = React.useState<WisbUser | null>(api.getCurrentUser())

  const onUserLoggedIn = (user: WisbUser) => {
    res.registerUserLocationListener(newLocation => {
      setUserLocation(newLocation)
    })

    setCurrentUser(user)
    navigate(WisbScreens.MapScreen, {})
  }

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
      navigationRef.navigate(WisbScreens.MapScreen, { onItemSelected, navigate: { go: navigate, goBack } })
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
    <GestureHandlerRootView style={{ flex: 1 }}>
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
                  onItemSelected
                }} />
                <Stack.Screen name={WisbScreens.SplashScreen} component={SplashScreen} initialParams={{
                  navigate: { go: navigate, goBack }
                }} />
                <Stack.Screen name={WisbScreens.MapScreen} component={MapScreen} initialParams={{
                  onItemSelected,
                }} />
                <Stack.Screen name={WisbScreens.SettingsScreen} component={SettingsScreen} />
                <Stack.Screen name={WisbScreens.LeaderBoardScreen} component={LeaderboardScreen} />
              </Stack.Navigator>
            </NavigationContainer>

            <NavBar
              enabled
              selectedIndex={ScreensNavbarMap[currentScreen].navBarIndex ?? 1}
              visible={ScreensNavbarMap[currentScreen].navBarIndex !== null}
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
                        <WisbIcon style={styles.bubbleIcon} icon={IconType.Calendar} size={22} modificator={ModificatorType.Add} />
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
                        <WisbIcon style={styles.bubbleIcon} icon={IconType.Dumpster} size={22} modificator={ModificatorType.Add} />
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
                        <WisbIcon style={styles.bubbleIcon} icon={IconType.WastelandIcon} size={50} modificator={ModificatorType.Add} />
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
                    wasteland={dialogData[WisbObjectType.Wasteland]?.item}
                    mode={dialogData[WisbObjectType.Wasteland]?.mode ?? Mode.Viewing}
                    userLocation={userLocation}
                    currentUser={currentUser}
                    onDismiss={() => setDialogData({})} /> : null}
                  {dialogData[WisbObjectType.Dumpster] != null ? <DumpsterDialog
                    currentUser={currentUser}
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
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: res.getColors().Primary,
    flexDirection: "column",
    justifyContent: "space-between"
  },
  bubbleIcon: {
    width: 28,
    height: 28,
    borderRadius: 100
  }
});
