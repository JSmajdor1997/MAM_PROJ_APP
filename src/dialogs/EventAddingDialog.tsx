import React, { Component, ReactElement, Fragment } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
  ToastAndroid,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import QRCode from 'react-native-qrcode-svg';
import Ripple from 'react-native-material-ripple';
import Swiper from 'react-native-swiper';
// import DateTimePicker from '@react-native-community/datetimepicker';
import Spinner from 'react-native-spinkit';
import { LatLng } from 'react-native-maps';
import { Icon } from '@rneui/base';
import { event_add_icon, map_pin_icon } from '../../res/icons/icons';
import { Resources } from '../../res/Resources';
import ImagesList from '../components/ImagesList';
import ShakyDialog from './ShakyDialog';
import EventsPlacesFilteringDialog from './EventsPlacesFilteringDialog';

function formatDate(date: Date) {
  const monthNames = [
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

  const day = date.getDate();
  const monthIndex = date.getMonth();
  const year = date.getFullYear();

  return day + ' ' + monthNames[monthIndex] + ' ' + year;
}

interface Props {
  //  determines whether dialog should be visible
  visible: boolean;
  //  function called once user requests to close the dialog
  onDismiss: () => void;
}

interface State {
  //  determines current index of swiper
  currentIndex: number;
  //  used to calculate size for QR tag
  sizeOfQR: number;
  //  added wasteland
  event: {
    title: string | null;
    description: string | null;
    position: LatLng | null;
    placeName: string | null;
    images: Array<{ image: string; ID: number }>;
    mainImage: string | null;
    date: Date | null;
    wasteland: any | null;
  };

  shouldRender: boolean;
  isPublishing: boolean;
  isEventsFilteringDialogVisible: boolean;
  isDateDialogVisible: boolean;
  joinCode: string | null;
}

export default class EventAddingDialog extends Component<Props, State> {
  private dialog: ShakyDialog | null = null;
  private swiper: Swiper | null = null;

  constructor(props: Props) {
    super(props);

    this.state = {
      currentIndex: 0,
      sizeOfQR: -1,

      event: {
        title: null,
        description: null,
        position: null,
        placeName: null,
        images: new Array(),
        mainImage: null,
        date: null,
        wasteland: null,
      },

      shouldRender: true,
      isPublishing: false,
      isEventsFilteringDialogVisible: false,
      isDateDialogVisible: false,

      joinCode: null,
    };
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.visible == false && this.props.visible == true) {
      const event = {
        title: null,
        description: null,
        position: null,
        placeName: null,
        images: new Array(),
        mainImage: null,
        date: null,
        wasteland: null,
      };

      this.swipeTo(0);

      this.setState({
        event,
        joinCode: null,
        isEventsFilteringDialogVisible: false,
        isPublishing: false,
        shouldRender: true,
      });
    }
  }

  private shareOnTwitter() {
    // shareOnTwitter(
    //   {
    //     text:
    //       'Dołącz do mojego nowego wydarzenia!  ' + this.state.joinCode
    //         ? this.state.joinCode
    //         : '',
    //   },
    //   (results: any) => {
    //     console.log(results);
    //   },
    // );
  }

  private shareOnFacebook() {
    // shareOnFacebook(
    //   {
    //     text:
    //       'Dołącz do mojego nowego wydarzenia!  ' + this.state.joinCode
    //         ? this.state.joinCode
    //         : '',
    //   },
    //   (results: any) => {
    //     console.log(results);
    //   },
    // );
  }

  private async publish() {
    this.setState({ isPublishing: true });

    const {
      position,
      description,
      placeName,
      images,
      date,
      wasteland,
      title,
    } = this.state.event;

    if (description && title && date) {
      // WisbEvent.publish(
      //   description,
      //   placeName,
      //   title,
      //   date,
      //   images.map(it => it.image),
      //   position,
      //   wasteland ? wasteland.ID : null,
      // ).then(EventPostResponse => {
      //   WisbEvent.fetch()
      //     .then(response => {
      //       console.log(response);

      //       this.setState(
      //         {isPublishing: false, joinCode: EventPostResponse.joinCode},
      //         () => this.swipeTo(2),
      //       );
      //     })
      //     .catch(console.log);
      // });
    }
  }

  private async setPlaceName() {
    const { event } = this.state;

    if (event.position) {


      const ff = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?key=${API_KEY}&latlng=${event.position.latitude},${event.position.longitude}&language=pl`,
      );

      const parsedResponse = await ff.json();

      event.placeName = parsedResponse.results[0].formatted_address;
      this.setState({ event });
    }
  }

  private shake() {
    this.dialog && this.dialog.shake();
  }

  private swipeTo(index: number) {
    this.swiper && this.swiper.scrollTo(index);

    this.setState({ currentIndex: index });
  }

  private showToast(message: string) {
    (ToastAndroid as any).showWithGravityAndOffset(
      message,
      ToastAndroid.SHORT,
      ToastAndroid.CENTER,
      0,
      50,
    );
  }

  private renderFAB(
    icon: ReactElement,
    color: string,
    onPress: () => void,
    label?: string,
    size?: number,
  ): ReactElement {
    return (
      <View style={{ justifyContent: 'center', alignItems: 'center' }}>
        <Ripple
          rippleCentered={true}
          rippleSize={45}
          onPress={onPress}
          style={{
            aspectRatio: 1,
            width: size || 54,
            backgroundColor: color,
            borderRadius: 50,
            justifyContent: 'center',
            alignItems: 'center',

            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 5,
            },
            shadowOpacity: 1,
            shadowRadius: 16,

            elevation: 20,
          }}>
          {icon}
        </Ripple>
        {label && label != '' ? (
          <View
            style={{
              width: '100%',
              backgroundColor: 'white',
              paddingHorizontal: 5,
              paddingVertical: 3,
              borderRadius: 5,
              marginTop: 8,

              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 5,
              },
              shadowOpacity: 1,
              shadowRadius: 16,

              elevation: 20,
            }}>
            <Text style={{ textAlign: 'center' }}>{label}</Text>
          </View>
        ) : null}
      </View>
    );
  }

  private renderNavButtons(): ReactElement {
    const { onDismiss } = this.props;
    const { currentIndex, event } = this.state;

    let buttons: ReactElement;

    switch (currentIndex) {
      case 0: //  basic data
        buttons = (
          <Fragment>
            {this.renderFAB(
              <Icon type="material" name="close" color="white" />,
              '#db887b',
              onDismiss,
              'Anuluj',
            )}
            {this.renderFAB(
              <Icon type="antdesign" name="arrowright" color="white" />,
              '#60b580',
              () => {
                if (event.description != null && event.title != null) {
                  Keyboard.dismiss();
                  this.swipeTo(1);
                } else {
                  this.shake();
                  this.showToast('Uzupełnij tytuł, opis oraz datę');
                }
              },
              'Dalej',
            )}
          </Fragment>
        );
        break;
      case 1: //  photos
        buttons = (
          <Fragment>
            {this.renderFAB(
              <Icon type="antdesign" name="arrowleft" color="white" />,
              '#db887b',
              this.swipeTo.bind(this, 0),
              'Wróć',
            )}
            {this.renderFAB(
              this.state.isPublishing ? (
                <Spinner type="FadingCircleAlt" color="white" />
              ) : (
                <Icon type="ionicon" name="md-send" color="white" />
              ),
              '#60b580',
              () => {
                this.publish();
              },
              'Publikuj',
            )}
          </Fragment>
        );
        break;
      default:
        //  sharing
        buttons = (
          <Fragment>
            {this.renderFAB(
              <Icon type="entypo" name="twitter" color="#FFFFFF" size={16} />,
              '#1dcaff',
              this.shareOnTwitter.bind(this),
              '',
              40,
            )}
            {this.renderFAB(
              <Icon type="feather" name="check" color="white" />,
              '#60b580',
              this.props.onDismiss,
              'Zakończ',
            )}
            {this.renderFAB(
              <Icon
                type="font-awesome"
                name="facebook"
                color="#FFFFFF"
                size={16}
              />,
              '#4267B2',
              this.shareOnFacebook.bind(this),
              '',
              40,
            )}
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

  private renderHeader(): ReactElement {
    const { currentIndex, event } = this.state;

    let label: string;
    if (currentIndex == 0) {
      label = 'Dodawanie wydarzenia';
    } else if (currentIndex == 1) {
      label = 'Dodawanie zdjęć';
    } else {
      label = 'Udostępnianie';
    }

    return (
      <View
        style={{
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: Resources.Colors.Primary,
          paddingVertical: 8,
        }}>
        <FastImage
          source={event_add_icon}
          style={{ aspectRatio: 1, width: 40 }}
        />
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
        <View
          style={{
            marginRight: 6,
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'flex-end',
            marginTop: 4,
          }}>
          <TouchableOpacity
            onPress={() => {
              this.setState({ shouldRender: false }, () => {
                // MapScreen.getUserSelectedPosition(
                //   position => {
                //     event.position = position;

                //     this.setState(
                //       {
                //         shouldRender: true,
                //         event,
                //       },
                //       () => this.setPlaceName(),
                //     );
                //   },
                //   () => {
                //     this.setState({
                //       shouldRender: true,
                //     });
                //   },
                // );
              });
            }}
            style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text
              style={{
                fontFamily: 'roboto',
                color: 'white',
                fontSize: 10,
                marginRight: 6,
                opacity: 0.8,
              }}>
              {event.placeName || 'Wybierz miejsce spotkania (opcjonalnie)'}
            </Text>
            <FastImage
              source={map_pin_icon}
              style={{ aspectRatio: 1, width: 22 }}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  private renderBasicDataPage(): ReactElement {
    const { event } = this.state;

    return (
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flex: 1, paddingBottom: 4 }}>
        <View
          style={{
            height: 40,
            backgroundColor: '#dedede',
            borderRadius: 15,
            borderTopLeftRadius: 0,
            borderBottomEndRadius: 0,
            marginHorizontal: 12,
            marginTop: 8,
            marginBottom: 4,

            shadowColor: '#dedede',
            shadowOffset: {
              width: 0,
              height: 7,
            },
            shadowOpacity: 0.43,
            shadowRadius: 9.51,

            elevation: 4,
          }}>
          <TextInput
            value={event.title || ''}
            placeholder="Nazwa wydarzenia"
            style={{
              marginHorizontal: 2,
              color: 'black',
              flex: 1,
              textAlign: 'left',
              textAlignVertical: 'center',
            }}
            onChangeText={text => {
              event.title = text;

              this.setState({ event });
            }}
          />
        </View>

        <View
          style={{
            flex: 6,
            backgroundColor: '#dedede',
            borderRadius: 15,
            borderTopLeftRadius: 0,
            borderBottomEndRadius: 0,
            marginHorizontal: 12,
            marginTop: 8,
            marginBottom: 4,

            shadowColor: '#dedede',
            shadowOffset: {
              width: 0,
              height: 7,
            },
            shadowOpacity: 0.43,
            shadowRadius: 9.51,

            elevation: 4,
          }}>
          <TextInput
            multiline
            value={event.description || ''}
            placeholder="Opis wydarzenia"
            style={{
              marginHorizontal: 2,
              color: 'black',
              flex: 1,
              textAlign: 'left',
              textAlignVertical: 'top',
            }}
            onChangeText={text => {
              event.description = text;

              this.setState({ event });
            }}
          />
        </View>

        <TouchableOpacity
          onPressIn={() =>
            this.setState({
              isDateDialogVisible: true,
            })
          }
          onPressOut={() => this.setState({ isDateDialogVisible: false })}
          style={{
            height: 40,
            backgroundColor: '#dedede',
            borderRadius: 15,
            borderTopLeftRadius: 0,
            borderBottomEndRadius: 0,
            marginHorizontal: 12,
            marginTop: 8,
            marginBottom: 4,

            shadowColor: '#dedede',
            shadowOffset: {
              width: 0,
              height: 7,
            },
            shadowOpacity: 0.43,
            shadowRadius: 9.51,

            elevation: 4,
          }}>
          <TextInput
            editable={false}
            placeholder="Data wydarzenia"
            style={{
              marginHorizontal: 2,
              color: 'black',
              flex: 1,
              textAlign: 'left',
              textAlignVertical: 'top',
            }}>
            {this.state.event.date ? formatDate(this.state.event.date) : ''}
          </TextInput>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => this.setState({ isEventsFilteringDialogVisible: true })}
          style={{
            height: 40,
            backgroundColor: '#dedede',
            borderRadius: 15,
            borderTopLeftRadius: 0,
            borderBottomEndRadius: 0,
            marginHorizontal: 12,
            marginTop: 8,
            marginBottom: 4,

            shadowColor: '#dedede',
            shadowOffset: {
              width: 0,
              height: 7,
            },
            shadowOpacity: 0.43,
            shadowRadius: 9.51,

            elevation: 4,
          }}>
          <TextInput
            editable={false}
            placeholder="Wysypisko do posprzątania (opcjonalnie)"
            style={{
              marginHorizontal: 2,
              color: 'black',
              flex: 1,
              textAlign: 'left',
              textAlignVertical: 'top',
            }}>
            {this.state.event.wasteland
              ? this.state.event.wasteland.placeName
              : ''}
          </TextInput>
        </TouchableOpacity>
        <EventsPlacesFilteringDialog
          visible={this.state.isEventsFilteringDialogVisible}
          onDismiss={() =>
            this.setState({ isEventsFilteringDialogVisible: false })
          }
          type="WisbWastelands"
          onItemSelected={item => {
            event.wasteland = (item as any) as any;
            this.setState({ event, isEventsFilteringDialogVisible: false });
          }}
        />
        {/* {this.state.isDateDialogVisible ? (
          <DateTimePicker
            locale="pl"
            minimumDate={new Date()}
            value={event.date || new Date()}
            mode="date"
            is24Hour={true}
            display="default"
            onChange={(e, date) => {
              if (date) {
                event.date = date;
              }
              this.setState({event});
            }}
          />
        ) : null} */}
      </ScrollView>
    );
  }

  private renderPhotosAddingPage(): ReactElement {
    return (
      <View
        style={{
          flex: 1,
        }}>
        <ImagesList
          images={this.state.event.images}
          onImagesChanged={images => {
            const event = this.state.event;

            event.images = images;

            this.setState({ event });
          }}
          readonly={false}
        />
      </View>
    );
  }

  private renderSharingPage(): ReactElement {
    return (
      <View
        onLayout={e => {
          if (e.nativeEvent.layout.width != 0) {
            this.setState({ sizeOfQR: e.nativeEvent.layout.width });
          }
        }}
        style={{
          flex: 1,
          justifyContent: 'space-between',
        }}>
        <ScrollView
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          style={{ marginHorizontal: 10, marginTop: 10, flex: 1 }}
          contentContainerStyle={{
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingBottom: 10,
          }}>
          <View style={{ alignItems: 'center', padding: 10 }}>
            <QRCode
              size={this.state.sizeOfQR / 2}
              value={this.state.joinCode ? this.state.joinCode : '.'}
            />
            <Text style={{ fontSize: 40, fontWeight: 'bold', marginTop: 10 }}>
              {this.state.joinCode ? this.state.joinCode : ''}
            </Text>
          </View>
        </ScrollView>
      </View>
    );
  }

  render() {
    const { shouldRender } = this.state;

    return shouldRender ? (
      <ShakyDialog
        shakingDuration={15}
        onDismiss={this.props.onDismiss}
        shakingOffset={2}
        ref={ref => (this.dialog = ref)}
        visible={this.props.visible}>
        <View
          style={{
            flex: 1,
            backgroundColor: Resources.Colors.White,
            justifyContent: 'space-between',
            alignItems: 'center',
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
      </ShakyDialog>
    ) : null;
  }
}
