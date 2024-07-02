import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import WisbDialog, { Mode } from "./WisbDialog";
import { faGripLines, faMapPin, faTrash, faPerson, faShare, faEdit } from "@fortawesome/free-solid-svg-icons";
import { StyleSheet, Text, TextInput, View } from "react-native";
import Resources from "../../res/Resources";
import LocationInput from "../components/LocationInput";
import { LatLng } from "react-native-maps";
import IconType from "../components/WisbIcon/IconType";
import WisbIcon from "../components/WisbIcon/WisbIcon";
import ImagesGallery from "../components/ImagesGallery";
import Dumpster from "../API/data_types/Dumpster";
import React from "react";
import User from "../API/data_types/User";

enum Sections {
    BasicInfo,
    Location,
    Photos
}

export interface Props {
    dumpster?: Dumpster
    mode: Mode
    onDismiss(): void
    onAdd?: (dumpster: Dumpster) => void
    visible: boolean
    userLocation: LatLng
    currentUser: User
}

export default function DumpsterDialog({ mode, dumpster, onDismiss, onAdd, visible, userLocation, currentUser }: Props) {
    const [workingDumpster, setWorkingDumpster] = React.useState<Partial<Dumpster>>(dumpster ?? {})

    return (
        <WisbDialog
            visible={visible}
            mainIcon={IconType.Dumpster}
            mode={mode}
            onDismiss={onDismiss}
            sectionsOrder={[Sections.Location, Sections.BasicInfo, Sections.Photos]}
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
                [Sections.Location]: {
                    enabled: () => workingDumpster.place != null,
                    icon: <FontAwesomeIcon icon={faMapPin} />, color: Resources.get().getColors().Green, name: Resources.get().getStrings().Dialogs.DumpsterDialog.LocationLabel, renderPage: (props, index) => (
                        <View key={index} style={{ flex: 1, padding: 15 }}>
                            <LocationInput
                                readonly
                                style={{ flex: 1, height: 300 }}
                                apiKey={Resources.get().getEnv().GOOGLE_MAPS_API_KEY}
                                userLocation={userLocation}
                                location={{
                                    coords: workingDumpster.place?.coords ?? userLocation,
                                    asText: "Jakaś lokalizacja"
                                }} />
                        </View>
                    )
                },
                [Sections.BasicInfo]: {
                    enabled: () => workingDumpster.description != null && workingDumpster.description.length > 0,
                    icon: <FontAwesomeIcon icon={faGripLines} />, color: Resources.get().getColors().Yellow, name: Resources.get().getStrings().Dialogs.DumpsterDialog.BasicDataLabel, renderPage: (props, index) => (
                        <View key={index} style={{ flex: 1, padding: 10 }}>
                            <View>
                                <Text style={{ fontWeight: "bold" }}>Opis</Text>

                                <TextInput placeholder="Opis" multiline style={{ backgroundColor: Resources.get().getColors().Beige, padding: 5, minHeight: 100, borderRadius: 15, fontWeight: 400, fontFamily: "Avenir", letterSpacing: 2 }}>
                                    Opis
                                </TextInput>
                            </View>

                            <View style={{ marginTop: 10, flexDirection: "row", justifyContent: "space-between" }}>
                                <Text style={{ fontWeight: "bold" }}>Dodane przez</Text>
                                <Text style={{}}>{currentUser.userName}</Text>
                            </View>
                        </View>
                    )
                },
                [Sections.Photos]: {
                    enabled: () => workingDumpster.photos != null && workingDumpster.photos.length > 0,
                    icon: <FontAwesomeIcon icon={faGripLines} />, color: Resources.get().getColors().Yellow, name: Resources.get().getStrings().Dialogs.DumpsterDialog.BasicDataLabel, renderPage: (props, index) => (
                        <View key={index} style={{ flex: 1, padding: 10 }}>
                            <Text style={{ fontWeight: "bold" }}>
                                Zdjęcia
                            </Text>

                            <ImagesGallery
                                images={workingDumpster.photos ?? []}
                                interImagesSpace={5}
                                style={{ width: "100%" }}
                                onAddRequest={() => { }}
                                onRemoveRequest={() => { }}
                                nrOfImagesPerRow={4} />
                        </View>
                    )
                },
            }} />
    )
}

const styles = StyleSheet.create({

})