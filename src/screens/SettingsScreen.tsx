import React, { Component } from 'react';
import { StyleSheet, Text, View, StatusBar } from 'react-native';
import { Switch } from 'react-native-switch';
import { Resources } from '../../res/Resources';
import DropDownMenu from '../components/DropDownMenu';
import WisbScreens from './WisbScreens';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import NavigationParamsList from './NavigationParamsList';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faMap } from '@fortawesome/free-regular-svg-icons';
import { faBell, faColonSign, faLanguage, faSmile, faTrash } from '@fortawesome/free-solid-svg-icons';

interface Props extends NativeStackScreenProps<NavigationParamsList, WisbScreens.SettingsScreen> { }

interface State { }

export default class SettingsScreen extends Component<Props, State> {
  resourcesListenerID = -1;

  constructor(props: Props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    // this.resourcesListenerID = Resources.listeners.addOnChangeListener(() => {
    //   this.forceUpdate();
    // });
  }

  componentWillUnmount() {
    // Resources.listeners.removeOnChangeListener(this.resourcesListenerID);
  }

  render() {
    return (
      <View style={[styles.mainContainer, { backgroundColor: Resources.Colors.White }]}>
        <View style={styles.topContainer}>
          {/* MAP TYPE */}
          <View style={styles.topSettingsItem}>
            <View style={{ flexDirection: 'row' }}>
              <View style={styles.icon}>
                <FontAwesomeIcon icon={faMap} color={Resources.Colors.Primary} />
              </View>
              <Text style={[styles.itemLabel, { color: Resources.Colors.Black }]}>
                Mapa{' '}
                {/* {Resources.settings.mapType == 'standard'
                  ? 'zwykła'
                  : 'satelitarna'} */}
              </Text>
            </View>
            <Switch
              value={false}
              onValueChange={(val: boolean) => {
                //Resources.change({mapType: val ? 'satellite' : 'standard'});
              }}
              circleSize={20}
              barHeight={24}
              circleBorderWidth={0}
              backgroundActive={Resources.Colors.Primary}
              backgroundInactive={'#e6e6e6'}
              circleActiveColor={'white'}
              circleInActiveColor={Resources.Colors.Primary}
              switchLeftPx={2}
              switchRightPx={2}
              switchWidthMultiplier={2.2}
              switchBorderRadius={40}
            />
            <Text>Domyślna lokalizcja (z GPS / wpisz - wybierz)</Text>
          </View>

          {/* SHOWING BINS ON MAP */}
          <View style={styles.topSettingsItem}>
            <View style={{ flexDirection: 'row' }}>
              <View style={styles.icon}>
                <FontAwesomeIcon
                  icon={faTrash}
                  color={Resources.Colors.Primary}
                  size={20}
                />
              </View>
              <Text style={[styles.itemLabel, { color: Resources.Colors.Black }]}>
                {/* {Resources.settings.showBinsOnMap
                  ? 'Pokazuj kosze na mapie'
                  : 'Nie pokazuj koszy na mapie'} */}
              </Text>
            </View>
            <Switch
              value={false}
              onValueChange={(val: boolean) => {
                // Resources.change({showBinsOnMap: val});
              }}
              circleSize={20}
              barHeight={24}
              circleBorderWidth={0}
              backgroundActive={Resources.Colors.Primary}
              backgroundInactive={'#e6e6e6'}
              circleActiveColor={'white'}
              circleInActiveColor={Resources.Colors.Primary}
              switchLeftPx={2}
              switchRightPx={2}
              switchWidthMultiplier={2.2}
              switchBorderRadius={40}
            />
          </View>

          {/* ADDS */}
          <View style={styles.topSettingsItem}>
            <View style={{ flexDirection: 'row' }}>
              <View style={styles.icon}>
                <FontAwesomeIcon icon={faSmile} color={Resources.Colors.Primary} />
              </View>
              <Text style={[styles.itemLabel, { color: Resources.Colors.Black }]}>
                {/* {Resources.settings.showAds
                  ? 'Wyświetlaj reklamy'
                  : 'Nie chcę widzieć żadnych reklam'} */}
              </Text>
            </View>
            <Switch
              // value={Resources.settings.showAds}
              value={false}
              onValueChange={(val: boolean) => {
                // Resources.change({showAds: val});
                val &&
                  alert(
                    'Zysk z reklam przekazywany jest na fundacje charytatywne oraz utrzymanie aplikacji, możesz je za darmo wyłączyć.',
                  );
              }}
              circleSize={20}
              barHeight={24}
              circleBorderWidth={0}
              backgroundActive={Resources.Colors.Primary}
              backgroundInactive={'#e6e6e6'}
              circleActiveColor={'white'}
              circleInActiveColor={Resources.Colors.Primary}
              switchLeftPx={2}
              switchRightPx={2}
              switchWidthMultiplier={2.2}
              switchBorderRadius={40}
            />
          </View>

          {/* LANGUAGE */}
          <View style={styles.topSettingsItem}>
            <View style={styles.icon}>
              <FontAwesomeIcon icon={faLanguage} color={Resources.Colors.Primary} />
            </View>
            <DropDownMenu
              onItemSelected={index => {
                // Resources.change({language: index});
              }}
              currentItem={0}
              data={[]}
              label="Język"
              style={[styles.dropdownMenu, styles.itemLabel]}
              dismissOnItemPress
            />
          </View>

          {/* COLOR MODE */}
          <View style={styles.topSettingsItem}>
            <View style={styles.icon}>
              <FontAwesomeIcon icon={faColonSign} color={Resources.Colors.Primary} />
            </View>
            <DropDownMenu
              onItemSelected={index => {
                // Resources.change({colorMode: index == 0 ? 'normal' : 'dark'});
              }}
              currentItem={
                ['Zwykły', 'Ciemny'][0
                // Resources.settings.colorMode == 'normal' ? 0 : 1
                ]
              }
              // data={SupportedColorModes.map(it => {
              //   return {label: it};
              // })}
              data={[]}
              label="Tryb koloru"
              style={[styles.dropdownMenu, styles.itemLabel]}
              dismissOnItemPress
            />
          </View>

          {/* PUSH NOTIFICATIONS MODE */}
          <View style={styles.topSettingsItem}>
            <View style={styles.icon}>
              <FontAwesomeIcon icon={faBell} color={Resources.Colors.Primary} />
            </View>
            <DropDownMenu
              onItemSelected={(index, isActive) => {
                // const notifications = Resources.settings.notifications;

                // switch (index) {
                //   case 0:
                //     notifications.newEventsMessages = isActive;
                //     break;
                //   case 1:
                //     notifications.newEventsNear = isActive;
                //     break;
                //   case 2:
                //     notifications.newWastelandsNear = isActive;
                //     break;
                // }

                // Resources.change({notifications});
              }}
              currentItem={
                // Resources.settings.notifications.newEventsMessages ||
                // Resources.settings.notifications.newEventsNear ||
                // Resources.settings.notifications.newWastelandsNear
                false
                  ? 'Włączone'
                  : 'Brak'
              }
              data={[
                {
                  label: 'Wiadomości w eventach',
                  isActive: false
                },
                {
                  label: 'Wydarzenia w pobliżu',
                  isActive: false
                },
                {
                  label: 'Wysypiska w pobliżu',
                  isActive: false
                },
              ]}
              label="Powiadomienia"
              style={[styles.dropdownMenu, styles.itemLabel]}
              dismissOnItemPress
            />
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 4,
    paddingTop: (StatusBar.currentHeight ? StatusBar.currentHeight : 20) + 14,
  },
  topContainer: {
    flex: 1,
  },
  bottomContainer: {},

  topSettingsItem: {
    paddingHorizontal: 4,
    paddingBottom: 20,
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  icon: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 24,
  },
  dropdownMenu: {
    flex: 1,
  },
  itemLabel: {
    marginLeft: 8,
  },

  listSeparator: {
    height: 1,
    width: '100%',
  },
});
