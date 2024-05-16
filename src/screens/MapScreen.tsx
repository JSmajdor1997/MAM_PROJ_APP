import React, { Component, ReactElement, Fragment } from 'react';
import {
  View,
  Text,
  StatusBar,
  ViewStyle,
  ToastAndroid,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Region } from 'react-native-maps';
import { LatLng } from 'react-native-maps';
import SearchBar from '../components/SearchBar';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import MoreButton from '../components/MoreButton';
const map_style = require('../../res/map_style.json');
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import NavigationParamsList from './NavigationParamsList';
import WisbScreens from './WisbScreens';
import Geolocation from '@react-native-community/geolocation';
import EventsPlacesFilteringDialog from '../dialogs/EventsPlacesFilteringDialog';
import getAPI from '../API/getAPI';
import Wasteland from '../API/data_types/Wasteland';
import Dumpster from '../API/data_types/Dumpster';
import Event from '../API/data_types/Event';
import WisbIcon, { IconType } from '../components/WisbIcon';
import { faCheck, faClose } from '@fortawesome/free-solid-svg-icons';

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

  isEventsWastelandsFilteringDialogVisible: boolean

  wastelands: Wasteland[]
  dumpsters: Dumpster[]
  events: Event[]
}

export default class MapScreen extends Component<Props, State> {
  static openWastelandAddingDialog: () => void;
  static openEventAddingDialog: () => void;

  static getUserSelectedPosition: (
    onChosen: (position: LatLng) => void,
    onDismissed: () => void,
  ) => void;

  private map: MapView | null = null;

  constructor(props: Props) {
    super(props);

    this.state = {
      events: [],
      dumpsters: [],
      wastelands: [],

      place: null,
      userPos: null,

      isWastelandAddingDialogVisible: false,
      isEventAddingDialogVisible: false,

      operationMode: 'Normal',
      userSelectedPosition: { latitude: 0, longitude: 0 },

      currentlyShownRegion: {
        latitude: 52,
        longitude: 19.1,
        latitudeDelta: 12,
        longitudeDelta: 12,
      },

      eventToShow: null,
      wastelandToShow: null,
      isEventsWastelandsFilteringDialogVisible: false
    };

    MapScreen.getUserSelectedPosition = () => {
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
    };
  }

  private getPosition() {
    try {
      Geolocation.getCurrentPosition(info => {
        const region: Region = {
          ...info.coords,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        };

        this.map && this.map.animateToRegion(region);

        this.setState({ userPos: info.coords });
      });
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

    Promise.all([
      getAPI().getEvents({}),
      getAPI().getWastelands({}),
      getAPI().getDumpsters({})
    ]).then(result => {
      const events = result[0].error == null ? result[0].data!.events! : []
      const wastelands = result[1].error == null ? result[1].data!.wastelands! : []
      const dumpsters = result[2].error == null ? result[2].data!.dumpsters! : []

      this.setState({
        dumpsters,
        events,
        wastelands
      })
    })
  }

  private renderUser(): ReactElement | null {
    return (
      this.state.userPos && (
        <Marker
          title="Tu jesteś"
          onPress={() => { }}
          coordinate={this.state.userPos}>
          <WisbIcon size={25} icon={IconType.MapPin} />
        </Marker>
      )
    );
  }

  private renderWasteland(wasteland: Wasteland): ReactElement {
    return (
      <Marker
        onPress={() =>
          this.setState({
            wastelandToShow: wasteland,
          })
        }
        coordinate={wasteland.placeCoords}>
        <WisbIcon size={30} icon={IconType.WastelandIcon} />
      </Marker>
    );
  }

  private renderDumpster(dumpster: Dumpster): ReactElement {
    return (
      <Marker
        onPress={() =>
          this.setState({
            wastelandToShow: dumpster,
          })
        }
        coordinate={dumpster.placeCoords}>
        <WisbIcon size={30} icon={IconType.Dumpster} />
      </Marker>
    );
  }

  private renderEvent(event: Event): ReactElement | null {
    return (
      <Marker
        onPress={() => this.setState({ eventToShow: event })}
        coordinate={event.meetPlace.coords}>
        <WisbIcon size={30} icon={IconType.Calendar} />
      </Marker>
    )
  }

  private renderDraggableMarker(): ReactElement {
    return (
      <Marker
        coordinate={this.state.userSelectedPosition}
        onDragEnd={e =>
          this.setState({ userSelectedPosition: e.nativeEvent.coordinate })
        }
        draggable>
        <WisbIcon size={28} icon={IconType.MapPin} />
      </Marker>
    );
  }

  private renderAllMarkers(): ReactElement {
    const { operationMode, eventToShow, wastelandToShow } = this.state;

    if (operationMode == 'Normal') {
      return (
        <Fragment>
          {this.state.events.map(event => this.renderEvent(event))}
          {this.state.wastelands.map(wasteland => this.renderWasteland(wasteland))}
          {this.state.dumpsters.map(dumpster => this.renderDumpster(dumpster))}

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
            <Text style={{ textAlign: 'center' }}>{label}</Text>
          </View>
        ) : null}

        {this.state.operationMode == 'GetSelectedPosition' &&
          this.renderFAB(
            <FontAwesomeIcon icon={faClose} color="white" />,
            '#db887b',
            this.onUserDismissedSelectingPosition,
            'Anuluj',
            { bottom: 10, left: 10 },
          )}
        {this.state.operationMode == 'GetSelectedPosition' &&
          this.renderFAB(
            <FontAwesomeIcon icon={faCheck} color="white" />,
            '#60b580',
            this.onUserSelectedPosition,
            'Wybierz',
            { bottom: 10, right: 10 },
          )}
      </View>
    );
  }

  render() {
    const { wastelandToShow, isEventsWastelandsFilteringDialogVisible } = this.state;

    return (
      <View
        style={{
          flex: 1,
        }}>

        <MapView
          onRegionChange={region =>
            this.setState({ currentlyShownRegion: region })
          }
          showsScale={false}
          showsIndoors={false}
          showsTraffic={false}
          showsMyLocationButton={false}
          toolbarEnabled={false}
          showsCompass={false}
          provider="google"
          showsPointsOfInterest={false}
          ref={(ref: any) => (this.map = ref)}
          style={{ height: '100%', width: '100%' }}
          customMapStyle={map_style}>
          {this.renderAllMarkers()}
        </MapView>

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
            onPress={() => this.setState({ isEventsWastelandsFilteringDialogVisible: true })}
            onClear={() => {
              this.setState({ eventToShow: null, wastelandToShow: null });
              this.getPosition();
            }}
          />
        </View>

        <EventsPlacesFilteringDialog
          visible={isEventsWastelandsFilteringDialogVisible}
          onDismiss={() => this.setState({ isEventsWastelandsFilteringDialogVisible: false })} />
      </View>
    );
  }
}
