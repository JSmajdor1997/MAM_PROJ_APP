import { ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native"
import ShakyDialog from "./ShakyDialog"
import WisbIcon, { IconType } from "../components/WisbIcon"
import { Resources } from "../../res/Resources"
import FAB from "../components/FAB"
import MapView from "react-native-maps"
import ImagesGallery from "../components/ImagesGallery"
import Wasteland from "../API/data_types/Wasteland"
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCalendar, faClose, faLocationArrow, faMapPin, faShare } from "@fortawesome/free-solid-svg-icons"
import React from "react"
import ConfettiCannon from 'react-native-confetti-cannon';

export enum Mode {
    Adding,
    Viewing
}

export interface Props {
    wasteland?: Wasteland
    mode: Mode
    onDismiss?: () => void
    onAdd?: (wasteland: Wasteland) => void
    onClean?: (images: unknown[]) => void
    visible: boolean
}

export default function WastelandDialog({ onDismiss, wasteland: providedWasteland, mode, visible }: Props) {
    const confettiCannonRef = React.useRef<ConfettiCannon>(null)
    const wasteland: Partial<Wasteland> = mode == Mode.Adding || providedWasteland == null ? {} : providedWasteland

    return (
        <ShakyDialog
            shakingDuration={15}
            shakingOffset={2}
            onDismiss={onDismiss}
            visible={visible}>
            <View style={{ height: "100%", width: "100%", flexDirection: "column" }}>
                <View style={{ width: "100%", backgroundColor: Resources.Colors.Primary, padding: 5 }}>
                    <WisbIcon icon={IconType.WastelandIcon} size={80} />
                </View>

                <ScrollView style={{ flex: 1, margin: 5 }}>
                    <View style={{ height: 200, width: '100%', borderRadius: 15, overflow: "hidden" }}>
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
                            style={{ flex: 1 }} />

                        <FAB
                            color={Resources.Colors.White}
                            icon={<FontAwesomeIcon icon={faLocationArrow} size={20} color={"black"} />}
                            style={{
                                position: "absolute",
                                right: 10,
                                bottom: 10
                            }}
                            size={40}
                            onPress={() => { }} />
                    </View>

                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 10 }}>
                        <Text style={{ fontStyle: "italic", letterSpacing: 1 }}>Szczebrzeszyno dolne</Text>
                        <FontAwesomeIcon icon={faMapPin} size={15} />
                    </View>

                    <View style={{ flexDirection: "row", padding: 10, justifyContent: "space-between" }}>
                        <FontAwesomeIcon icon={faCalendar} size={15} />
                        <View style={{ flexDirection: "row" }}>
                            <Text style={{ fontStyle: "italic", letterSpacing: 1 }}>zgłoszono</Text>
                            <Text style={{ fontStyle: "italic", letterSpacing: 1, marginLeft: 5, fontWeight: "bold" }}>wczoraj</Text>
                            <Text style={{ fontStyle: "italic", letterSpacing: 1, marginLeft: 5 }}>przez</Text>
                            <Text style={{ fontStyle: "italic", letterSpacing: 1, marginLeft: 5, fontWeight: "bold" }}>Mariusz1997</Text>
                        </View>
                    </View>

                    <View>
                        <TextInput style={{ width: "100%", height: 100, backgroundColor: "white", borderRadius: 10, shadowColor: "black", borderStyle: "dashed", borderWidth: 2, paddingLeft: 8, paddingRight: 8 }} multiline value="lorem ipsum" />
                        <Text>Opis</Text>
                    </View>

                    <View style={{
                        width: "100%",
                        marginTop: 40
                    }}>
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

                    <View style={{
                        width: "100%",
                        marginTop: 40
                    }}>
                        <Text>Zdjęcia po sprzątnięciu przez Mariusz1997</Text>
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
                </ScrollView>

                <ConfettiCannon ref={confettiCannonRef} count={40} origin={{x: 0, y: 0}} autoStart={false} fadeOut/>

                <View style={{ width: "100%", paddingBottom: 5, paddingTop: 5, justifyContent: "space-around", flexDirection: "row" }}>
                    <FAB color={Resources.Colors.Red} icon={<FontAwesomeIcon icon={faClose} color="white" />} size={50} onPress={onDismiss} />
                    <FAB color={Resources.Colors.Blue} icon={<FontAwesomeIcon icon={faShare} color="white" />} size={40} onPress={() => { }} />
                    <FAB color={Resources.Colors.Primary} icon={<WisbIcon icon={IconType.BroomMono} size={25} />} size={50} onPress={() => { confettiCannonRef.current?.start() }} />
                </View>
            </View>
        </ShakyDialog>
    )
}