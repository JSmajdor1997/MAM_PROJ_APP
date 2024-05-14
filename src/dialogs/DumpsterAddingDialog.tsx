import React, {Component, ReactElement, Fragment} from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
  ToastAndroid,
  StatusBar,
  Modal
} from 'react-native';
import FastImage from 'react-native-fast-image';
import QRCode from 'react-native-qrcode-svg';
import Ripple from 'react-native-material-ripple';
import Swiper from 'react-native-swiper';
import Spinner from 'react-native-spinkit';
import {LatLng} from 'react-native-maps';
import ImagesList from '../components/ImagesList';
import { Icon } from '@rneui/base';
import ShakyDialog from './ShakyDialog';
import { map_pin_icon, trash_bin_icon } from '../../res/icons/icons';
import { Resources } from '../../res/Resources';

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
  wasteland: {
    description: string | null;
    position: LatLng | null;
    placeName: string | null;
    images: Array<{image: string; ID: number}>;
  };

  shouldRender: boolean;
  isPublishing: boolean;
}

export default class DumpsterAddingDialog extends Component<Props, State> {
  private dialog: ShakyDialog | null = null;
  //  used for swiping screens
  private swiper: Swiper | null = null;

  constructor(props: Props) {
    super(props);

    this.state = {
      currentIndex: 0,
      sizeOfQR: -1,

      wasteland: {
        description: null,
        position: null,
        placeName: null,
        images: new Array(),
      },

      shouldRender: true,
      isPublishing: false,
    };
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.visible == false && this.props.visible == true) {
      const wasteland = {
        description: null,
        position: null,
        placeName: null,
        images: new Array(),
      };

      this.swipeTo(0);

      this.setState({
        wasteland,
        isPublishing: false,
        shouldRender: true,
      });
    }
  }

  private shareOnTwitter() {
    // shareOnTwitter(
    //   {
    //     text: 'Pomóż mi sprzątać planetę',
    //   },
    //   (results: any) => {
    //     console.log(results);
    //   },
    // );
  }

  private shareOnFacebook() {
    // shareOnFacebook(
    //   {
    //     text: 'Pomóż mi sprzątać planetę',
    //   },
    //   (results: any) => {
    //     console.log(results);
    //   },
    // );
  }

  private async publish() {
    this.setState({isPublishing: true});

    const {position, description, placeName, images} = this.state.wasteland;

    if (description && placeName && position) {
      // WisbWasteland.publish(
      //   position!,
      //   description,
      //   placeName,
      //   images.map(it => it.image),
      // ).then(() => {
      //   WisbWasteland.fetch().then(() =>
      //     this.setState({isPublishing: false}, this.props.onDismiss),
      //   );
      // });
    } else this.dialog && this.dialog.shake();
  }

  private async setPlaceName() {
    const {wasteland} = this.state;

    if (wasteland.position) {


      const ff = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?key=${API_KEY}&latlng=${wasteland.position.latitude},${wasteland.position.longitude}&language=pl`,
      );

      const parsedResponse = await ff.json();

      wasteland.placeName = parsedResponse.results[0].formatted_address;
      this.setState({wasteland});
    }
  }

  private shake() {
    this.dialog && this.dialog.shake();
  }

  private swipeTo(index: number) {
    this.swiper && this.swiper.scrollTo(index);

    this.setState({currentIndex: index});
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
      <View style={{justifyContent: 'center', alignItems: 'center'}}>
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
            <Text style={{textAlign: 'center'}}>{label}</Text>
          </View>
        ) : null}
      </View>
    );
  }

  private renderHeader(): ReactElement {
    const {currentIndex, wasteland} = this.state;

    let label: string;
    if (currentIndex == 0) {
      label = 'Dodawanie śmietniska';
    } else if (currentIndex == 1) {
      label = 'Dodaj zdjęcia';
    } else {
      label = 'Udostępnij';
    }

    return (
      <View
        style={{
          width: '100%',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#60b580',
          minHeight: '24%',
          paddingVertical: 8,
        }}>
        <FastImage
          source={trash_bin_icon}
          style={{aspectRatio: 1, width: 40}}
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
              this.setState({shouldRender: false}, () => {
                // MapScreen.getUserSelectedPosition(
                //   position => {
                //     wasteland.position = position;

                //     this.setState(
                //       {
                //         shouldRender: true,
                //         wasteland,
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
            style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text
              style={{
                fontFamily: 'roboto',
                color: 'white',
                fontSize: 10,
                marginRight: 6,
                opacity: 0.8,
              }}>
              {wasteland.placeName || 'Wybierz miejsce'}
            </Text>
            <FastImage
              source={map_pin_icon}
              style={{aspectRatio: 1, width: 22}}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  private renderBasicDataPage(): ReactElement {
    const {wasteland} = this.state;

    return (
      <View
        style={{
          flex: 1,
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
          value={wasteland.description || ''}
          placeholder="Opis wysypiska"
          style={{
            marginHorizontal: 2,
            color: 'black',
            flex: 1,
            textAlign: 'left',
            textAlignVertical: 'top',
          }}
          onChangeText={text => {
            wasteland.description = text;

            this.setState({wasteland});
          }}
        />
      </View>
    );
  }

  private renderPhotosAddingPage(): ReactElement {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'space-between',
        }}>
        <ImagesList
          images={this.state.wasteland.images}
          onImagesChanged={images => {
            const wasteland = this.state.wasteland;

            wasteland.images = images;

            this.setState({wasteland});
          }}
          readonly={false}
          containerStyle={{flex: 1}}
        />
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
        <ScrollView
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          style={{marginHorizontal: 10, marginTop: 10, flex: 1}}
          contentContainerStyle={{
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingBottom: 10,
          }}>
          <View style={{alignItems: 'center', padding: 10}}>
            <QRCode size={this.state.sizeOfQR / 2} value="A9BNJKL8" />
            <Text style={{fontSize: 40, fontWeight: 'bold', marginTop: 10}}>
              A45GBHJ7
            </Text>
          </View>
        </ScrollView>
      </View>
    );
  }

  private renderNavButtons(): ReactElement {
    const {onDismiss} = this.props;
    const {currentIndex, wasteland} = this.state;

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
                if (
                  wasteland.description != null &&
                  wasteland.position != null
                ) {
                  Keyboard.dismiss();
                  this.swipeTo(1);
                } else {
                  this.shake();
                  this.showToast('Uzupełnij opis oraz miejsce');
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
                // if (wasteland.imagesURIs.length > 0) {
                //   this.publish();
                // } else {
                //   this.shake();
                //   this.showToast('Dodaj zdjęcia');
                // }
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

  render() {
    const {shouldRender} = this.state;

    return shouldRender ? (
      <ShakyDialog
        shakingDuration={15}
        shakingOffset={2}
        onDismiss={this.props.onDismiss}
        ref={ref => (this.dialog = ref)}
        visible={this.props.visible}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} style={{}}>
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
        </TouchableWithoutFeedback>
      </ShakyDialog>
    ) : null;
  }
}
