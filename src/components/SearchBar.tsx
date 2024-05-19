import React from 'react';
import {
    View,
    TextInput,
    TouchableOpacity,
    ViewStyle,
    LayoutChangeEvent,
} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronDown, faClose, faSearch } from '@fortawesome/free-solid-svg-icons';
import { Resources } from '../../res/Resources';

interface Props {
    style?: ViewStyle
    inputStyle?: ViewStyle
    inputContainerStyle?: ViewStyle


    readonly?: boolean
    onPress?: () => void
    onClear?: () => void
    phrase: string
    onPhraseChanged?: (newPhrase: string) => void

    placeholder: string
    leftIcon: React.ReactElement
    rightIcon?: React.ReactElement

    onLayout?: (event: LayoutChangeEvent) => void
}

export default function SearchBar({ style, inputStyle, inputContainerStyle, onPress, phrase, onPhraseChanged, onClear, placeholder, readonly, leftIcon, rightIcon, onLayout }: Props) {
    return (
        <View
            onLayout={onLayout}
            style={{
                padding: 6,
                alignItems: 'center',
                justifyContent: 'center',
                ...style
            }}>
            <View
                style={{
                    width: '100%',
                    height: 35,
                    backgroundColor: Resources.Colors.Beige,
                    borderRadius: 10,
                    padding: 10,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    ...inputContainerStyle
                }}>
                {leftIcon}
                <TextInput
                    contextMenuHidden={true}
                    numberOfLines={1}
                    autoCapitalize="none"
                    value={phrase}
                    placeholder={placeholder}
                    onChangeText={text => onPhraseChanged?.(text)}
                    onPress={onPress}
                    readOnly={readonly}
                    style={{
                        color: Resources.Colors.White,
                        fontSize: 16,
                        letterSpacing: 1,
                        fontWeight: "600",
                        flex: 1,
                        paddingRight: 12,
                        paddingLeft: 6,
                        ...inputStyle
                    }} />

                {phrase.length == 0 ? rightIcon : (<TouchableOpacity
                    onPress={onClear}
                    style={{ paddingLeft: 4, paddingTop: 4, paddingBottom: 4 }}>
                    <FontAwesomeIcon icon={faClose} color={Resources.Colors.Black} size={16} />
                </TouchableOpacity>)}
            </View>
        </View>
    );
}