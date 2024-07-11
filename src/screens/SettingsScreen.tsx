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
import { Dropdown, MultiSelect } from 'react-native-element-dropdown';

const res = Resources.get()

interface Props extends NativeStackScreenProps<NavigationParamsList, WisbScreens.SettingsScreen> { }

export default function SettingsScreen({ route: {params: {navigate}}  }: Props) {
  const [userPosiition, setUserPosiition] = React.useState(res.getLastLocation())

  React.useEffect(() => {
    return res.registerUserLocationListener(setUserPosiition)
  }, [])

  return (
    <SafeAreaView style={{ backgroundColor: res.getColors().LightBeige, width: "100%", height: "100%" }}>
      <View style={{ height: 50, flexDirection: "row", alignItems: "center", paddingLeft: 15, paddingRight: 15, justifyContent: "space-between" }}>
        <TouchableOpacity onPress={() => navigate.goBack()}>
          <FontAwesomeIcon icon={faChevronLeft} color={res.getColors().Primary} />
        </TouchableOpacity>

        <FontAwesomeIcon icon={faCog} color={res.getColors().Primary}/>
      </View>

      <View style={{ width: "100%", height: 0, borderColor: res.getColors().Primary, borderWidth: 2, borderStyle: "dashed" }} />

      <ScrollView style={{ backgroundColor: res.getColors().LightBeige, flex: 1 }}>
        <DropDownItem
          label='Typ mapy'
          icon={<FontAwesomeIcon icon={faMap} size={20} color={res.getColors().Blue} />}
          data={[
            { label: "Domyślna", value: MapType.Default },
            { label: "Satelitarna", value: MapType.Satellite },
          ]}
          selectedValue={res.getSettings().mapType}
          onSelected={value => res.setSettings({languageCode: value.value})} />
        <DropDownItem
          label='Język'
          selectedValue={res.getSettings().languageCode}
          onSelected={item => res.setSettings({languageCode: item.value})}
          data={res.getSupportedLanguages().map(language => ({ label: language.nativeName, icon: () => <Text>{language.flagEmoji}</Text>, value: language.code }))}
          icon={<FontAwesomeIcon icon={faLanguage} size={20} color={res.getColors().Green} />} />
        <BooleanItem label='Reklamy' icon={<FontAwesomeIcon icon={faSmile} size={20} color={res.getColors().Primary} />} value={res.getSettings().showAdds} onValueChanged={item => res.setSettings({showAdds: item})} />
        <BooleanItem label='Powiadomienia o nowych wydarzeniach' icon={<FontAwesomeIcon icon={faSmile} size={20} color={res.getColors().Primary} />} value={res.getSettings().showAdds} onValueChanged={item => res.setSettings({showAdds: item})} />
        <BooleanItem label='Powiadomienia o nowych śmietnikach' icon={<FontAwesomeIcon icon={faSmile} size={20} color={res.getColors().Primary} />} value={res.getSettings().showAdds} onValueChanged={item => res.setSettings({showAdds: item})} />
        <BooleanItem label='Powiadomienia o nowych wysypiskach' icon={<FontAwesomeIcon icon={faSmile} size={20} color={res.getColors().Primary} />} value={res.getSettings().showAdds} onValueChanged={item => res.setSettings({showAdds: item})} />
        <BooleanItem label='Powiadomienia o zaproszeniach do wydarzeń' icon={<FontAwesomeIcon icon={faSmile} size={20} color={res.getColors().Primary} />} value={res.getSettings().showAdds} onValueChanged={item => res.setSettings({showAdds: item})} />
        <BooleanItem label='Powiadomienia o nowych wiadomościach' icon={<FontAwesomeIcon icon={faSmile} size={20} color={res.getColors().Primary} />} value={res.getSettings().showAdds} onValueChanged={item => res.setSettings({showAdds: item})} />
        <BooleanItem label='Pokazuj śmietniki na mapie' icon={<FontAwesomeIcon icon={faDumpster} size={20} color={res.getColors().Yellow} />} value={res.getSettings().showDumpstersOnMap} onValueChanged={item => res.setSettings({showDumpstersOnMap: item})} />

        <ItemTemplate icon={<FontAwesomeIcon icon={faLocationDot} color={res.getColors().Red} />} label='GPS'>
          <View style={{ flexDirection: "column" }}>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 4 }}>
              <Switch
                value={res.getSettings().defaultLocation == null}
                onValueChange={item => res.setSettings({})}
                circleSize={20}
                barHeight={24}
                circleBorderWidth={0}
                activeText=''
                inActiveText=''
                backgroundActive={res.getColors().Primary}
                backgroundInactive={res.getColors().DarkBeige}
                circleActiveColor={res.getColors().White}
                circleInActiveColor={res.getColors().Primary}
                switchLeftPx={2}
                switchRightPx={2}
                switchWidthMultiplier={2.2}
                switchBorderRadius={40}
              />

              <Text>{res.getSettings().defaultLocation == null ? "Lokalizacja automatyczna (GPS)" : "Domyślak lokalizacja"}</Text>
            </View>

            <LocationInput
              readonly={res.getSettings().defaultLocation == null}
              userLocation={userPosiition}
              showNavigateButton={false}
              location={{
                coords: {
                  latitude: 0,
                  longitude: 0
                },
                asText: ''
              }}
              apiKey={res.getEnv().GOOGLE_MAPS_API_KEY} />
          </View>
        </ItemTemplate>
      </ScrollView>
    </SafeAreaView>
  )
}

function ItemTemplate({ children, icon, label }: { children: React.ReactNode, icon: React.ReactNode, label: string }) {
  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 10, backgroundColor: "white", margin: 10, borderRadius: 15, overflow: "hidden", minHeight: 50 }}>
      <View style={{ flexDirection: "row", alignItems: 'center' }}>
        {icon}
        <Text style={{ marginLeft: 10, maxWidth: 100, fontWeight: "800", fontFamily: "Avenir", letterSpacing: 0.5, fontSize: 13, color: res.getColors().DarkBeige }}>{label}</Text>
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
        backgroundActive={res.getColors().Primary}
        backgroundInactive={res.getColors().DarkBeige}
        circleActiveColor={res.getColors().White}
        circleInActiveColor={res.getColors().Primary}
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
