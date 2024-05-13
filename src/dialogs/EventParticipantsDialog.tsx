import React, {Component} from 'react';
import {
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Dimensions,
  Modal
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Resources } from '../../res/Resources';
import { Avatar } from 'react-native-gifted-chat';

interface Props {
  visible: boolean;
  onDismiss: () => void;
  event: any | null;
}

interface State {
  searchBarText: string;
  allParticipants: Array<any>;
  data: Array<any>;
}

export default class EventParticipantsDialog extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      searchBarText: '',
      allParticipants: [],
      data: [],
    };
  }

  fetch() {
    if (this.props.event) {
      this.props.event.getParticipants().then(participants => {
        this.setState(
          {allParticipants: participants},
          this.onSearchBarTextChange.bind(this, ''),
        );
      });
    }
  }

  componentDidMount() {
    this.fetch();
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.visible != this.props.visible) {
      if (!prevProps.visible) {
        this.fetch();
      } else {
        this.onSearchBarTextChange('');
      }
    }
  }

  onSearchBarTextChange(text: string) {
    const {event} = this.props;
    if (event) {
      text = text.toLowerCase();

      let newData = new Array<any>();

      if (text == '') {
        newData = this.state.allParticipants;
      } else {
        newData.push(
          ...this.state.allParticipants.filter(user =>
            user.name.toLowerCase().includes(text),
          ),
        );
      }

      this.setState({searchBarText: text, data: newData});
    }
  }

  render() {
    const {searchBarText} = this.state;

    return (
      <Modal
        onDismiss={this.props.onDismiss}
        visible={this.props.visible}>
        <View
          style={{
            top: StatusBar.currentHeight,
            bottom: 0,
            right: 0,
            left: 0,
            position: 'absolute',
            backgroundColor: Resources.Colors.White,
            borderRadius: 10,
            justifyContent: 'space-between',
          }}>
          <FlatList
            renderItem={data => (
              <View
                style={{
                  width: '100%',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingVertical: 4,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingLeft: 8,
                  }}>
                  <Avatar
                    size={40}
                    fontSize={18}
                    username={data.item.name}
                    image={data.item.avatar}
                  />
                  <Text
                    style={{
                      fontWeight: 'bold',
                      marginLeft: 16,
                      fontSize: 16,
                    }}>
                    {data.item.name}
                  </Text>
                </View>
              </View>
            )}
            keyExtractor={item => item.ID}
            ItemSeparatorComponent={() => (
              <LinearGradient
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
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
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              colors={['#ffffff', '#bcbaba', '#ffffff']}
              style={styles.sectionsSeparator}
            />
            <View style={styles.buttonsContainer}>
              <TouchableOpacity
                onPress={this.props.onDismiss}
                style={[styles.button, styles.rightButton, styles.rightButton]}>
                <Text style={[styles.label, {color: 'pink'}]}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
