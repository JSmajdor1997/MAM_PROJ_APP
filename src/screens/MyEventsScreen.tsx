import React, {Component} from 'react';
import {
  View,
  StatusBar,
  FlatList,
  Text
} from 'react-native';
import EventItem from '../components/EventItem';
import EventParticipantsDialog from '../dialogs/Event/EventParticipantsDialog';
import EventJoiningDialog from '../dialogs/Event/EventJoiningDialog';
import WisbScreens from './WisbScreens';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import NavigationParamsList from './NavigationParamsList';
import { Resources } from '../../res/Resources';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCalendar } from '@fortawesome/free-solid-svg-icons';

interface Props  extends NativeStackScreenProps<NavigationParamsList, WisbScreens.MyEventsScreen> {}

interface State {
  place: string | null;
  activeIndex: number;
  currentEvent: any | null;

  isQRAddingVisible: boolean;

  eventsToShow: Array<any>;
}

export default class EventsScreen extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      place: null,
      activeIndex: 0,
      currentEvent: null,
      isQRAddingVisible: false,
      eventsToShow: [],
    };
  }

  componentDidMount() {
    this.updateList();
  }

  updateList() {

  }

  render() {
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
          backgroundColor="transparent"
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
            <FontAwesomeIcon color="#ffffff77"  icon={faCalendar} size={70} />
          }
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          data={this.state.eventsToShow}
          keyExtractor={() => Math.random().toString()}
          renderItem={data => (
            <EventItem
              onShowParticipants={() =>
                this.setState({currentEvent: data.item})
              }
              item={data.item}
              onShowChat={event =>{
                
              }}
            />
          )}
        />

        {/* <EventParticipantsDialog
          onDismiss={() => this.setState({currentEvent: null})}
          visible={!!this.state.currentEvent}
          event={this.state.currentEvent}
        />
        <EventJoiningDialog
          visible={this.state.isQRAddingVisible}
          onDismiss={() =>
            this.setState({isQRAddingVisible: false}, this.updateList)
          }
        /> */}
      </View>
    );
  }
}
