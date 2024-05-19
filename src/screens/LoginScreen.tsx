import React, { Fragment } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Resources } from '../../res/Resources';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import NavigationParamsList from './NavigationParamsList';
import WisbScreens from './WisbScreens';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import getAPI from '../API/getAPI';
import Toast from 'react-native-simple-toast';
import FastImage from 'react-native-fast-image';
import { SvgUri } from 'react-native-svg';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { faFacebookF, faGoogle } from '@fortawesome/free-brands-svg-icons';
import BambooImage from "../../res/images/bamboo.svg"
import LeavesImage from "../../res/images/leaves_on_stick.svg"

interface Props extends NativeStackScreenProps<NavigationParamsList, WisbScreens.LoginScreen> { }

enum Mode {
  Login,
  SignUp
}

// export default interface User {
//   userName: string
//   photoUrl?: string
// }


export default function LoginScreen({ navigation }: Props) {
  const [mode, setMode] = React.useState(Mode.Login)

  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")

  const [userName, setUserName] = React.useState("")
  const [photo, setPhoto] = React.useState("")

  const toast = (message: string) => {
    Toast.showWithGravityAndOffset(message, Toast.SHORT, Toast.CENTER, 0, 10)
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Resources.Colors.Primary,
        justifyContent: 'center',
      }}>
      <LeavesImage
        style={{
          height: 190,
          width: 161,
          position: 'absolute',
          top: -50,
          right: -20,
          transform: [{ rotate: '180deg' }],
        }} />
      <BambooImage
        style={{
          height: 250,
          width: 120,
          position: 'absolute',
          bottom: -30,
          left: -45,
          transform: [{ rotate: '20deg' }],
        }} />
      <View>
        <View
          style={{
            alignItems: 'center',
            bottom: 5,
            justifyContent: 'flex-end',
          }}>
          <Text style={{ color: Resources.Colors.White, fontSize: 40, fontFamily: 'leafy' }}>
            {mode == Mode.Login ? "LOGOWANIE" : "REJESTRACJA"}
          </Text>
        </View>

        <View
          style={{
            width: 350,
            borderTopRightRadius: 80,
            borderBottomRightRadius: 80,
            backgroundColor: Resources.Colors.Beige,
            shadowOffset: { width: 5, height: 0 },
            shadowRadius: 10,
            shadowOpacity: 0.4,
            shadowColor: Resources.Colors.Black,
            elevation: 2,
          }}>
          <TextInput
            placeholder="Email"
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
            onChangeText={value => {
              setEmail(value)
            }}
          />
          <TextInput
            placeholder="Hasło"
            style={styles.input}
            secureTextEntry
            autoCapitalize="none"
            onChangeText={value => {
              setPassword(value)
            }}
          />

          {mode == Mode.SignUp ? (
            <Fragment>
              <TextInput
                placeholder="Nazwa użytkownika"
                style={styles.input}
                secureTextEntry
                autoCapitalize="none"
                onChangeText={value => {
                  setUserName(value)
                }}
              />

              <TextInput
                placeholder="Zdjęcie"
                style={styles.input}
                secureTextEntry
                autoCapitalize="none"
                onChangeText={value => {
                  setPhoto(value)
                }}
              />
            </Fragment>
          ) : null}

          <TouchableOpacity
            onPress={() => {
              if (mode == Mode.Login) {
                getAPI().login(email, password).then(result => {
                  if (result.error) {
                    toast('Nie udało się zalogować :(');
                  } else {
                    toast('Zalogowano pomyślnie');
                    navigation.push(WisbScreens.MapScreen, {} as any)
                  }
                })
              } else {
                getAPI().signUp({ email, password, userName }).then(result => {
                  if (result.error) {
                    toast('Nie udało się utworzyć konta :(');
                  } else {
                    toast('Zarejestrowano pomyślnie, zaloguj się!');
                    setMode(Mode.Login)
                  }
                })
              }
            }}
            style={{
              borderRadius: 50,
              backgroundColor: Resources.Colors.White,
              aspectRatio: 1,
              height: 54,
              position: 'absolute',
              justifyContent: 'center',
              alignItems: 'center',
              right: 0,
              top: 0,
              elevation: 20,
            }}>
            <FontAwesomeIcon icon={faArrowRight} color={Resources.Colors.Primary} />
          </TouchableOpacity>
        </View>
      </View>

      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'flex-end',
          flexDirection: 'column',
          paddingBottom: 8,
          bottom: 0,
          right: 0,
          left: 0,
          position: 'absolute',
        }}>
        <View style={{ flexDirection: "row" }}>
          <Text style={{ color: Resources.Colors.Beige }}>{mode == Mode.SignUp ? "Masz konto?" : "Nie masz konta?"}</Text>
          <TouchableOpacity
            onPress={() => setMode(mode == Mode.Login ? Mode.SignUp : Mode.Login)}>
            <Text style={styles.login}>{mode == Mode.SignUp ? "Zaloguj się!" : "Utwórz konto!"}</Text>
          </TouchableOpacity>
        </View>

        <Text style={{ color: Resources.Colors.Beige }}>LUB</Text>

        <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
          <FontAwesomeIcon icon={faFacebookF} style={{ marginRight: 10 }} color={Resources.Colors.Blue} />
          <FontAwesomeIcon icon={faGoogle} style={{ marginLeft: 10 }} color={Resources.Colors.Blue} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Resources.Colors.Beige,
  },
  header: {
    alignSelf: 'center',
    marginBottom: 1,
    fontSize: 45,
    color: Resources.Colors.OceanBlue,
    fontFamily: 'leafy',
  },
  input: {
    padding: 15,
    fontSize: 15,
  },
  inputWrapper: {
    width: 350,
    marginTop: 100,
    borderTopRightRadius: 80,
    borderBottomRightRadius: 80,
    backgroundColor: Resources.Colors.Beige,
    shadowOffset: { width: 5, height: 0 },
    shadowRadius: 10,
    shadowOpacity: 0.4,
    shadowColor: Resources.Colors.Black,
    elevation: 2,
  },
  submitWrapper: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    top: 460,
    left: 320,
    // alignSelf: 'center',
    backgroundColor: Resources.Colors.OceanBlue,
    borderRadius: 50,
    height: 60,
    width: 60,
    shadowOffset: { width: 5, height: 0 },
    shadowRadius: 10,
    shadowOpacity: 0.4,
    shadowColor: Resources.Colors.Black,
    elevation: 2,
  },
  loginWrapper: {},
  login: {
    marginLeft: 8,
    color: Resources.Colors.White,
  },
  bambooImage: {
    height: 275,
    width: 132,
    position: 'absolute',
    bottom: -30,
    left: 0,
    transform: [{ rotate: '20deg' }],
  },
  stickImage: {
    height: 190,
    width: 161,
    position: 'absolute',
    top: 50,
    right: -20,
    transform: [{ rotate: '180deg' }],
  }
});
