import { faArrowRight, faBell, faClose, faDumpster, faEnvelope, faMessage, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { Animated, Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View, ViewStyle, Easing } from "react-native";
import Resources from "../../../res/Resources";
import React, { useRef } from "react";
import { Swipeable } from "react-native-gesture-handler";
import { LatLng } from "react-native-maps";
import getAPI from "../../API/getAPI";
import uuid from 'react-native-uuid';
import { CRUD, NewInvitationNotification, NewMessageNotification, Notification, ObjectCRUDNotification, isNewInvitationNotification, isNewMessageNotification, isObjectCRUDNotification } from "../../API/notifications";
import WisbObjectType from "../../API/WisbObjectType";
import Toast from 'react-native-simple-toast';
import IconType from "../WisbIcon/IconType";
import WisbIcon from "../WisbIcon/WisbIcon";
import Avatar from "../Avatar";
import { useClickOutside } from "react-native-click-outside";
import Ref from "../../API/Ref";
import PulsingComponent from "../PulsingComponent";
import { isInvitation } from "../../API/type_guards";
import { Invitation } from "../../API/interfaces";

const res = Resources.get()
const api = getAPI()

export interface Props {
    style?: ViewStyle
    userPosition: LatLng

    expanded: boolean
    onExpandedChange: (expanded: boolean) => void

    onOpenChat: (id: Ref<WisbObjectType.Event>) => void
    onItemSelected: (id: Ref<WisbObjectType.Dumpster | WisbObjectType.Event | WisbObjectType.Wasteland>) => void
}

const MaxNrNotifications = 10

const NewNotificationCleartimeout = 3000

type ItemType = (Omit<NewInvitationNotification, "author"> | NewMessageNotification | ObjectCRUDNotification<WisbObjectType.Dumpster | WisbObjectType.Event | WisbObjectType.Wasteland, CRUD.Created>) & { key: string }

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity)

function getNotificationMessage(n: ItemType) {
    return isObjectCRUDNotification(n) ? (
        n.type == WisbObjectType.Dumpster ? "Nowy śmietnik w Twojej okolicy!" :
            n.type == WisbObjectType.Wasteland ? "Nowe wysypisko w Twojej okolicy!" :
                "Nowe wydarzenie w twojej okolicy!"
    ) : isNewMessageNotification(n) ? `Nowa wiadomość: ${n.message.content}` :
        `Zaproszenie do ${n.invitation.event.name}`
}

export default function NotificationsList({ style, userPosition, expanded, onExpandedChange, onOpenChat, onItemSelected }: Props) {
    const outsideClickRef = useClickOutside<View>(() => {
        if (expanded) {
            onExpandedChange(false)
        }
    });

    let newestNotificationId: NodeJS.Timeout | null = null

    const [newestNotification, setNewestNotification] = React.useState<string | null>()

    const [invitations, setInvitations] = React.useState<({ invitation: Invitation, key: string })[]>([])
    const [notifications, setNotifications] = React.useState<ItemType[]>([])

    const scrollViewHeight = useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        if (expanded) {
            Animated.timing(scrollViewHeight, {
                toValue: 200,
                duration: 300,
                useNativeDriver: false
            }).start();
        } else {
            Animated.timing(scrollViewHeight, {
                toValue: 0,
                duration: 300,
                useNativeDriver: false
            }).start();
        }
    }, [expanded, newestNotification]);

    const onNotification = async (n: Notification) => {
        const settings = res.getSettings()

        if (newestNotificationId != null) {
            clearTimeout(newestNotificationId)
        }

        const notification: ItemType = {
            ...n,
            key: uuid.v4().toString()
        } as any

        setNewestNotification(getNotificationMessage(notification))
        newestNotificationId = setTimeout(() => {
            setNewestNotification(null)
            newestNotificationId = null
        }, NewNotificationCleartimeout)

        if (isNewInvitationNotification(notification) && settings.notifications.newInvitation) {
            setInvitations(invitations => [
                notification,
                ...invitations
            ])
        }

        if (
            (isObjectCRUDNotification(notification) && notification.action == CRUD.Created && (
                settings.notifications.newDumpsterInArea && notification.type == WisbObjectType.Dumpster ||
                settings.notifications.newEventInArea && notification.type == WisbObjectType.Event ||
                settings.notifications.newWastelandInArea && notification.type == WisbObjectType.Wasteland
            )) || (
                isNewMessageNotification(notification) && settings.notifications.newMessage
            )
        ) {
            setNotifications(notifications => {
                const toRemove = notifications.length - MaxNrNotifications
                if (toRemove > 0) {
                    notifications.splice(notifications.length - 1 - toRemove)
                }

                return [
                    notification,
                    ...notifications
                ]
            })
        }
    }

    React.useEffect(() => {
        api.getMyInvitations().then(rsp => {
            if (rsp.data != null) {
                invitations.push(...rsp.data.map(invitation => ({ invitation, key: uuid.v4().toString() })))
            }
        })

        api.notifications.registerListener(onNotification, { location: userPosition })

        return () => {
            api.notifications.unregisterListener(onNotification)
        }
    }, [])

    React.useEffect(() => {
        res.registerUserLocationListener(newLocation => {
            api.notifications.updateListener(onNotification, { location: newLocation })
        })
    }, [userPosition])

    const deleteNotification = (id: string) => {
        notifications.splice(notifications.findIndex(it => it.key == id), 1)

        setNotifications(notifications)
    }

    const deleteInvitations = (id: string) => {
        invitations.splice(invitations.findIndex(it => it.key == id), 1)

        setInvitations(invitations)
    }

    return (
        <View ref={outsideClickRef} style={{ ...style }}>
            {notifications.length == 0 && invitations.length == 0 ? <Text style={{ fontSize: 8, alignSelf: "center" }}>BRAK POWIADOMIEŃ</Text> : (
                <TouchableOpacity onPress={() => onExpandedChange(!expanded)} style={{ paddingHorizontal: 10, flexDirection: "row", justifyContent: "center", alignItems: "center", height: 20 }}>
                    <PulsingComponent
                        onDuration={50}
                        offDuration={50}
                        numberOfPulses={4}
                        isPulsing={newestNotification != null}>
                        {expanded ?
                            <FontAwesomeIcon icon={faClose} color={res.getColors().Red} /> :
                            newestNotification == null ?
                                <FontAwesomeIcon icon={faBell} color={res.getColors().DarkBeige} />
                                : null}

                        {newestNotification == null || expanded ? null : <Text style={{ fontFamily: res.getFonts().Secondary, fontSize: 12 }}>{newestNotification}</Text>}
                    </PulsingComponent>
                </TouchableOpacity>
            )}

            <Animated.FlatList
                data={[...invitations, ...notifications]}
                contentContainerStyle={{ alignItems: "center" }}
                style={{
                    position: "absolute",
                    top: 30,
                    borderRadius: 15,
                    backgroundColor: "white",
                    left: 0,
                    marginLeft: 0,
                    width: "100%",
                    maxHeight: scrollViewHeight,
                    overflow: "hidden",
                }}
                renderItem={({ item: n }) => (
                    isObjectCRUDNotification(n) ? (
                        <NotificationItem
                            key={n.key}
                            onAction={() => {
                                onItemSelected(n.ref!)
                                onExpandedChange(false)
                            }}
                            onDelete={() => deleteNotification(n.key)}
                            actionMessage="Pokaż"
                            message={getNotificationMessage(n)}
                            icon={
                                <WisbIcon icon={(
                                    n.type == WisbObjectType.Dumpster ? IconType.Dumpster :
                                        n.type == WisbObjectType.Wasteland ? IconType.WastelandIcon :
                                            IconType.Calendar
                                )} size={20} />
                            } />
                    ) :
                        isNewMessageNotification(n) ? (
                            <NotificationItem
                                key={n.key}
                                onAction={() => {
                                    onOpenChat(n.message.event)
                                    onExpandedChange(false)
                                }}
                                onDelete={() => deleteNotification(n.key)}
                                message={getNotificationMessage(n)}
                                actionMessage="Pokaż"
                                icon={(
                                    <View>
                                        <FontAwesomeIcon icon={faMessage} style={{ left: -5, bottom: -2 }} size={20} color="white" />
                                        <Avatar
                                            style={{ position: "absolute", marginTop: -4 }}
                                            username={n.message.sender.userName}
                                            image={n.message.sender.photoUrl}
                                            colors={res.getColors().AvatarColors}
                                            size={18}
                                            fontSize={14} />
                                    </View>
                                )} />
                        ) :
                            isNewInvitationNotification(n) ? (
                                <NotificationItem
                                    key={n.key}
                                    onDelete={() => {
                                        api.removeInvitation(n.invitation).then(it => {
                                            deleteInvitations(n.key)
                                            Toast.show(`Usunięto zaproszenie`, Toast.SHORT)
                                        })
                                    }}
                                    message={getNotificationMessage(n)}
                                    actionMessage="Dołącz"
                                    onAction={() => {
                                        api.joinEvent(n.invitation).then(() => {
                                            Toast.show(`Dołączono do wydarzenia ${n.invitation.event.name}!`, Toast.SHORT)

                                            onItemSelected(n.invitation.event)
                                            onExpandedChange(false)
                                        })
                                    }}
                                    icon={<FontAwesomeIcon icon={faEnvelope} size={20} color="white" />} />
                            ) :
                                null
                )} />

        </View>
    )
}

function NotificationItem({ icon, onDelete, message, actionMessage, onAction }: { icon: React.ReactNode, message: string, actionMessage: string, onDelete: () => void, onAction: () => void }) {
    return (
        <Swipeable
            onSwipeableOpen={onDelete}
            containerStyle={{ marginVertical: 10, borderRadius: 15, overflow: "hidden" }}
            renderRightActions={(
                _,
                dragAnimatedValue: Animated.AnimatedInterpolation<number>,
            ) => {
                const opacity = dragAnimatedValue.interpolate({
                    inputRange: [-150, 0],
                    outputRange: [1, 0],
                    extrapolate: 'clamp',
                });

                return (
                    <AnimatedTouchableOpacity
                        onPress={e => {
                            e.stopPropagation()
                            e.preventDefault()
                            onDelete()
                        }}
                        style={[{ opacity }, { height: 40, bottom: 0, backgroundColor: res.getColors().Red, flex: 1, justifyContent: "flex-end", alignItems: "center", paddingHorizontal: 5, flexDirection: "row" }]}>
                        <FontAwesomeIcon icon={faTrash} color="white" size={12} />
                        <Text style={{ marginLeft: 10, fontFamily: res.getFonts().Secondary, color: "white", fontWeight: "600" }}>Delete</Text>
                    </AnimatedTouchableOpacity>
                );
            }}>
            <View
                style={styles.neomorph}>
                {icon}

                <Text style={{ fontFamily: res.getFonts().Secondary, flex: 1, marginHorizontal: 5, fontSize: 12, textAlign: "center" }}>{message}</Text>

                <TouchableOpacity
                    style={styles.joinButtonContainer}
                    onPress={onAction}>
                    <View
                        style={styles.innerNeomorph}>
                        <Text style={styles.joinText}>{actionMessage}</Text>

                        <FontAwesomeIcon icon={faArrowRight} style={styles.arrowIcon} color='white' />
                    </View>
                </TouchableOpacity>
            </View>
        </Swipeable>
    )
}

const styles = StyleSheet.create({
    neomorph: {
        shadowRadius: 10,
        backgroundColor: '#E5E5E5',
        width: Dimensions.get("window").width * 0.9,
        height: 40,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingLeft: 15,
    },
    joinButtonContainer: {
        height: 40,
        alignItems: "center",
        justifyContent: "center"
    },
    innerNeomorph: {
        shadowRadius: 5,
        shadowOpacity: 0.1,
        borderRadius: 15,
        flexDirection: "row",
        backgroundColor: "#CCC",
        width: 120,
        height: 40,
        alignItems: "center",
        justifyContent: "space-between",
        padding: 5,
        paddingHorizontal: 10
    },
    joinText: {
        color: "white",
        fontFamily: res.getFonts().Secondary,
        fontWeight: "500",
        letterSpacing: 1
    },
    arrowIcon: {
        marginLeft: 5
    }
});
