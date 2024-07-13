import { faQrcode } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import React from "react";
import { Animated, Modal, Pressable, Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { RNCamera } from 'react-native-camera';
import QRCodeScanner from 'react-native-qrcode-scanner';
import Spinner from "react-native-spinkit";
import Resources from "../../res/Resources";
import getAPI from "../API/getAPI";
import { WisbEvent } from "../API/interfaces";
import useShaky from "../hooks/useShaky";

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
                style={styles.pressable}
                onPress={onDismiss} >
                <Animated.View style={[styles.animatedView, { transform: [{ translateX: translationX }] }]}>
                    <View style={styles.iconContainer}>
                        <FontAwesomeIcon icon={faQrcode} size={40} />
                    </View>

                    <View style={styles.qrCodeContainer}>
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
                            containerStyle={styles.qrCodeScannerContainer}
                            cameraStyle={styles.qrCodeCamera}
                            flashMode={RNCamera.Constants.FlashMode.auto}
                        />

                        {isLoading ? <Spinner type="Circle" style={styles.spinner} color={res.getColors().Primary} /> : null}
                    </View>

                    <View style={styles.flexOne} />

                    <View style={styles.descriptionContainer}>
                        <Text style={styles.descriptionText}>Sprzątanie Gliwic, Gliwice Zimnej Wody 15</Text>
                    </View>

                    <TouchableOpacity style={styles.okButton} onPress={onDismiss}>
                        <Text>OK</Text>
                    </TouchableOpacity>
                </Animated.View>
            </Pressable>
        </Modal>
    )
}

const styles = StyleSheet.create({
    pressable: {
        height: "100%",
        display: "flex",
        backgroundColor: res.getColors().BackdropBlack,
        justifyContent: "center",
        alignItems: "center"
    },
    animatedView: {
        borderRadius: 15,
        width: "90%",
        height: "90%",
        backgroundColor: "white",
        alignItems: "center",
        flexDirection: "column"
    },
    iconContainer: {
        justifyContent: "center",
        padding: 15
    },
    qrCodeContainer: {
        alignItems: "center",
        justifyContent: "center"
    },
    qrCodeScannerContainer: {
        maxWidth: "100%",
        maxHeight: 400
    },
    qrCodeCamera: {
        width: "100%",
        alignSelf: "center"
    },
    spinner: {
        position: "absolute"
    },
    flexOne: {
        flex: 1
    },
    descriptionContainer: {
        padding: 15
    },
    descriptionText: {
        fontWeight: "400",
        letterSpacing: 1,
        fontFamily: "Avenir"
    },
    okButton: {
        padding: 10
    }
});
