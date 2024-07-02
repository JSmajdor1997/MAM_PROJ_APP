import React, { Component } from 'react';
import {
  View,
  StatusBar,
  FlatList,
  Text,
  StyleSheet,
  Dimensions
} from 'react-native';
import EventItem from '../components/EventItem';
import WisbScreens from './WisbScreens';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import NavigationParamsList from './NavigationParamsList';
import Resources from '../../res/Resources';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCalendar } from '@fortawesome/free-solid-svg-icons';
import SearchBar from '../components/SearchBar';
import QueryInput from '../components/QueryInput/QueryInput';
import getAPI from '../API/getAPI';
import Event, { EventUser } from '../API/data_types/Event';
import ObjectsList from '../components/ObjectsList';
import { isEvent } from '../API/data_types/type_guards';
import { Type } from '../API/helpers';

interface Props extends NativeStackScreenProps<NavigationParamsList, WisbScreens.MyEventsScreen> { }

export default function EventsScreen({ route: { params: { getCurrentUser } } }: Props) {
  const [phrase, setPhrase] = React.useState("")
  const [isSearching, setIsSearching] = React.useState(false)
  const [onlyCurrentEvents, setOnlyCurrentEvents] = React.useState(true)

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

      <View
        style={{
          ...styles.mapQueryInputContainer,
          marginTop: (StatusBar.currentHeight ?? 20),
        }}>
        <QueryInput
          placeholder='Szukaj swoich wydarzeń'
          onPress={() => {
            setIsSearching(true)
          }}
          onPhraseChanged={setPhrase}
          isFocused={isSearching}
          onClear={() => {
            setPhrase("")
            setIsSearching(false)
          }}
          phrase={phrase}
          items={[
            {
              isSelected: onlyCurrentEvents,
              component: <Text>Obecne</Text>,
              onClick: () => {
                setOnlyCurrentEvents(true)
              }
            },
            {
              isSelected: !onlyCurrentEvents,
              component: <Text>Przeszłe</Text>,
              onClick: () => {
                setOnlyCurrentEvents(false)
              }
            }
          ]}
        />
      </View>

      <ObjectsList
        style={styles.flatList}
        currentUser={getCurrentUser()}
        type={Type.Event}
        filter={{
          [Type.Event]: {
            onlyOwn: true
          }
        }}
        multi={false}
        onPressed={(item: Event) => {
          if (!isEvent(item)) {

          }
        }}
        phrase={phrase}
        googleMapsApiKey={""}
      />

      <View style={{
        position: "absolute", width: "120%", left: -20, height: 120, bottom: -120,
        shadowColor: "#000000",
        backgroundColor: "black",
        borderRadius: 100,
        shadowOffset: {
          width: 0,
          height: -110,
        },
        shadowOpacity: 0.4,
        shadowRadius: 10,
      }} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Resources.get().getColors().White,
  },
  flatList: {
    marginTop: 14,
  },
  flatListContentContainer: {
    marginTop: 14,
  },
  mapQueryInputContainer: {
    shadowColor: Resources.get().getColors().Black,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.51,
    shadowRadius: 13.16,

    elevation: 20,
    backgroundColor: Resources.get().getColors().White,
    borderRadius: 10,
    marginHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
})