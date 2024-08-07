import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  View
} from 'react-native';
import Resources from '../../res/Resources';
import WisbObjectType from '../API/WisbObjectType';
import ObjectsList from '../components/lists/ObjectsList';
import QueryInput from '../components/inputs/QueryInput';
import NavigationParamsList, { WisbScreens } from './NavigationParamsList';
import getAPI from '../API/getAPI';

const res = Resources.get()
const api = getAPI()

interface Props extends NativeStackScreenProps<NavigationParamsList, WisbScreens.MyEventsScreen> { }

export default function EventsScreen({ route: { params: { onItemSelected } } }: Props) {
  const [phrase, setPhrase] = React.useState("")
  const [isSearching, setIsSearching] = React.useState(false)
  const [onlyCurrentEvents, setOnlyCurrentEvents] = React.useState(true)

  const currentUser = api.getCurrentUser()

  if(currentUser == null) {
    return <Text>BŁĄD!</Text>
  }

  return (
    <View style={[styles.root, { paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight - 8 : 20 }]}>
      <StatusBar
        backgroundColor={res.getColors().Transparent}
        translucent
        barStyle="dark-content"
      />

      <View style={[styles.mapQueryInputContainer, { marginTop: (StatusBar.currentHeight ?? 20) }]}>
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
              component: <Text style={{ fontFamily: res.getFonts().Secondary }}>Obecne</Text>,
              onClick: () => {
                setOnlyCurrentEvents(true)
              }
            },
            {
              isSelected: !onlyCurrentEvents,
              component: <Text style={{ fontFamily: res.getFonts().Secondary }}>Przeszłe</Text>,
              onClick: () => {
                setOnlyCurrentEvents(false)
              }
            }
          ]}
        />
      </View>

      <ObjectsList<WisbObjectType.Event, false>
        style={styles.flatList}
        currentUser={currentUser}
        type={WisbObjectType.Event}
        filter={{
          onlyOwn: true,
          activeOnly: onlyCurrentEvents,
          phrase
        }}
        multiselect={false}
        onSelection={onItemSelected}
        googleMapsAPIKey={res.getEnv().GOOGLE_MAPS_API_KEY}
        ListFooterComponent={<View style={{height: 150}}/>}
      />

      <View style={styles.shadowView} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: res.getColors().White,
  },
  flatList: {
    marginTop: 14,
    flex: 1
  },
  flatListContentContainer: {
    marginTop: 14,
  },
  mapQueryInputContainer: {
    shadowColor: res.getColors().Black,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.51,
    shadowRadius: 13.16,
    elevation: 20,
    backgroundColor: res.getColors().White,
    borderRadius: 10,
    marginHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  shadowView: {
    position: "absolute",
    width: "120%",
    left: -20,
    height: 120,
    bottom: -120,
    shadowColor: "#000000",
    backgroundColor: "black",
    borderRadius: 100,
    shadowOffset: {
      width: 0,
      height: -110,
    },
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },
});
