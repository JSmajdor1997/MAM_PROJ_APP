import React, { Component, ReactElement } from 'react';
import {
  View,
  Text,
  StatusBar,
  Animated,
  Image,
  TextInput,
  Button,
  TouchableOpacity,
  PermissionsAndroid,
  StyleSheet,
  FlatList,
  Dimensions,
  Modal
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import EventItem from '../components/EventItem';
import WastelandItem from '../components/WastelandItem';
import SearchBar from '../components/SearchBar';
import { Resources } from '../../res/Resources';
import Dialog from './Dialog';

interface Props {
  visible: boolean;
  onDismiss: () => void;
  onItemSelected: (item: any | any) => void;
  type: 'WisbWastelands' | 'WisbEvents' | 'All';
}

interface State {
  searchBarText: string;
  data: Array<any>;
}

export default class EventsPlacesFilteringDialog extends Component<
  Props,
  State
> {
  searchBar: any | null = null;

  constructor(props: Props) {
    super(props);

    this.state = {
      searchBarText: '',
      data: [],
    };
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.visible != this.props.visible) {
      if (this.props.visible) {
        this.searchBar && this.searchBar.clear();
        this.onSearchBarTextChange('');
      } else {
        this.onSearchBarTextChange('');
      }
    }
  }

  onSearchBarTextChange(text: string) {
    text = text.toLowerCase();

    let newData = new Array<any>();

    let areWisbEventsAllowed = false;
    let areWisbWastelandsAllowed = false;
    switch (this.props.type) {
      case 'WisbEvents':
        areWisbEventsAllowed = true;
        break;
      case 'WisbWastelands':
        areWisbWastelandsAllowed = true;
        break;
      case 'All':
        areWisbEventsAllowed = true;
        areWisbWastelandsAllowed = true;
        break;
    }

    if (text == '') {
      if (areWisbEventsAllowed) {
        // newData.push(...WisbEvent.all);
      }

      if (areWisbWastelandsAllowed) {
        // newData.push(...WisbWasteland.all);
      }
    } else {
      if (areWisbEventsAllowed) {
        // newData.push(
        //   ...WisbEvent.all.filter(
        //     it =>
        //       it.title.toLowerCase().includes(text) ||
        //       it.description.toLowerCase().includes(text),
        //   ),
        // );
      }

      if (areWisbWastelandsAllowed) {
        // newData.push(
        //   ...WisbWasteland.all.filter(
        //     it =>
        //       it.description.toLowerCase().includes(text) ||
        //       it.placeName.toLowerCase().includes(text) ||
        //       it.authorName.toLowerCase().includes(text),
        //   ),
        //);
      }
    }

    this.setState({ searchBarText: text, data: newData });
  }

  renderItem(item: {
    item: any
    index: number;
  }): ReactElement {
    if (item.item instanceof Date)
      return (
        <EventItem
          item={item.item}
          key={item.index}
          onPress={() => { }}
        />
      );
    else
      return (
        <WastelandItem
          item={item.item}
          key={item.index}
          onPress={item => this.props.onItemSelected(item)}
        />
      );
  }

  render() {
    return (
      <Dialog
        onDismiss={this.props.onDismiss}
        visible={this.props.visible}>
        <View
          style={{
            backgroundColor: Resources.Colors.White,
            borderRadius: 10,
            justifyContent: 'space-between',
          }}>
          <SearchBar onClear={() => { }} onPress={() => { }} />
          <FlatList
            renderItem={this.renderItem.bind(this)}
            keyExtractor={item => item.ID}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => (
              <LinearGradient
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                colors={['#ffffff', '#bcbaba', '#ffffff']}
                style={styles.sectionsSeparator}
              />
            )}
            data={this.state.data}
          />
          <View
            style={{
              marginBottom: 0,
            }}>
            <LinearGradient
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              colors={['#ffffff', '#bcbaba', '#ffffff']}
              style={styles.sectionsSeparator}
            />
            <View style={styles.buttonsContainer}>
              <TouchableOpacity
                onPress={this.props.onDismiss}
                style={[styles.button, styles.rightButton, styles.rightButton]}>
                <Text style={[styles.label, { color: 'pink' }]}>ANULUJ</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Dialog>
    );
  }
}

const styles = StyleSheet.create({
  topContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 0,
    paddingVertical: 8,
  },
  dialog: {},
  buttonsContainer: {
    flexDirection: 'row',
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
  leftButton: {
    borderBottomStartRadius: 5,
  },
  rightButton: {
    borderBottomEndRadius: 5,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  sectionsSeparator: {
    width: '100%',
    height: StyleSheet.hairlineWidth * 2,
  },
  buttonsSeparator: {
    height: '100%',
    width: StyleSheet.hairlineWidth,
    backgroundColor: '#bcbaba',
  },
});
