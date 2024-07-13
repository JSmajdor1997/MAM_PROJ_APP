import { faGripLines, faImage, faMapPin } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import React from "react";
import { Dimensions, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { LatLng } from "react-native-maps";
import Resources from "../../res/Resources";
import WisbObjectType from "../API/WisbObjectType";
import getAPI from "../API/getAPI";
import { WisbDumpster, WisbUser } from "../API/interfaces";
import { isObjectCRUDNotification } from "../API/notifications";
import { isDumpster } from "../API/type_guards";;
import LocationInput from "../components/inputs/LocationInput";
import IconType from "../components/WisbIcon/IconType";
import WisbDialog, { Mode } from "./WisbDialog";
import ImagesGallery from "../components/inputs/ImagesGallery";

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

export default function DumpsterDialog({ mode: propMode, dumpster, onDismiss, onAdd, visible, userLocation, currentUser }: Props) {
    const [mode, setMode] = React.useState(propMode)
    const [workingDumpster, setWorkingDumpster] = React.useState<Partial<WisbDumpster>>(dumpster ?? {})

    React.useEffect(() => {
        const unregister = api.notifications.registerListener((n) => {
            if ((mode == Mode.Viewing || mode == Mode.Editing) && isObjectCRUDNotification(n)) {
                setWorkingDumpster({
                    ...workingDumpster,
                    ...n.updatedFields
                })
            }
        }, { observedIds: dumpster?.id != null ? [{ type: WisbObjectType.Event, id: dumpster.id }] : [] })

        return unregister
    }, [dumpster, mode])

    return (
        <WisbDialog
            currentUser={currentUser}
            type={WisbObjectType.Dumpster}
            workingItem={workingDumpster}
            onModeChanged={setMode}
            visible={visible}
            mainIcon={IconType.Dumpster}
            mode={mode}
            onDismiss={onDismiss}
            sections={[
                {
                    enabled: () => workingDumpster.place != null,
                    icon: <FontAwesomeIcon icon={faMapPin} />, color: res.getColors().Green, name: res.getStrings().Dialogs.DumpsterDialog.LocationLabel, renderPage: (props, index) => (
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
                    icon: <FontAwesomeIcon icon={faGripLines} />, color: res.getColors().Yellow, name: res.getStrings().Dialogs.DumpsterDialog.BasicDataLabel, renderPage: (props, index) => (
                        <View key={index} style={styles.basicDataContainer}>
                            <View>
                                <Text style={styles.sectionTitle}>Opis</Text>

                                <TextInput
                                    placeholder="Opis"
                                    multiline
                                    readOnly={mode == Mode.Viewing}
                                    onChange={e => setWorkingDumpster({ ...workingDumpster, description: e.nativeEvent.text })}
                                    value={workingDumpster.description ?? ""}
                                    style={styles.descriptionInput} />
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
                    name: "Zdjęcia",
                    renderPage: ({ block, startConfetti, setLoading }, index) => {
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
                                        onAddRequest={() => { }}
                                        onRemoveRequest={() => { }}
                                        nrOfImagesPerRow={4} />
                                </View>
                                <TouchableOpacity style={styles.addButton} onPress={() => {
                                    if (isDumpster({ ...workingDumpster, id: -1 })) {
                                        setLoading("Trwa dodawanie")

                                        api.createOne(WisbObjectType.Dumpster, workingDumpster as Omit<WisbDumpster, "id">).then(async ref => {
                                            setLoading(null)
                                        })
                                    }
                                }}>
                                    <Text style={styles.addButtonText}>DODAJ</Text>
                                </TouchableOpacity>
                            </View>
                        )
                    }
                },
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
        padding: 10
    },
    addButtonText: {
        fontFamily: res.getFonts().Secondary
    }
});
