import React, { Component } from 'react';
import { View, Text, StatusBar, Animated, Image, StyleSheet } from 'react-native';
import BlurryView from '../components/BlurryView';
import Resources from '../../res/Resources';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import NavigationParamsList from './NavigationParamsList';
import WisbScreens from './WisbScreens';
import Logo from '../components/Logo';
import getAPI from '../API/getAPI';

const res = Resources.get()
const api = getAPI()

interface Props extends NativeStackScreenProps<NavigationParamsList, WisbScreens.SplashScreen> {

}

export default function SplashScreen({ route: {params: {navigate}} }: Props) {
  const [isBlurred, setIsBlurred] = React.useState(false)

  React.useEffect(() => {
    setTimeout(() => {
      setIsBlurred(true)

      setTimeout(() => {
        if (api.getCurrentUser != null) {
          navigate.go(WisbScreens.MapScreen, {})
        } else {
          navigate.go(WisbScreens.MapScreen, {})
        }
      }, 1000)
    }, 500)
  }, [])

  return (
    <BlurryView
      isBlurred={isBlurred}
      style={styles.root}>
      <StatusBar backgroundColor={res.getColors().Transparent} translucent />
      <View
        style={styles.logoContainer}>
        <Logo withMotto />
      </View>
    </BlurryView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '100%',
  },
  logoContainer: {
    height: '100%',
    width: '100%',
    backgroundColor: res.getColors().Primary,
    justifyContent: 'center',
    alignItems: 'center',
  }
})