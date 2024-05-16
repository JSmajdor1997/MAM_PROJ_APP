import React, { Component } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  Alert,
  StatusBar,
} from 'react-native';
import { MenuItem, Menu } from 'react-native-material-menu';
import FastImage from 'react-native-fast-image';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import WisbIcon, { IconType } from './WisbIcon';
import { faCrown, faMobileRetro } from '@fortawesome/free-solid-svg-icons';
import { faMessage } from '@fortawesome/free-regular-svg-icons';

interface Props {
  item: any;
  onShowParticipants: () => void;
  onShowChat: (event: any) => void;
}

interface State {
  image: string | null;
  isUserAdmin: boolean;

  maxHeight: number | undefined;
}

export default class EventItem extends Component<Props, State> {
  private static IDsCounter = 0;
  private static instances = new Array<EventItem>();
  private ID: number;
  private menu: any = null;

  constructor(props: Props) {
    super(props);

    this.ID = EventItem.IDsCounter++;

    this.state = {
      image: null,
      isUserAdmin: false,

      maxHeight: 130,
    };
  }

  private static async closeAll(exceptFor: number) {
    EventItem.instances.forEach(instance => {
      if (instance.ID != exceptFor) instance.setState({ maxHeight: 120 });
    });
  }

  componentDidMount() {
    EventItem.instances.push(this);

    this.props.item.getImagesBase64().then(images => {
      this.setState({ image: images[0] });
    });

    this.props.item
      .isUserAdmin()
      .then(() => this.setState({ isUserAdmin: true }));
  }

  componentWillUnmount() {
    EventItem.instances = EventItem.instances.filter(it => it.ID != this.ID);
  }

  showMenu() {
    this.menu && this.menu.show();
  }

  hideMenu() {
    this.menu && this.menu.hide();
  }

  render() {
    const { image, isUserAdmin } = this.state;
    const { item } = this.props;
    const primary = 'white';
    const white = '#55ba9b';

    return (
      <TouchableOpacity
        activeOpacity={0.6}
        onPress={() => {
          EventItem.closeAll(this.ID);

          this.setState({
            maxHeight: this.state.maxHeight == undefined ? 130 : undefined,
          });
        }}
        style={{
          flex: 1,
          backgroundColor: primary,
          marginVertical: 10,
          minHeight: 120,
          maxHeight: this.state.maxHeight,
          marginHorizontal: 16,
          borderRadius: 10,
          justifyContent: 'space-between',

          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 1,
          },
          shadowOpacity: 0.1,
          shadowRadius: 12,

          elevation: 5,
        }}>
        <View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 6,
              marginHorizontal: 6,
            }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View
                style={{
                  height: 39,
                  width: 39,
                  borderRadius: 50,
                  backgroundColor: image ? 'black' : 'white',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                {
                  image
                    ? <FastImage
                      style={{
                        height: image ? 36 : 26,
                        width: image ? 36 : 26,
                        borderRadius: image ? 50 : 0,
                      }}
                      resizeMode="cover"
                      source={{
                        uri: image,
                      }}
                    />
                    : <WisbIcon size={22} icon={IconType.Earth} />
                }
              </View>
              <Text
                numberOfLines={1}
                style={{
                  color: 'black',
                  marginLeft: 8,
                  fontWeight: 'bold',
                  fontSize: 16,
                }}>
                {item.title}
              </Text>
            </View>

            <Menu
              style={{ marginTop: StatusBar.currentHeight }}
              button={
                <TouchableOpacity
                  style={{ marginRight: -6 }}
                  onPress={this.showMenu.bind(this)}>
                  <FontAwesomeIcon color={white} icon={faMobileRetro} />
                </TouchableOpacity>
              }
              ref={(ref: any) => (this.menu = ref)}>
              <MenuItem
                onPress={() => {
                  this.props.onShowParticipants();
                  this.hideMenu();
                }}>
                Uczestnicy
              </MenuItem>
              <MenuItem
                onPress={() => {
                  this.hideMenu();
                  alert('TODO');
                }}>
                Udostępnij
              </MenuItem>
              <MenuItem
                onPress={() => {
                  this.hideMenu();
                  alert('TODO');
                }}>
                Edytuj
              </MenuItem>
              {isUserAdmin ? (
                <MenuItem
                  onPress={() => {
                    this.hideMenu();
                    Alert.alert(
                      'Usunięcie wydarzenia',
                      'Czy na pewno chcesz usunąć to wydarzenie? Tej akcji nie mozna cofnąć.',
                      [
                        {
                          text: 'ANULUJ',
                          onPress: () => { },
                          style: 'cancel',
                        },
                        {
                          text: 'TAK',
                          onPress: () => {
                            this.props.item.delete();
                            this.props.onShowParticipants();
                          },
                        },
                      ],
                      { cancelable: true },
                    );
                  }}>
                  Usuń
                </MenuItem>
              ) : (
                <MenuItem
                  onPress={() => {
                    this.hideMenu();
                    this.props.item.leave();
                    this.props.onShowParticipants();
                  }}>
                  Opuść
                </MenuItem>
              )}
            </Menu>
          </View>

          <Text
            style={{
              color: 'black',
              marginLeft: 52,
              marginRight: 40,
              marginTop: 5,
            }}
            numberOfLines={2}>
            {item.description}
          </Text>
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginHorizontal: 6,
            marginBottom: 2,
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <TouchableOpacity
              onPress={this.props.onShowChat.bind(this, item)}
              style={{
                alignSelf: 'flex-start',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <FontAwesomeIcon color={white} icon={faMessage} />
            </TouchableOpacity>
            {isUserAdmin == true && (
              <View style={{ marginLeft: 6 }}>
                <FontAwesomeIcon
                  icon={faCrown}
                  color="#ff8c00"
                  size={15}
                />
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}
