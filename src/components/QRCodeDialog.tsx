import { Modal, Pressable, Text, TouchableOpacity, View } from "react-native"
import Resources from "../../res/Resources"
import React from "react"
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faQrcode } from "@fortawesome/free-solid-svg-icons";

export interface Props {
    visible: boolean
    onQrCodeScanned: (code: string) => void
    onDismiss: () => void
}

export default function QRCodeDialog({ visible, onQrCodeScanned, onDismiss }: Props) {
    return (
        <Modal
            animationType='slide'
            transparent
            visible={visible}
            onDismiss={onDismiss}>
            <Pressable
                style={{ height: "100%", display: "flex", backgroundColor: Resources.get().getColors().BackdropBlack, justifyContent: "center", alignItems: "center" }}
                onPress={onDismiss} >
                <View style={{ borderRadius: 15, width: "90%", height: "90%", backgroundColor: "white", alignItems: "center", flexDirection: "column" }}>
                    <View style={{justifyContent: "center", padding: 15}}>
                        <FontAwesomeIcon icon={faQrcode} size={40}/>
                    </View>
                    
                    <View style={{ flex: 1, alignItems: "center" }}>
                        <QRCodeScanner
                            onRead={(code) => {console.log(code) }}
                            containerStyle={{maxWidth: "100%", maxHeight: 400}}
                            cameraStyle={{width: "100%", alignSelf: "center"}}
                            flashMode={RNCamera.Constants.FlashMode.auto}
                        />
                    </View>

                    <View style={{ padding: 15}}>
                        <Text style={{fontWeight: "400", letterSpacing: 1, fontFamily: "Avenir"}}>Sprzątanie Gliwic, Gliwice Zimnej Wody 15</Text>
                    </View>

                    <Pressable style={{ padding: 10 }}>
                        <Text>OK</Text>
                    </Pressable>
                </View>
            </Pressable>
        </Modal>
    )
}