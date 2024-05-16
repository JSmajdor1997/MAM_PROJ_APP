import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Image,
  View,
  Modal
} from 'react-native';
import { Resources } from './res/Resources';
import SplashScreen from './src/screens/SplashScreen';
import MapScreen from './src/screens/MapScreen';
import NavBar from './src/components/NavBar';
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

const navigationRef = createNavigationContainerRef<NavigationParamsList>()

function navigate<ScreenType extends WisbScreens>(name: WisbScreens, params: NavigationParamsList[ScreenType]) {
  navigationRef.navigate(name, params);
}

const Stack = createNativeStackNavigator<NavigationParamsList>();

export default function App() {
  const [navBarIndex, setNavBarIndex] = React.useState(1)
  const [isNavigationBarVisible, setIsNavigationBarVisible] = React.useState(true)

  const [selectedWasteland, setSelectedWasteland] = React.useState<Wasteland | undefined>()
  const [isDumpsterAddingDialogVisible, setIsDumpsterAddingDialogVisible] = React.useState(false)
  const [isEventAddingDialogVisible, setIsEventAddingDialogVisible] = React.useState(false)

  return (
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
          initialRouteName={WisbScreens.SplashScreen}
          screenOptions={{ headerShown: false, animation: "fade", animationDuration: 100 }}>
          <Stack.Screen name={WisbScreens.ChatScreen} component={ChatScreen} />
          <Stack.Screen name={WisbScreens.LeaderBoardScreen} component={LeaderboardScreen} />
          <Stack.Screen name={WisbScreens.LoginScreen} component={LoginScreen} />
          <Stack.Screen name={WisbScreens.MapScreen} component={MapScreen} />
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
              navigate(WisbScreens.MyEventsScreen, {})
              setNavBarIndex(0)
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
              navigate(WisbScreens.MapScreen, {})
              setNavBarIndex(1)
            },
            bubbles: [
              {
                component: (
                  <WisbIcon style={{ width: 28, height: 28, borderRadius: 100 }} icon={IconType.Calendar} size={22} modificator={ModificatorType.Add} />
                ),
                onPress: () => {
                  setIsEventAddingDialogVisible(true)
                  setIsWastelandAddingDialogVisible(false)
                  setIsDumpsterAddingDialogVisible(false)
                },
              },
              {
                component: (
                  <WisbIcon style={{ width: 28, height: 28, borderRadius: 100 }} icon={IconType.Dumpster} size={22} modificator={ModificatorType.Add} />
                ),
                onPress: () => {
                  setIsEventAddingDialogVisible(false)
                  setIsWastelandAddingDialogVisible(false)
                  setIsDumpsterAddingDialogVisible(true)
                },
              },
              {
                component: (
                  <WisbIcon style={{ width: 28, height: 28, borderRadius: 100 }} icon={IconType.WastelandIcon} size={50} modificator={ModificatorType.Add} />
                ),
                onPress: () => {
                  setIsEventAddingDialogVisible(false)
                  setIsWastelandAddingDialogVisible(true)
                  setIsDumpsterAddingDialogVisible(false)
                },
              },
            ],
          },
          {
            render: () => <WisbIcon icon={IconType.Chevron} size={30} />,
            onPress: () => {
              navigate(WisbScreens.LeaderBoardScreen, {})
              setNavBarIndex(2)
            },
          },
        ]} />

      <EventDialog visible={false} mode={Mode.Adding}/>
      <WastelandDialog visible={false} mode={Mode.Adding}/>
      <DumpsterDialog visible={false} mode={Mode.Adding}/> 
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Resources.Colors.Primary,
    flexDirection: "column",
    justifyContent: "space-between"
  },
});