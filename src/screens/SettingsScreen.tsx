import React, { Component } from 'react';
import { StyleSheet, Text, View, StatusBar } from 'react-native';
import { Switch } from 'react-native-switch';
import { Resources } from '../../res/Resources';
import WisbScreens from './WisbScreens';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import NavigationParamsList from './NavigationParamsList';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faMap } from '@fortawesome/free-regular-svg-icons';
import { faBell, faColonSign, faLanguage, faSmile, faTrash } from '@fortawesome/free-solid-svg-icons';
import DropDownPicker from 'react-native-dropdown-picker';

interface Props extends NativeStackScreenProps<NavigationParamsList, WisbScreens.SettingsScreen> { }

export default function SettingsScreen({ }: Props) {
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
            backgroundInactive={Resources.Colors.DarkBeige}
            circleActiveColor={Resources.Colors.White}
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
            backgroundInactive={Resources.Colors.Beige}
            circleActiveColor={Resources.Colors.White}
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

            }}
            circleSize={20}
            barHeight={24}
            circleBorderWidth={0}
            backgroundActive={Resources.Colors.Primary}
            backgroundInactive={Resources.Colors.DarkBeige}
            circleActiveColor={Resources.Colors.White}
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

          <DropDownPicker
            open={false}
            value={null}
            items={[]}
            setOpen={() => { }}
            setValue={() => { }}
            setItems={() => { }}
            placeholder='Język'
          />
        </View>

        {/* COLOR MODE */}
        <View style={styles.topSettingsItem}>
          <View style={styles.icon}>
            <FontAwesomeIcon icon={faColonSign} color={Resources.Colors.Primary} />
          </View>
          <DropDownPicker
            open={false}
            value={null}
            items={[]}
            setOpen={() => { }}
            setValue={() => { }}
            setItems={() => { }}
            placeholder='Motyw'
          />
        </View>

        {/* PUSH NOTIFICATIONS MODE */}
        <View style={styles.topSettingsItem}>
          <View style={styles.icon}>
            <FontAwesomeIcon icon={faBell} color={Resources.Colors.Primary} />
          </View>
          <DropDownPicker
            open={false}
            value={null}
            items={[]}
            setOpen={() => { }}
            setValue={() => { }}
            setItems={() => { }}
            placeholder='Powiadomienia'
          />
        </View>
      </View>
    </View>
  );
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
