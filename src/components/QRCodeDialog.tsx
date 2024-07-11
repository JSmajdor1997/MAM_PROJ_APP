import { Animated, Modal, Pressable, Text, TouchableOpacity, View } from "react-native"
import Resources from "../../res/Resources"
import React from "react"
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faQrcode } from "@fortawesome/free-solid-svg-icons";
import getAPI from "../API/getAPI";
import Spinner from "react-native-spinkit";
import BlurryView from "./BlurryView";
import useShaky from "../hooks/useShaky";
import { WisbEvent } from "../API/interfaces";

const res = Resources.get()

export interface Props {
    visible: boolean
    onEvent: (event: WisbEvent) => void
    onDismiss: () => void
}

export default function QRCodeDialog({ visible, onEvent, onDismiss }: Props) {
    const [isLoading, setIsLoading] = React.useState(false)

    const { shake, translationX } = useShaky({
        durationMs: 40,
        offset: 15
    })

    return (
        <Modal
            animationType='slide'
            transparent
            visible={visible}
            onDismiss={onDismiss}>
            <Pressable
                style={{ height: "100%", display: "flex", backgroundColor: res.getColors().BackdropBlack, justifyContent: "center", alignItems: "center" }}
                onPress={onDismiss} >
                <Animated.View style={{ borderRadius: 15, width: "90%", height: "90%", backgroundColor: "white", alignItems: "center", flexDirection: "column", transform: [{ translateX: translationX }] }}>
                    <View style={{ justifyContent: "center", padding: 15 }}>
                        <FontAwesomeIcon icon={faQrcode} size={40} />
                    </View>

                    <View style={{ alignItems: "center", justifyContent: "center" }}>
                        <QRCodeScanner
                            reactivate={!isLoading}
                            reactivateTimeout={1500}
                            onRead={async result => {
                                setIsLoading(true)
                                const api = getAPI()
                                const event = (await api.getEventByQrCode(result.data))?.data

                                setIsLoading(false)

                                if (event != null) {
                                    onEvent(event)
                                } else {
                                    shake()
                                }
                            }}
                            containerStyle={{ maxWidth: "100%", maxHeight: 400 }}
                            cameraStyle={{ width: "100%", alignSelf: "center" }}
                            flashMode={RNCamera.Constants.FlashMode.auto}
                        />

                        {isLoading ? <Spinner type="Circle" style={{ position: "absolute" }} color={res.getColors().Primary} /> : null}
                    </View>

                    <View style={{ flex: 1 }} />

                    <View style={{ padding: 15 }}>
                        <Text style={{ fontWeight: "400", letterSpacing: 1, fontFamily: "Avenir" }}>Sprzątanie Gliwic, Gliwice Zimnej Wody 15</Text>
                    </View>

                    <TouchableOpacity style={{ padding: 10 }} onPress={onDismiss}>
                        <Text>OK</Text>
                    </TouchableOpacity>
                </Animated.View>
            </Pressable>
        </Modal>
    )
}