import React, {Component, ReactElement, Fragment} from 'react';
import {
  View,
  Text,
  StatusBar,
  ViewStyle,
  ToastAndroid,
} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import FastImage from 'react-native-fast-image';
import Ripple from 'react-native-material-ripple';
import {Menu, MenuItem} from 'react-native-material-menu';
import {Region} from 'react-native-maps';
import {LatLng} from 'react-native-maps';
import { event_icon, map_pin_icon, wasteland_icon } from '../../res/icons/icons';
import { Icon } from '@rneui/base';
import SearchBar from '../components/SearchBar';
import MoreButton from '../components/MoreButton';
import WastelandInfoDialog from '../dialogs/WastelandInfoDialog';
import EventAddingDialog from '../dialogs/EventAddingDialog';
import EventInfoDialog from '../dialogs/EventInfoDialog';
import WastelandAddingDialog from '../dialogs/WastelandAddingDialog';
import map_style from '../../res/map_style';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import NavigationParamsList from './NavigationParamsList';
import WisbScreens from './WisbScreens';

interface Props extends NativeStackScreenProps<NavigationParamsList, WisbScreens.MapScreen> {

}

interface State {
  place: string | null;
  userPos: LatLng | null;

  isWastelandAddingDialogVisible: boolean;
  isEventAddingDialogVisible: boolean;

  wastelandToShow: any | null;
  eventToShow: any | null;

  operationMode: 'GetSelectedPosition' | 'Normal';
  userSelectedPosition: LatLng;

  currentlyShownRegion: Region;
}

export default class MapScreen extends Component<Props, State> {
  static openWastelandAddingDialog: () => void;
  static openEventAddingDialog: () => void;

  static getUserSelectedPosition: (
    onChosen: (position: LatLng) => void,
    onDismissed: () => void,
  ) => void;

  private menu: any = null;
  private map: MapView | null = null;

  private onUserSelectedPosition = () => {};
  private onUserDismissedSelectingPosition = () => {};

  constructor(props: Props) {
    super(props);

    this.state = {
      place: null,
      userPos: null,

      isWastelandAddingDialogVisible: false,
      isEventAddingDialogVisible: false,

      operationMode: 'Normal',
      userSelectedPosition: {latitude: 0, longitude: 0},

      currentlyShownRegion: {
        latitude: 52,
        longitude: 19.1,
        latitudeDelta: 12,
        longitudeDelta: 12,
      },

      eventToShow: null,
      wastelandToShow: null,
    };

    MapScreen.openEventAddingDialog = () => {
      this.setState({isEventAddingDialogVisible: true});
    };

    MapScreen.openWastelandAddingDialog = () => {
      this.setState({isWastelandAddingDialogVisible: true});
    };

    MapScreen.getUserSelectedPosition = (
      onChosen: (position: LatLng) => void,
      onDismissed: () => void,
    ) => {
      (ToastAndroid as any).showWithGravityAndOffset(
        'Przesuń marker na pozycję śmieciowiska',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
        0,
        50,
      );

      this.setState({
        operationMode: 'GetSelectedPosition',
        userSelectedPosition: this.state.currentlyShownRegion,
      });

      this.map &&
        this.map.animateToRegion({
          ...this.state.currentlyShownRegion,
        });

      this.onUserDismissedSelectingPosition = () => {
        this.setState({operationMode: 'Normal'});
        onDismissed();
      };

      this.onUserSelectedPosition = () => {
        this.setState({operationMode: 'Normal'});
        onChosen(this.state.userSelectedPosition);
      };
    };
  }

  private getPosition() {
    try {
      // Geolocation.getCurrentPosition(info => {
      //   const region: Region = {
      //     ...info.coords,
      //     latitudeDelta: 0.05,
      //     longitudeDelta: 0.05,
      //   };

      //   this.map && this.map.animateToRegion(region);

      //   this.setState({userPos: info.coords});
      // });
    } catch {
      const region = {
        latitude: 52,
        longitude: 19.1,
        latitudeDelta: 12,
        longitudeDelta: 10,
      };

      this.map && this.map.animateToRegion(region);
    }
  }

  componentDidMount() {
    this.getPosition();
  }

  private showMenu(show: boolean) {
    if (this.menu) {
      if (show) {
        this.menu.show();
      } else {
        this.menu.hide();
      }
    }
  }

  private renderUser(): ReactElement | null {
    return (
      this.state.userPos && (
        <Marker
          title="Tu jesteś"
          onPress={() => {}}
          coordinate={this.state.userPos}>
          <FastImage
            source={map_pin_icon}
            resizeMode="contain"
            style={{height: 25, width: 25}}
          />
        </Marker>
      )
    );
  }

  private renderWasteland(wasteland: any): ReactElement {
    return (
      <Marker
        onPress={() =>
          this.setState({
            wastelandToShow: wasteland,
          })
        }
        coordinate={wasteland.position}>
        <FastImage
          source={wasteland_icon}
          resizeMode="contain"
          style={{height: 30, width: 30}}
        />
      </Marker>
    );
  }

  private renderEvent(event: any): ReactElement | null {
    return event.position && event.position.latitude && event.position.longitude ? (
      <Marker
        onPress={() => this.setState({eventToShow: event})}
        coordinate={event.position}>
        <FastImage
          source={event_icon}
          resizeMode="contain"
          style={{height: 30, width: 30}}
        />
      </Marker>
    ) : null;
  }

  private renderDraggableMarker(): ReactElement {
    return (
      <Marker
        coordinate={this.state.userSelectedPosition}
        onDragEnd={e =>
          this.setState({userSelectedPosition: e.nativeEvent.coordinate})
        }
        draggable>
        <FastImage source={map_pin_icon} style={{aspectRatio: 1, width: 28}} />
      </Marker>
    );
  }

  private renderAllMarkers(): ReactElement {
    const {operationMode, eventToShow, wastelandToShow} = this.state;

    if (operationMode == 'Normal') {
      return (
        <Fragment>
          {/* {any.all.map(event => this.renderEvent(event))} */}

          {this.renderUser()}
        </Fragment>
      );
    } else {
      return this.renderDraggableMarker();
    }
  }

  private renderFAB(
    icon: ReactElement,
    color: string,
    onPress: () => void,
    label: string,
    style: ViewStyle,
  ): ReactElement {
    return (
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          position: 'absolute',
          ...style,
        }}>
        <Ripple
          rippleCentered={true}
          rippleSize={45}
          onPress={onPress}
          style={{
            aspectRatio: 1,
            width: 54,
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

  private renderBar(): ReactElement {
    return (
      <View
        style={{
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 10,
          },
          shadowOpacity: 0.51,
          shadowRadius: 13.16,

          elevation: 20,
          backgroundColor: 'white',
          borderRadius: 10,
          marginHorizontal: 10,
          flexDirection: 'row',
          alignItems: 'center',
          position: 'absolute',
          marginTop: (StatusBar.currentHeight ?? 20) + 5,
        }}>
        <SearchBar
          onEventSelected={item => this.setState({eventToShow: item})}
          onWastelandSelected={item => this.setState({wastelandToShow: item})}
          onClear={() => {
            this.setState({eventToShow: null, wastelandToShow: null});
            this.getPosition();
          }}
        />
        <MoreButton
          style={{paddingRight: 8}}
          onPress={this.showMenu.bind(this, true)}
          color="black"
        />
        <Menu style={{marginTop: 75}} ref={(ref: any) => (this.menu = ref)}>
          <MenuItem
            onPress={() => {
              this.showMenu(false);
            }}>
            Ustawienia
          </MenuItem>
        </Menu>
      </View>
    );
  }

  render() {
    const {wastelandToShow} = this.state;

    return (
      <View
        style={{
          flex: 1,
        }}>

        <MapView
          onRegionChange={region =>
            this.setState({currentlyShownRegion: region})
          }
          showsMyLocationButton={false}
          toolbarEnabled={false}
          showsCompass={false}
          provider="google"
          showsPointsOfInterest={false}
          ref={(ref: any) => (this.map = ref)}
          style={{height: '100%', width: '100%'}}
          customMapStyle={map_style}>
          {this.renderAllMarkers()}
        </MapView>

        {this.renderBar()}

        {/* <WastelandInfoDialog
          wasteland={wastelandToShow}
          visible={wastelandToShow != null}
          onDismiss={() => {
            this.setState({
              wastelandToShow: null,
            });
          }}
          onShowOnMap={() => {
            this.map &&
              this.state.wastelandToShow &&
              // this.map.animateToCoordinate(this.state.wastelandToShow.position);

            this.setState({wastelandToShow: null});
          }}
        /> */}

        {/* <WastelandAddingDialog
          visible={this.state.isWastelandAddingDialogVisible}
          onDismiss={() =>
            this.setState({isWastelandAddingDialogVisible: false})
          }
        /> */}

        {/* <EventAddingDialog
          visible={this.state.isEventAddingDialogVisible}
          onDismiss={() => this.setState({isEventAddingDialogVisible: false})}
        /> */}

        {/* <EventInfoDialog
          event={this.state.eventToShow}
          visible={this.state.eventToShow != null}
          onDismiss={() => this.setState({eventToShow: null})}
          onShowOnMap={() => {
            this.map &&
              this.state.eventToShow &&
              // this.map.animateToCoordinate(this.state.eventToShow.position);

            this.setState({eventToShow: null});
          }}
        /> */}

        {this.state.operationMode == 'GetSelectedPosition' &&
          this.renderFAB(
            <Icon type="material" name="close" color="white" />,
            '#db887b',
            this.onUserDismissedSelectingPosition,
            'Anuluj',
            {bottom: 10, left: 10},
          )}
        {this.state.operationMode == 'GetSelectedPosition' &&
          this.renderFAB(
            <Icon type="material" name="check" color="white" />,
            '#60b580',
            this.onUserSelectedPosition,
            'Wybierz',
            {bottom: 10, right: 10},
          )}
      </View>
    );
  }
}
