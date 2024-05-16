import { Animated, Text, TextInput, View } from "react-native";
import { Resources } from "../../res/Resources";
import WisbIcon, { IconType } from "../components/WisbIcon";
import ShakyDialog from "./ShakyDialog";
import FAB from "../components/FAB";
import ProgressInput from "../components/ProgressInput";
import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faGripLines, faMapMarker, faMapPin, faPassport, faPerson, faShare, faTrash } from "@fortawesome/free-solid-svg-icons";
import Swiper from "react-native-swiper";
import { Image } from "react-native-svg";
import MapView from "react-native-maps/lib/MapView";
import ShareButton, { ShareDestination } from "../components/ShareButton";
import ConfettiCannon from 'react-native-confetti-cannon';

export enum Mode {
    Adding,
    Viewing
}

export interface Props {
    wasteland?: Event
    mode: Mode
    onDismiss?: () => void
    onAdd?: (wasteland: Event) => void
    onClean?: (images: unknown[]) => void
    visible: boolean
}

const PagesList = [
    { label: <FontAwesomeIcon icon={faGripLines} />, color: "#fcfa6a", name: "Podstawowe informacje" },
    { label: <FontAwesomeIcon icon={faMapPin} />, color: "#8ae364", name: "Lokalizacja" }
]

const TranslationAnimationDuration = 300

export default function DumpsterDialog({ visible, onDismiss }: Props) {
    const shadowAnim = React.useRef(new Animated.Value(0)).current;
    const swiperRef = React.useRef<Swiper>(null)
    const [index, setIndex] = React.useState(0)

    React.useEffect(() => {
        Animated.sequence([
            Animated.timing(shadowAnim, {
                toValue: 10,
                duration: TranslationAnimationDuration,
                useNativeDriver: false,
            }),
            Animated.timing(shadowAnim, {
                toValue: 0,
                duration: TranslationAnimationDuration,
                useNativeDriver: false,
            }),
        ]).start();
    }, [index]);

    return (
        <ShakyDialog
            shakingDuration={15}
            shakingOffset={2}
            onDismiss={onDismiss}
            visible={visible}>
            <View style={{ height: "100%", width: "100%", flexDirection: "column" }}>
                <Animated.View style={{
                    width: "100%", backgroundColor: Resources.Colors.Primary, padding: 5, shadowColor: "black", shadowOffset: { height: 1, width: 1 }, shadowOpacity: shadowAnim.interpolate({
                        inputRange: [0, 10],
                        outputRange: [0, 1],
                    }), shadowRadius: 5, zIndex: 2
                }}>
                    <WisbIcon icon={IconType.Dumpster} size={80} />
                </Animated.View>

                <Swiper
                    ref={swiperRef}
                    showsButtons={false}
                    showsPagination={false}
                    scrollEnabled={false}
                    loop={false}>
                    <View style={{ flex: 1, padding: 10 }}>
                        <View>
                            <Text style={{ fontSize: 16, fontWeight: "bold" }}>stworzone przez</Text>
                        </View>

                        <TextInput multiline>
                            Opis
                        </TextInput>

                        <TextInput multiline>
                            Zdjęcia
                        </TextInput>
                    </View>
                    <View style={{ flex: 1, padding: 15 }}>
                        <MapView
                            pitchEnabled={false}
                            zoomEnabled={false}
                            rotateEnabled={false}
                            scrollEnabled={false}
                            showsScale={false}
                            showsIndoors={false}
                            showsTraffic={false}
                            showsMyLocationButton={false}
                            toolbarEnabled={false}
                            showsCompass={false}
                            provider="google"
                            showsPointsOfInterest={false}
                            style={{ flex: 1, borderRadius: 15 }} />
                        <TextInput>SIEMa</TextInput>
                    </View>
                </Swiper>

                <Animated.View style={{
                    width: "100%", paddingBottom: 5, paddingTop: 5, flexDirection: "column", alignItems: "center", shadowColor: "black", shadowOffset: { height: -1, width: 0 }, shadowOpacity: shadowAnim.interpolate({
                        inputRange: [0, 10],
                        outputRange: [0, 1],
                    }), shadowRadius: 5, backgroundColor: "white"
                }}>
                    <Text style={{ fontWeight: "bold", fontStyle: "italic" }}>{PagesList[index].name}</Text>
                    <ProgressInput translationAnimationTime={TranslationAnimationDuration} selectedOptionIndex={index} options={PagesList}
                        style={{ width: "95%" }}
                        onSelectedOptionChanged={i => {
                            setIndex(i)
                            swiperRef.current?.scrollTo(i, true)
                        }} />
                </Animated.View>
            </View>
        </ShakyDialog>
    )
}