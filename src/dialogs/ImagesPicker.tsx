import React, {Component, ReactElement} from 'react';
import {View, TouchableOpacity, Text, StyleSheet, Modal} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Icon } from '@rneui/base';
import { Resources } from '../../res/Resources';

interface Props {
  visible: boolean;
  onDismiss: () => void;
  onImage: (base64: string, uri: string)=>void
}

interface State {}

export default class ImagesPicker extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {};
  }

  private renderButton(
    text: string,
    icon: ReactElement,
    onPress: () => void,
  ): ReactElement {
    return (
      <View style={styles.buttonsContainer}>
        <TouchableOpacity onPress={onPress} style={styles.button}>
          <Text style={[styles.label, {color: Resources.Colors.Primary}]}>{text}</Text>
          {icon}
        </TouchableOpacity>
      </View>
    );
  }

  private renderGradient(): ReactElement {
    return (
      <LinearGradient
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        colors={['#ffffff', '#bcbaba', '#ffffff']}
        style={styles.sectionsSeparator}
      />
    );
  }

  render() {
    const {visible, onDismiss, onImage} = this.props;

    return (
      <Modal
        style={{justifyContent: 'center', alignItems: 'center'}}
        onDismiss={onDismiss}
        visible={visible}>
        <View
          style={{
            backgroundColor: 'white',
            borderRadius: 10,
            width: '90%',
          }}>
          {this.renderButton(
            'Zrób zdjęcie',
            <Icon type="antdesign" name="camera" color={Resources.Colors.Primary} />,
            () => {

            },
          )}
          {this.renderGradient()}
          {this.renderButton(
            'Wybierz z galerii',
            <Icon type="entypo" name="folder-images" color={Resources.Colors.Primary} />,
            () => {
            },
          )}
          {this.renderGradient()}
          {this.renderButton(
            'Anuluj',
            <Icon type="material" name="close" color={Resources.Colors.Primary} />,
            onDismiss,
          )}
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  buttonsContainer: {
    flexDirection: 'row',
  },
  button: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    flexDirection: 'row',
    paddingHorizontal: 8,
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
