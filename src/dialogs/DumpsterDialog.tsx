import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import WisbDialog, { Mode } from "./WisbDialog";
import { faGripLines, faMapPin, faTrash, faEdit, faImage } from "@fortawesome/free-solid-svg-icons";
import { Dimensions, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Resources from "../../res/Resources";
import LocationInput from "../components/LocationInput";
import { LatLng } from "react-native-maps";
import IconType from "../components/WisbIcon/IconType";
import ImagesGallery from "../components/ImagesGallery";
import React from "react";
import Spinner from "react-native-spinkit";
import getAPI from "../API/getAPI";
import { WisbDumpster, WisbUser } from "../API/interfaces";
import WisbObjectType from "../API/WisbObjectType";
import { isDumpster } from "../API/type_guards";

const res = Resources.get()

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

    return (
        <WisbDialog
            visible={visible}
            mainIcon={IconType.Dumpster}
            mode={mode}
            onDismiss={onDismiss}
            sectionsOrder={[Sections.Location, Sections.BasicInfo, Sections.Photos]}
            moreActions={mode == Mode.Viewing && isDumpster(workingDumpster) && (workingDumpster?.addedBy.id == currentUser.id ?? false) ? [
                {
                    label: res.getStrings().Dialogs.DumpsterDialog.DeleteAction,
                    icon: <FontAwesomeIcon icon={faTrash} />,
                    color: res.getColors().Red,
                    onPress: () => api.deleteOne({ type: WisbObjectType.Dumpster, id: workingDumpster.id }),
                },
                {
                    label: res.getStrings().Dialogs.DumpsterDialog.EditAction,
                    icon: <FontAwesomeIcon icon={faEdit} />,
                    color: res.getColors().White,
                    onPress: () => { }
                }
            ] : undefined}
            sections={{
                [Sections.Location]: {
                    enabled: () => workingDumpster.place != null,
                    icon: <FontAwesomeIcon icon={faMapPin} />, color: res.getColors().Green, name: res.getStrings().Dialogs.DumpsterDialog.LocationLabel, renderPage: (props, index) => (
                        <View key={index} style={{ flex: 1, padding: 15 }}>
                            <LocationInput
                                readonly={mode == Mode.Viewing}
                                style={{ flex: 1, height: 300 }}
                                apiKey={res.getEnv().GOOGLE_MAPS_API_KEY}
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
                    icon: <FontAwesomeIcon icon={faGripLines} />, color: res.getColors().Yellow, name: res.getStrings().Dialogs.DumpsterDialog.BasicDataLabel, renderPage: (props, index) => (
                        <View key={index} style={{ flex: 1, padding: 10 }}>
                            <View>
                                <Text style={{ fontWeight: "bold" }}>Opis</Text>

                                <TextInput
                                    placeholder="Opis"
                                    multiline
                                    readOnly={mode == Mode.Viewing}
                                    onChange={e => setWorkingDumpster({ ...workingDumpster, description: e.nativeEvent.text })}
                                    value={workingDumpster.description ?? ""}
                                    style={{ backgroundColor: res.getColors().Beige, padding: 5, minHeight: 100, borderRadius: 15, fontWeight: 400, fontFamily: "Avenir", letterSpacing: 2 }} />
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
                    color: res.getColors().Yellow,
                    name: "Zdjęcia",
                    renderPage: ({ block, startConfetti, setLoading }, index) => {
                        return (
                            <View>
                                <View key={index} style={{ flex: 1, padding: 10 }}>
                                    <Text style={{ fontWeight: "bold" }}>
                                        Zdjęcia
                                    </Text>

                                    <ImagesGallery
                                        images={workingDumpster.photos ?? []}
                                        rowWidth={Dimensions.get("window").width * 0.9}
                                        interImagesSpace={5}
                                        style={{ width: "100%" }}
                                        onAddRequest={() => { }}
                                        onRemoveRequest={() => { }}
                                        nrOfImagesPerRow={4} />


                                </View>
                                <TouchableOpacity onPress={() => {
                                    if (isDumpster({ ...workingDumpster, id: -1 })) {
                                        setLoading("Trwa dodawanie")

                                        api.createOne(WisbObjectType.Dumpster, workingDumpster as Omit<WisbDumpster, "id">).then(async ref => {
                                            setLoading(null)
                                        })
                                    }
                                }}>
                                    <Text>DODAJ</Text>
                                </TouchableOpacity>
                            </View>
                        )
                    }
                },
            }} />
    )
}

const styles = StyleSheet.create({

})