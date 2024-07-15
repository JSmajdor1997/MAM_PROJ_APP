import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { StatusBar, StyleSheet, Text, View } from 'react-native';
import Resources from '../../res/Resources';
import getAPI from '../API/getAPI';
import BlurryView from '../components/BlurryView';
import NavigationParamsList, { WisbScreens } from './NavigationParamsList';

const res = Resources.get()
const api = getAPI()

interface Props extends NativeStackScreenProps<NavigationParamsList, WisbScreens.SplashScreen> {

}

export default function SplashScreen({ route: { params: { navigate } } }: Props) {
  const [isBlurred, setIsBlurred] = React.useState(false)

  React.useEffect(() => {
    setTimeout(() => {
      setIsBlurred(true)

      setTimeout(() => {
        navigate.go(WisbScreens.LoginScreen, {})
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
        <View style={styles.logo}>
          <Text style={styles.text}>Wisb</Text>
          <Text style={styles.motto}>Let's clean up the planet!</Text>
        </View>

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
  },
  logo: {
    justifyContent: "center",
    alignItems: "center"
  },
  text: {
    fontFamily: res.getFonts().Primary,
    color: res.getColors().White,
    fontSize: 80
  },
  motto: {
    fontFamily: res.getFonts().Primary,
    color: res.getColors().White,
  }
})