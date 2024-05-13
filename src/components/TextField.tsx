import React, {Component} from 'react';
import {TextInput, View, TouchableOpacity, ViewStyle} from 'react-native';

interface Props {
  readonly: boolean;
  children: string;
  placeholder?: string;
  onTextChange?: (text: string) => void;
  onPress?: () => void;
  containerStyle?: ViewStyle;
}

interface State {}

export default class TextField extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {};
  }

  render() {
    const {
      children,
      placeholder,
      onTextChange,
      readonly,
      onPress,
      containerStyle,
    } = this.props;

    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={readonly}
        style={{
          height: 40,
          backgroundColor: '#dedede',
          borderRadius: 15,
          borderTopLeftRadius: 0,
          borderBottomEndRadius: 0,
          marginHorizontal: 12,
          marginTop: 8,
          marginBottom: 4,

          shadowColor: '#dedede',
          shadowOffset: {
            width: 0,
            height: 7,
          },
          shadowOpacity: 0.43,
          shadowRadius: 9.51,

          elevation: 4,
          ...containerStyle,
        }}>
        <TextInput
          editable={!readonly}
          multiline
          value={children}
          placeholder={placeholder}
          style={{
            marginHorizontal: 2,
            color: 'black',
            flex: 1,
            textAlign: 'left',
            textAlignVertical: 'top',
            paddingHorizontal: 4,
            paddingVertical: 4,
          }}
          onChangeText={onTextChange}
        />
      </TouchableOpacity>
    );
  }
}
