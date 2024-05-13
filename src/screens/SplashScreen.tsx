import React, { Component } from 'react';
import { View, Text, StatusBar, Animated, Image, StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';
import BlurryView from '../components/BlurryView';
import { Resources } from '../../res/Resources';
import { bamboo_image, leaves_image } from '../../res/icons/icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import NavigationParamsList from './NavigationParamsList';
import WisbScreens from './WisbScreens';
import Logo from '../components/Logo';
import getAPI from '../API/getAPI';

interface Props extends NativeStackScreenProps<NavigationParamsList, WisbScreens.SplashScreen> {

}

export default function SplashScreen({ navigation }: Props) {
  const [isBlurred, setIsBlurred] = React.useState(false)

  React.useEffect(() => {
    setTimeout(() => {
      setIsBlurred(true)

      setTimeout(() => {
        getAPI().isUserLoggedIn().then(result => {
          if (result) {
            navigation.push(WisbScreens.MapScreen, {})
          } else {
            navigation.push(WisbScreens.LoginScreen, {})
          }
        })
      }, 1000)
    }, 500)
  }, [])

  return (
    <BlurryView
      isBlurred={isBlurred}
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        width: '100%',
      }}>
      <StatusBar backgroundColor="transparent" translucent />
      <Animated.View
        style={{
          height: '100%',
          width: '100%',
          backgroundColor: Resources.Colors.Primary,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Logo withMotto />
        <FastImage
          style={{
            height: 250,
            width: 120,
            position: 'absolute',
            bottom: -30,
            left: 0,
            transform: [{ rotate: '20deg' }],
          }}
          source={bamboo_image}
        />
        <FastImage
          style={{
            height: 190,
            width: 161,
            position: 'absolute',
            top: 50,
            right: -20,
            transform: [{ rotate: '180deg' }],
          }}
          source={leaves_image}
        />
      </Animated.View>
    </BlurryView>
  );
}