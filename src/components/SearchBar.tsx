import { Icon } from '@rneui/base';
import React, { Component, VoidFunctionComponent } from 'react';
import {
    View,
    TextInput,
    Text,
    TouchableOpacity,
    StyleProp,
    ViewStyle,
} from 'react-native';

interface Props {
    onClear: () => void;
    onPress: ()=>void
    style?: ViewStyle
}

export default function SearchBar({ style, onPress, onClear }: Props) {
    return (
        <View
            style={{
                padding: 6,
                alignItems: 'center',
                justifyContent: 'center',
                ...style
            }}>
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
            <TouchableOpacity
                onPress={onPress}
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
                    <Icon type="font-awesome" name="search" color="black" size={16} />
                </TouchableOpacity>
                <Text
                    numberOfLines={1}
                    style={{
                        color: '#00000036',
                        fontSize: 16,
                        flex: 1,
                        paddingRight: 12,
                        paddingLeft: 6,
                    }}>
                    Szukaj wydarzeń i wysypisk...
                </Text>
                <TouchableOpacity
                    onPress={onClear}
                    style={{ paddingLeft: 4, paddingTop: 4, paddingBottom: 4 }}>
                    <Icon name="close" type="material" color="black" size={16} />
                </TouchableOpacity>
            </TouchableOpacity>
        </View>
    );
}