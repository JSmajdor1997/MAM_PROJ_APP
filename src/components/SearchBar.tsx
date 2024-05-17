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

interface Props {
    onPress: () => void
    style?: ViewStyle
    query: Query
    onQueryChanged: (newQuery: Query) => void
    isFocused: boolean
}

export default function SearchBar({ style, onPress, query, onQueryChanged, isFocused }: Props) {
    const heightAnim = React.useRef(new Animated.Value(0)).current;

    React.useEffect(()=>{
        if(isFocused) {
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
            <View>
                <View
                    style={{
                        position: 'absolute',
                        height: 35,
                        width: '100%',
                        backgroundColor: '#919191',
                        borderRadius: 10,
                        padding: 10,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}
                />
                <View
                    style={{
                        width: '100%',
                        height: 35,
                        backgroundColor: '#d6d6d6',
                        borderRadius: 10,
                        padding: 10,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}>
                    <TouchableOpacity>
                        <FontAwesomeIcon icon={faSearch} color="black" size={16} />
                    </TouchableOpacity>
                    <TextInput
                        numberOfLines={1}
                        value={query.phrase}
                        placeholder='Szukaj wydarzeń i wysypisk...'
                        onChangeText={text => onQueryChanged({
                            ...query,
                            phrase: text
                        })}
                        onPress={() => {
                            onPress()
                        }}
                        style={{
                            color: '#00000036',
                            fontSize: 16,
                            flex: 1,
                            paddingRight: 12,
                            paddingLeft: 6,
                        }} />
                    {query.phrase.length == 0 ? <TouchableOpacity
                        onPress={onPress}
                        style={{ paddingLeft: 4, paddingTop: 4, paddingBottom: 4 }}>
                        <FontAwesomeIcon icon={faChevronDown} color="black" size={16} />
                    </TouchableOpacity> : <TouchableOpacity
                        onPress={() => onQueryChanged({
                            type: [Type.Dumpster, Type.Event, Type.Wasteland],
                            phrase: ""
                        })}
                        style={{ paddingLeft: 4, paddingTop: 4, paddingBottom: 4 }}>
                        <FontAwesomeIcon icon={faClose} color="black" size={16} />
                    </TouchableOpacity>}
                </View>
            </View>

            <Animated.View style={{ flexDirection: "row", justifyContent: "space-around", width: "100%", height: heightAnim, overflow: "hidden", alignItems: "center", maxWidth: "100%" }}>
                <TouchableOpacity
                    style={{ opacity: query.type.includes(Type.Dumpster) ? 1 : 0.4 }}
                    onPress={() =>
                        onQueryChanged({
                            ...query,
                            type: flip(query.type, Type.Dumpster)
                        })}>
                    <WisbIcon icon={IconType.Dumpster} size={20} greyOut={!query.type.includes(Type.Dumpster)} />
                </TouchableOpacity>

                <TouchableOpacity
                    style={{ opacity: query.type.includes(Type.Event) ? 1 : 0.4 }}
                    onPress={() =>
                        onQueryChanged({
                            ...query,
                            type: flip(query.type, Type.Event)
                        })}>
                    <WisbIcon icon={IconType.Calendar} size={20}  greyOut={!query.type.includes(Type.Event)}/>
                </TouchableOpacity>

                <TouchableOpacity
                    style={{ opacity: query.type.includes(Type.Wasteland) ? 1 : 0.4 }}
                    onPress={() =>
                        onQueryChanged({
                            ...query,
                            type: flip(query.type, Type.Wasteland)
                        })}>
                    <WisbIcon icon={IconType.WastelandIcon} size={20} greyOut={!query.type.includes(Type.Wasteland)}/>
                </TouchableOpacity>
            </Animated.View>
        </View>
    );
}

function flip(array: Type[], element: Type) {
    const index = array.indexOf(element)

    if (index == -1) {
        return [...array, element]
    }

    return [
        ...array.slice(0, index),
        ...array.slice(index + 1),
    ]
}