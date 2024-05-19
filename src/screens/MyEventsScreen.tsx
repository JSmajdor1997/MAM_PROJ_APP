import React, { Component } from 'react';
import {
  View,
  StatusBar,
  FlatList,
  Text
} from 'react-native';
import EventItem from '../components/EventItem';
import WisbScreens from './WisbScreens';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import NavigationParamsList from './NavigationParamsList';
import { Resources } from '../../res/Resources';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCalendar } from '@fortawesome/free-solid-svg-icons';

interface Props extends NativeStackScreenProps<NavigationParamsList, WisbScreens.MyEventsScreen> { }

export default function EventsScreen({ }: Props) {
  const [state, setState] = React.useState({
    place: null,
    activeIndex: 0,
    currentEvent: null,
    isQRAddingVisible: false,
    eventsToShow: [],
  })

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Resources.Colors.White,
        paddingTop: StatusBar.currentHeight
          ? StatusBar.currentHeight - 8
          : 20,
      }}>
      <StatusBar
        backgroundColor={Resources.Colors.Transparent}
        translucent
        barStyle="dark-content"
      />

      <FlatList
        style={{
          flex: 1,
          marginBottom: 80,
          marginTop: 14,
        }}
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: [].length == 0 ? 'center' : undefined,
        }}
        ListEmptyComponent={
          <FontAwesomeIcon color={Resources.Colors.BackdropWhite} icon={faCalendar} size={70} />
        }
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        data={state.eventsToShow}
        keyExtractor={() => Math.random().toString()}
        renderItem={data => (
          <EventItem
            onPress={() => { }}
            item={data.item}
          />
        )}
      />
    </View>
  );
}