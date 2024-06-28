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
}

export default function DumpsterDialog({ mode, dumpster, onDismiss, onAdd, visible, userLocation }: Props) {
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
                    icon: <FontAwesomeIcon icon={faMapPin} />, color: Resources.get().getColors().Green, name: Resources.get().getStrings().Dialogs.DumpsterDialog.LocationLabel, renderPage: (props, index) => (
                        <View key={index} style={{ flex: 1, padding: 15 }}>
                            <LocationInput
                                readonly
                                style={{ flex: 1, height: 300 }}
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
                },
                [Sections.BasicInfo]: {
                    icon: <FontAwesomeIcon icon={faGripLines} />, color: Resources.get().getColors().Yellow, name: Resources.get().getStrings().Dialogs.DumpsterDialog.BasicDataLabel, renderPage: (props, index) => (
                        <View key={index} style={{ flex: 1, padding: 10 }}>
                            <View>
                                <Text style={{fontWeight: "bold"}}>Opis</Text>

                                <TextInput multiline style={{backgroundColor: Resources.get().getColors().Beige, padding: 5, minHeight: 100, borderRadius: 15, fontWeight: 400, fontFamily: "Avenir", letterSpacing: 2}}>
                                    Opis
                                </TextInput>
                            </View>

                            <View style={{marginTop: 10, flexDirection: "row", justifyContent: "space-between"}}>
                                <Text style={{ fontWeight: "bold" }}>Dodane przez</Text>
                                <Text style={{  }}>Agatkę</Text>
                            </View>
                        </View>
                    )
                },
                [Sections.Photos]: {
                    icon: <FontAwesomeIcon icon={faGripLines} />, color: Resources.get().getColors().Yellow, name: Resources.get().getStrings().Dialogs.DumpsterDialog.BasicDataLabel, renderPage: (props, index) => (
                        <View key={index} style={{ flex: 1, padding: 10 }}>
                            <Text style={{fontWeight: "bold"}}>
                                Zdjęcia
                            </Text>

                            <ImagesGallery
                                images={[]}
                                interImagesSpace={5}
                                style={{width: "100%"}}
                                onAddRequest={()=>{}}
                                onRemoveRequest={()=>{}}
                                nrOfImagesPerRow={4}/>
                        </View>
                    )
                },
            }} />
    )
}

const styles = StyleSheet.create({
    
})