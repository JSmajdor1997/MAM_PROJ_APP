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
} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronDown, faClose, faSearch } from '@fortawesome/free-solid-svg-icons';
import WisbIcon, { IconType } from './WisbIcon';
import { Query, Type } from '../API/helpers';
import flipArrayElement from '../utils/flipArrayElement';
import SearchBar from './SearchBar';

interface Props {
    onPress: () => void
    style?: ViewStyle
    query: Query
    onQueryChanged: (newQuery: Query) => void
    isFocused: boolean
    onClear: ()=>void
}

export default function MapQueryInput({ style, onPress, query, onQueryChanged, isFocused, onClear }: Props) {
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
                zIndex: 100,
                ...style
            }}>
            <SearchBar
                leftIcon={<FontAwesomeIcon icon={faSearch} color="black" size={16} />}
                rightIcon={<FontAwesomeIcon icon={faChevronDown} color="black" size={16} />}
                placeholder='Szukaj wydarzeń i wysypisk...'
                onPress={onPress}
                phrase={query.phrase}
                onPhraseChanged={newPhrase => onQueryChanged({ ...query, phrase: newPhrase })}
                onClear={() => {
                    onQueryChanged({ type: [Type.Dumpster, Type.Event, Type.Dumpster], phrase: "" })
                    onClear()
                }} />

            <Animated.View style={{ flexDirection: "row", justifyContent: "space-around", width: "100%", height: heightAnim, overflow: "hidden", alignItems: "center", maxWidth: "100%" }}>
                <TouchableOpacity
                    style={{ opacity: query.type.includes(Type.Dumpster) ? 1 : 0.4 }}
                    onPress={() =>
                        onQueryChanged({
                            ...query,
                            type: flipArrayElement(query.type, Type.Dumpster)
                        })}>
                    <WisbIcon icon={IconType.Dumpster} size={20} greyOut={!query.type.includes(Type.Dumpster)} />
                </TouchableOpacity>

                <TouchableOpacity
                    style={{ opacity: query.type.includes(Type.Event) ? 1 : 0.4 }}
                    onPress={() =>
                        onQueryChanged({
                            ...query,
                            type: flipArrayElement(query.type, Type.Event)
                        })}>
                    <WisbIcon icon={IconType.Calendar} size={20} greyOut={!query.type.includes(Type.Event)} />
                </TouchableOpacity>

                <TouchableOpacity
                    style={{ opacity: query.type.includes(Type.Wasteland) ? 1 : 0.4 }}
                    onPress={() =>
                        onQueryChanged({
                            ...query,
                            type: flipArrayElement(query.type, Type.Wasteland)
                        })}>
                    <WisbIcon icon={IconType.WastelandIcon} size={20} greyOut={!query.type.includes(Type.Wasteland)} />
                </TouchableOpacity>
            </Animated.View>
        </View>
    );
}