import React, { Component } from 'react';
import { StyleSheet, Text, View, StatusBar, TouchableOpacity, ScrollView } from 'react-native';
import { Switch } from 'react-native-switch';
import Resources from '../../res/Resources';
import WisbScreens from './WisbScreens';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import NavigationParamsList from './NavigationParamsList';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faMap } from '@fortawesome/free-regular-svg-icons';
import { faBell, faChevronLeft, faCog, faColonSign, faDumpster, faLanguage, faLightbulb, faLocationDot, faSmile, faTrash } from '@fortawesome/free-solid-svg-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import LocationInput from '../components/LocationInput';
import Separator from '../components/Separator';
import MapType from '../../res/MapType';
import NotificationType from '../../res/NotificationType';
import { Dropdown, MultiSelect } from 'react-native-element-dropdown';
import ColorMode from '../../res/ColorMode';

interface Props extends NativeStackScreenProps<NavigationParamsList, WisbScreens.SettingsScreen> { }

export default function SettingsScreen({ navigation }: Props) {
  const [userPosiition, setUserPosiition] = React.useState(Resources.get().getLastLocation())

  React.useEffect(() => {
    return Resources.get().registerUserLocationListener(setUserPosiition)
  }, [])

  return (
    <SafeAreaView style={{ backgroundColor: Resources.get().getColors().LightBeige, width: "100%", height: "100%" }}>
      <View style={{ height: 50, flexDirection: "row", alignItems: "center", paddingLeft: 15, paddingRight: 15, justifyContent: "space-between" }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesomeIcon icon={faChevronLeft} color={Resources.get().getColors().Primary} />
        </TouchableOpacity>

        <Text style={{ fontFamily: Resources.get().getFonts().Primary, color: Resources.get().getColors().Primary, fontSize: 25 }}>Ustawienia</Text>
      </View>

      <View style={{ width: "100%", height: 0, borderColor: Resources.get().getColors().Primary, borderWidth: 2, borderStyle: "dashed" }} />

      <ScrollView style={{ backgroundColor: Resources.get().getColors().LightBeige, flex: 1 }}>
        <DropDownItem
          label='Typ mapy'
          icon={<FontAwesomeIcon icon={faMap} size={20} color={Resources.get().getColors().Blue} />}
          data={[
            { label: "Domyślna", value: MapType.Default },
            { label: "Satelitarna", value: MapType.Satellite },
          ]}
          selectedValue={Resources.get().getSettings().mapType}
          onSelected={value => Resources.get().setSettings({languageCode: value.value})} />
        <DropDownItem
          label='Język'
          selectedValue={Resources.get().getSettings().languageCode}
          onSelected={item => Resources.get().setSettings({languageCode: item.value})}
          data={Resources.get().getSupportedLanguages().map(language => ({ label: language.nativeName, icon: () => <Text>{language.flagEmoji}</Text>, value: language.code }))}
          icon={<FontAwesomeIcon icon={faLanguage} size={20} color={Resources.get().getColors().Green} />} />
        <BooleanItem label='Reklamy' icon={<FontAwesomeIcon icon={faSmile} size={20} color={Resources.get().getColors().OceanBlue} />} value={Resources.get().getSettings().showAdds} onValueChanged={item => Resources.get().setSettings({showAdds: item})} />
        <BooleanItem label='Pokazuj śmietniki na mapie' icon={<FontAwesomeIcon icon={faDumpster} size={20} color={Resources.get().getColors().Yellow} />} value={Resources.get().getSettings().showDumpstersOnMap} onValueChanged={item => Resources.get().setSettings({showDumpstersOnMap: item})} />

        <ItemTemplate
          icon={<FontAwesomeIcon icon={faBell} size={20} color={Resources.get().getColors().Golden} />}
          label={'Powiadomiania'}>
          <MultiSelect
            data={[
              { value: NotificationType.NewEventNearby, label: "Nowe wydarzenia w okolicy" },
              { value: NotificationType.MessagesFromCreators, label: "Wiadomości ogólne" },
              { value: NotificationType.NewWastelandNearby, label: "Nowe wysypiska w okolicy" },
            ]}
            style={{ width: 200 }}
            value={Resources.get().getSettings().enabledNotifications}
            labelField={"label"}
            valueField={"value"}
            renderItem={(item) => <View><Text>{item.label}</Text></View>}
            onChange={(items) => Resources.get().setSettings({enabledNotifications: items as NotificationType[]})} />
        </ItemTemplate>

        <DropDownItem
          label='Motyw'
          selectedValue={Resources.get().getSettings().colorMode}
          onSelected={item => Resources.get().setSettings({colorMode: item.value})}
          data={[
            { value: ColorMode.Light, label: "Jasny motyw" },
            { value: ColorMode.Dark, label: "Ciemny motywa" },
            { value: ColorMode.Auto, label: "Ustawienia systemowe" },
          ]}
          icon={<FontAwesomeIcon icon={faLightbulb} size={20} color={Resources.get().getColors().Lime} />} />

        <ItemTemplate icon={<FontAwesomeIcon icon={faLocationDot} color={Resources.get().getColors().Red} />} label='GPS'>
          <View style={{ flexDirection: "column" }}>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 4 }}>
              <Switch
                value={Resources.get().getSettings().defaultLocation == null}
                onValueChange={item => Resources.get().setSettings({})}
                circleSize={20}
                barHeight={24}
                circleBorderWidth={0}
                activeText=''
                inActiveText=''
                backgroundActive={Resources.get().getColors().Primary}
                backgroundInactive={Resources.get().getColors().DarkBeige}
                circleActiveColor={Resources.get().getColors().White}
                circleInActiveColor={Resources.get().getColors().Primary}
                switchLeftPx={2}
                switchRightPx={2}
                switchWidthMultiplier={2.2}
                switchBorderRadius={40}
              />

              <Text>{Resources.get().getSettings().defaultLocation == null ? "Lokalizacja automatyczna (GPS)" : "Domyślak lokalizacja"}</Text>
            </View>

            <LocationInput
              readonly={Resources.get().getSettings().defaultLocation == null}
              userLocation={userPosiition}
              showNavigateButton={false}
              location={{
                coords: {
                  latitude: 0,
                  longitude: 0
                },
                asText: ''
              }}
              apiKey={Resources.get().getEnv().GOOGLE_MAPS_API_KEY} />
          </View>
        </ItemTemplate>
      </ScrollView>
    </SafeAreaView>
  )
}

function ItemTemplate({ children, icon, label }: { children: React.ReactNode, icon: React.ReactNode, label: string }) {
  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 5 }}>
      <View style={{ flexDirection: "row", alignItems: 'center' }}>
        {icon}
        <Text style={{ marginLeft: 10, maxWidth: 100, fontWeight: "400", letterSpacing: 0.5, fontSize: 13 }}>{label}</Text>
      </View>

      {children}
    </View>
  )
}

function BooleanItem({ icon, label, onValueChanged, value }: { icon: React.ReactNode, label: string, onValueChanged: (newValue: boolean) => void, value: boolean }) {
  return (
    <ItemTemplate
      icon={icon}
      label={label}>
      <Switch
        value={value}
        onValueChange={onValueChanged}
        circleSize={20}
        activeText=''
        inActiveText=''
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
    </ItemTemplate>
  )
}

function DropDownItem<T extends { label: string, value: string, icon?: () => JSX.Element }>({ onSelected, icon, label, data, selectedValue }: { icon: React.ReactNode, label: string, data: T[], selectedValue: string, onSelected: (value: T) => void }) {
  return (
    <ItemTemplate
      icon={icon}
      label={label}>
      <Dropdown
        data={data}
        style={{ width: 200 }}
        value={selectedValue}
        labelField={"label"}
        valueField={"value"}
        renderItem={(item) => <View><Text>{item.label}</Text></View>}
        onChange={onSelected} />
    </ItemTemplate>
  )
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
