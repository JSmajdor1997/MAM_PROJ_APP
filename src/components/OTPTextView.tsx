import React, {PureComponent} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TextStyle,
  ViewStyle,
} from 'react-native';

//naveenvignesh5's poorly ported component to tsx

interface Props {
  readonly: boolean;
  defaultValue?: string;
  inputCount: number;
  containerStyle?: ViewStyle;
  textInputStyle?: TextStyle;
  cellTextLength?: number;
  tintColor?: string;
  offTintColor?: string;
  handleTextChange?: (txt: string) => void;
}

interface State {
  focusedInput: number;
  otpText: Array<any>;
}

export default class OTPTextView extends PureComponent<Props, State> {
  inputs = Array<any>();
  otpText: any;

  constructor(props: Props) {
    super(props);
    this.state = {
      focusedInput: 0,
      otpText: [],
    };
  }

  componentDidMount() {
    const {defaultValue, cellTextLength} = this.props;
    this.otpText = (defaultValue || '').match(
      new RegExp('.{1,' + cellTextLength + '}', 'g'),
    );
  }

  onTextChange = (text: string, i: number) => {
    const {cellTextLength, inputCount, handleTextChange} = this.props;
    this.setState(
      prevState => {
        let {otpText} = prevState;
        otpText[i] = text;
        return {
          otpText,
        };
      },
      () => {
        handleTextChange && handleTextChange(this.state.otpText.join(''));
        if (text.length === cellTextLength && i !== inputCount - 1) {
          this.inputs[i + 1].focus();
        }
      },
    );
  };

  onInputFocus = (i: any) => {
    this.setState({focusedInput: i});
  };

  onKeyPress = (e: any, i: number) => {
    const {otpText = []} = this.state;
    //Since otpText[i] is undefined, The clear operation is not functional
    if (e.nativeEvent.key === 'Backspace' && i !== 0 && !otpText[i]) {
      this.inputs[i - 1].focus();
    }
  };

  render() {
    const {
      inputCount,
      offTintColor,
      tintColor,
      defaultValue,
      cellTextLength,
      containerStyle,
      textInputStyle,
      readonly,
      ...textInputProps
    } = this.props;

    const TextInputs = [];

    for (let i = 0; i < inputCount; i += 1) {
      let defaultChars: any = [];
      if (defaultValue) {
        defaultChars = (defaultValue || '').match(
          new RegExp('.{1,' + cellTextLength + '}', 'g'),
        );
      }
      const inputStyle = [
        styles.textInput,
        textInputStyle,
        {borderColor: offTintColor || '#DCDCDC'},
      ];
      if (this.state.focusedInput === i && readonly == false) {
        inputStyle.push({borderColor: '#3CB371'});
      }

      TextInputs.push(
        <TextInput
          editable={!readonly}
          ref={e => {
            this.inputs[i] = e;
          }}
          key={i}
          defaultValue={defaultValue ? defaultChars[i] : ''}
          style={inputStyle}
          maxLength={this.props.cellTextLength}
          onFocus={() => this.onInputFocus(i)}
          onChangeText={text => this.onTextChange(text, i)}
          multiline={false}
          onKeyPress={e => this.onKeyPress(e, i)}
          autoCapitalize="none"
          {...textInputProps}
        />,
      );
    }
    return <View style={[styles.container, containerStyle]}>{TextInputs}</View>;
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  textInput: {
    height: 50,
    width: 50,
    borderBottomWidth: 4,
    margin: 5,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '500',
    color: '#000000',
  },
});
