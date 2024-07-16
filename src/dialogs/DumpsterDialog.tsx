import { faAdd, faGripLines, faImage, faMapPin } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import React from "react";
import { Dimensions, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { LatLng } from "react-native-maps";
import Resources from "../../res/Resources";
import WisbObjectType from "../API/WisbObjectType";
import getAPI from "../API/getAPI";
import { WisbDumpster, WisbUser } from "../API/interfaces";
import { isDumpster } from "../API/type_guards";
import IconType from "../components/WisbIcon/IconType";
import ImagesGallery from "../components/inputs/ImagesGallery";
import LocationInput from "../components/inputs/LocationInput";
import WisbDialog, { Mode } from "./WisbDialog";
;

const res = Resources.get()

export interface Props {
    dumpster?: WisbDumpster
    mode: Mode
    onDismiss(): void
    userLocation: LatLng
    currentUser: WisbUser
}

const api = getAPI()

export default function DumpsterDialog({ mode: propMode, dumpster, onDismiss, userLocation, currentUser }: Props) {
    const [mode, setMode] = React.useState(propMode)
    const [workingDumpster, setWorkingDumpster] = React.useState<Partial<WisbDumpster>>(dumpster ?? {})

    return (
        <WisbDialog
            onItemUpdated={update => setWorkingDumpster({ ...workingDumpster, ...update })}
            currentUser={currentUser}
            type={WisbObjectType.Dumpster}
            workingItem={workingDumpster}
            onModeChanged={setMode}
            mainIcon={IconType.Dumpster}
            mode={mode}
            onDismiss={onDismiss}
            sections={[
                {
                    enabled: () => workingDumpster.place != null,
                    icon: <FontAwesomeIcon icon={faMapPin} />, color: res.getColors().Green, label: res.getStrings().Dialogs.DumpsterDialog.LocationLabel, renderPage: (props, index) => (
                        <View key={index} style={styles.locationContainer}>
                            <LocationInput
                                readonly={mode == Mode.Viewing}
                                style={styles.locationInput}
                                apiKey={res.getEnv().GOOGLE_MAPS_API_KEY}
                                userLocation={userLocation}
                                onLocationChanged={place => setWorkingDumpster({ ...workingDumpster, place })}
                                location={workingDumpster.place ?? {
                                    coords: userLocation,
                                    asText: "Obecna"
                                }} />
                        </View>
                    )
                },
                {
                    enabled: () => workingDumpster.description != null && workingDumpster.description.length > 0,
                    icon: <FontAwesomeIcon icon={faGripLines} />, color: res.getColors().Yellow, label: res.getStrings().Dialogs.DumpsterDialog.BasicDataLabel, renderPage: (props, index) => (
                        <View key={index} style={styles.basicDataContainer}>
                            <View>
                                <Text style={styles.sectionTitle}>Opis</Text>

                                <TextInput
                                    placeholder="Opis"
                                    multiline
                                    readOnly={mode == Mode.Viewing}
                                    onChange={e => setWorkingDumpster({ ...workingDumpster, description: e.nativeEvent.text })}
                                    style={styles.descriptionInput} >
                                    {workingDumpster.description}
                                </TextInput>
                            </View>

                            <View style={styles.addedByContainer}>
                                <Text style={styles.sectionTitle}>Dodane przez</Text>
                                <Text style={styles.addedByText}>{currentUser.userName}</Text>
                            </View>
                        </View>
                    )
                },
                {
                    enabled: () => workingDumpster.photos != null && workingDumpster.photos.length > 0,
                    icon: <FontAwesomeIcon icon={faImage} />,
                    color: res.getColors().Yellow,
                    label: "Zdjęcia",
                    renderPage: ({ startConfetti, setLoading }, index) => {
                        return (
                            <View style={styles.photosContainer}>
                                <View key={index} style={styles.photosSection}>
                                    <Text style={styles.sectionTitle}>
                                        Zdjęcia
                                    </Text>

                                    <ImagesGallery
                                        images={workingDumpster.photos ?? []}
                                        rowWidth={Dimensions.get("window").width * 0.9}
                                        interImagesSpace={5}
                                        style={styles.gallery}
                                        readonly={mode == Mode.Viewing}
                                        onAddRequest={path => setWorkingDumpster({
                                            ...workingDumpster, 
                                            photos: [...(workingDumpster.photos ?? []), path]
                                        })}
                                        onRemoveRequest={() => { }}
                                        nrOfImagesPerRow={4} />
                                </View>
                            </View>
                        )
                    }
                },
                {
                    enabled: () => true,
                    available: mode == Mode.Adding,
                    icon: <FontAwesomeIcon icon={faAdd} />,
                    color: res.getColors().Primary,
                    label: "Dodaj",
                    renderPage: ({ startConfetti, setLoading, currentIndex }, index) => {
                        return (
                            <View style={styles.addButtonContainer}>
                                <TouchableOpacity
                                    style={styles.addButton}
                                    onPress={() => {
                                        if (isDumpster({ ...workingDumpster, id: -1, addedBy: {type: WisbObjectType.User, id: -1} })) {
                                            setLoading("Trwa dodawanie")

                                            api.createOne(WisbObjectType.Dumpster, workingDumpster as Omit<WisbDumpster, "id">).then(async ref => {
                                                setLoading(null)
                                                startConfetti()
                                                setTimeout(onDismiss, 600)
                                            })
                                        }
                                    }}>
                                    <Text style={styles.addButtonText}>DODAJ</Text>
                                </TouchableOpacity>
                            </View>
                        )
                    }
                }
            ]} />
    )
}

const styles = StyleSheet.create({
    locationContainer: {
        flex: 1,
        padding: 15
    },
    locationInput: {
        flex: 1,
        height: 300
    },
    basicDataContainer: {
        flex: 1,
        padding: 10
    },
    sectionTitle: {
        fontWeight: "bold",
        fontFamily: res.getFonts().Secondary
    },
    descriptionInput: {
        backgroundColor: res.getColors().Beige,
        padding: 5,
        minHeight: 100,
        borderRadius: 15,
        fontWeight: "400",
        fontFamily: res.getFonts().Secondary,
        letterSpacing: 2
    },
    addedByContainer: {
        marginTop: 10,
        flexDirection: "row",
        justifyContent: "space-between"
    },
    addedByText: {
        fontFamily: res.getFonts().Secondary
    },
    photosContainer: {},
    photosSection: {
        flex: 1,
        padding: 10
    },
    gallery: {
        width: "100%"
    },
    addButton: {
        padding: 10,
        borderRadius: 15,
        backgroundColor: res.getColors().Beige
    },
    addButtonText: {
        fontFamily: res.getFonts().Secondary
    },
    addButtonContainer: {
        justifyContent: "center",
        alignItems: "center",
        flex: 1
    },
});
