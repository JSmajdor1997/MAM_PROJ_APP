import React, {Component, ReactElement, Fragment} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import QRCodeScanner from 'react-native-qrcode-scanner';
import Toast from 'react-native-simple-toast';
import { Icon } from '@rneui/base';
import ShakyDialog from './ShakyDialog';
import OTPTextView from '../components/OTPTextView';

interface Props {
  visible: boolean;
  onDismiss: () => void;
}

interface State {
  code: string;
}

export default class EventJoiningDialog extends Component<Props, State> {
  private dialog: ShakyDialog | null = null;

  constructor(props: Props) {
    super(props);

    this.state = {
      code: '',
    };
  }

  private renderButtons(): ReactElement {
    return (
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          onPress={this.props.onDismiss}
          style={[styles.button, styles.rightButton, styles.rightButton]}>
          <Text style={[styles.label, {color: 'pink'}]}>ANULUJ</Text>
        </TouchableOpacity>
        <LinearGradient
          start={{x: 0, y: 1}}
          end={{x: 0, y: 0}}
          colors={['#ffffff', '#bcbaba', '#ffffff']}
          style={{height: '100%', width: StyleSheet.hairlineWidth}}
        />
        <TouchableOpacity
          onPress={() => {
            if (this.state.code.length == 8) {
              // WisbEvent.join(this.state.code).then(this.props.onDismiss);
            } else {
              this.dialog && this.dialog.shake();
              Toast.showWithGravity(
                'Zeskanuj kod lub wprowadź 8 znaków',
                Toast.SHORT,
                Toast.CENTER,
              );
            }
          }}
          style={[styles.button, styles.rightButton, styles.rightButton]}>
          <Text style={[styles.label, {color: 'pink'}]}>DOŁĄCZ</Text>
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    return (
      <ShakyDialog
        ref={ref => (this.dialog = ref)}
        visible={this.props.visible}>
        {/* <QRCodeScanner
          onRead={value => {
            this.setState({code: value.data});
          }}
          bottomViewStyle={{height: 0, flex: 0}}
          topViewStyle={{height: 0, flex: 0}}
          cameraStyle={{height: '100%', width: '100%'}}
          containerStyle={{
            height: '100%',
            width: '100%',
          }}
        /> */}

        <View
          style={{
            position: 'absolute',
            borderRadius: 100,
            backgroundColor: 'white',
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'center',
            aspectRatio: 1,
            height: 45,
            transform: [{rotate: '45deg'}],
            top: -22.5,
          }}>
          <Icon type="antdesign" name="qrcode" reverseColor="white" size={30} />
        </View>

        <View
          style={{
            position: 'absolute',
            backgroundColor: 'white',
            left: 0,
            right: 0,
            bottom: 0,
          }}>
          <OTPTextView
            readonly={false}
            handleTextChange={code => this.setState({code})}
            inputCount={8}
            cellTextLength={1}
            textInputStyle={{
              width: undefined,
              backgroundColor: '#f7f7f7',
              marginTop: 8,
            }}
            containerStyle={{marginHorizontal: 8}}
          />
          <Text
            style={{
              paddingHorizontal: 8,
              textAlign: 'center',
              fontWeight: 'bold',
              fontSize: 20,
              color: 'grey',
              paddingVertical: 10,
            }}>
            Zeskanuj lub wprowadź kod
          </Text>
          <LinearGradient
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            colors={['#ffffff', '#bcbaba', '#ffffff']}
            style={styles.sectionsSeparator}
          />
          {this.renderButtons()}
        </View>
      </ShakyDialog>
    );
  }
}

const styles = StyleSheet.create({
  topContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 0,
    paddingVertical: 8,
  },
  dialog: {},
  buttonsContainer: {
    flexDirection: 'row',
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
  leftButton: {
    borderBottomStartRadius: 5,
  },
  rightButton: {
    borderBottomEndRadius: 5,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  sectionsSeparator: {
    width: '100%',
    height: StyleSheet.hairlineWidth * 2,
  },
  buttonsSeparator: {
    height: '100%',
    width: StyleSheet.hairlineWidth,
    backgroundColor: '#bcbaba',
  },
});
