import React from 'react';
import {
  StyleSheet,
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
import WisbIcon, { IconType, ModificatorType } from './src/components/WisbIcon';
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
import { LocationProvider } from './src/hooks/LocationContext';
import getRandomLatLngInPoland from './src/API/implementations/mockup/getRandomLatLngInPoland';

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
  'Sending `geolocationDidChange` with no listeners registered.'
]);

enum NavBarIndices {
  MyEvents = 0,
  Map = 1,
  Leadership = 2
}

const navigationRef = createNavigationContainerRef<NavigationParamsList>()

const Stack = createNativeStackNavigator<NavigationParamsList>();

export default function App() {
  const [navBarIndex, setNavBarIndex] = React.useState(NavBarIndices.Map)
  const [isNavigationBarVisible, setIsNavigationBarVisible] = React.useState(true)

  const [dialogMode, setDialogMode] = React.useState<Mode>(Mode.Viewing)
  const [selectedItem, setSelectedItem] = React.useState<Wasteland | Dumpster | Event | null>(null)

  const [userLocation, setUserLocation] = React.useState(getRandomLatLngInPoland())

  return (
    <LocationProvider onLocationChanged={setUserLocation}>
      <ClickOutsideProvider>
        <PortalProvider>
          <View style={styles.root}>
            <NavigationContainer ref={navigationRef} onStateChange={state => {
              const currentScreen = state?.routes[state.index].name

              if (currentScreen == null) {
                return
              }

              switch (currentScreen) {
                case WisbScreens.MapScreen:
                case WisbScreens.LeaderBoardScreen:
                case WisbScreens.MyEventsScreen:
                  setIsNavigationBarVisible(true)
                  break

                case WisbScreens.ChatScreen:
                case WisbScreens.LoginScreen:
                case WisbScreens.SettingsScreen:
                case WisbScreens.SplashScreen:
                case WisbScreens.ChatScreen:
                  setIsNavigationBarVisible(false)
                  break;
              }
            }}>
              <Stack.Navigator
                initialRouteName={WisbScreens.MapScreen}
                screenOptions={{ headerShown: false, animation: "fade", animationDuration: 100 }}>
                <Stack.Screen name={WisbScreens.ChatScreen} component={ChatScreen} />
                <Stack.Screen name={WisbScreens.LeaderBoardScreen} component={LeaderboardScreen} />
                <Stack.Screen name={WisbScreens.LoginScreen} component={LoginScreen} />
                <Stack.Screen name={WisbScreens.MapScreen} component={MapScreen} initialParams={{
                  onItemSelected: setSelectedItem
                }} />
                <Stack.Screen name={WisbScreens.MyEventsScreen} component={MyEventsScreen} />
                <Stack.Screen name={WisbScreens.SettingsScreen} component={SettingsScreen} />
                <Stack.Screen name={WisbScreens.SplashScreen} component={SplashScreen} />
              </Stack.Navigator>
            </NavigationContainer>

            <NavBar
              enabled
              selectedIndex={navBarIndex}
              visible={isNavigationBarVisible}
              items={[
                {
                  render: (isActive) => <WisbIcon icon={IconType.Calendar} size={isActive ? 30 : 25} />,
                  onPress: () => {
                    navigationRef.navigate(WisbScreens.MyEventsScreen, {})
                    setNavBarIndex(NavBarIndices.MyEvents)
                  },
                  bubbles: [
                    {
                      component: <FontAwesomeIcon icon={faQrcode} />,
                      onPress: () => setState({ isQRDialogVisible: true }),
                    },
                  ],
                },
                {
                  render: () => <WisbIcon icon={IconType.Earth} size={30} />,
                  onPress: () => {
                    navigationRef.navigate(WisbScreens.MapScreen, { onItemSelected: setSelectedItem })
                    setNavBarIndex(NavBarIndices.Map)
                  },
                  bubbles: [
                    {
                      component: (
                        <WisbIcon style={{ width: 28, height: 28, borderRadius: 100 }} icon={IconType.Calendar} size={22} modificator={ModificatorType.Add} />
                      ),
                      onPress: () => {
                        // setIsEventAddingDialogVisible(true)
                        // setIsWastelandAddingDialogVisible(false)
                        // setIsDumpsterAddingDialogVisible(false)
                      },
                    },
                    {
                      component: (
                        <WisbIcon style={{ width: 28, height: 28, borderRadius: 100 }} icon={IconType.Dumpster} size={22} modificator={ModificatorType.Add} />
                      ),
                      onPress: () => {
                        // setIsEventAddingDialogVisible(false)
                        // setIsWastelandAddingDialogVisible(false)
                        // setIsDumpsterAddingDialogVisible(true)
                      },
                    },
                    {
                      component: (
                        <WisbIcon style={{ width: 28, height: 28, borderRadius: 100 }} icon={IconType.WastelandIcon} size={50} modificator={ModificatorType.Add} />
                      ),
                      onPress: () => {
                        // setIsEventAddingDialogVisible(false)
                        // setIsWastelandAddingDialogVisible(true)
                        // setIsDumpsterAddingDialogVisible(false)
                      },
                    },
                  ],
                },
                {
                  render: () => <WisbIcon icon={IconType.Chevron} size={30} />,
                  onPress: () => {
                    navigationRef.navigate(WisbScreens.MapScreen, { onItemSelected: setSelectedItem })
                    setNavBarIndex(NavBarIndices.Leadership)
                  },
                },
              ]} />

            <EventDialog visible={selectedItem != null && isEvent(selectedItem)} mode={Mode.Viewing} userLocation={userLocation} onDismiss={() => {

            }} />
            <WastelandDialog visible={selectedItem != null && isWasteland(selectedItem)} mode={Mode.Viewing} userLocation={userLocation} onDismiss={() => {

            }} />
            <DumpsterDialog visible={selectedItem != null && isDumpster(selectedItem)} mode={Mode.Viewing} userLocation={userLocation} onDismiss={() => {

            }} />
          </View>
        </PortalProvider>
      </ClickOutsideProvider>
    </LocationProvider>
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