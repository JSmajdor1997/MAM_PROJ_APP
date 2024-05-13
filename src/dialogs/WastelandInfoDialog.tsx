import React, { Component, ReactElement, Fragment } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import Swiper from 'react-native-swiper';
import Toast from 'react-native-simple-toast';
import ShakyDialog from './ShakyDialog';
import { mono_clear_icon, wasteland_icon } from '../../res/icons/icons';
import { Icon } from '@rneui/base';
import ImagesList from '../components/ImagesList';
import { FBShareButton, TwitterShareButton, renderFAB } from '../components/buttons';
import { Resources } from '../../res/Resources';

interface Props {
  visible: boolean;
  onDismiss: () => void;
  wasteland: any | null;
  onShowOnMap: (event: any) => void;
}

interface State {
  currentIndex: number;
  images: Array<{ image: string; ID: number }>;
  cleanImages: Array<{ image: string; ID: number }>;
}

export default class WastelandInfoDialog extends Component<Props, State> {
  private swiper: Swiper | null = null;
  private dialog: ShakyDialog | null = null;

  constructor(props: Props) {
    super(props);

    this.state = {
      currentIndex: 0,
      images: [],
      cleanImages: [],
    };
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.visible != this.props.visible) {
      if (this.props.visible) {
        if (this.props.wasteland) {
          this.props.wasteland.getImagesBase64().then(images => {
            const mapped = images.map((it, index) => {
              return { image: it, ID: index };
            });

            this.setState({ images: mapped });
          });
        }
      }
    }
  }

  private shareOnTwitter() {
    const wasteland = this.props.wasteland;

    if (wasteland)
      wasteland.getImagesBase64().then(images => {
        // shareOnTwitter(
        //   {
        //     text: 'Zapraszam do wspólnego sprzątania ' + wasteland.placeName,
        //     image: images[0],
        //   },
        //   (results: any) => {
        //     console.log(results);
        //   },
        // );
      });
  }

  private shareOnFacebook() {
    const wasteland = this.props.wasteland;

    if (wasteland)
      wasteland.getImagesBase64().then(images => {
        // shareOnFacebook(
        //   {
        //     text: 'Zapraszam do wspólnego sprzątania ' + wasteland.placeName,
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

    this.setState({ currentIndex: index });
  }

  private renderHeader(): ReactElement {
    const { currentIndex } = this.state;
    const { wasteland } = this.props;

    let label: string;
    if (currentIndex == 0) {
      label = wasteland != null ? wasteland.placeName : '';
    } else {
      label = 'Sprzątanie';
    }

    return (
      <View
        style={{
          width: '100%',
          backgroundColor: '#60b580',
          minHeight: '24%',
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
            style={{ position: 'absolute', right: 4, top: 4 }}
            onPress={this.props.onDismiss}>
            <Icon type="material" name="close" size={20} color="white" />
          </TouchableOpacity>
          <FastImage
            source={wasteland_icon}
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
        </View>
      </View>
    );
  }

  private renderInfoPage(): ReactElement {
    const { wasteland } = this.props;

    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'space-between',
        }}>
        <View
          style={{
            backgroundColor: '#dedede',
            borderRadius: 10,
            borderTopLeftRadius: 0,
            borderBottomEndRadius: 0,
            margin: 8,
            marginTop: 12,

            shadowColor: '#dedede',
            shadowOffset: {
              width: 0,
              height: 7,
            },
            shadowOpacity: 0.43,
            shadowRadius: 9.51,

            elevation: 4,
          }}>
          <Text
            style={{
              marginHorizontal: 12,
              marginVertical: 8,
              color: 'black',
            }}>
            {wasteland ? wasteland.description : ''}
          </Text>
        </View>
        <ImagesList
          images={this.state.images}
          onImagesChanged={images => this.setState({ images })}
          readonly={true}
          containerStyle={{ flex: 1 }}
        />
      </View>
    );
  }

  private renderCleaningPage(): ReactElement {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'space-between',
        }}>
        <ImagesList
          images={this.state.cleanImages}
          onImagesChanged={cleanImages => this.setState({ cleanImages })}
          readonly={false}
          containerStyle={{ flex: 1 }}
        />
      </View>
    );
  }

  private renderNavButtons(): ReactElement {
    const { currentIndex } = this.state;

    let buttons: ReactElement;

    switch (currentIndex) {
      case 0: //  basic data
        buttons = (
          <Fragment>
            <TwitterShareButton onPress={this.shareOnTwitter.bind(this)} />

            {renderFAB(
              <Icon type="entypo" name="map" color="white" />,
              '#db887b',
              () => this.props.wasteland && this.props.onShowOnMap(this.props.wasteland),
              'Mapa',
            )}
            {renderFAB(
              <FastImage
                source={mono_clear_icon}
                style={{ aspectRatio: 1, width: 30 }}
              />,
              '#d1cb71',
              () => {
                this.swipeTo(1);

                setTimeout(() => {
                  Toast.showWithGravity(
                    'Wybierz zdjęcia',
                    Toast.SHORT,
                    Toast.CENTER,
                  );
                }, 399);
              },
              'Posprzątaj',
            )}

            <FBShareButton onPress={this.shareOnFacebook.bind(this)} />
          </Fragment>
        );
        break;
      default:
        //  photos
        buttons = (
          <Fragment>
            {renderFAB(
              <Icon type="antdesign" name="arrowleft" color="white" />,
              '#db887b',
              this.swipeTo.bind(this, 0),
              'Wróć',
            )}
            {renderFAB(
              <Icon type="feather" name="check" color="white" />,
              '#60b580',
              () => {
                if (
                  this.props.wasteland &&
                  this.state.cleanImages.length != 0
                ) {
                  this.props.onDismiss();
                  Toast.showWithGravity(
                    'Wysłano do analizu',
                    Toast.SHORT,
                    Toast.CENTER,
                  );
                } else {
                  this.dialog && this.dialog.shake();
                  Toast.showWithGravity(
                    'Dodaj zdjęcia',
                    Toast.SHORT,
                    Toast.CENTER,
                  );
                }
              },
              'Zakończ',
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
    return (
      <ShakyDialog
        ref={ref => (this.dialog = ref)}
        shakingDuration={15}
        shakingOffset={2}
        visible={this.props.visible}>
        <View
          style={{
            flex: 1,
            backgroundColor: Resources.Colors.White,
            borderRadius: 10,
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
            {this.renderInfoPage()}
            {this.renderCleaningPage()}
          </Swiper>
          {this.renderNavButtons()}
        </View>
      </ShakyDialog>
    );
  }
}
