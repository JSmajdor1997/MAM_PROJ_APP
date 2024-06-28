import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import WisbDialog, { Mode } from "./WisbDialog";
import { faGripLines, faMapPin, faTrash, faPerson, faShare, faLocationArrow, faCalendar, faClose, faBroom, faEdit } from "@fortawesome/free-solid-svg-icons";
import { StyleSheet, Text, TextInput, View } from "react-native";
import MapView, { LatLng } from "react-native-maps";
import Resources from "../../res/Resources";
import FAB from "../components/FAB";
import ImagesGallery from "../components/ImagesGallery";
import LocationInput from "../components/LocationInput";
import IconType from "../components/WisbIcon/IconType";
import WisbIcon from "../components/WisbIcon/WisbIcon";
import Wasteland from "../API/data_types/Wasteland";

enum Sections {
    BasicInfo,
    BeforeCleaningPhotos,
    AfterCleaningPhotos,
}

export interface Props {
    wasteland?: Wasteland
    mode: Mode
    onDismiss(): void
    onAdd?: (wasteland: Wasteland) => void
    visible: boolean
    userLocation: LatLng
}

export default function WastelandDialog({ mode, wasteland, onDismiss, onAdd, visible, userLocation }: Props) {
    return (
        <WisbDialog
            visible={visible}
            mainIcon={IconType.WastelandIcon}
            mode={mode}
            onDismiss={onDismiss}
            moreActions={[
                {
                    label: Resources.get().getStrings().Dialogs.WastelandDialog.DeleteAction,
                    icon: <FontAwesomeIcon icon={faTrash} />,
                    color: Resources.get().getColors().Red,
                    onPress: () => { }
                },
                {
                    label: Resources.get().getStrings().Dialogs.WastelandDialog.EditAction,
                    icon: <FontAwesomeIcon icon={faEdit} />,
                    color: Resources.get().getColors().White,
                    onPress: () => { }
                }
            ]}
            actions={[
                {
                    label: Resources.get().getStrings().Dialogs.WastelandDialog.CleanAction,
                    icon: <FontAwesomeIcon icon={faBroom} />,
                    color: Resources.get().getColors().Primary,
                    onPress: (startConfetti) => { startConfetti()},
                },
                {
                    label: Resources.get().getStrings().Dialogs.WastelandDialog.ShareAction,
                    icon: <FontAwesomeIcon icon={faShare} />,
                    color: Resources.get().getColors().Blue,
                    onPress: () => { },
                },
                {
                    label: Resources.get().getStrings().Dialogs.WastelandDialog.CreateEventAction,
                    icon: <FontAwesomeIcon icon={faCalendar} />,
                    color: Resources.get().getColors().Lime,
                    onPress: () => { },
                }
            ]}
            sectionsOrder={[Sections.BasicInfo, Sections.BeforeCleaningPhotos, Sections.AfterCleaningPhotos]}
            sections={{
                [Sections.BasicInfo]: {
                    icon: <FontAwesomeIcon icon={faGripLines} />, color: Resources.get().getColors().Yellow, name: Resources.get().getStrings().Dialogs.WastelandDialog.BasicDataLabel, renderPage: (props, index) => (
                        <View key={index} style={{ flex: 1, margin: 5 }}>
                            <View style={{ flex: 1, padding: 10 }}>
                                <LocationInput
                                    readonly
                                    style={{ width: "100%", height: 200 }}
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

                            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 10 }}>
                                <Text style={{ fontStyle: "italic", letterSpacing: 1 }}>Szczebrzeszyno dolne</Text>
                                <FontAwesomeIcon icon={faMapPin} size={15} />
                            </View>

                            <View style={{ flexDirection: "row", padding: 10, justifyContent: "space-between" }}>
                                <FontAwesomeIcon icon={faCalendar} size={15} />
                                <View style={{ flexDirection: "row" }}>
                                    <Text style={{ fontStyle: "italic", letterSpacing: 1 }}>{Resources.get().getStrings().Dialogs.WastelandDialog.ReportedLabel}</Text>
                                    <Text style={{ fontStyle: "italic", letterSpacing: 1, marginLeft: 5, fontWeight: "bold" }}>wczoraj</Text>
                                    <Text style={{ fontStyle: "italic", letterSpacing: 1, marginLeft: 5 }}>{Resources.get().getStrings().Dialogs.WastelandDialog.ByLabel}</Text>
                                    <Text style={{ fontStyle: "italic", letterSpacing: 1, marginLeft: 5, fontWeight: "bold" }}>Mariusz1997</Text>
                                </View>
                            </View>

                            <View>
                                <Text style={{fontWeight: "bold"}}>Opis</Text>
                                <TextInput multiline style={{backgroundColor: Resources.get().getColors().Beige, padding: 5, minHeight: 100, borderRadius: 15, fontWeight: 400, fontFamily: "Avenir", letterSpacing: 2}}>
                                    Opis
                                </TextInput>
                            </View>
                        </View>
                    )
                },
                [Sections.BeforeCleaningPhotos]: {
                    icon: <FontAwesomeIcon icon={faTrash} />, color: Resources.get().getColors().Lime, name: Resources.get().getStrings().Dialogs.WastelandDialog.PhotosBeforeCleaningLabel, renderPage: (props, index) => (
                        <View key={index} style={{ flex: 1, padding: 15 }}>
                            <Text style={{fontWeight: "bold"}}>Zdjęcia z przed sprzątnięcia</Text>
                            <ImagesGallery
                                images={[
                                    "https://plus.unsplash.com/premium_photo-1661905921900-a8b49e65feeb?q=80&w=2075&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                                    "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=2128&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                                    "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                                    "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                                    "https://plus.unsplash.com/premium_photo-1681681061526-5f5496c635e1?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                                ]}
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
                    icon: <FontAwesomeIcon icon={faBroom} />, color: Resources.get().getColors().DarkBeige, name: Resources.get().getStrings().Dialogs.WastelandDialog.PhotosAfterCleaningLabel, renderPage: ({ shake, startConfetti }, index) => (
                        <View key={index} style={{ flex: 1 }}>
                            <View style={{
                                width: "100%",
                                marginTop: 40
                            }}>
                                <Text style={{fontWeight: "bold"}}>{Resources.get().getStrings().Dialogs.WastelandDialog.PhotosAfterCleaningByLabel} Mariusz1997</Text>
                                <ImagesGallery
                                    images={[
                                        "https://plus.unsplash.com/premium_photo-1661905921900-a8b49e65feeb?q=80&w=2075&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                                        "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=2128&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                                        "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                                        "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                                        "https://plus.unsplash.com/premium_photo-1681681061526-5f5496c635e1?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                                    ]}
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