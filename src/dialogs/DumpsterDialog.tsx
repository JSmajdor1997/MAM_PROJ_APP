import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { IconType } from "../components/WisbIcon";
import WisbDialog, { Mode } from "./WisbDialog";
import { faGripLines, faMapPin, faTrash, faPerson, faShare, faEdit } from "@fortawesome/free-solid-svg-icons";
import { Text, TextInput, View } from "react-native";
import Resources from "../../res/Resources";
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
                    label: Resources.get().getStrings().Dialogs.DumpsterDialog.DeleteAction,
                    icon: <FontAwesomeIcon icon={faTrash} />,
                    color: Resources.get().getColors().Red,
                    onPress: () => { }
                },
                {
                    label: Resources.get().getStrings().Dialogs.DumpsterDialog.EditAction,
                    icon: <FontAwesomeIcon icon={faEdit} />,
                    color: Resources.get().getColors().White,
                    onPress: () => { }
                }
            ]}
            sections={{
                [Sections.BasicInfo]: {
                    icon: <FontAwesomeIcon icon={faGripLines} />, color: Resources.get().getColors().Yellow, name: Resources.get().getStrings().Dialogs.DumpsterDialog.BasicDataLabel, renderPage: (props) => (
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
                    icon: <FontAwesomeIcon icon={faMapPin} />, color: Resources.get().getColors().Green, name: Resources.get().getStrings().Dialogs.DumpsterDialog.LocationLabel, renderPage: (props) => (
                        <View style={{ flex: 1, padding: 15 }}>
                            <LocationInput
                                readonly
                                style={{ flex: 1 }}
                                apiKey={Resources.get().getEnv().GOOGLE_MAPS_API_KEY}
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