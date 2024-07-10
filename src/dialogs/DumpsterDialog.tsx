import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import WisbDialog, { AddingPhases, Mode } from "./WisbDialog";
import { faGripLines, faMapPin, faTrash, faPerson, faShare, faEdit, faImage } from "@fortawesome/free-solid-svg-icons";
import { Share, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Resources from "../../res/Resources";
import LocationInput from "../components/LocationInput";
import { LatLng } from "react-native-maps";
import IconType from "../components/WisbIcon/IconType";
import WisbIcon from "../components/WisbIcon/WisbIcon";
import ImagesGallery from "../components/ImagesGallery";
import React from "react";
import QRCode from "react-native-qrcode-svg";
import Spinner from "react-native-spinkit";
import getAPI from "../API/getAPI";
import { WisbDumpster, WisbUser } from "../API/interfaces";
import WisbObjectType from "../API/WisbObjectType";

enum Sections {
    BasicInfo,
    Location,
    Photos
}

export interface Props {
    dumpster?: WisbDumpster
    mode: Mode
    onDismiss(): void
    onAdd?: (dumpster: WisbDumpster) => void
    visible: boolean
    userLocation: LatLng
    currentUser: WisbUser
}

const api = getAPI()

export default function DumpsterDialog({ mode, dumpster, onDismiss, onAdd, visible, userLocation, currentUser }: Props) {
    const [workingDumpster, setWorkingDumpster] = React.useState<Partial<WisbDumpster>>(dumpster ?? {})

    const [addingPhase, setAddingPhase] = React.useState(AddingPhases.None)

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
                                readonly={mode == Mode.Viewing}
                                style={{ flex: 1, height: 300 }}
                                apiKey={Resources.get().getEnv().GOOGLE_MAPS_API_KEY}
                                userLocation={userLocation}
                                onLocationChanged={(latLng, asText) => setWorkingDumpster({ ...workingDumpster, place: { coords: latLng, asText } })}
                                location={workingDumpster.place ?? {
                                    coords: userLocation,
                                    asText: "Obecna"
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

                                <TextInput
                                    placeholder="Opis"
                                    multiline
                                    readOnly={mode == Mode.Viewing}
                                    onChange={e => setWorkingDumpster({ ...workingDumpster, description: e.nativeEvent.text })}
                                    value={workingDumpster.description ?? ""}
                                    style={{ backgroundColor: Resources.get().getColors().Beige, padding: 5, minHeight: 100, borderRadius: 15, fontWeight: 400, fontFamily: "Avenir", letterSpacing: 2 }} />
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
                    icon: <FontAwesomeIcon icon={faImage} />,
                    color: Resources.get().getColors().Yellow,
                    name: "Zdjęcia",
                    renderPage: (props, index) => {
                        if (mode == Mode.Adding) {
                            if (props.currentIndex == Sections.Photos && addingPhase == AddingPhases.Added) {
                                props.startConfetti()
                            }

                            if (addingPhase == AddingPhases.None) {
                                return (
                                    <View>
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
                                        <TouchableOpacity onPress={() => {
                                            setAddingPhase(AddingPhases.Adding)
                                            api.createOne(WisbObjectType.Dumpster, workingDumpster as WisbDumpster).then(() => {
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
                                <Text>:) to już wszystko</Text>
                            </View>
                        )
                    }
                },
            }} />
    )
}

const styles = StyleSheet.create({

})