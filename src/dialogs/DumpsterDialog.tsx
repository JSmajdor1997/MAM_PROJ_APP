import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { IconType } from "../components/WisbIcon";
import WisbDialog, { Mode } from "./WisbDialog";
import { faGripLines, faMapPin, faTrash, faPerson, faShare, faEdit } from "@fortawesome/free-solid-svg-icons";
import { Text, TextInput, View } from "react-native";
import { Resources } from "../../res/Resources";
import LocationInput from "../components/LocationInput";
import { LatLng } from "react-native-maps";

enum Sections {
    BasicInfo,
    Location
}

export interface Props {
    event?: Event
    mode: Mode
    onDismiss(): void
    onAdd?: (event: Event) => void
    visible: boolean
    userLocation: LatLng
}

export default function DumpsterDialog({ mode, event, onDismiss, onAdd, visible, userLocation }: Props) {
    return (
        <WisbDialog<Sections>
            visible={visible}
            mainIcon={IconType.Dumpster}
            mode={mode}
            onDismiss={onDismiss}
            sectionsOrder={[Sections.BasicInfo, Sections.Location]}
            moreActions={[
                {
                    label: "Usuń",
                    icon: <FontAwesomeIcon icon={faTrash} />,
                    color: Resources.Colors.Red,
                    onPress: () => { }
                },
                {
                    label: "Edytuj",
                    icon: <FontAwesomeIcon icon={faEdit} />,
                    color: Resources.Colors.White,
                    onPress: () => { }
                }
            ]}
            sections={{
                [Sections.BasicInfo]: {
                    icon: <FontAwesomeIcon icon={faGripLines} />, color: Resources.Colors.Yellow, name: "Podstawowe informacje", renderPage: (props) => (
                        <View style={{ flex: 1, padding: 10 }}>
                            <View>
                                <Text style={{ fontSize: 16, fontWeight: "bold" }}>stworzone przez</Text>
                            </View>

                            <TextInput multiline>
                                Opis
                            </TextInput>

                            <TextInput multiline>
                                Zdjęcia
                            </TextInput>
                        </View>
                    )
                },
                [Sections.Location]: {
                    icon: <FontAwesomeIcon icon={faMapPin} />, color: Resources.Colors.Green, name: "Lokalizacja", renderPage: (props) => (
                        <View style={{ flex: 1, padding: 15 }}>
                            <LocationInput
                                readonly
                                style={{ flex: 1 }}
                                apiKey={Resources.Env.GOOGLE_MAPS_API_KEY}
                                userLocation={userLocation}
                                location={{
                                    coords: {
                                        latitude: 51.246452,
                                        longitude: 22.568445
                                    },
                                    asText: "Jakaś lokalizacja"
                                }} />
                        </View>
                    )
                }
            }} />
    )
}