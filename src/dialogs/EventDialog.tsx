import { faAdd, faClock, faClose, faGripLines, faMapPin, faMessage, faPerson, faShare, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import React from "react";
import { Share, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { LatLng } from "react-native-maps";
import QRCode from "react-native-qrcode-svg";
import Resources from "../../res/Resources";
import Ref from "../API/Ref";
import WisbObjectType from "../API/WisbObjectType";
import getAPI from "../API/getAPI";
import { WisbEvent, WisbUser } from "../API/interfaces";
import { isEvent, isUser, isWasteland } from "../API/type_guards";
import IconType from "../components/WisbIcon/IconType";
import ImageInput from "../components/inputs/ImageInput";
import LocationInput from "../components/inputs/LocationInput";
import SearchBar from "../components/inputs/SearchBar";
import ObjectsList from "../components/lists/ObjectsList";
import WisbDialog, { Mode } from "./WisbDialog";

const res = Resources.get()

export interface Props {
    event?: WisbEvent
    mode: Mode
    onDismiss(): void
    userLocation: LatLng
    onOpenChat: (event: WisbEvent) => void
    currentUser: WisbUser
    googleMapsApiKey: string
}

const api = getAPI()

function addDay(date: Date) {
    const newOne = new Date(date)
    newOne.setDate(newOne.getDate()+1)

    return newOne
}

export default function EventDialog({ mode: propMode, event, onDismiss, userLocation, onOpenChat, currentUser, googleMapsApiKey }: Props) {
    const [mode, setMode] = React.useState(propMode)
    const [workingEvent, setWorkingEvent] = React.useState<Partial<WisbEvent>>(event ?? {
        dateRange: [new Date(), addDay(new Date())],
        members: new Map()
    })
    const [phrase, setPhrase] = React.useState("")
    const [isAdded, setIsAdded] = React.useState(false)

    return (
        <WisbDialog
            onItemUpdated={update => setWorkingEvent({ ...workingEvent, ...update })}
            type={WisbObjectType.Event}
            currentUser={currentUser}
            onModeChanged={setMode}
            workingItem={workingEvent}
            mainIcon={IconType.Calendar}
            mode={mode}
            actions={isEvent(workingEvent) && mode == Mode.Viewing ? [
                {
                    label: workingEvent.members.has(currentUser.id.toString()) ? res.getStrings().Dialogs.EventDialog.LeaveAction : res.getStrings().Dialogs.EventDialog.JoinAction,
                    icon: workingEvent.members.has(currentUser.id.toString()) ? <FontAwesomeIcon icon={faClose} /> : <FontAwesomeIcon icon={faAdd} />,
                    color: workingEvent.members.has(currentUser.id.toString()) ? res.getColors().Lime : res.getColors().Yellow,
                    onPress: ({setLoading}) => {
                        setLoading("")

                        if (workingEvent.members.has(currentUser.id.toString())) {
                            api.leaveEvent(workingEvent).then(() => {
                                setLoading(null)
                                workingEvent.members.delete(currentUser.id.toString())
                                setWorkingEvent(workingEvent)
                            })
                        } else {
                            api.joinEvent(workingEvent).then(() => {
                                setLoading(null)
                                workingEvent.members.set(currentUser.id.toString(), { type: WisbObjectType.User, id: currentUser.id, isAdmin: false })
                                setWorkingEvent(workingEvent)
                            })
                        }
                    },
                },
                {
                    label: res.getStrings().Dialogs.EventDialog.OpenChatAction,
                    icon: <FontAwesomeIcon icon={faMessage} />,
                    color: res.getColors().Primary,
                    onPress: () => onOpenChat(event!),
                    available: workingEvent.members.has(currentUser.id.toString())
                }
            ] : []}
            onDismiss={onDismiss}
            sections={[
                {
                    enabled: () => workingEvent.name != null && workingEvent.iconUrl != null && workingEvent.dateRange != null && workingEvent.dateRange[0] instanceof Date && workingEvent.dateRange[1] instanceof Date && workingEvent.description != null && workingEvent.description.length != null,
                    icon: <FontAwesomeIcon icon={faGripLines} />, color: res.getColors().Yellow, label: "Podstawowe informacje", renderPage: (props, index) => (
                        <View key={index} style={styles.basicInfoContainer}>
                            <View style={styles.basicInfoHeader}>
                                <ImageInput
                                    readonly={mode == Mode.Viewing}
                                    style={styles.imageInput}
                                    image={workingEvent?.iconUrl}
                                    onImageSelected={image => {
                                        setWorkingEvent({
                                            ...workingEvent,
                                            iconUrl: image
                                        })
                                    }} />

                                <View style={styles.nameContainer}>
                                    <TextInput
                                        readOnly={mode == Mode.Viewing}
                                        placeholder="Nazwa"
                                        placeholderTextColor={"white"}
                                        style={styles.nameInput}
                                        onChange={e => setWorkingEvent({ ...workingEvent, name: e.nativeEvent.text })}>
                                        {workingEvent.name}
                                    </TextInput>

                                    <Text style={styles.createdByText}>by {currentUser.userName}</Text>
                                </View>
                            </View>

                            <View style={styles.dateTimeContainer}>
                                <View style={styles.dateTimeRow}>
                                    <FontAwesomeIcon icon={faClock} color={res.getColors().DarkBeige} style={styles.clockIcon} />
                                    <Text style={styles.dateTimeLabel}>OD</Text>
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
                                <View style={styles.dateTimeRow}>
                                    <FontAwesomeIcon icon={faClock} color={res.getColors().DarkBeige} style={styles.clockIcon} />
                                    <Text style={styles.dateTimeLabel}>OD</Text>
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
                            </View>

                            <TextInput
                                multiline
                                style={[styles.textField, { minHeight: 100 }]}
                                readOnly={mode == Mode.Viewing}
                                onChange={e => setWorkingEvent({ ...workingEvent, description: e.nativeEvent.text })}
                                placeholder="Opis"
                                placeholderTextColor={res.getColors().Black}>
                                {workingEvent.description ?? ""}
                            </TextInput>
                        </View>
                    ),
                },
                {
                    enabled: () => workingEvent.place != null,
                    icon: <FontAwesomeIcon icon={faMapPin} />, color: res.getColors().Lime, label: res.getStrings().Dialogs.EventDialog.MeetPlaceLabel, renderPage: (props, index) => (
                        <View key={index} style={styles.meetPlaceContainer}>
                            <LocationInput
                                readonly={mode == Mode.Viewing}
                                iconColor={res.getColors().DarkBeige}
                                style={styles.locationInput}
                                userLocation={userLocation}
                                apiKey={res.getEnv().GOOGLE_MAPS_API_KEY}
                                onLocationChanged={place => setWorkingEvent({ ...workingEvent, place })}
                                location={workingEvent.place ?? {
                                    coords: userLocation,
                                    asText: "Obecna"
                                }} />
                        </View>
                    )
                },
                {
                    enabled: () => workingEvent.wastelands != null && workingEvent.wastelands.length > 0,
                    icon: <FontAwesomeIcon icon={faTrash} />, color: res.getColors().DarkBeige, label: res.getStrings().Dialogs.EventDialog.WastelandsLabel, renderPage: (props, index) => (
                        <View key={index} style={styles.wastelandsContainer}>
                            <Text style={{ fontFamily: res.getFonts().Secondary }}>Co sprzątamy?</Text>

                            {mode == Mode.Adding ? <SearchBar
                                phrase={phrase}
                                placeholder="Szukaj wysypisk"
                                onPhraseChanged={setPhrase} /> : null}

                            <ObjectsList<WisbObjectType.Wasteland, true | false>
                                filter={{activeOnly: true, phrase}}
                                type={WisbObjectType.Wasteland}
                                multiselect={mode == Mode.Adding}
                                selectedItems={([...workingEvent.wastelands?.values() ?? []]).map(it => ({type: WisbObjectType.Wasteland, id: it.id}))}
                                onSelection={selectedItem => {
                                    if (isWasteland(selectedItem)) {
                                        if (workingEvent.wastelands != null && (workingEvent.wastelands ?? []).some(it => it.id == selectedItem.id)) {
                                            setWorkingEvent({
                                                ...workingEvent,
                                                wastelands: workingEvent.wastelands.filter(it => it.id != selectedItem.id)
                                            })
                                        } else {
                                            setWorkingEvent({
                                                ...workingEvent,
                                                wastelands: [
                                                    ...(workingEvent.wastelands ?? []).map(({ id }) => ({ type: WisbObjectType.Wasteland, id } satisfies Ref<WisbObjectType.Wasteland>)),
                                                    { type: WisbObjectType.Wasteland, id: selectedItem.id }
                                                ]
                                            })
                                        }
                                    }
                                }}
                                currentUser={currentUser}
                                googleMapsAPIKey={googleMapsApiKey} />
                        </View>
                    )
                },
                {
                    enabled: () => true,
                    icon: <FontAwesomeIcon icon={faPerson} />, color: res.getColors().Purple, label: res.getStrings().Dialogs.EventDialog.MembersLabel, renderPage: (props, index) => (
                        <View key={index} style={styles.membersContainer}>
                            <Text style={{ fontFamily: res.getFonts().Secondary }}>Zaproś uczestników</Text>

                            {mode == Mode.Adding ? <SearchBar
                                phrase={phrase}
                                placeholder="Szukaj użytkowników"
                                onPhraseChanged={setPhrase} /> : null}

                            <ObjectsList<WisbObjectType.User, true | false>
                                type={WisbObjectType.User}
                                multiselect={mode == Mode.Adding}
                                selectedItems={[...(workingEvent.members?.values() ?? [])].map(it => ({type: WisbObjectType.User, id: it.id}))}
                                onSelection={selectedItem => {
                                    if (isUser(selectedItem)) {
                                        if (workingEvent.members != null && workingEvent.members.has(selectedItem.id.toString())) {
                                            workingEvent.members.delete(selectedItem.id.toString())
                                            setWorkingEvent({...workingEvent})
                                        } else {
                                            workingEvent.members?.set(selectedItem.id.toString(), { type: WisbObjectType.User, id: selectedItem.id, isAdmin: false })
                                            setWorkingEvent({...workingEvent})
                                        }
                                    }
                                }}
                                filter={{phrase}}
                                currentUser={currentUser}
                                googleMapsAPIKey={googleMapsApiKey} />
                        </View>
                    )
                },
                {
                    enabled: () => true,
                    available: mode == Mode.Adding || mode == Mode.Viewing,
                    icon: mode == Mode.Adding ? <FontAwesomeIcon icon={faAdd} /> : <FontAwesomeIcon icon={faShare} />,
                    color: res.getColors().Primary,
                    label: "Dodaj",
                    renderPage: ({ startConfetti, setLoading, currentIndex }, index) => {
                        if (mode == Mode.Adding && !isAdded) {
                            return (
                                <View style={styles.addButtonContainer}>
                                    <TouchableOpacity
                                        style={styles.addButton}
                                        onPress={() => {
                                            if (isEvent({ ...workingEvent, id: -1 })) {
                                                setLoading("Trwa dodawanie")

                                                api.createOne(WisbObjectType.Event, workingEvent as Omit<WisbEvent, "id">).then(async ref => {
                                                    if (ref.data != null) {
                                                        setLoading("Wysyłanie zaproszeń")
                                                        api.sendEventInvitations(ref.data, [...(workingEvent.members?.keys() ?? [])].map(id => ({ type: WisbObjectType.User, id: parseInt(id), asAdmin: false }))).then(() => {
                                                            setLoading(null)
                                                            startConfetti()
                                                            setIsAdded(true)
                                                        })
                                                    }
                                                })
                                            }
                                        }}>
                                        <Text style={styles.addButtonText}>DODAJ</Text>
                                    </TouchableOpacity>
                                </View>
                            )
                        }

                        return (
                            <View key={index} style={styles.sharingContainer}>
                                <Text style={{ fontFamily: res.getFonts().Secondary }}>{res.getStrings().Dialogs.EventDialog.InviteMorePeopleMessage}</Text>

                                <View style={styles.qrCodeContainer}>
                                    <QRCode color={res.getColors().Blue} value={api.getQRCode(workingEvent as WisbEvent)} />
                                </View>

                                <View style={styles.shareButtonContainer}>
                                    <TouchableOpacity
                                        style={styles.shareButton}
                                        onPress={() => {
                                            Share.share({
                                                title: "Share",
                                                message: "Let's clean up planet together!",
                                            }, {tintColor: res.getColors().Primary})
                                                .then((res) => {
                                                    console.log(res);
                                                })
                                                .catch((err) => {
                                                    err && console.log(err);
                                                });
                                        }}>
                                        <Text style={styles.shareButtonText}>Share on Social Media</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )
                    }
                },
            ]} />
    )
}

const styles = StyleSheet.create({
    basicInfoContainer: {
        flex: 1,
        padding: 10
    },
    basicInfoHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        height: 120
    },
    imageInput: {
        height: "100%",
        aspectRatio: 1
    },
    nameContainer: {
        flex: 1,
        justifyContent: "center",
        height: "100%",
        alignItems: "center"
    },
    nameInput: {
        fontSize: 20,
        padding: 2,
        textAlign: "center",
        fontWeight: "500",
        letterSpacing: 1,
        fontStyle: "italic",
        fontFamily: res.getFonts().Secondary,
        backgroundColor: res.getColors().DarkBeige,
        width: "100%",
        marginLeft: 4,
        borderRadius: 15
    },
    createdByText: {
        position: "absolute",
        right: 5,
        bottom: 5,
        fontSize: 12,
        fontFamily: res.getFonts().Secondary
    },
    dateTimeContainer: {
        flexDirection: "column",
        justifyContent: "space-around",
        marginTop: 10
    },
    dateTimeRow: {
        justifyContent: "space-around",
        flexDirection: "row",
        alignItems: "center",
        marginTop: 5
    },
    clockIcon: {
        flex: 1
    },
    dateTimeLabel: {
        fontSize: 12,
        fontFamily: res.getFonts().Secondary,
        marginTop: 3,
        marginLeft: 10
    },
    textField: {
        overflow: "hidden",
        marginTop: 10,
        backgroundColor: res.getColors().Beige,
        padding: 5,
        borderRadius: 15,
        fontWeight: "400",
        fontFamily: res.getFonts().Secondary,
        letterSpacing: 2
    },
    meetPlaceContainer: {
        flex: 1,
        padding: 15
    },
    locationInput: {
        width: "100%",
        height: 300
    },
    wastelandsContainer: {
        flex: 1,
        minHeight: 50
    },
    membersContainer: {
        flex: 1
    },
    addButtonContainer: {
        justifyContent: "center",
        alignItems: "center",
        flex: 1
    },
    addButton: {
        padding: 10,
        borderRadius: 15,
        backgroundColor: res.getColors().Beige
    },
    addButtonText: {
        fontWeight: "bold",
        fontSize: 25,
        color: res.getColors().Primary,
        fontFamily: res.getFonts().Secondary
    },
    sharingContainer: {
        flex: 1
    },
    qrCodeContainer: {
        justifyContent: "center",
        alignItems: "center",
        flex: 2
    },
    shareButtonContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    shareButton: {
        backgroundColor: res.getColors().DarkBeige,
        padding: 20,
        borderRadius: 15
    },
    shareButtonText: {
        fontFamily: res.getFonts().Secondary,
        color: "white",
        fontWeight: "600",
        letterSpacing: 1,
        fontSize: 15
    }
});
