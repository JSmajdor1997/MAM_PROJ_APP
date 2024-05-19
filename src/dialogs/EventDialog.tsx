import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { IconType } from "../components/WisbIcon";
import WisbDialog, { Mode } from "./WisbDialog";
import { faGripLines, faMapPin, faTrash, faPerson, faShare, faClose, faAdd, faEdit, faMessage } from "@fortawesome/free-solid-svg-icons";
import { Text, TextInput, View } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { Resources } from "../../res/Resources";
import LocationInput from "../components/LocationInput";
import FAB from "../components/FAB";
import { faFacebookF, faInstagram, faTwitter } from "@fortawesome/free-brands-svg-icons";
import { LatLng } from "react-native-maps";

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
    return (
        <WisbDialog
            visible={visible}
            mainIcon={IconType.Calendar}
            mode={mode}
            moreActions={[
                {
                    label: Resources.Strings.get().Dialogs.EventDialog.DeleteAction,
                    icon: <FontAwesomeIcon icon={faTrash} />,
                    color: Resources.Colors.Red,
                    onPress: () => { }
                },
                {
                    label: Resources.Strings.get().Dialogs.EventDialog.EditAction,
                    icon: <FontAwesomeIcon icon={faEdit} />,
                    color: Resources.Colors.White,
                    onPress: () => { }
                }
            ]}
            actions={[
                {
                    label: Resources.Strings.get().Dialogs.EventDialog.JoinAction,
                    icon: <FontAwesomeIcon icon={faAdd} />,
                    color: Resources.Colors.Yellow,
                    onPress: () => { },
                },
                {
                    label: Resources.Strings.get().Dialogs.EventDialog.ShareAction,
                    icon: <FontAwesomeIcon icon={faShare} />,
                    color: Resources.Colors.Blue,
                    onPress: () => { },
                },
                {
                    label: Resources.Strings.get().Dialogs.EventDialog.LeaveAction,
                    icon: <FontAwesomeIcon icon={faClose} />,
                    color: Resources.Colors.Lime,
                    onPress: () => { },
                },
                {
                    label: Resources.Strings.get().Dialogs.EventDialog.OpenChatAction,
                    icon: <FontAwesomeIcon icon={faMessage} />,
                    color: Resources.Colors.OceanBlue,
                    onPress: () => { },
                }
            ]}
            onDismiss={onDismiss}
            sectionsOrder={[Sections.BasicInfo, Sections.MeetPlace, Sections.Wastelands, Sections.Members, Sections.Sharing]}
            sections={{
                [Sections.BasicInfo]: {
                    icon: <FontAwesomeIcon icon={faGripLines} />, color: Resources.Colors.Yellow, name: "Podstawowe informacje", renderPage: () => (
                        <View style={{ flex: 1, padding: 10 }}>
                            <View style={{ borderRadius: 10, backgroundColor: Resources.Colors.Black, width: "30%", aspectRatio: 1 }} />
                            <Text style={{ fontSize: 16, fontWeight: "bold" }}>NAZWA</Text>

                            <View>
                                <Text style={{ fontSize: 16, fontWeight: "bold" }}>czas od</Text>
                                <Text style={{ fontSize: 16, fontWeight: "bold" }}>czas do</Text>
                            </View>

                            <View>
                                <Text style={{ fontSize: 16, fontWeight: "bold" }}>stworzone przez</Text>
                            </View>

                            <TextInput multiline>
                                Opis
                            </TextInput>
                        </View>
                    )
                },
                [Sections.MeetPlace]: {
                    icon: <FontAwesomeIcon icon={faMapPin} />, color: Resources.Colors.Lime, name: Resources.Strings.get().Dialogs.EventDialog.MeetPlaceLabel, renderPage: () => (
                        <View style={{ flex: 1, padding: 15 }}>
                            <LocationInput
                                readonly
                                style={{ flex: 1 }}
                                userLocation={userLocation}
                                apiKey={Resources.Env.GOOGLE_MAPS_API_KEY}
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
                    icon: <FontAwesomeIcon icon={faTrash} />, color: Resources.Colors.DarkBeige, name: Resources.Strings.get().Dialogs.EventDialog.WastelandsLabel, renderPage: () => (
                        <View style={{ flex: 1 }}>
                            <Text>LISTA ŚMIETNISK</Text>
                        </View>
                    )
                },
                [Sections.Members]: {
                    icon: <FontAwesomeIcon icon={faPerson} />, color: Resources.Colors.Purple, name: Resources.Strings.get().Dialogs.EventDialog.MembersLabel, renderPage: () => (
                        <View style={{ flex: 1 }}>
                            <Text>LISTA UCZESTNIKÓW + ADMIN</Text>
                        </View>
                    )
                },
                [Sections.Sharing]: {
                    icon: <FontAwesomeIcon icon={faShare} />, color: Resources.Colors.OceanBlue, name: Resources.Strings.get().Dialogs.EventDialog.ShareAction, renderPage: (props) => {
                        if (props.currentIndex == Sections.Sharing) {
                            props.startConfetti()
                        }

                        return (
                            <View style={{ flex: 1 }}>
                                <Text>{Resources.Strings.get().Dialogs.EventDialog.ThatsAllMessage}</Text>
                                <Text>{Resources.Strings.get().Dialogs.EventDialog.InviteMorePeopleMessage}</Text>
                                <FAB
                                    size={45}
                                    color={Resources.Colors.Blue}
                                    onPress={() => { }}
                                    icon={
                                        <FontAwesomeIcon icon={faFacebookF} color={Resources.Colors.White} size={16} />
                                    } />
                                <FAB
                                    size={45}
                                    color={Resources.Colors.Blue}
                                    onPress={() => { }}
                                    icon={
                                        <FontAwesomeIcon icon={faInstagram} color={Resources.Colors.White} size={16} />
                                    } />
                                <FAB
                                    size={45}
                                    color={Resources.Colors.Blue}
                                    onPress={() => { }}
                                    icon={
                                        <FontAwesomeIcon icon={faTwitter} color={Resources.Colors.White} size={16} />
                                    } />
                                <Text>{Resources.Strings.get().Dialogs.EventDialog.OpenChatAction}</Text>
                                <QRCode value="AAA123" />
                            </View>
                        )
                    }
                },
            }} />
    )
}