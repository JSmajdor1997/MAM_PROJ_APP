import React from 'react';
import {
    View,
    TextInput,
    TouchableOpacity,
    ViewStyle,
    LayoutChangeEvent,
    StyleSheet,
} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronDown, faClose, faSearch } from '@fortawesome/free-solid-svg-icons';
import Resources from '../../res/Resources';

interface Props {
    style?: ViewStyle
    inputStyle?: ViewStyle
    inputContainerStyle?: ViewStyle


    readonly?: boolean
    onPress?: () => void
    phrase: string
    onPhraseChanged?: (newPhrase: string) => void

    placeholder: string
    leftIcon?: React.ReactElement
    rightIcon?: React.ReactElement

    onLayout?: (event: LayoutChangeEvent) => void

    focused?: boolean
}

export default function SearchBar({ focused, style, inputStyle, inputContainerStyle, onPress, phrase, onPhraseChanged, placeholder, readonly, leftIcon, rightIcon, onLayout }: Props) {
    const inputRef = React.useRef<TextInput>(null)

    React.useEffect(() => {
        if (focused == undefined) {
            return
        }

        if (focused) {
            inputRef.current?.focus()
        } else {
            inputRef.current?.blur()
        }
    }, [focused])

    return (
        <View
            onLayout={onLayout}
            style={{
                ...styles.root,
                ...style
            }}>
            <View
                style={{
                    ...styles.inputContainer,
                    ...inputContainerStyle
                }}>
                {leftIcon}
                <TextInput
                    ref={inputRef}
                    contextMenuHidden={true}
                    numberOfLines={1}
                    autoCapitalize="none"
                    value={phrase}
                    placeholderTextColor={Resources.get().getColors().DarkBeige}
                    placeholder={placeholder}
                    onChangeText={text => onPhraseChanged?.(text)}
                    onPress={onPress}
                    readOnly={readonly}
                    style={{
                        ...styles.input,
                        ...inputStyle,
                    }} />

                {rightIcon}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    root: {
        padding: 6,
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputContainer: {
        width: '100%',
        height: 35,
        backgroundColor: Resources.get().getColors().Beige,
        borderRadius: 10,
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    input: {
        color: Resources.get().getColors().White,
        fontSize: 16,
        letterSpacing: 1,
        fontWeight: "600",
        flex: 1,
        paddingRight: 12,
        paddingLeft: 6,
    },
    clearButton: {
        paddingLeft: 4, paddingTop: 4, paddingBottom: 4
    }
})