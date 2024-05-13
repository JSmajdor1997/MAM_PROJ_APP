import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Image,
  View
} from 'react-native';
import { Resources } from './res/Resources';
import SplashScreen from './src/screens/SplashScreen';
import MapScreen from './src/screens/MapScreen';
import NavBar from './src/components/NavBar';
import FastImage from 'react-native-fast-image';
import { event_icon, map_icon, event_add_icon, wasteland_icon, rank_icon } from './res/icons/icons';
import { Icon } from '@rneui/base';
import LoginScreen from './src/screens/LoginScreen';
import ChatScreen from './src/screens/ChatScreen';
import { NavigationContainer, createNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WisbScreens from './src/screens/WisbScreens';
import LeaderboardScreen from './src/screens/LeaderBoardScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import MyEventsScreen from './src/screens/MyEventsScreen';
import NavigationParamsList from './src/screens/NavigationParamsList';

const navigationRef = createNavigationContainerRef<NavigationParamsList>()

function navigate<ScreenType extends WisbScreens>(name: WisbScreens, params: NavigationParamsList[ScreenType]) {
  navigationRef.navigate(name, params);
}

const Stack = createNativeStackNavigator<NavigationParamsList>();

export default function App() {
  const [navBarIndex, setNavBarIndex] = React.useState(1)
  const [isNavigationBarVisible, setIsNavigationBarVisible] = React.useState(false)

  return (
    <View style={styles.root}>
      <NavigationContainer ref={navigationRef} onStateChange={state => {
        const currentScreen = state?.routes[state.index].name

        if(currentScreen == null) {
          return
        }

        switch(currentScreen) {
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
          screenOptions={{headerShown: false, animation: "fade", animationDuration: 100}}>
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
        style={styles.navbar}
        visible={isNavigationBarVisible}
        items={[
          {
            activeComponent: (
              <FastImage
                source={event_icon}
                style={{ height: 30, width: 30 }}
              />
            ),
            inactiveComponent: (
              <FastImage
                source={event_icon}
                style={{ height: 25, width: 25 }}
              />
            ),
            onPress: () => {
              navigate(WisbScreens.MyEventsScreen, {})
              setNavBarIndex(0)
            },
            bubbles: [
              {
                component: <Icon type="antdesign" name="qrcode" />,
                onPress: () => this.setState({ isQRDialogVisible: true }),
              },
            ],
          },
          {
            activeComponent: (
              <FastImage source={map_icon} style={{ height: 30, width: 30 }} />
            ),
            inactiveComponent: (
              <FastImage source={map_icon} style={{ height: 25, width: 25 }} />
            ),
            onPress: () => {
              navigate(WisbScreens.MapScreen, {})
              setNavBarIndex(1)
            },
            bubbles: [
              {
                component: (
                  <FastImage
                    source={event_add_icon}
                    resizeMode="cover"
                    style={{ width: 22, aspectRatio: 1 }}
                  />
                ),
                onPress: () => { },
              },
              {
                component: (
                  <FastImage
                    source={wasteland_icon}
                    resizeMode="cover"
                    style={{ width: 22, aspectRatio: 1 }}
                  />
                ),
                onPress: () => { },
              },
            ],
          },
          {
            activeComponent: (
              <FastImage source={rank_icon} style={{ height: 30, width: 30 }} />
            ),
            inactiveComponent: (
              <FastImage source={rank_icon} style={{ height: 25, width: 25 }} />
            ),
            onPress: () => {
              navigate(WisbScreens.LeaderBoardScreen, {})
              setNavBarIndex(2)
            },
          },
        ]} />
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
  navbar: {
    // position: "absolute",
    // height: 20,
    // width: "90%",
    // backgroundColor: "red",
    // bottom: 5,
    // alignSelf: 'center'
  }
});