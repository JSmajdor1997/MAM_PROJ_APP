import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { IconType } from "../components/WisbIcon";
import WisbDialog, { Mode } from "./WisbDialog";
import { faGripLines, faMapPin, faTrash, faPerson, faShare, faClose, faAdd, faEdit, faMessage } from "@fortawesome/free-solid-svg-icons";
import { Text, TextInput, View } from "react-native";
import QRCode from "react-native-qrcode-svg";
import ShareButton, { ShareDestination } from "../components/ShareButton";
import { Resources } from "../../res/Resources";
import LocationInput from "../components/LocationInput";

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
}

export default function EventDialog({ mode, event, onDismiss, onAdd, visible }: Props) {
    return (
        <WisbDialog
            visible={visible}
            mainIcon={IconType.Calendar}
            mode={mode}
            moreActions={[
                {
                    label: "Usuń",
                    icon: <FontAwesomeIcon icon={faTrash} />,
                    color: "#c74926",
                    onPress: () => { }
                },
                {
                    label: "Edytuj",
                    icon: <FontAwesomeIcon icon={faEdit} />,
                    color: "#FFFFFF",
                    onPress: () => { }
                }
            ]}
            actions={[
                {
                    label: "Join",
                    icon: <FontAwesomeIcon icon={faAdd} />,
                    color: "#ded264",
                    onPress: () => { },
                },
                {
                    label: "Share",
                    icon: <FontAwesomeIcon icon={faShare} />,
                    color: "#2c81a3",
                    onPress: () => { },
                },
                {
                    label: "Leave",
                    icon: <FontAwesomeIcon icon={faClose} />,
                    color: "#cde340",
                    onPress: () => { },
                },
                {
                    label: "Open chat",
                    icon: <FontAwesomeIcon icon={faMessage} />,
                    color: "#41b9e8",
                    onPress: () => { },
                }
            ]}
            onDismiss={onDismiss}
            sectionsOrder={[Sections.BasicInfo, Sections.MeetPlace, Sections.Wastelands, Sections.Members, Sections.Sharing]}
            sections={{
                [Sections.BasicInfo]: {
                    icon: <FontAwesomeIcon icon={faGripLines} />, color: "#fcfa6a", name: "Podstawowe informacje", renderPage: () => (
                        <View style={{ flex: 1, padding: 10 }}>
                            <View style={{ borderRadius: 10, backgroundColor: "black", width: "30%", aspectRatio: 1 }} />
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
                    icon: <FontAwesomeIcon icon={faMapPin} />, color: "#8ae364", name: "Miejsce spotkania", renderPage: () => (
                        <View style={{ flex: 1, padding: 15 }}>
                            <LocationInput
                                readonly
                                style={{ flex: 1 }}
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
                    icon: <FontAwesomeIcon icon={faTrash} />, color: "#73d0e6", name: "Wysypiska", renderPage: () => (
                        <View style={{ flex: 1 }}>
                            <Text>LISTA ŚMIETNISK</Text>
                        </View>
                    )
                },
                [Sections.Members]: {
                    icon: <FontAwesomeIcon icon={faPerson} />, color: "#4b57c9", name: "Uczestnicy", renderPage: () => (
                        <View style={{ flex: 1 }}>
                            <Text>LISTA UCZESTNIKÓW + ADMIN</Text>
                        </View>
                    )
                },
                [Sections.Sharing]: {
                    icon: <FontAwesomeIcon icon={faShare} />, color: "#8d39a8", name: "Udostępnij", renderPage: (props) => {
                        if (props.currentIndex == Sections.Sharing) {
                            props.startConfetti()
                        }

                        return (
                            <View style={{ flex: 1 }}>
                                <Text>TO WSZYSTKO!</Text>
                                <Text>zaproś więcej osób!</Text>
                                <ShareButton destination={ShareDestination.Facebook} onPress={() => { }} />
                                <ShareButton destination={ShareDestination.Instagram} onPress={() => { }} />
                                <ShareButton destination={ShareDestination.Twitter} onPress={() => { }} />
                                <Text>Przejdź do chatu</Text>
                                <QRCode value="AAA123" />
                            </View>
                        )
                    }
                },
            }} />
    )
}