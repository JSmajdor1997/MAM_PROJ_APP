import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import WisbIcon, { IconType } from "../components/WisbIcon";
import WisbDialog, { Mode } from "./WisbDialog";
import { faGripLines, faMapPin, faTrash, faPerson, faShare, faLocationArrow, faCalendar, faClose, faBroom, faEdit } from "@fortawesome/free-solid-svg-icons";
import { Text, TextInput, View } from "react-native";
import MapView, { LatLng } from "react-native-maps";
import { Resources } from "../../res/Resources";
import FAB from "../components/FAB";
import ImagesGallery from "../components/ImagesGallery";
import LocationInput from "../components/LocationInput";

enum Sections {
    BasicInfo,
    BeforeCleaningPhotos,
    AfterCleaningPhotos,
}

export interface Props {
    event?: Event
    mode: Mode
    onDismiss(): void
    onAdd?: (event: Event) => void
    visible: boolean
    userLocation: LatLng
}

export default function WastelandDialog({ mode, event, onDismiss, onAdd, visible, userLocation }: Props) {
    return (
        <WisbDialog
            visible={visible}
            mainIcon={IconType.WastelandIcon}
            mode={mode}
            onDismiss={onDismiss}
            moreActions={[
                {
                    label: Resources.Strings.get().Dialogs.WastelandDialog.DeleteAction,
                    icon: <FontAwesomeIcon icon={faTrash} />,
                    color: Resources.Colors.Red,
                    onPress: () => { }
                },
                {
                    label: Resources.Strings.get().Dialogs.WastelandDialog.EditAction,
                    icon: <FontAwesomeIcon icon={faEdit} />,
                    color: Resources.Colors.White,
                    onPress: () => { }
                }
            ]}
            actions={[
                {
                    label: Resources.Strings.get().Dialogs.WastelandDialog.CleanAction,
                    icon: <FontAwesomeIcon icon={faBroom} />,
                    color: Resources.Colors.Primary,
                    onPress: () => { },
                },
                {
                    label: Resources.Strings.get().Dialogs.WastelandDialog.ShareAction,
                    icon: <FontAwesomeIcon icon={faShare} />,
                    color: Resources.Colors.Blue,
                    onPress: () => { },
                },
                {
                    label: Resources.Strings.get().Dialogs.WastelandDialog.CreateEventAction,
                    icon: <FontAwesomeIcon icon={faCalendar} />,
                    color: Resources.Colors.Lime,
                    onPress: () => { },
                }
            ]}
            sectionsOrder={[Sections.BasicInfo, Sections.BeforeCleaningPhotos, Sections.AfterCleaningPhotos]}
            sections={{
                [Sections.BasicInfo]: {
                    icon: <FontAwesomeIcon icon={faGripLines} />, color: Resources.Colors.Yellow, name: Resources.Strings.get().Dialogs.WastelandDialog.BasicDataLabel, renderPage: () => (
                        <View style={{ flex: 1, margin: 5 }}>
                            <View style={{ flex: 1, padding: 10 }}>
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

                            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 10 }}>
                                <Text style={{ fontStyle: "italic", letterSpacing: 1 }}>Szczebrzeszyno dolne</Text>
                                <FontAwesomeIcon icon={faMapPin} size={15} />
                            </View>

                            <View style={{ flexDirection: "row", padding: 10, justifyContent: "space-between" }}>
                                <FontAwesomeIcon icon={faCalendar} size={15} />
                                <View style={{ flexDirection: "row" }}>
                                    <Text style={{ fontStyle: "italic", letterSpacing: 1 }}>{Resources.Strings.get().Dialogs.WastelandDialog.ReportedLabel}</Text>
                                    <Text style={{ fontStyle: "italic", letterSpacing: 1, marginLeft: 5, fontWeight: "bold" }}>wczoraj</Text>
                                    <Text style={{ fontStyle: "italic", letterSpacing: 1, marginLeft: 5 }}>{Resources.Strings.get().Dialogs.WastelandDialog.ByLabel}</Text>
                                    <Text style={{ fontStyle: "italic", letterSpacing: 1, marginLeft: 5, fontWeight: "bold" }}>Mariusz1997</Text>
                                </View>
                            </View>

                            <View>
                                <TextInput style={{ width: "100%", height: 100, backgroundColor: Resources.Colors.White, borderRadius: 10, shadowColor: Resources.Colors.Black, borderStyle: "dashed", borderWidth: 2, paddingLeft: 8, paddingRight: 8 }} multiline value="lorem ipsum" />
                                <Text>Opis</Text>
                            </View>
                        </View>
                    )
                },
                [Sections.BeforeCleaningPhotos]: {
                    icon: <FontAwesomeIcon icon={faTrash} />, color: Resources.Colors.Lime, name: Resources.Strings.get().Dialogs.WastelandDialog.PhotosBeforeCleaningLabel, renderPage: () => (
                        <View style={{ flex: 1, padding: 15 }}>
                            <Text>Zdjęcia z przed sprzątnięcia</Text>
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
                    icon: <FontAwesomeIcon icon={faBroom} />, color: Resources.Colors.DarkBeige, name: Resources.Strings.get().Dialogs.WastelandDialog.PhotosAfterCleaningLabel, renderPage: ({ shake, startConfetti }) => (
                        <View style={{ flex: 1 }}>
                            <View style={{
                                width: "100%",
                                marginTop: 40
                            }}>
                                <Text>{Resources.Strings.get().Dialogs.WastelandDialog.PhotosAfterCleaningByLabel}</Text>
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

                            <View style={{ width: "100%", paddingBottom: 5, paddingTop: 5, justifyContent: "space-around", flexDirection: "row" }}>
                                <FAB color={Resources.Colors.Red} icon={<FontAwesomeIcon icon={faClose} color={Resources.Colors.White} />} size={50} onPress={onDismiss} />
                                <FAB color={Resources.Colors.Blue} icon={<FontAwesomeIcon icon={faShare} color={Resources.Colors.White} />} size={40} onPress={() => { }} />
                                <FAB color={Resources.Colors.Primary} icon={<WisbIcon icon={IconType.BroomMono} size={25} />} size={50} onPress={() => { startConfetti() }} />
                            </View>
                        </View>
                    )
                },
            }} />
    )
}