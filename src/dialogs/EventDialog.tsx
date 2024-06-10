import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import WisbDialog, { Mode } from "./WisbDialog";
import { faGripLines, faMapPin, faTrash, faPerson, faShare, faClose, faAdd, faEdit, faMessage, faCopy, faClock } from "@fortawesome/free-solid-svg-icons";
import { Animated, FlatList, Image, StyleSheet, Text, TextInput, View } from "react-native";
import QRCode from "react-native-qrcode-svg";
import Resources from "../../res/Resources";
import LocationInput from "../components/LocationInput";
import FAB from "../components/FAB";
import { faFacebookF, faInstagram, faTwitter } from "@fortawesome/free-brands-svg-icons";
import { LatLng } from "react-native-maps";
import IconType from "../components/WisbIcon/IconType";
import { faker } from "@faker-js/faker"
import SearchBar from "../components/SearchBar";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import React from "react";
import WastelandItem from "../components/WastelandItem";
import Wasteland from "../API/data_types/Wasteland";
import User from "../API/data_types/User";
import Event from "../API/data_types/Event";
import UserItem from "../components/UserItem";

enum Sections {
    BasicInfo,
    MeetPlace,
    Wastelands,
    Members,
    Sharing
}

export interface Props {
    event?: Event
    mode: Mode
    onDismiss(): void
    onAdd?: (event: Event) => void
    visible: boolean
    userLocation: LatLng
}

export default function EventDialog({ mode, event, onDismiss, onAdd, visible, userLocation }: Props) {
    const [isDatePickerVisible, setIsDatePickerVisible] = React.useState(false)

    return (
        <WisbDialog
            visible={visible}
            mainIcon={IconType.Calendar}
            mode={mode}
            moreActions={[
                {
                    label: Resources.get().getStrings().Dialogs.EventDialog.DeleteAction,
                    icon: <FontAwesomeIcon icon={faTrash} />,
                    color: Resources.get().getColors().Red,
                    onPress: () => { }
                },
                {
                    label: Resources.get().getStrings().Dialogs.EventDialog.EditAction,
                    icon: <FontAwesomeIcon icon={faEdit} />,
                    color: Resources.get().getColors().White,
                    onPress: () => { }
                }
            ]}
            actions={[
                {
                    label: Resources.get().getStrings().Dialogs.EventDialog.JoinAction,
                    icon: <FontAwesomeIcon icon={faAdd} />,
                    color: Resources.get().getColors().Yellow,
                    onPress: () => { },
                },
                {
                    label: Resources.get().getStrings().Dialogs.EventDialog.ShareAction,
                    icon: <FontAwesomeIcon icon={faShare} />,
                    color: Resources.get().getColors().Blue,
                    onPress: () => { },
                },
                {
                    label: Resources.get().getStrings().Dialogs.EventDialog.LeaveAction,
                    icon: <FontAwesomeIcon icon={faClose} />,
                    color: Resources.get().getColors().Lime,
                    onPress: () => { },
                },
                {
                    label: Resources.get().getStrings().Dialogs.EventDialog.OpenChatAction,
                    icon: <FontAwesomeIcon icon={faMessage} />,
                    color: Resources.get().getColors().Primary,
                    onPress: () => { },
                }
            ]}
            onDismiss={onDismiss}
            sectionsOrder={[Sections.BasicInfo, Sections.MeetPlace, Sections.Wastelands, Sections.Members, Sections.Sharing]}
            sections={{
                [Sections.BasicInfo]: {
                    icon: <FontAwesomeIcon icon={faGripLines} />, color: Resources.get().getColors().Yellow, name: "Podstawowe informacje", renderPage: (props, index) => (
                        <View key={index} style={{ flex: 1, padding: 10 }}>
                            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", height: 120 }}>
                                <Image source={{ uri: faker.image.urlLoremFlickr({ category: "face" }) }} style={{ borderRadius: 5, width: 120, aspectRatio: 1 }} />

                                <View style={{ flex: 1, justifyContent: "center", height: "100%", alignItems: "center" }}>
                                    <TextInput readOnly style={{ fontSize: 20, fontWeight: "500", letterSpacing: 1, fontStyle: "italic", fontFamily: "Avenir" }}>NAZWA</TextInput>

                                    <Text style={{ position: "absolute", right: 5, bottom: 5, fontSize: 12 }}>by Agatka Kaczatka</Text>
                                </View>
                            </View>

                            <View style={{ flexDirection: "row", marginTop: 10 }}>
                                <View style={{ alignItems: "center", flex: 1 }}>
                                    <SearchBar
                                        readonly
                                        phrase=""
                                        placeholder=""
                                        leftIcon={<FontAwesomeIcon icon={faClock} color={Resources.get().getColors().DarkBeige} />} style={{ flex: 1 }} />
                                    <Text style={{ fontSize: 12, fontFamily: "Avenir" }}>OD</Text>
                                </View>

                                <View style={{ alignItems: "center", flex: 1 }}>
                                    <SearchBar
                                        readonly
                                        phrase=""
                                        placeholder=""
                                        rightIcon={<FontAwesomeIcon icon={faClock} color={Resources.get().getColors().DarkBeige} />} style={{ flex: 1 }} />
                                    <Text style={{ fontSize: 12, fontFamily: "Avenir" }}>DO</Text>
                                </View>
                            </View>

                            <TextInput multiline style={{ marginTop: 10, backgroundColor: Resources.get().getColors().Beige, padding: 5, minHeight: 100, borderRadius: 15, fontWeight: 400, fontFamily: "Avenir", letterSpacing: 2 }}>
                                Opis
                            </TextInput>
                        </View>
                    )
                },
                [Sections.MeetPlace]: {
                    icon: <FontAwesomeIcon icon={faMapPin} />, color: Resources.get().getColors().Lime, name: Resources.get().getStrings().Dialogs.EventDialog.MeetPlaceLabel, renderPage: (props, index) => (
                        <View key={index} style={{ flex: 1, padding: 15 }}>
                            <LocationInput
                                readonly
                                iconColor={Resources.get().getColors().DarkBeige}
                                style={{ flex: 1, width: "100%", height: 200 }}
                                userLocation={userLocation}
                                apiKey={Resources.get().getEnv().GOOGLE_MAPS_API_KEY}
                                location={{
                                    coords: {
                                        latitude: 51.246452,
                                        longitude: 22.568445
                                    },
                                    asText: "Jakaś lokalizacja"
                                }} />
                        </View>
                    )
                },
                [Sections.Wastelands]: {
                    icon: <FontAwesomeIcon icon={faTrash} />, color: Resources.get().getColors().DarkBeige, name: Resources.get().getStrings().Dialogs.EventDialog.WastelandsLabel, renderPage: (props, index) => (
                        <View key={index} style={{ flex: 1, minHeight: 50 }}>
                            <Text>Co sprzątamy?</Text>

                            <FlatList<Wasteland>
                                data={[]}
                                renderItem={item => <WastelandItem item={item.item} onPress={() => { }} />} />
                        </View>
                    )
                },
                [Sections.Members]: {
                    icon: <FontAwesomeIcon icon={faPerson} />, color: Resources.get().getColors().Purple, name: Resources.get().getStrings().Dialogs.EventDialog.MembersLabel, renderPage: (props, index) => (
                        <View key={index} style={{ flex: 1 }}>
                            <Text>Uczestnicy</Text>

                            <FlatList<User>
                                data={[]}
                                renderItem={item => <UserItem isAdmin={item.item.id == event?.id} item={item.item} onPress={() => { }} />} />
                        </View>
                    )
                },
                [Sections.Sharing]: {
                    icon: <FontAwesomeIcon icon={faShare} />, color: Resources.get().getColors().Primary, name: Resources.get().getStrings().Dialogs.EventDialog.ShareAction, renderPage: (props, index) => {
                        if (props.currentIndex == Sections.Sharing) {
                            props.startConfetti()
                        }

                        return (
                            <View key={index} style={{ flex: 1 }}>
                                <Text>{Resources.get().getStrings().Dialogs.EventDialog.InviteMorePeopleMessage}</Text>

                                <View style={{ width: "90%", alignSelf: "center", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                                    <View style={{ justifyContent: "space-between", height: "100%" }}>
                                        <FAB
                                            size={45}
                                            color={Resources.get().getColors().Blue}
                                            onPress={() => { }}
                                            icon={
                                                <FontAwesomeIcon icon={faFacebookF} color={Resources.get().getColors().White} size={16} />
                                            } />
                                        <FAB
                                            size={45}
                                            color={Resources.get().getColors().Blue}
                                            onPress={() => { }}
                                            icon={
                                                <FontAwesomeIcon icon={faInstagram} color={Resources.get().getColors().White} size={16} />
                                            } />
                                    </View>

                                    <QRCode color={Resources.get().getColors().Blue} value="AAA123" />

                                    <View style={{ justifyContent: "space-between", height: "100%" }}>
                                        <FAB
                                            size={45}
                                            color={Resources.get().getColors().Blue}
                                            onPress={() => { }}
                                            icon={
                                                <FontAwesomeIcon icon={faTwitter} color={Resources.get().getColors().White} size={16} />
                                            } />
                                        <FAB
                                            size={45}
                                            color={Resources.get().getColors().Blue}
                                            onPress={() => { }}
                                            icon={
                                                <FontAwesomeIcon icon={faCopy} color={Resources.get().getColors().White} size={16} />
                                            } />
                                    </View>
                                </View>

                                <DateTimePickerModal
                                    isVisible={isDatePickerVisible}
                                    mode="date"
                                    onConfirm={selectedDate => { }}
                                    onCancel={() => setIsDatePickerVisible(false)}
                                />
                            </View>
                        )
                    }
                },
            }} />
    )
}

const styles = StyleSheet.create({

})