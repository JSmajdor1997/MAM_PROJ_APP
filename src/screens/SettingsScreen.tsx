import { faMap } from '@fortawesome/free-regular-svg-icons';
import { faChevronLeft, faCog, faEnvelope, faLanguage, faLocationDot, faMessage } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Switch } from 'react-native-switch';
import MapType from '../../res/MapType';
import Resources from '../../res/Resources';
import LocationInput from '../components/LocationInput';
import IconType from '../components/WisbIcon/IconType';
import WisbIcon from '../components/WisbIcon/WisbIcon';
import NavigationParamsList from './NavigationParamsList';
import WisbScreens from './WisbScreens';

const res = Resources.get()

interface Props extends NativeStackScreenProps<NavigationParamsList, WisbScreens.SettingsScreen> { }

export default function SettingsScreen({ route: { params: { navigate } } }: Props) {
  const [userPosiition, setUserPosiition] = React.useState(res.getLastLocation())
  const [settings, setSettings] = React.useState(res.getSettings())

  React.useEffect(() => {
    const unregisterSettingsListener = res.registerSettingsChangedListener(setSettings)
    const unregisterUserLocationListener = res.registerUserLocationListener(setUserPosiition)

    return () => {
      unregisterSettingsListener()
      unregisterUserLocationListener()
    }
  }, [])

  return (
    <SafeAreaView style={{ backgroundColor: res.getColors().LightBeige, width: "100%", height: "100%" }}>
      <View style={{ height: 50, flexDirection: "row", alignItems: "center", paddingLeft: 15, paddingRight: 15, justifyContent: "space-between" }}>
        <TouchableOpacity onPress={() => navigate.goBack()}>
          <FontAwesomeIcon icon={faChevronLeft} color={res.getColors().Primary} />
        </TouchableOpacity>

        <FontAwesomeIcon icon={faCog} color={res.getColors().Primary} />
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
          selectedValue={settings.mapType}
          onSelected={value => res.setSettings({ mapType: value.value })} />
        <DropDownItem
          label='Język'
          selectedValue={settings.languageCode}
          onSelected={item => res.setSettings({ languageCode: item.value })}
          data={res.getSupportedLanguages().map(language => ({ label: language.nativeName, icon: () => <Text>{language.flagEmoji}</Text>, value: language.code }))}
          icon={<FontAwesomeIcon icon={faLanguage} size={20} color={res.getColors().Green} />} />
        <BooleanItem label='Powiadomienia o nowych wydarzeniach' icon={<WisbIcon icon={IconType.Calendar} size={20} />} value={settings.notifications.newEventInArea} onValueChanged={item => res.setSettings({ notifications: { newEventInArea: item } })} />
        <BooleanItem label='Powiadomienia o nowych śmietnikach' icon={<WisbIcon icon={IconType.Dumpster} size={20} />} value={settings.notifications.newDumpsterInArea} onValueChanged={item => res.setSettings({ notifications: { newDumpsterInArea: item } })} />
        <BooleanItem label='Powiadomienia o nowych wysypiskach' icon={<WisbIcon icon={IconType.WastelandIcon} size={20} />} value={settings.notifications.newWastelandInArea} onValueChanged={item => res.setSettings({ notifications: { newWastelandInArea: item } })} />
        <BooleanItem label='Powiadomienia o zaproszeniach do wydarzeń' icon={<FontAwesomeIcon icon={faEnvelope} size={20} color={res.getColors().Primary} />} value={settings.notifications.newInvitation} onValueChanged={item => res.setSettings({ notifications: { newInvitation: item } })} />
        <BooleanItem label='Powiadomienia o nowych wiadomościach' icon={<FontAwesomeIcon icon={faMessage} size={20} color={res.getColors().Primary} />} value={settings.notifications.newMessage} onValueChanged={item => res.setSettings({ notifications: { newMessage: item } })} />

        <View
          style={{
            padding: 10,
            backgroundColor: "white",
            margin: 10,
            borderRadius: 15,
            overflow: "hidden",
            minHeight: 50
          }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
            <FontAwesomeIcon icon={faLocationDot} color={res.getColors().Red} />
            <Text
              style={{
                marginLeft: 10,
                fontWeight: "800",
                fontFamily: "Avenir",
                letterSpacing: 0.5,
                fontSize: 13,
                color: res.getColors().DarkBeige
              }}>
              {settings.defaultLocation == null ? "Domyślna lokalizacja" : "Automatyczna lokalizacja"}
            </Text>

            <Switch
              value={settings.defaultLocation == null}
              onValueChange={item => res.setSettings({ defaultLocation: item ? null : userPosiition })}
              circleSize={20}
              barHeight={24}
              circleBorderWidth={0}
              activeText=''
              inActiveText=''
              backgroundActive={res.getColors().Green}
              backgroundInactive={res.getColors().Beige}
              circleActiveColor={res.getColors().White}
              circleInActiveColor={res.getColors().White}
              switchLeftPx={2}
              switchRightPx={2}
              switchWidthMultiplier={2.2}
              switchBorderRadius={40}
            />
          </View>

          <LocationInput
            style={{ height: 250, marginTop: 10 }}
            readonly={settings.defaultLocation == null}
            userLocation={userPosiition}
            showNavigateButton={false}
            location={{
              coords: settings.defaultLocation ?? userPosiition,
              asText: ''
            }}
            apiKey={res.getEnv().GOOGLE_MAPS_API_KEY} />
        </View>
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
        backgroundActive={res.getColors().Green}
        backgroundInactive={res.getColors().Beige}
        circleActiveColor={res.getColors().White}
        circleInActiveColor={res.getColors().White}
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
