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
import { Mode } from './src/dialogs/WisbDialog';
import { PortalProvider } from '@gorhom/portal';
import { ClickOutsideProvider } from 'react-native-click-outside';
import { LatLng } from 'react-native-maps';
import Dumpster from './src/API/data_types/Dumpster';
import Event from './src/API/data_types/Event';
import { isDumpster, isEvent, isWasteland } from './src/API/data_types/type_guards';
import { LogBox } from 'react-native';
import IconType from './src/components/WisbIcon/IconType';
import ModificatorType from './src/components/WisbIcon/ModificatorType';
import QRCodeDialog from './src/components/QRCodeDialog';
import { Type } from './src/API/helpers';

LogBox.ignoreAllLogs();

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
  'FontAwesomeIcon: ',
  'Sending `geolocationDidChange` with no listeners registered.'
]);

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

  const [currentScreen, setCurrentScreen] = React.useState<WisbScreens>(WisbScreens.MapScreen)

  const [isQrCodeDialogVisible, setIsQrCodeDialogVisible] = React.useState(false)

  const [userLocation, setUserLocation] = React.useState(Resources.get().getLastLocation())

  React.useEffect(() => {
    return Resources.get().registerUserLocationListener(newLocation => {
      setUserLocation(newLocation)
    })
  })

  const onItemSelected = (item: Event | Wasteland | Dumpster) => {
    if(isDumpster(item)) {
        setDialogData({
          [Type.Dumpster]: {
            mode: Mode.Viewing,
            item: item
          }
        })
    } else if(isEvent(item)) {
      setDialogData({
        [Type.Event]: {
          mode: Mode.Viewing,
          item: item
        }
      })
    } else if(isWasteland(item)) {
      setDialogData({
        [Type.Wasteland]: {
          mode: Mode.Viewing,
          item: item
        }
      })
    }
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
              screenOptions={{ headerShown: false, animation: "fade_from_bottom", animationDuration: 500 }}>
              <Stack.Screen name={WisbScreens.ChatScreen} component={ChatScreen} />
              <Stack.Screen name={WisbScreens.LoginScreen} component={LoginScreen} />
              <Stack.Screen name={WisbScreens.MyEventsScreen} component={MyEventsScreen} />
              <Stack.Screen name={WisbScreens.MapScreen} component={MapScreen} initialParams={{
                onItemSelected
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
                  navigationRef.navigate(WisbScreens.MyEventsScreen, {})
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
                  navigationRef.navigate(WisbScreens.MapScreen, { onItemSelected })
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

          <EventDialog 
            visible={dialogData[Type.Event] != null} 
            event={dialogData[Type.Event]?.item}
            mode={dialogData[Type.Event]?.mode ?? Mode.Viewing} 
            userLocation={userLocation} 
            onDismiss={() => setDialogData({})} />
          <WastelandDialog 
            visible={dialogData[Type.Wasteland] != null} 
            wasteland={dialogData[Type.Wasteland]?.item}
            mode={dialogData[Type.Wasteland]?.mode ?? Mode.Viewing} 
            userLocation={userLocation}
            onDismiss={() => setDialogData({})} />
          <DumpsterDialog 
            visible={dialogData[Type.Dumpster] != null} 
            dumpster={dialogData[Type.Dumpster]?.item}
            mode={dialogData[Type.Dumpster]?.mode ?? Mode.Viewing} 
            userLocation={userLocation} 
            onDismiss={() => setDialogData({})} />

          <QRCodeDialog
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
            }} />
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