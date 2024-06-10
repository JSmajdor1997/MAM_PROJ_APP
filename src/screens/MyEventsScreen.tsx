import React, { Component } from 'react';
import {
  View,
  StatusBar,
  FlatList,
  Text,
  StyleSheet
} from 'react-native';
import EventItem from '../components/EventItem';
import WisbScreens from './WisbScreens';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import NavigationParamsList from './NavigationParamsList';
import Resources from '../../res/Resources';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCalendar } from '@fortawesome/free-solid-svg-icons';
import SearchBar from '../components/SearchBar';

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
        ...styles.root,
        paddingTop: StatusBar.currentHeight
          ? StatusBar.currentHeight - 8
          : 20,
      }}>
      <StatusBar
        backgroundColor={Resources.get().getColors().Transparent}
        translucent
        barStyle="dark-content"
      />

      <SearchBar phrase='' placeholder='Szukaj wydarzeń...'/>

      <FlatList
        style={styles.flatList}
        contentContainerStyle={styles.flatListContentContainer}
        ListEmptyComponent={
          <FontAwesomeIcon color={Resources.get().getColors().BackdropWhite} icon={faCalendar} size={70} />
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

const styles = StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: Resources.get().getColors().White,
    },
    flatList: {
      flex: 1,
      marginBottom: 80,
      marginTop: 14,
    }, 
    flatListContentContainer: {
      flex: 1,
      marginBottom: 80,
      marginTop: 14,
    }
})