import React, { Component, VoidFunctionComponent } from 'react';
import {
    View,
    TextInput,
    Text,
    TouchableOpacity,
    StyleProp,
    ViewStyle,
    Animated,
    Easing,
    StyleSheet,
} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronDown, faClose, faSearch } from '@fortawesome/free-solid-svg-icons';
import Resources from '../../../res/Resources';
import { Type } from '../../API/helpers';
import IconType from '../WisbIcon/IconType';
import WisbIcon from '../WisbIcon/WisbIcon';
import SearchBar from '../SearchBar';

interface Props {
    onPress: () => void
    style?: ViewStyle
    onPhraseChanged: (phrase: string) => void
    isFocused: boolean
    onClear: () => void
    placeholder: string
    phrase: string
    items: {
        isSelected: boolean
        component: React.ReactNode
        onClick: () => void
    }[]
}

export default function QueryInput({ style, onPress, phrase, onPhraseChanged, items, isFocused, onClear, placeholder }: Props) {
    const heightAnim = React.useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        if (isFocused) {
            Animated.timing(heightAnim, {
                toValue: 35,
                duration: 100,
                useNativeDriver: false,
                easing: Easing.quad
            }).start()
        } else {
            Animated.timing(heightAnim, {
                toValue: 0,
                duration: 100,
                useNativeDriver: false,
                easing: Easing.quad
            }).start()
        }
    }, [isFocused])

    return (
        <View
            style={{
                padding: 6,
                alignItems: 'center',
                justifyContent: 'center',
                ...style
            }}>
            <SearchBar
                focused={isFocused}
                leftIcon={<FontAwesomeIcon icon={faSearch} color={Resources.get().getColors().Black} size={16} />}
                rightIcon={(
                    isFocused ?
                        <TouchableOpacity onPress={onClear}>
                            <FontAwesomeIcon icon={faClose} color={Resources.get().getColors().Black} size={16} />
                        </TouchableOpacity> :
                        <FontAwesomeIcon icon={faChevronDown} color={Resources.get().getColors().Black} size={16} />
                )}
                placeholder={placeholder}
                onPress={onPress}
                phrase={phrase}
                onPhraseChanged={onPhraseChanged} />

            <Animated.View style={{ flexDirection: "row", justifyContent: "space-around", width: "100%", height: heightAnim, overflow: "hidden", alignItems: "center", maxWidth: "100%" }}>
                {items.map(item => (
                    <TouchableOpacity
                        disabled={item.isSelected}
                        style={{ opacity: item.isSelected ? 1 : 0.4 }}
                        onPress={item.onClick}>
                        {item.component}
                    </TouchableOpacity>
                ))}
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({

})