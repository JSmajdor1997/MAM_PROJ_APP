import { faAdd, faBroom, faCalendar, faCheck, faClose, faGripLines, faShare, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import React from "react";
import { Dimensions, Share, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { LatLng } from "react-native-maps";
import Toast from 'react-native-simple-toast';
import Resources from "../../res/Resources";
import WisbObjectType from "../API/WisbObjectType";
import getAPI from "../API/getAPI";
import { WastelandCleaningData, WisbUser, WisbWasteland } from "../API/interfaces";
import { isWasteland } from "../API/type_guards";
import IconType from "../components/WisbIcon/IconType";
import ImagesGallery from "../components/inputs/ImagesGallery";
import LocationInput from "../components/inputs/LocationInput";
import WisbDialog, { Mode } from "./WisbDialog";

const res = Resources.get()

export interface Props {
    wasteland?: WisbWasteland
    mode: Mode
    onDismiss(): void
    userLocation: LatLng
    currentUser: WisbUser
}

const api = getAPI()

export default function WastelandDialog({ mode: propMode, wasteland, onDismiss, userLocation, currentUser }: Props) {
    const [mode, setMode] = React.useState(propMode)
    const [workingWasteland, setWorkingWasteland] = React.useState<Partial<WisbWasteland>>(wasteland ?? {})

    const [isInClearingMode, setIsInClearingMode] = React.useState(false)

    const [clearingPhotos, setClearingPhotos] = React.useState<string[]>([])

    return (
        <WisbDialog
            onItemUpdated={update => setWorkingWasteland({ ...workingWasteland, ...update })}
            type={WisbObjectType.Wasteland}
            mainIcon={IconType.WastelandIcon}
            mode={mode}
            onDismiss={onDismiss}
            currentUser={currentUser}
            onModeChanged={setMode}
            workingItem={workingWasteland}
            actions={[
                {
                    label: isInClearingMode ? "Zgłoś" : res.getStrings().Dialogs.WastelandDialog.CleanAction,
                    icon: <FontAwesomeIcon icon={faCheck} />,
                    color: res.getColors().Primary,
                    enabled: (isInClearingMode && clearingPhotos?.length !== 0) || !isInClearingMode,
                    available: workingWasteland.afterCleaningData == null,
                    onPress: ({ startConfetti, setLoading }) => {
                        if (isInClearingMode) {
                            setLoading("Czyszczenie...")
                            const afterClearingData: WastelandCleaningData = {
                                photos: clearingPhotos,
                                cleanedBy: [{ type: WisbObjectType.User, id: currentUser.id }],
                                date: new Date()
                            }

                            api.clearWasteland(workingWasteland as WisbWasteland, afterClearingData).then(rsp => {
                                if (rsp.error) {
                                    Toast.show(`Unexpected Error!`, Toast.SHORT);
                                    setLoading(null)
                                } else {
                                    setLoading(null)
                                    setWorkingWasteland({ afterCleaningData: afterClearingData })
                                }

                                setIsInClearingMode(false)
                                setClearingPhotos([])
                            })
                        } else {
                            setIsInClearingMode(true)
                        }
                    }
                },
                {
                    label: "Anuluj",
                    icon: <FontAwesomeIcon icon={faClose} />,
                    color: res.getColors().Red,
                    available: isInClearingMode,
                    onPress: ({ startConfetti }) => { startConfetti() },
                },
                {
                    label: res.getStrings().Dialogs.WastelandDialog.ShareAction,
                    available: !isInClearingMode,
                    icon: <FontAwesomeIcon icon={faShare} />,
                    color: res.getColors().Blue,
                    onPress: () => Share.share({
                        title: "Share",
                        message: "Let's clean up planet together!",
                    }, { tintColor: res.getColors().Primary })
                        .then((res) => {
                            console.log(res);
                        })
                        .catch((err) => {
                            err && console.log(err);
                        }),
                }
            ]}
            sections={[
                {
                    enabled: () => workingWasteland.place != null && workingWasteland.description != null && workingWasteland.description.length > 0,
                    icon: <FontAwesomeIcon icon={faGripLines} />,
                    color: res.getColors().Yellow,
                    label: res.getStrings().Dialogs.WastelandDialog.BasicDataLabel,
                    renderPage: (props, index) => (
                        <View key={index} style={styles.sectionContainer}>
                            <LocationInput
                                readonly={mode == Mode.Viewing}
                                style={styles.locationInput}
                                apiKey={res.getEnv().GOOGLE_MAPS_API_KEY}
                                userLocation={userLocation}
                                onLocationChanged={place => setWorkingWasteland({ ...workingWasteland, place })}
                                location={workingWasteland.place ?? {
                                    coords: userLocation,
                                    asText: "Obecna"
                                }} />

                            <View style={styles.infoRow}>
                                <FontAwesomeIcon icon={faCalendar} size={15} />
                                <View style={styles.infoSubRow}>
                                    <Text style={styles.italicText}>{res.getStrings().Dialogs.WastelandDialog.ReportedLabel}</Text>
                                    <Text style={[styles.italicText, styles.boldText, styles.marginLeft5]}>{(workingWasteland.creationDate ?? new Date()).toLocaleDateString(res.getLocale(), { year: "numeric", month: "2-digit", day: "2-digit" })}</Text>
                                    <Text style={[styles.italicText, styles.marginLeft5]}>{res.getStrings().Dialogs.WastelandDialog.ByLabel}</Text>
                                    <Text style={[styles.italicText, styles.boldText, styles.marginLeft5]}>{workingWasteland.reportedBy?.userName ?? currentUser.userName}</Text>
                                </View>
                            </View>

                            <View>
                                <Text style={styles.boldText}>Opis</Text>
                                <TextInput
                                    placeholder="Opis"
                                    readOnly={mode == Mode.Viewing}
                                    onChange={e => setWorkingWasteland({
                                        ...workingWasteland,
                                        description: e.nativeEvent.text
                                    })}
                                    multiline
                                    style={styles.descriptionInput} >
                                    {workingWasteland.description}
                                </TextInput>
                            </View>
                        </View>
                    )
                },
                {
                    enabled: () => workingWasteland.photos != null && workingWasteland.photos.length > 0,
                    icon: <FontAwesomeIcon icon={faTrash} />,
                    color: res.getColors().Lime,
                    label: res.getStrings().Dialogs.WastelandDialog.PhotosBeforeCleaningLabel, renderPage: (props, index) => (
                        <View key={index} style={styles.sectionContainer}>
                            <Text style={styles.boldText}>Zdjęcia z przed sprzątnięcia</Text>
                            <ImagesGallery
                                style={styles.imagesGallery}
                                images={workingWasteland.photos ?? []}
                                nrOfImagesPerRow={4}
                                interImagesSpace={5}
                                onAddRequest={path => setWorkingWasteland({
                                    ...workingWasteland,
                                    photos: [...(workingWasteland.photos ?? []), path]
                                })}
                                readonly={mode == Mode.Viewing}
                                onRemoveRequest={() => { }}
                                rowWidth={Dimensions.get("window").width * 0.9} />
                        </View>
                    )
                },
                {
                    enabled: () => workingWasteland.afterCleaningData != null && workingWasteland.afterCleaningData.photos.length > 0,
                    icon: <FontAwesomeIcon icon={faBroom} />,
                    color: res.getColors().DarkBeige,
                    available: mode == Mode.Viewing,
                    label: res.getStrings().Dialogs.WastelandDialog.PhotosAfterCleaningLabel,
                    renderPage: ({ shake, startConfetti, setLoading }, index) => (
                        <View key={index} style={styles.sectionContainer}>
                            <View style={styles.afterCleaningContainer}>
                                <Text style={styles.boldText}>{res.getStrings().Dialogs.WastelandDialog.PhotosAfterCleaningByLabel} Mariusz1997</Text>
                                <ImagesGallery
                                    images={workingWasteland.afterCleaningData?.photos ?? clearingPhotos}
                                    style={styles.imagesGallery}
                                    nrOfImagesPerRow={4}
                                    interImagesSpace={5}
                                    onAddRequest={path => setClearingPhotos([...clearingPhotos, path])}
                                    readonly={!isInClearingMode}
                                    onRemoveRequest={() => { }}
                                    rowWidth={Dimensions.get("window").width * 0.9} />
                            </View>
                        </View>
                    )
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
                                        setLoading("Trwa dodawanie")

                                        api.createOne(WisbObjectType.Wasteland, workingWasteland as Omit<WisbWasteland, "id">).then(async ref => {
                                            setLoading(null)
                                            startConfetti()
                                            setTimeout(onDismiss, 600)
                                            console.log(ref)
                                        })
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
    sectionContainer: {
        flex: 1,
        padding: 15
    },
    locationInput: {
        width: "100%",
        height: 300
    },
    infoRow: {
        flexDirection: "row",
        padding: 10,
        justifyContent: "space-between"
    },
    infoSubRow: {
        flexDirection: "row"
    },
    italicText: {
        fontStyle: "italic",
        letterSpacing: 1,
        fontFamily: res.getFonts().Secondary,
    },
    boldText: {
        fontWeight: "bold",
        fontFamily: res.getFonts().Secondary,
    },
    marginLeft5: {
        marginLeft: 5
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
    imagesGallery: {
        marginTop: 10
    },
    afterCleaningContainer: {
        width: "100%",
        marginTop: 40,
        padding: 15
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
