import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { Fragment } from 'react';
import {
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import Toast from 'react-native-simple-toast';
import Resources from '../../res/Resources';
import BambooImage from "../../res/images/bamboo.svg";
import LeavesImage from "../../res/images/leaves_on_stick.svg";
import { GeneralError, SignUpError } from '../API/API';
import getAPI from '../API/getAPI';
import NavigationParamsList, { WisbScreens } from './NavigationParamsList';
import ImageInput from '../components/inputs/ImageInput';

const api = getAPI()
const res = Resources.get()

interface Props extends NativeStackScreenProps<NavigationParamsList, WisbScreens.LoginScreen> { }

enum Mode {
  Login,
  SignUp
}

export default function LoginScreen({ route: { params: { onUserLoggedIn } } }: Props) {
  const [mode, setMode] = React.useState(Mode.Login)

  const [credentials, setCredentials] = React.useState({
    email: "",
    password: ""
  })

  const [userName, setUserName] = React.useState("")
  const [photo, setPhoto] = React.useState("")

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
    <View style={styles.root}>
      <LeavesImage style={styles.leavesImage} />
      <BambooImage style={styles.bambooImage} />
      <View>
        <View style={styles.headerContainer}>
          <Text style={styles.header}>
            {mode == Mode.Login ? res.getStrings().Screens.LoginScreen.LoginHeader : res.getStrings().Screens.LoginScreen.SignUpHeader}
          </Text>
        </View>

        <View style={styles.inputsContainer}>
          {mode == Mode.SignUp ? (
            <ImageInput
              readonly={false}
              onImageSelected={setPhoto}
              style={{ width: 100, height: 100 }}
              image={photo}
            />
          ) : null}

          <TextInput
            onChangeText={value => setCredentials({ ...credentials, email: value })}
            placeholder={res.getStrings().Screens.LoginScreen.EmailLabel}
            style={styles.input}
            autoCorrect={false}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholderTextColor={res.getColors().DarkBeige}
          />
          <TextInput
            onChangeText={value => setCredentials({ ...credentials, password: value })}
            placeholder={res.getStrings().Screens.LoginScreen.PasswordLabel}
            style={styles.input}
            secureTextEntry
            autoCorrect={false}
            autoCapitalize="none"
            placeholderTextColor={res.getColors().DarkBeige}
          />

          {mode == Mode.SignUp ? (
            <TextInput
              placeholder={res.getStrings().Screens.LoginScreen.UserNameLabel}
              style={styles.input}
              autoCorrect={false}
              autoCapitalize="none"
              placeholderTextColor={res.getColors().DarkBeige}
              onChangeText={value => {
                setUserName(value)
              }}
            />
          ) : null}

          <TouchableOpacity
            disabled={credentials.email.length == 0 || credentials.password.length == 0}
            onPress={() => {
              const { email, password } = credentials

              if (mode == Mode.Login) {
                api.login(email, password).then(result => {
                  if (result.error == GeneralError.InvalidDataProvided) {
                    toast(res.getStrings().Screens.LoginScreen.LoginErrorInvalidPasswordMessage);
                  } else if (result.data != null) {
                    setCredentials({
                      password: "",
                      email: ""
                    })
                    onUserLoggedIn(result.data)
                  }
                })
              } else {
                api.signUp({ email, password, userName, photoUrl: photo }).then(result => {
                  if (result.error != null) {
                    console.log(result.error)
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
            style={styles.submitButton}>
            <FontAwesomeIcon icon={faArrowRight} color={res.getColors().Primary} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.bottomContainer}>
        <View style={styles.switchModeContainer}>
          <Text style={{ color: res.getColors().Beige, fontFamily: res.getFonts().Secondary }}>
            {mode == Mode.SignUp ? res.getStrings().Screens.LoginScreen.AlreadyHaveAccountQuestion : res.getStrings().Screens.LoginScreen.DontYouHaveAccountQuestion}
          </Text>
          <TouchableOpacity onPress={() => setMode(mode == Mode.Login ? Mode.SignUp : Mode.Login)}>
            <Text style={styles.login}>
              {mode == Mode.SignUp ? res.getStrings().Screens.LoginScreen.LoginExclamation : res.getStrings().Screens.LoginScreen.SignUpExclamation}
            </Text>
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
    color: res.getColors().White,
    fontSize: 40,
    fontFamily: res.getFonts().Primary,
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
    padding: 15,
  },
  headerContainer: {
    alignItems: 'center',
    bottom: 5,
    justifyContent: 'flex-end',
  },
  input: {
    padding: 15,
    fontSize: 15,
    color: res.getColors().DarkBeige,
    fontFamily: res.getFonts().Secondary,
  },
  submitButton: {
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
  },
  bottomContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    flexDirection: 'column',
    paddingBottom: 8,
    bottom: 0,
    right: 0,
    left: 0,
    position: 'absolute',
  },
  switchModeContainer: {
    flexDirection: "row",
  },
  login: {
    marginLeft: 8,
    color: res.getColors().White,
    fontFamily: res.getFonts().Secondary,
  },
});
