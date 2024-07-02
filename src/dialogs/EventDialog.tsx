import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import WisbDialog, { Mode } from "./WisbDialog";
import { faGripLines, faMapPin, faTrash, faPerson, faShare, faClose, faAdd, faEdit, faMessage, faCopy, faClock } from "@fortawesome/free-solid-svg-icons";
import { Animated, FlatList, Image, StyleSheet, Text, TextInput, Touchable, TouchableOpacity, View } from "react-native";
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
import React, { Fragment } from "react";
import WastelandItem from "../components/WastelandItem";
import Wasteland from "../API/data_types/Wasteland";
import User from "../API/data_types/User";
import Event from "../API/data_types/Event";
import UserItem from "../components/UserItem";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import ImageInput from "../components/ImageInput";
import ObjectsList from "../components/ObjectsList";
import { isUser, isWasteland } from "../API/data_types/type_guards";
import { Type } from "../API/helpers";
import Share from 'react-native-share';
import getMockupEvents from "../API/implementations/mockup/mockup_events";
import getAPI from "../API/getAPI";
import Spinner from "react-native-spinkit";

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
    visible: boolean
    userLocation: LatLng
    onOpenChat: (event: Event) => void
    currentUser: User
    googleMapsApiKey: string
}

const api = getAPI()

enum AddingPhases {
    None,
    Adding,
    Added
}

export default function EventDialog({ mode, event, onDismiss, visible, userLocation, onOpenChat, currentUser, googleMapsApiKey }: Props) {
    const [workingEvent, setWorkingEvent] = React.useState<Partial<Event>>(event ?? {})
    const [wastelandPhrase, setWastelandPhrase] = React.useState("")
    const [userPhrase, setUserPhrase] = React.useState("")

    const [selectedMembers, setSelectedMembers] = React.useState<User[]>([])

    const [addingPhase, setAddingPhase] = React.useState(AddingPhases.None)

    return (
        <Fragment>
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
                        onPress: () => onOpenChat(event!),
                    }
                ]}
                onDismiss={onDismiss}
                sectionsOrder={[Sections.BasicInfo, Sections.MeetPlace, Sections.Wastelands, Sections.Members, Sections.Sharing]}
                sections={{
                    [Sections.BasicInfo]: {
                        enabled: () => workingEvent.iconUrl != null && workingEvent.dateRange != null && workingEvent.description != null && workingEvent.description.length != null,
                        icon: <FontAwesomeIcon icon={faGripLines} />, color: Resources.get().getColors().Yellow, name: "Podstawowe informacje", renderPage: (props, index) => (
                            <View key={index} style={{ flex: 1, padding: 10 }}>
                                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", height: 120 }}>
                                    <ImageInput
                                        readonly={mode == Mode.Viewing}
                                        style={{ height: "100%", aspectRatio: 1 }}
                                        image={workingEvent?.iconUrl}
                                        onImageSelected={image => {
                                            setWorkingEvent({
                                                ...workingEvent,
                                                iconUrl: image
                                            })
                                        }} />

                                    <View style={{ flex: 1, justifyContent: "center", height: "100%", alignItems: "center" }}>
                                        <TextInput
                                            readOnly={mode == Mode.Viewing}
                                            style={{ fontSize: 20, fontWeight: "500", letterSpacing: 1, fontStyle: "italic", fontFamily: "Avenir" }}
                                            onChange={e => setWorkingEvent({ ...workingEvent, name: e.nativeEvent.text })}>
                                            {workingEvent.name}
                                        </TextInput>

                                        <Text style={{ position: "absolute", right: 5, bottom: 5, fontSize: 12 }}>by {currentUser.userName}</Text>
                                    </View>
                                </View>

                                <View style={{ flexDirection: "row", justifyContent: "space-around", marginTop: 10 }}>
                                    <View style={{ justifyContent: "space-around", flexDirection: "row", alignItems: "center" }}>
                                        <FontAwesomeIcon icon={faClock} color={Resources.get().getColors().DarkBeige} style={{ flex: 1 }} />

                                        <Text style={{ fontSize: 12, fontFamily: "Avenir", marginTop: 3, marginLeft: 10 }}>OD</Text>
                                    </View>

                                    <RNDateTimePicker
                                        value={workingEvent?.dateRange?.[0] ?? new Date()}
                                        onChange={(_, date) => {
                                            if (date != null) {
                                                setWorkingEvent({
                                                    ...workingEvent,
                                                    dateRange: [date, workingEvent.dateRange?.[1]!]
                                                })
                                            }
                                        }}
                                        mode="datetime"
                                        minimumDate={new Date()} />
                                </View>

                                <View style={{ flexDirection: "row", justifyContent: "space-around", marginTop: 10 }}>
                                    <View style={{ justifyContent: "space-around", flexDirection: "row", alignItems: "center" }}>
                                        <FontAwesomeIcon icon={faClock} color={Resources.get().getColors().DarkBeige} style={{ flex: 1 }} />

                                        <Text style={{ fontSize: 12, fontFamily: "Avenir", marginTop: 3, marginLeft: 10 }}>OD</Text>
                                    </View>

                                    <RNDateTimePicker
                                        value={workingEvent?.dateRange?.[1] ?? new Date()}
                                        onChange={(_, date) => {
                                            if (date != null) {
                                                setWorkingEvent({
                                                    ...workingEvent,
                                                    dateRange: [workingEvent.dateRange?.[0]!, date]
                                                })
                                            }
                                        }}
                                        mode="datetime"
                                        minimumDate={workingEvent?.dateRange?.[0] ?? new Date()} />
                                </View>

                                <TextInput
                                    multiline
                                    style={[styles.textField, { minHeight: 100 }]}
                                    readOnly={mode == Mode.Viewing}
                                    onChange={e => setWorkingEvent({ ...workingEvent, description: e.nativeEvent.text })}
                                    placeholder="Opis"
                                    placeholderTextColor={Resources.get().getColors().Black}>
                                    {workingEvent.description ?? ""}
                                </TextInput>
                            </View>
                        ),
                    },
                    [Sections.MeetPlace]: {
                        enabled: () => workingEvent.meetPlace != null,
                        icon: <FontAwesomeIcon icon={faMapPin} />, color: Resources.get().getColors().Lime, name: Resources.get().getStrings().Dialogs.EventDialog.MeetPlaceLabel, renderPage: (props, index) => (
                            <View key={index} style={{ flex: 1, padding: 15 }}>
                                <LocationInput
                                    readonly={mode == Mode.Viewing}
                                    iconColor={Resources.get().getColors().DarkBeige}
                                    style={{ width: "100%", height: "100%" }}
                                    userLocation={userLocation}
                                    apiKey={Resources.get().getEnv().GOOGLE_MAPS_API_KEY}
                                    onLocationChanged={(coords, asText) => {
                                        setWorkingEvent({
                                            ...workingEvent,
                                            meetPlace: {
                                                coords,
                                                asText
                                            }
                                        })
                                    }}
                                    location={{
                                        coords: event?.meetPlace.coords ?? userLocation,
                                        asText: "Jakaś lokalizacja"
                                    }} />
                            </View>
                        )
                    },
                    [Sections.Wastelands]: {
                        enabled: () => workingEvent.wastelands != null && workingEvent.wastelands.length > 0,
                        icon: <FontAwesomeIcon icon={faTrash} />, color: Resources.get().getColors().DarkBeige, name: Resources.get().getStrings().Dialogs.EventDialog.WastelandsLabel, renderPage: (props, index) => (
                            <View key={index} style={{ flex: 1, minHeight: 50 }}>
                                <Text>Co sprzątamy?</Text>

                                {mode == Mode.Adding ? <SearchBar
                                    phrase={wastelandPhrase}
                                    placeholder="Szukaj wysypisk"
                                    onPhraseChanged={setWastelandPhrase} /> : null}

                                <ObjectsList
                                    filter={{
                                        [Type.Wasteland]: {
                                            activeOnly: true
                                        }
                                    }}
                                    type={Type.Wasteland}
                                    multi={true}
                                    selectedItemsIds={workingEvent.wastelands?.map(it => it.id) ?? []}
                                    onSelected={selectedItem => {
                                        if (isWasteland(selectedItem)) {
                                            if (workingEvent.wastelands != null && workingEvent.wastelands.some(it => it.id == selectedItem.id)) {
                                                setWorkingEvent({
                                                    ...workingEvent,
                                                    wastelands: workingEvent.wastelands!.filter(it => it.id != selectedItem.id)
                                                })
                                            } else {
                                                setWorkingEvent({
                                                    ...workingEvent,
                                                    wastelands: [
                                                        ...workingEvent.wastelands!,
                                                        selectedItem
                                                    ]
                                                })
                                            }
                                        }
                                    }}
                                    phrase={wastelandPhrase}
                                    currentUser={currentUser}
                                    googleMapsApiKey={googleMapsApiKey} />
                            </View>
                        )
                    },
                    [Sections.Members]: {
                        enabled: () => true,
                        icon: <FontAwesomeIcon icon={faPerson} />, color: Resources.get().getColors().Purple, name: Resources.get().getStrings().Dialogs.EventDialog.MembersLabel, renderPage: (props, index) => (
                            <View key={index} style={{ flex: 1 }}>
                                <Text>Zaproś uczestników</Text>

                                {mode == Mode.Adding ? <SearchBar
                                    phrase={userPhrase}
                                    placeholder="Szukaj użytkowników"
                                    onPhraseChanged={setUserPhrase} /> : null}

                                <ObjectsList
                                    type={Type.User}
                                    multi={mode == Mode.Adding}
                                    selectedItemsIds={selectedMembers.map(it => it.id)}
                                    onSelected={selectedItem => {
                                        if (isUser(selectedItem)) {
                                            if (selectedMembers.some(it => it.id == selectedItem.id)) {
                                                setSelectedMembers(selectedMembers.filter(it => it.id != selectedItem.id))
                                            } else {
                                                setSelectedMembers([
                                                    ...selectedMembers,
                                                    selectedItem
                                                ])
                                            }
                                        }
                                    }}
                                    phrase={userPhrase}
                                    currentUser={currentUser}
                                    googleMapsApiKey={googleMapsApiKey} />
                            </View>
                        )
                    },
                    [Sections.Sharing]: {
                        enabled: () => true,
                        icon: <FontAwesomeIcon icon={faAdd} />,
                        color: Resources.get().getColors().Primary,
                        name: "Dodaj",
                        renderPage: (props, index) => {
                            if (mode == Mode.Adding) {
                                if (props.currentIndex == Sections.Sharing && addingPhase == AddingPhases.Added) {
                                    props.startConfetti()
                                }

                                if (addingPhase == AddingPhases.None) {
                                    return (
                                        <View>
                                            <TouchableOpacity onPress={() => {
                                                setAddingPhase(AddingPhases.Adding)
                                                api.createEvent(workingEvent as Event).then(() => {
                                                    setAddingPhase(AddingPhases.Added)
                                                })
                                            }}>
                                                <Text>DODAJ</Text>
                                            </TouchableOpacity>
                                        </View>
                                    )
                                }

                                if (addingPhase == AddingPhases.Adding) {
                                    return (
                                        <View>
                                            <Spinner />
                                        </View>
                                    )
                                }
                            }


                            return (
                                <View key={index} style={{ flex: 1 }}>
                                    <Text>{Resources.get().getStrings().Dialogs.EventDialog.InviteMorePeopleMessage}</Text>

                                    <View style={{ justifyContent: "center", alignItems: "center", flex: 2 }}>
                                        <QRCode color={Resources.get().getColors().Blue} value="AAA123" />
                                    </View>

                                    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                                        <TouchableOpacity
                                            style={{ backgroundColor: Resources.get().getColors().DarkBeige, padding: 20, borderRadius: 15 }}
                                            onPress={() => {
                                                Share.open({
                                                    title: "Share",
                                                    message: "Let's clean up planet together!",
                                                })
                                                    .then((res) => {
                                                        console.log(res);
                                                    })
                                                    .catch((err) => {
                                                        err && console.log(err);
                                                    });
                                            }}>
                                            <Text style={{ fontFamily: "Avenir", color: "white", fontWeight: "600", letterSpacing: 1, fontSize: 15 }}>Share on Social Media</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )
                        }
                    },
                }} />
        </Fragment>
    )
}

const styles = StyleSheet.create({
    textField: {
        overflow: "hidden",
        marginTop: 10, backgroundColor: Resources.get().getColors().Beige, padding: 5, borderRadius: 15, fontWeight: 400, fontFamily: "Avenir", letterSpacing: 2
    }
})