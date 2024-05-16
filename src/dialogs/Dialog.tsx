import React, { Component } from 'react';
import {
    Animated,
    ViewProps,
    Modal,
    SafeAreaView,
    Pressable,
    ViewStyle
} from 'react-native';

interface Props {
    visible: boolean;
    onDismiss?: () => void;
    children: React.ReactNode
    backdropStyle?: ViewStyle
    dialogStyle?: ViewStyle
}

export default function Dialog({ visible, onDismiss, children, backdropStyle, dialogStyle }: Props) {
    return (
        <Modal
            animationType='slide'
            transparent
            visible={visible}
            onDismiss={onDismiss}>

            <Pressable
                style={{ height: "100%", display: "flex" }}
                onPress={onDismiss} >
                <SafeAreaView style={{ backgroundColor: "#00000055", flex: 1, justifyContent: "flex-end", alignItems: "center", ...backdropStyle }}>
                    <Animated.View
                        onStartShouldSetResponder={(event) => true}
                        onTouchEnd={(e) => {
                            e.stopPropagation();
                        }}
                        style={[
                            {
                                minWidth: 50,
                                minHeight: 50,
                                width: "100%",
                                height: "95%",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                backgroundColor: "white",
                                borderTopLeftRadius: 15,
                                borderTopRightRadius: 15,
                                overflow: "hidden",
                                ...dialogStyle
                            }
                        ]}>
                        {children}
                    </Animated.View>
                </SafeAreaView>
            </Pressable>
        </Modal>
    )
}