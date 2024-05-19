import React, { Component } from 'react';
import { StyleSheet, Text, View, StatusBar } from 'react-native';
import { Switch } from 'react-native-switch';
import Resources from '../../res/Resources';
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
    <View style={[styles.mainContainer, { backgroundColor: Resources.get().getColors().White }]}>
      <View style={styles.topContainer}>
        {/* MAP TYPE */}
        <View style={styles.topSettingsItem}>
          <View style={{ flexDirection: 'row' }}>
            <View style={styles.icon}>
              <FontAwesomeIcon icon={faMap} color={Resources.get().getColors().Primary} />
            </View>
            <Text style={[styles.itemLabel, { color: Resources.get().getColors().Black }]}>
              {Resources.get().getStrings().Screens.SettingsScreen.MapTypeLabel}
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
            backgroundActive={Resources.get().getColors().Primary}
            backgroundInactive={Resources.get().getColors().DarkBeige}
            circleActiveColor={Resources.get().getColors().White}
            circleInActiveColor={Resources.get().getColors().Primary}
            switchLeftPx={2}
            switchRightPx={2}
            switchWidthMultiplier={2.2}
            switchBorderRadius={40}
          />
          <Text>{Resources.get().getStrings().Screens.SettingsScreen.DefaultLocationOrGpsLabel}</Text>
        </View>

        {/* SHOWING DUMPSTERS ON MAP */}
        <View style={styles.topSettingsItem}>
          <View style={{ flexDirection: 'row' }}>
            <View style={styles.icon}>
              <FontAwesomeIcon
                icon={faTrash}
                color={Resources.get().getColors().Primary}
                size={20}
              />
            </View>
            <Text style={[styles.itemLabel, { color: Resources.get().getColors().Black }]}>
              {Resources.get().getStrings().Screens.SettingsScreen.ShowDumpstersOnMapLabel}
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
            backgroundActive={Resources.get().getColors().Primary}
            backgroundInactive={Resources.get().getColors().Beige}
            circleActiveColor={Resources.get().getColors().White}
            circleInActiveColor={Resources.get().getColors().Primary}
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
              <FontAwesomeIcon icon={faSmile} color={Resources.get().getColors().Primary} />
            </View>
            <Text style={[styles.itemLabel, { color: Resources.get().getColors().Black }]}>
             {Resources.get().getStrings().Screens.SettingsScreen.AddsLabel}
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
            backgroundActive={Resources.get().getColors().Primary}
            backgroundInactive={Resources.get().getColors().DarkBeige}
            circleActiveColor={Resources.get().getColors().White}
            circleInActiveColor={Resources.get().getColors().Primary}
            switchLeftPx={2}
            switchRightPx={2}
            switchWidthMultiplier={2.2}
            switchBorderRadius={40}
          />
        </View>

        {/* LANGUAGE */}
        <View style={styles.topSettingsItem}>
          <View style={styles.icon}>
            <FontAwesomeIcon icon={faLanguage} color={Resources.get().getColors().Primary} />
          </View>

          <DropDownPicker
            open={false}
            value={null}
            items={[]}
            setOpen={() => { }}
            setValue={() => { }}
            setItems={() => { }}
            placeholder={Resources.get().getStrings().Screens.SettingsScreen.LanguageLabel}
          />
        </View>

        {/* COLOR MODE */}
        <View style={styles.topSettingsItem}>
          <View style={styles.icon}>
            <FontAwesomeIcon icon={faColonSign} color={Resources.get().getColors().Primary} />
          </View>
          <DropDownPicker
            open={false}
            value={null}
            items={[]}
            setOpen={() => { }}
            setValue={() => { }}
            setItems={() => { }}
            placeholder={Resources.get().getStrings().Screens.SettingsScreen.ColorModeLabel}
          />
        </View>

        {/* PUSH NOTIFICATIONS MODE */}
        <View style={styles.topSettingsItem}>
          <View style={styles.icon}>
            <FontAwesomeIcon icon={faBell} color={Resources.get().getColors().Primary} />
          </View>
          <DropDownPicker
            open={false}
            value={null}
            items={[]}
            setOpen={() => { }}
            setValue={() => { }}
            setItems={() => { }}
            placeholder={Resources.get().getStrings().Screens.SettingsScreen.NotificationsLabel}
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
