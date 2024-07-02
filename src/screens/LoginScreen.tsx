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
import { LoginError, SignUpError } from '../API/API';

interface Props extends NativeStackScreenProps<NavigationParamsList, WisbScreens.LoginScreen> { }

enum Mode {
  Login,
  SignUp
}

export default function LoginScreen({ route: { params: { onUserLoggedIn } } }: Props) {
  const [mode, setMode] = React.useState(Mode.Login)

  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")

  const [userName, setUserName] = React.useState("")
  const [photo, setPhoto] = React.useState("")

  const toast = (message: string) => {
    Toast.showWithGravityAndOffset(message, Toast.SHORT, Toast.CENTER, 0, 10)
  }

  React.useState(async ()=>{
    await new Promise((resolve)=>setTimeout(resolve, 400))

    getAPI().login("aaa@bbb.com", "abc").then(result => {
      if(result.data!=null){
        setEmail("")
        setPassword("")
        onUserLoggedIn(result.data)
      }
    })
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
            {mode == Mode.Login ? Resources.get().getStrings().Screens.LoginScreen.LoginHeader : Resources.get().getStrings().Screens.LoginScreen.SignUpHeader}
          </Text>
        </View>

        <View
          style={styles.inputsContainer}>
          <TextInput
            placeholder={Resources.get().getStrings().Screens.LoginScreen.EmailLabel}
            style={styles.input}
            keyboardType="email-address"
            placeholderTextColor={Resources.get().getColors().DarkBeige}
            autoCapitalize="none"
            onChangeText={value => {
              setEmail(value)
            }}
          />
          <TextInput
            placeholder={Resources.get().getStrings().Screens.LoginScreen.PasswordLabel}
            style={styles.input}
            secureTextEntry
            placeholderTextColor={Resources.get().getColors().DarkBeige}
            autoCapitalize="none"
            onChangeText={value => {
              setPassword(value)
            }}
          />

          {mode == Mode.SignUp ? (
            <Fragment>
              <TextInput
                placeholder={Resources.get().getStrings().Screens.LoginScreen.UserNameLabel}
                style={styles.input}
                secureTextEntry
                placeholderTextColor={Resources.get().getColors().DarkBeige}
                autoCapitalize="none"
                onChangeText={value => {
                  setUserName(value)
                }}
              />

              <TextInput
                placeholder={Resources.get().getStrings().Screens.LoginScreen.PhotoLabel}
                style={styles.input}
                secureTextEntry
                placeholderTextColor={Resources.get().getColors().DarkBeige}
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
                  if (result.error == LoginError.InvalidPassword) {
                    toast(Resources.get().getStrings().Screens.LoginScreen.LoginErrorInvalidPasswordMessage);
                  } else if (result.error == LoginError.UserDoesNotExist) {
                    toast(Resources.get().getStrings().Screens.LoginScreen.LoginErrorUserDoesntExistMessage);
                  } else if(result.data!=null){
                    setEmail("")
                    setPassword("")
                    onUserLoggedIn(result.data)
                  } else {
                    toast("Unknown error occurred!!!");
                  }
                })
              } else {
                getAPI().signUp({ email, password, userName }).then(result => {
                  if (result.error != null) {
                    if (result.error == SignUpError.InvalidDataProvided) {
                      toast(Resources.get().getStrings().Screens.LoginScreen.SignUpErrorInvalidDataProvidedMessage);
                    } else if (result.error == SignUpError.UserAlreadyRegistered) {
                      toast(Resources.get().getStrings().Screens.LoginScreen.SignUpErrorUserAlreadyRegisteredMessage);
                    }
                  } else {
                    toast(Resources.get().getStrings().Screens.LoginScreen.SignUpSuccessMessage);
                    setMode(Mode.Login)
                  }
                })
              }
            }}
            style={{
              borderRadius: 50,
              backgroundColor: Resources.get().getColors().White,
              aspectRatio: 1,
              height: 54,
              position: 'absolute',
              justifyContent: 'center',
              alignItems: 'center',
              right: 0,
              top: 0,
              elevation: 20,
            }}>
            <FontAwesomeIcon icon={faArrowRight} color={Resources.get().getColors().Primary} />
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
          <Text style={{ color: Resources.get().getColors().Beige }}>{mode == Mode.SignUp ? Resources.get().getStrings().Screens.LoginScreen.AlreadyHaveAccountQuestion : Resources.get().getStrings().Screens.LoginScreen.DontYouHaveAccountQuestion}</Text>
          <TouchableOpacity
            onPress={() => setMode(mode == Mode.Login ? Mode.SignUp : Mode.Login)}>
            <Text style={styles.login}>{mode == Mode.SignUp ? Resources.get().getStrings().Screens.LoginScreen.LoginExclamation : Resources.get().getStrings().Screens.LoginScreen.SignUpExclamation}</Text>
          </TouchableOpacity>
        </View>

        <Text style={{ color: Resources.get().getColors().Beige }}>{Resources.get().getStrings().Screens.LoginScreen.Or}</Text>

        <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
          <FontAwesomeIcon icon={faFacebookF} style={{ marginRight: 10 }} color={Resources.get().getColors().Blue} />
          <FontAwesomeIcon icon={faGoogle} style={{ marginLeft: 10 }} color={Resources.get().getColors().Blue} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Resources.get().getColors().Primary,
    justifyContent: 'center',
  },
  header: {
    color: Resources.get().getColors().White, fontSize: 40, fontFamily: Resources.get().getFonts().Primary
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
    backgroundColor: Resources.get().getColors().Beige,
    shadowOffset: { width: 5, height: 0 },
    shadowRadius: 10,
    shadowOpacity: 0.4,
    shadowColor: Resources.get().getColors().Black,
    elevation: 2,
  },
  container: {
    flex: 1,
    backgroundColor: Resources.get().getColors().Beige,
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
    backgroundColor: Resources.get().getColors().Beige,
    shadowOffset: { width: 5, height: 0 },
    shadowRadius: 10,
    shadowOpacity: 0.4,
    shadowColor: Resources.get().getColors().Black,
    elevation: 2,
  },
  submitWrapper: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    top: 460,
    left: 320,
    // alignSelf: 'center',
    backgroundColor: Resources.get().getColors().Primary,
    borderRadius: 50,
    height: 60,
    width: 60,
    shadowOffset: { width: 5, height: 0 },
    shadowRadius: 10,
    shadowOpacity: 0.4,
    shadowColor: Resources.get().getColors().Black,
    elevation: 2,
  },
  loginWrapper: {},
  login: {
    marginLeft: 8,
    color: Resources.get().getColors().White,
  }
});
