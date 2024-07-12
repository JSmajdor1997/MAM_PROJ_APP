import { faBroom, faCalendar, faGripLines, faShare, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import React from "react";
import { Dimensions, Text, TextInput, TouchableOpacity, View } from "react-native";
import { LatLng } from "react-native-maps";
import Share from 'react-native-share';
import Resources from "../../res/Resources";
import WisbObjectType from "../API/WisbObjectType";
import getAPI from "../API/getAPI";
import { WisbUser, WisbWasteland } from "../API/interfaces";
import { isObjectCRUDNotification } from "../API/notifications";
import { isWasteland } from "../API/type_guards";
import ImagesGallery from "../components/ImagesGallery";
import LocationInput from "../components/LocationInput";
import IconType from "../components/WisbIcon/IconType";
import WisbDialog, { Mode, Section } from "./WisbDialog";

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
    visible: boolean
    userLocation: LatLng
    currentUser: WisbUser
}

const api = getAPI()

export default function WastelandDialog({ mode: propMode, wasteland, onDismiss, visible, userLocation, currentUser }: Props) {
    const [mode, setMode] = React.useState(propMode)
    const [workingWasteland, setWorkingWasteland] = React.useState<Partial<WisbWasteland>>(wasteland ?? {})

    React.useEffect(() => {
        const unregister = api.notifications.registerListener((n) => {
            if ((mode == Mode.Viewing || mode == Mode.Editing) && isObjectCRUDNotification(n)) {
                setWorkingWasteland({
                    ...workingWasteland,
                    ...n.updatedFields
                })
            }
        }, { observedIds: wasteland?.id != null ? [{ type: WisbObjectType.Event, id: wasteland.id }] : [] })

        return unregister
    }, [wasteland, mode])

    return (
        <WisbDialog
            type={WisbObjectType.Wasteland}
            visible={visible}
            mainIcon={IconType.WastelandIcon}
            mode={mode}
            onDismiss={onDismiss}
            currentUser={currentUser}
            onModeChanged={setMode}
            workingItem={workingWasteland}
            actions={[
                {
                    label: res.getStrings().Dialogs.WastelandDialog.CleanAction,
                    icon: <FontAwesomeIcon icon={faBroom} />,
                    color: res.getColors().Primary,
                    onPress: ({ startConfetti }) => { startConfetti() },
                },
                {
                    label: res.getStrings().Dialogs.WastelandDialog.ShareAction,
                    icon: <FontAwesomeIcon icon={faShare} />,
                    color: res.getColors().Blue,
                    onPress: () => Share.open({
                        title: "Share",
                        message: "Let's clean up planet together!",
                    })
                        .then((res) => {
                            console.log(res);
                        })
                        .catch((err) => {
                            err && console.log(err);
                        }),
                },
                {
                    label: res.getStrings().Dialogs.WastelandDialog.CreateEventAction,
                    icon: <FontAwesomeIcon icon={faCalendar} />,
                    color: res.getColors().Lime,
                    onPress: () => { },
                }
            ]}
            sections={[
                {
                    enabled: () => workingWasteland.place != null && workingWasteland.description != null && workingWasteland.description.length > 0,
                    icon: <FontAwesomeIcon icon={faGripLines} />, color: res.getColors().Yellow, name: res.getStrings().Dialogs.WastelandDialog.BasicDataLabel, renderPage: (props, index) => (
                        <View key={index} style={{ flex: 1, padding: 15 }}>
                            <LocationInput
                                readonly={mode == Mode.Viewing}
                                style={{ width: "100%", height: 300 }}
                                apiKey={res.getEnv().GOOGLE_MAPS_API_KEY}
                                userLocation={userLocation}
                                onLocationChanged={(latLng, asText) => setWorkingWasteland({ ...workingWasteland, place: { coords: latLng, asText } })}
                                location={workingWasteland.place ?? {
                                    coords: userLocation,
                                    asText: "Obecna"
                                }} />

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
                {
                    enabled: () => workingWasteland.photos != null && workingWasteland.photos.length > 0,
                    icon: <FontAwesomeIcon icon={faTrash} />, color: res.getColors().Lime, name: res.getStrings().Dialogs.WastelandDialog.PhotosBeforeCleaningLabel, renderPage: (props, index) => (
                        <View key={index} style={{ flex: 1, padding: 15 }}>
                            <Text style={{ fontWeight: "bold" }}>Zdjęcia z przed sprzątnięcia</Text>
                            <ImagesGallery
                                style={{ marginTop: 10 }}
                                images={workingWasteland.photos ?? []}
                                nrOfImagesPerRow={4}
                                interImagesSpace={5}
                                onAddRequest={() => { }}
                                onRemoveRequest={() => { }}
                                rowWidth={Dimensions.get("window").width * 0.9} />
                        </View>
                    )
                },
                ...(mode == Mode.Viewing ? [{
                    enabled: () => workingWasteland.afterCleaningData != null && workingWasteland.afterCleaningData.photos.length > 0,
                    icon: <FontAwesomeIcon icon={faBroom} />,
                    color: res.getColors().DarkBeige,
                    name: res.getStrings().Dialogs.WastelandDialog.PhotosAfterCleaningLabel,
                    renderPage: ({ shake, startConfetti, block, setLoading }, index) => (
                        <View key={index} style={{ flex: 1 }}>
                            <View style={{
                                width: "100%",
                                marginTop: 40,
                                padding: 15
                            }}>
                                <Text style={{ fontWeight: "bold" }}>{res.getStrings().Dialogs.WastelandDialog.PhotosAfterCleaningByLabel} Mariusz1997</Text>
                                <ImagesGallery
                                    images={workingWasteland.afterCleaningData?.photos ?? []}
                                    style={{ marginTop: 10 }}
                                    nrOfImagesPerRow={4}
                                    interImagesSpace={5}
                                    onAddRequest={() => { }}
                                    onRemoveRequest={() => { }}
                                    rowWidth={Dimensions.get("window").width * 0.9} />
                            </View>

                            <TouchableOpacity onPress={() => {
                                if (isWasteland({ ...workingWasteland, id: -1 })) {
                                    setLoading("Trwa dodawanie")
                                    api.createOne(WisbObjectType.Wasteland, workingWasteland as Omit<WisbWasteland, "id">).then(() => {
                                        setLoading(null)
                                        block(true)
                                        startConfetti()
                                    })
                                }
                            }}>
                                <Text>DODAJ</Text>
                            </TouchableOpacity>
                        </View>
                    )
                } satisfies Section<WisbObjectType.Wasteland>]
                    : [] as any)
            ]} />
    )
}