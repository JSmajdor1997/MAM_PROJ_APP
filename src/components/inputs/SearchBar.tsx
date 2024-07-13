import React from 'react';
import {
    LayoutChangeEvent,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
    ViewStyle,
} from 'react-native';
import Spinner from 'react-native-spinkit';
import Resources from '../../../res/Resources';

const res = Resources.get()

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
    loading?: boolean
}

export default function SearchBar({ focused, style, inputStyle, inputContainerStyle, onPress, phrase, onPhraseChanged, placeholder, readonly, leftIcon, rightIcon, onLayout, loading }: Props) {
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
            style={[styles.root, style]}>
            <View
                style={[styles.inputContainer, inputContainerStyle]}>
                {leftIcon}
                {loading ? (
                    <TouchableOpacity onPress={onPress} style={{ justifyContent: "center", alignItems: "center", width: 30, aspectRatio: 1 }}>
                        <Spinner type="Circle" size={15} color={res.getColors().DarkBeige} style={{ left: 6, top: 6, position: "absolute" }} />
                        <Spinner type="Pulse" size={12} color={res.getColors().DarkBeige} style={{ left: 9, top: 10, position: "absolute" }} />
                    </TouchableOpacity>
                ) : (
                    <TextInput
                        ref={inputRef}
                        contextMenuHidden={true}
                        numberOfLines={1}
                        autoCapitalize="none"
                        value={phrase}
                        placeholderTextColor={res.getColors().DarkBeige}
                        placeholder={placeholder}
                        onChangeText={text => onPhraseChanged?.(text)}
                        onPress={onPress}
                        readOnly={readonly}
                        style={[styles.input, inputStyle]} />
                )}
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
        backgroundColor: res.getColors().Beige,
        borderRadius: 10,
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    input: {
        color: res.getColors().DarkBeige,
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
