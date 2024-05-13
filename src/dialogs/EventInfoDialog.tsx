import React, {Component, ReactElement, Fragment} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import QRCode from 'react-native-qrcode-svg';
import Swiper from 'react-native-swiper';
import Spinner from 'react-native-spinkit';
import { Icon } from '@rneui/base';
import ShakyDialog from './ShakyDialog';
import { Resources } from '../../res/Resources';
import { event_icon, map_pin_icon } from '../../res/icons/icons';
import OTPTextView from '../components/OTPTextView';
import TextField from '../components/TextField';
import ImagesList from '../components/ImagesList';
import { FBShareButton, TwitterShareButton, renderFAB } from '../components/buttons';

function formatDate(date: Date) {
  var monthNames = [
    'Styczeń',
    'Luty',
    'Marzec',
    'Kwiecień',
    'Maj',
    'Czerwiec',
    'Lipiec',
    'Sierpień',
    'Wrzesień',
    'Październik',
    'Listopad',
    'Grudzień',
  ];

  var day = date.getDate();
  var monthIndex = date.getMonth();
  var year = date.getFullYear();

  return day + ' ' + monthNames[monthIndex] + ' ' + year;
}

interface Props {
  //  determines whether dialog should be visible
  visible: boolean;
  //  function called once user requests to close the dialog
  onDismiss: () => void;
  onShowOnMap: (event: any) => void;
  event: any | null
}

interface State {
  currentIndex: number;
  //  used to calculate size for QR tag
  sizeOfQR: number;

  isPublishing: boolean;
  isEventsFilteringDialogVisible: boolean;
  isDateDialogVisible: boolean;
  placeName: string;
  wasteland: any | null;

  imagesUris: Array<{image: string, ID: number}>;
}

export default class EventInfoDialog extends Component<Props, State> {
  private swiper: Swiper | null = null;

  constructor(props: Props) {
    super(props);

    this.state = {
      currentIndex: 0,
      sizeOfQR: -1,

      isPublishing: false,
      isEventsFilteringDialogVisible: false,
      isDateDialogVisible: false,

      placeName: '',
      wasteland: null,
      imagesUris: [],
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.visible != prevProps.visible && this.props.visible == true) {
      this.fetchData();
      this.swipeTo(0);
    }
  }

  private async setPlaceName() {
    const {event} = this.props;

    if (event && event.position.latitude && event.position.longitude) {


      const ff = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?key=${API_KEY}&latlng=${event.position.latitude},${event.position.longitude}&language=pl`,
      );

      const parsedResponse = await ff.json();

      this.setState({placeName: parsedResponse.results[0].formatted_address});
    }
  }

  private fetchData() {
    this.setPlaceName();

    if (this.props.event) {
      this.props.event
        .getWasteland()
        .then(wasteland => this.setState({wasteland}));

      this.props.event.getImagesBase64().then(images =>
        this.setState({
          imagesUris: images.map((it, index) => {
            return {image: it, ID: index};
          }),
        }),
      );

      this.props.event.getParticipants;
    }
  }

  private shareOnTwitter() {
    const event = this.props.event;

    if (event)
      event.getImagesBase64().then(images => {
        // shareOnTwitter(
        //   {
        //     text: 'Zapraszam do wspólnego sprzątania ' + event.title,
        //     image: images[0],
        //   },
        //   (results: any) => {
        //     console.log(results);
        //   },
        // );
      });
  }

  private shareOnFacebook() {
    const event = this.props.event;

    if (event)
      event.getImagesBase64().then(images => {
        // shareOnFacebook(
        //   {
        //     text: 'Zapraszam do wspólnego sprzątania ' + event.title,
        //     image: images[0],
        //   },
        //   (results: any) => {
        //     console.log(results);
        //   },
        // );
      });
  }

  private swipeTo(index: number) {
    this.swiper && this.swiper.scrollTo(index);

    this.setState({currentIndex: index});
  }

  private renderHeader(): ReactElement {
    const {currentIndex} = this.state;
    const {event} = this.props;

    let label: string;
    if (currentIndex == 0) {
      label = event ? event.title : '';
    } else if (currentIndex == 1) {
      label = 'Dodawanie zdjęć';
    } else {
      label = 'Udostępnianie';
    }

    return (
      <View
        style={{
          width: '100%',
          backgroundColor: '#60b580',
          height: '24%',
          top: 0,
          justifyContent: 'space-between',
        }}>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 8,
          }}>
          <TouchableOpacity
            style={{position: 'absolute', right: 4, top: 4}}
            onPress={this.props.onDismiss}>
            <Icon type="material" name="close" size={20} color="white" />
          </TouchableOpacity>
          <FastImage source={event_icon} style={{aspectRatio: 1, width: 40}} />
          <Text
            style={{
              color: 'white',
              fontSize: 30,
              fontFamily: 'roboto',
              fontWeight: 'bold',
              textAlign: 'center',
            }}>
            {label}
          </Text>
        </View>
        <View
          style={{
            marginRight: 6,
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'flex-end',
            marginTop: 4,
            padding: 4,
          }}>
          {this.state.placeName != '' && (
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text
                style={{
                  fontFamily: 'roboto',
                  color: 'white',
                  fontSize: 10,
                  marginRight: 6,
                  opacity: 0.8,
                }}>
                {this.state.placeName}
              </Text>
              <FastImage
                source={map_pin_icon}
                style={{aspectRatio: 1, width: 22}}
              />
            </View>
          )}
        </View>
      </View>
    );
  }

  private renderBasicDataPage(): ReactElement {
    const {event} = this.props;

    return (
      <ScrollView
        style={{flex: 1}}
        contentContainerStyle={{flex: 1, paddingBottom: 4}}>
        <TextField
          containerStyle={{flex: 6, marginTop: 10}}
          readonly={true}
          placeholder="Opis wydarzenia">
          {event ? event.description : ''}
        </TextField>

        <TextField readonly={true} placeholder="Data wydarzenia">
          {formatDate(new Date())}
        </TextField>

        {this.state.wasteland && (
          <TextField readonly={true} placeholder="Wysypisko do posprzątania">
            {this.state.wasteland.placeName}
          </TextField>
        )}
      </ScrollView>
    );
  }

  private renderPhotosAddingPage(): ReactElement {
    return (
      <View
        style={{
          flex: 1,
        }}>
        {this.state.imagesUris.length != 0 ? (
          <ImagesList
            readonly={true}
            images={this.state.imagesUris}
            onImagesChanged={images => this.setState({imagesUris: images})}
          />
        ) : (
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text>Brak zdjęć</Text>
          </View>
        )}
      </View>
    );
  }

  private renderSharingPage(): ReactElement {
    return (
      <View
        onLayout={e => {
          if (e.nativeEvent.layout.width != 0) {
            this.setState({sizeOfQR: e.nativeEvent.layout.width});
          }
        }}
        style={{
          flex: 1,
          justifyContent: 'space-between',
        }}>
        <View
          style={{
            alignItems: 'center',
            padding: 10,
            justifyContent: 'space-between',
          }}>
          <QRCode
            size={this.state.sizeOfQR / 2}
            value={this.props.event ? this.props.event.joinCode : '.'}
          />

          <OTPTextView
            readonly={true}
            inputCount={8}
            defaultValue={this.props.event ? this.props.event.joinCode : ''}
            cellTextLength={1}
            textInputStyle={{
              width: undefined,
              backgroundColor: '#f7f7f7',
              marginTop: 8,
            }}
            containerStyle={{marginHorizontal: 8}}
          />
        </View>
      </View>
    );
  }

  private renderNavButtons(): ReactElement {
    const {onDismiss, event, onShowOnMap} = this.props;
    const {currentIndex} = this.state;

    let buttons: ReactElement;

    switch (currentIndex) {
      case 0: //  basic data
        buttons = (
          <Fragment>
            {renderFAB(
              <Icon type="entypo" name="map" color="white" />,
              '#db887b',
              () => event && onShowOnMap(event),
              'Mapa',
            )}
            {this.props.event && this.props.event.isUserParticipant
              ? renderFAB(
                  <Icon type="entypo" name="emoji-sad" color="white" />,
                  '#ffcb5c',
                  () => {
                    Alert.alert(
                      'Bez Ciebie nie będzie już tak samo',
                      'Czy na pewno chcesz opuścić wydarzenie?',
                      [
                        {
                          text: 'Nie',
                          style: 'cancel',
                        },
                        {
                          text: 'Tak',
                          onPress: () => {
                            if (this.props.event) {
                              this.props.event.leave();
                              this.props.event.isUserParticipant = false;
                              this.forceUpdate();
                            }
                          },
                        },
                      ],
                      {cancelable: false},
                    );
                  },
                  'Opuść',
                  65,
                )
              : renderFAB(
                  <Icon type="antdesign" name="adduser" color="white" />,
                  '#ffcb5c',
                  () => {
                    Alert.alert(
                      'Dołączanie do wydarzenia',
                      'Czy chcesz dołaczyć do wydarzenia?',
                      [
                        {
                          text: 'Nie',
                          style: 'cancel',
                        },
                        {
                          text: 'Tak',
                          onPress: () => {
                            if (this.props.event) {
                              this.props.event.join();
                              this.props.event.isUserParticipant = true;
                              this.forceUpdate();
                            }
                          },
                        },
                      ],
                      {cancelable: false},
                    );
                  },
                  'Dołącz',
                  65,
                )}
            {renderFAB(
              <Icon type="entypo" name="folder-images" color="white" />,
              '#60b580',
              () => {
                Keyboard.dismiss();
                this.swipeTo(1);
              },
              'Zdjęcia',
            )}
          </Fragment>
        );
        break;
      case 1: //  photos
        buttons = (
          <Fragment>
            {renderFAB(
              <Icon type="antdesign" name="arrowleft" color="white" />,
              '#db887b',
              this.swipeTo.bind(this, 0),
              'Wróć',
            )}
            {renderFAB(
              <Icon type="antdesign" name="adduser" color="white" />,
              '#ffcb5c',
              () => {
                Keyboard.dismiss();
                this.swipeTo(1);
              },
              'Dołącz',
              65,
            )}
            {renderFAB(
              this.state.isPublishing ? (
                <Spinner type="FadingCircleAlt" color="white" />
              ) : (
                <Icon type="antdesign" name="sharealt" color="white" />
              ),
              '#60b580',
              () => this.swipeTo(2),
              'Udostępnij',
            )}
          </Fragment>
        );
        break;
      default:
        //  sharing
        buttons = (
          <Fragment>
            <TwitterShareButton onPress={this.shareOnTwitter.bind(this)} />
            {renderFAB(
              <Icon type="antdesign" name="arrowleft" color="white" />,
              '#db887b',
              this.swipeTo.bind(this, 1),
              'Wróć',
              65,
            )}
            <FBShareButton onPress={this.shareOnFacebook.bind(this)} />
          </Fragment>
        );
        break;
    }

    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          paddingBottom: 10,
          paddingHorizontal: 10,
          marginTop: 16,
          width: '100%',
        }}>
        {buttons}
      </View>
    );
  }

  render() {
    return (
      <ShakyDialog
        shakingDuration={15}
        shakingOffset={2}
        visible={this.props.visible}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View
            style={{
              flex: 1,
              backgroundColor: Resources.Colors.White,
              justifyContent: 'space-between',
              overflow: 'hidden',
            }}>
            {this.renderHeader()}
            <Swiper
              ref={ref => (this.swiper = ref)}
              showsButtons={false}
              showsPagination={false}
              scrollEnabled={false}
              loop={false}>
              {this.renderBasicDataPage()}
              {this.renderPhotosAddingPage()}
              {this.renderSharingPage()}
            </Swiper>
            {this.renderNavButtons()}
          </View>
        </TouchableWithoutFeedback>
      </ShakyDialog>
    );
  }
}
