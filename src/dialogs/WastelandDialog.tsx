import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import WisbDialog, { AddingPhases, Mode } from "./WisbDialog";
import { faGripLines, faMapPin, faTrash, faPerson, faShare, faLocationArrow, faCalendar, faClose, faBroom, faEdit } from "@fortawesome/free-solid-svg-icons";
import { StyleSheet, Text, TextInput, View } from "react-native";
import MapView, { LatLng } from "react-native-maps";
import Resources from "../../res/Resources";
import ImagesGallery from "../components/ImagesGallery";
import LocationInput from "../components/LocationInput";
import IconType from "../components/WisbIcon/IconType";
import React from "react";
import { WisbWasteland, WisbUser } from "../API/interfaces";

const res = Resources.get()

enum Sections {
    BasicInfo,
    BeforeCleaningPhotos,
    AfterCleaningPhotos,
}

export interface Props {
    wasteland?: WisbWasteland
    mode: Mode
    onDismiss(): void
    onAdd?: (wasteland: WisbWasteland) => void
    visible: boolean
    userLocation: LatLng
    currentUser: WisbUser
}

export default function WastelandDialog({ mode, wasteland, onDismiss, onAdd, visible, userLocation, currentUser }: Props) {
    const [workingWasteland, setWorkingWasteland] = React.useState<Partial<WisbWasteland>>(wasteland ?? {})

    const [addingPhase, setAddingPhase] = React.useState(AddingPhases.None)

    return (
        <WisbDialog
            visible={visible}
            mainIcon={IconType.WastelandIcon}
            mode={mode}
            onDismiss={onDismiss}
            moreActions={[
                {
                    label: res.getStrings().Dialogs.WastelandDialog.EditAction,
                    icon: <FontAwesomeIcon icon={faEdit} />,
                    color: res.getColors().White,
                    onPress: () => { }
                }
            ]}
            actions={[
                {
                    label: res.getStrings().Dialogs.WastelandDialog.CleanAction,
                    icon: <FontAwesomeIcon icon={faBroom} />,
                    color: res.getColors().Primary,
                    onPress: (startConfetti) => { startConfetti() },
                },
                {
                    label: res.getStrings().Dialogs.WastelandDialog.ShareAction,
                    icon: <FontAwesomeIcon icon={faShare} />,
                    color: res.getColors().Blue,
                    onPress: () => { },
                },
                {
                    label: res.getStrings().Dialogs.WastelandDialog.CreateEventAction,
                    icon: <FontAwesomeIcon icon={faCalendar} />,
                    color: res.getColors().Lime,
                    onPress: () => { },
                }
            ]}
            sectionsOrder={[Sections.BasicInfo, Sections.BeforeCleaningPhotos, Sections.AfterCleaningPhotos]}
            sections={{
                [Sections.BasicInfo]: {
                    enabled: () => workingWasteland.place != null && workingWasteland.description != null && workingWasteland.description.length > 0,
                    icon: <FontAwesomeIcon icon={faGripLines} />, color: res.getColors().Yellow, name: res.getStrings().Dialogs.WastelandDialog.BasicDataLabel, renderPage: (props, index) => (
                        <View key={index} style={{ flex: 1, margin: 5 }}>
                            <View style={{ flex: 1, padding: 10 }}>
                                <LocationInput
                                    readonly={mode == Mode.Viewing}
                                    style={{ width: "100%", height: 200 }}
                                    apiKey={res.getEnv().GOOGLE_MAPS_API_KEY}
                                    userLocation={userLocation}
                                    onLocationChanged={(latLng, asText) => setWorkingWasteland({ ...workingWasteland, place: { coords: latLng, asText } })}
                                    location={workingWasteland.place ?? {
                                        coords: userLocation,
                                        asText: "Obecna"
                                    }} />
                            </View>

                            <View style={{ flexDirection: "row", padding: 10, justifyContent: "space-between" }}>
                                <FontAwesomeIcon icon={faCalendar} size={15} />
                                <View style={{ flexDirection: "row" }}>
                                    <Text style={{ fontStyle: "italic", letterSpacing: 1 }}>{res.getStrings().Dialogs.WastelandDialog.ReportedLabel}</Text>
                                    <Text style={{ fontStyle: "italic", letterSpacing: 1, marginLeft: 5, fontWeight: "bold" }}>{(workingWasteland.creationDate ?? new Date()).toLocaleDateString(res.getLocale(), { year: "numeric", month: "2-digit", day: "2-digit" })}</Text>
                                    <Text style={{ fontStyle: "italic", letterSpacing: 1, marginLeft: 5 }}>{res.getStrings().Dialogs.WastelandDialog.ByLabel}</Text>
                                    <Text style={{ fontStyle: "italic", letterSpacing: 1, marginLeft: 5, fontWeight: "bold" }}>{workingWasteland.reportedBy?.userName ?? currentUser.userName}</Text>
                                </View>
                            </View>

                            <View>
                                <Text style={{ fontWeight: "bold" }}>Opis</Text>
                                <TextInput
                                    placeholder="Opis"
                                    readOnly={mode == Mode.Viewing}
                                    value={workingWasteland.description ?? ""}
                                    onChange={e => setWorkingWasteland({
                                        ...workingWasteland,
                                        description: e.nativeEvent.text
                                    })}
                                    multiline
                                    style={{ backgroundColor: res.getColors().Beige, padding: 5, minHeight: 100, borderRadius: 15, fontWeight: 400, fontFamily: "Avenir", letterSpacing: 2 }} />
                            </View>
                        </View>
                    )
                },
                [Sections.BeforeCleaningPhotos]: {
                    enabled: () => workingWasteland.photos != null && workingWasteland.photos.length > 0,
                    icon: <FontAwesomeIcon icon={faTrash} />, color: res.getColors().Lime, name: res.getStrings().Dialogs.WastelandDialog.PhotosBeforeCleaningLabel, renderPage: (props, index) => (
                        <View key={index} style={{ flex: 1, padding: 15 }}>
                            <Text style={{ fontWeight: "bold" }}>Zdjęcia z przed sprzątnięcia</Text>
                            <ImagesGallery
                                images={workingWasteland.photos ?? []}
                                nrOfImagesPerRow={3}
                                interImagesSpace={5}
                                onAddRequest={() => { }}
                                onRemoveRequest={() => { }}
                                style={{
                                    flex: 1
                                }} />
                        </View>
                    )
                },
                [Sections.AfterCleaningPhotos]: {
                    enabled: () => workingWasteland.afterCleaningData != null && workingWasteland.afterCleaningData.photos.length > 0,
                    icon: <FontAwesomeIcon icon={faBroom} />, color: res.getColors().DarkBeige, name: res.getStrings().Dialogs.WastelandDialog.PhotosAfterCleaningLabel, renderPage: ({ shake, startConfetti }, index) => (
                        <View key={index} style={{ flex: 1 }}>
                            <View style={{
                                width: "100%",
                                marginTop: 40
                            }}>
                                <Text style={{ fontWeight: "bold" }}>{res.getStrings().Dialogs.WastelandDialog.PhotosAfterCleaningByLabel} Mariusz1997</Text>
                                <ImagesGallery
                                    images={workingWasteland.afterCleaningData?.photos ?? []}
                                    nrOfImagesPerRow={3}
                                    interImagesSpace={5}
                                    style={{
                                        flex: 1
                                    }} />
                            </View>
                        </View>
                    )
                },
            }} />
    )
}

const styles = StyleSheet.create({

})