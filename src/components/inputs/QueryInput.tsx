import { faChevronDown, faClose, faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React from 'react';
import {
    Animated,
    Easing,
    StyleSheet,
    TouchableOpacity,
    View,
    ViewStyle
} from 'react-native';
import Resources from '../../../res/Resources';
import SearchBar from './SearchBar';

const res = Resources.get()

interface Props {
    onPress: () => void
    style?: ViewStyle
    onPhraseChanged: (phrase: string) => void
    isFocused: boolean
    onClear: () => void
    placeholder: string
    phrase: string
    loading?: boolean
    items: {
        isSelected: boolean
        component: React.ReactNode
        onClick: () => void
    }[]
}

export default function QueryInput({ style, onPress, phrase, onPhraseChanged, items, isFocused, onClear, placeholder, loading }: Props) {
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
                loading={loading}
                focused={isFocused}
                leftIcon={<FontAwesomeIcon icon={faSearch} color={res.getColors().Black} size={16} />}
                rightIcon={(
                    <TouchableOpacity onPress={isFocused ? onClear : onPress}>
                        {isFocused ? <FontAwesomeIcon icon={faClose} color={res.getColors().Black} size={16} /> :
                            <FontAwesomeIcon icon={faChevronDown} color={res.getColors().Black} size={16} />}

                    </TouchableOpacity>
                )}
                placeholder={placeholder}
                onPress={onPress}
                phrase={phrase}
                onPhraseChanged={onPhraseChanged} />

            <Animated.View style={{ flexDirection: "row", minWidth: "100%", justifyContent: "space-around", height: heightAnim, overflow: "hidden", alignItems: "center", maxWidth: "100%" }}>
                {items.map((item, index) => (
                    <TouchableOpacity
                        key={index}
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
