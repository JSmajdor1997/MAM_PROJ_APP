import React, { Fragment } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';
import Resources from '../../res/Resources';
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
import { GeneralError, SignUpError } from '../API/API';

const api = getAPI()
const res = Resources.get()

interface Props extends NativeStackScreenProps<NavigationParamsList, WisbScreens.LoginScreen> { }

enum Mode {
  Login,
  SignUp
}

export default function LoginScreen({ route: { params: { onUserLoggedIn } } }: Props) {
  const [mode, setMode] = React.useState(Mode.Login)

  const emailRef = React.useRef<TextInput>(null)
  const passwordRef = React.useRef<TextInput>(null)

  const [userName, setUserName] = React.useState("")
  const [photo, setPhoto] = React.useState("")

  function getCredentials(): { email: string, password: string } {
    return {
      email: (emailRef.current as any)?._getText() ?? "",
      password: (passwordRef.current as any)?._getText() ?? "",
    }
  }

  function clearInputs() {
    emailRef.current?.clear()
    passwordRef.current?.clear()
  }

  const toast = (message: string) => {
    Toast.showWithGravityAndOffset(message, Toast.SHORT, Toast.CENTER, 0, 10)
  }

  React.useEffect(() => {
    setTimeout(() => {
      const currentUser = api.getCurrentUser()

      if (currentUser != null) {
        onUserLoggedIn(currentUser)
      }
    }, 200)
  })

  return (
    <View
      style={styles.root}>
      <LeavesImage
        style={styles.leavesImage} />
      <BambooImage
        style={styles.bambooImage} />
      <View>
        <View
          style={styles.headerContainer}>
          <Text style={styles.header}>
            {mode == Mode.Login ? res.getStrings().Screens.LoginScreen.LoginHeader : res.getStrings().Screens.LoginScreen.SignUpHeader}
          </Text>
        </View>

        <View
          style={styles.inputsContainer}>
          <TextInput
            ref={emailRef}
            placeholder={res.getStrings().Screens.LoginScreen.EmailLabel}
            style={styles.input}
            keyboardType="email-address"
            placeholderTextColor={res.getColors().DarkBeige}
            autoCapitalize="none"
          />
          <TextInput
            ref={passwordRef}
            placeholder={res.getStrings().Screens.LoginScreen.PasswordLabel}
            style={styles.input}
            secureTextEntry
            placeholderTextColor={res.getColors().DarkBeige}
            autoCapitalize="none"
          />

          {mode == Mode.SignUp ? (
            <Fragment>
              <TextInput
                placeholder={res.getStrings().Screens.LoginScreen.UserNameLabel}
                style={styles.input}
                secureTextEntry
                placeholderTextColor={res.getColors().DarkBeige}
                autoCapitalize="none"
                onChangeText={value => {
                  setUserName(value)
                }}
              />

              <TextInput
                placeholder={res.getStrings().Screens.LoginScreen.PhotoLabel}
                style={styles.input}
                secureTextEntry
                placeholderTextColor={res.getColors().DarkBeige}
                autoCapitalize="none"
                onChangeText={value => {
                  setPhoto(value)
                }}
              />
            </Fragment>
          ) : null}

          <TouchableOpacity
            onPress={() => {
              const { email, password } = getCredentials()

              if (mode == Mode.Login) {
                api.login(email, password).then(result => {
                  if (result.error == GeneralError.InvalidDataProvided) {
                    toast(res.getStrings().Screens.LoginScreen.LoginErrorInvalidPasswordMessage);
                  } else if (result.data != null) {
                    clearInputs()
                    onUserLoggedIn(result.data)
                  }
                })
              } else {
                api.signUp({ email, password, userName }).then(result => {
                  if (result.error != null) {
                    if (result.error == SignUpError.InvalidDataProvided) {
                      toast(res.getStrings().Screens.LoginScreen.SignUpErrorInvalidDataProvidedMessage);
                    } else if (result.error == SignUpError.UserAlreadyRegistered) {
                      toast(res.getStrings().Screens.LoginScreen.SignUpErrorUserAlreadyRegisteredMessage);
                    }
                  } else {
                    toast(res.getStrings().Screens.LoginScreen.SignUpSuccessMessage);
                    setMode(Mode.Login)
                  }
                })
              }
            }}
            style={{
              borderRadius: 50,
              backgroundColor: res.getColors().White,
              aspectRatio: 1,
              height: 54,
              position: 'absolute',
              justifyContent: 'center',
              alignItems: 'center',
              right: 0,
              top: 0,
              elevation: 20,
            }}>
            <FontAwesomeIcon icon={faArrowRight} color={res.getColors().Primary} />
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
          <Text style={{ color: res.getColors().Beige }}>{mode == Mode.SignUp ? res.getStrings().Screens.LoginScreen.AlreadyHaveAccountQuestion : res.getStrings().Screens.LoginScreen.DontYouHaveAccountQuestion}</Text>
          <TouchableOpacity
            onPress={() => setMode(mode == Mode.Login ? Mode.SignUp : Mode.Login)}>
            <Text style={styles.login}>{mode == Mode.SignUp ? res.getStrings().Screens.LoginScreen.LoginExclamation : res.getStrings().Screens.LoginScreen.SignUpExclamation}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: res.getColors().Primary,
    justifyContent: 'center',
  },
  header: {
    color: res.getColors().White, fontSize: 40, fontFamily: res.getFonts().Primary
  },
  leavesImage: {
    height: 190,
    width: 161,
    position: 'absolute',
    top: -50,
    right: -20,
    transform: [{ rotate: '180deg' }],
  },
  bambooImage: {
    height: 250,
    width: 120,
    position: 'absolute',
    bottom: -30,
    left: -45,
    transform: [{ rotate: '20deg' }],
  },
  inputsContainer: {
    width: 350,
    borderTopRightRadius: 80,
    borderBottomRightRadius: 80,
    backgroundColor: res.getColors().Beige,
    shadowOffset: { width: 5, height: 0 },
    shadowRadius: 10,
    shadowOpacity: 0.4,
    shadowColor: res.getColors().Black,
    elevation: 2,
  },
  container: {
    flex: 1,
    backgroundColor: res.getColors().Beige,
  },
  headerContainer: {
    alignItems: 'center',
    bottom: 5,
    justifyContent: 'flex-end',
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
    backgroundColor: res.getColors().Beige,
    shadowOffset: { width: 5, height: 0 },
    shadowRadius: 10,
    shadowOpacity: 0.4,
    shadowColor: res.getColors().Black,
    elevation: 2,
  },
  submitWrapper: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    top: 460,
    left: 320,
    // alignSelf: 'center',
    backgroundColor: res.getColors().Primary,
    borderRadius: 50,
    height: 60,
    width: 60,
    shadowOffset: { width: 5, height: 0 },
    shadowRadius: 10,
    shadowOpacity: 0.4,
    shadowColor: res.getColors().Black,
    elevation: 2,
  },
  loginWrapper: {},
  login: {
    marginLeft: 8,
    color: res.getColors().White,
  }
});
