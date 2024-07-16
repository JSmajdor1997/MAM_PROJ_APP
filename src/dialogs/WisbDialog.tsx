import { faAdd, faCheck, faClose, faEdit, faEllipsisV, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React from 'react';
import {
    Animated,
    Modal,
    Pressable,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
    StyleSheet,
    Share
} from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';
import { Menu, MenuItem } from 'react-native-material-menu';
import Spinner from 'react-native-spinkit';
import Swiper from 'react-native-swiper';
import Resources from '../../res/Resources';
import { TypeMap } from '../API/API';
import WisbObjectType from '../API/WisbObjectType';
import getAPI from '../API/getAPI';
import { WisbDumpster, WisbEvent, WisbUser, WisbWasteland } from '../API/interfaces';
import { isDumpster, isEvent, isWasteland } from '../API/type_guards';
import FAB from '../components/FAB';
import IconType from '../components/WisbIcon/IconType';
import ModificatorType from '../components/WisbIcon/ModificatorType';
import WisbIcon from "../components/WisbIcon/WisbIcon";
import useShaky from '../hooks/useShaky';
import ProgressInput from '../components/inputs/ProgressInput';
import { CRUD, Notification, isObjectCRUDNotification } from '../API/notifications';
import Toast from 'react-native-simple-toast';

const res = Resources.get()
const api = getAPI()

export interface RenderPageProps<Type extends ObjectType> {
    currentIndex: number
    shake: () => void
    startConfetti: () => void
    setLoading: (label: string | null) => void
    item: Partial<TypeMap<Type>>
    dismiss(): void
    mode: Mode
}

export interface Section<Type extends ObjectType> {
    icon: React.ReactNode
    color: string
    label: string

    enabled: () => boolean
    renderPage(props: RenderPageProps<Type>, index: number): React.ReactNode

    available?: boolean
}

export enum Mode {
    Adding,
    Editing,
    Viewing
}

export interface Action<Type extends ObjectType> {
    label: string
    icon: React.ReactNode
    color: string
    enabled?: boolean
    onPress: (props: RenderPageProps<Type>) => void

    available?: boolean
}

type ObjectType = WisbObjectType.Dumpster | WisbObjectType.Wasteland | WisbObjectType.Event

export interface Props<Type extends ObjectType> {
    type: Type
    workingItem: Partial<TypeMap<Type>>
    mode: Mode
    currentUser: WisbUser

    onDismiss(): void

    sections: Section<Type>[]

    mainIcon: IconType

    actions?: Action<Type>[]

    onModeChanged: (newMode: Mode) => void

    onItemUpdated: (obj: Partial<TypeMap<Type>>) => void
}

const ShakeOffset = 15
const ShakingDuration = 15
const TranslationAnimationDuration = 300

function isAllowedToManage(user: WisbUser, item: Partial<WisbDumpster | WisbEvent | WisbWasteland>) {
    if (isEvent(item)) {
        return item.members.get(user.id.toString())?.isAdmin === true
    } else if (isWasteland(item)) {
        return item.reportedBy.id == user.id
    } else if (isDumpster(item)) {
        return item.addedBy.id == user.id
    } else return false
}

export default function WisbDialog<Type extends ObjectType>({ onItemUpdated, currentUser, type, workingItem, mode, onDismiss, sections, actions, mainIcon, onModeChanged }: Props<Type>) {
    const shadowAnim = React.useRef(new Animated.Value(0)).current;
    const swiperRef = React.useRef<Swiper>(null)
    const [currentIndex, setCurrentIndex] = React.useState<number>(0)
    const [makeConfetti, setMakeConfetti] = React.useState(false)
    const [isMoreMenuVisible, setIsMoreMenuVisible] = React.useState(false)
    const [loadingMessage, setLoadingMessage] = React.useState<string | null>(null)

    React.useEffect(() => {
        const listener = (n: Notification) => {
            if (isObjectCRUDNotification(n)) {
                if (n.action == CRUD.Deleted) {
                    Toast.show(`Obiekt został usunięty przez innego użytkownika!`, Toast.SHORT);
                    onDismiss()
                } else if (n.action == CRUD.Updated) {
                    onItemUpdated(n.updatedFields as any)
                }
            }
        }

        if ((mode == Mode.Editing || mode == Mode.Viewing) && workingItem?.id != null) {
            api.notifications.registerListener(listener, { observedIds: [{ type, id: workingItem.id }] })
        }

        return () => {
            api.notifications.unregisterListener(listener)
        }
    }, [workingItem?.id, type, mode])

    const { shake, translationX } = useShaky({
        durationMs: ShakingDuration,
        offset: ShakeOffset
    })

    const startConfetti = () => {
        if (!makeConfetti) {
            setMakeConfetti(true)
        }
    }

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
    }, [currentIndex]);

    const setLoading = (message: string | null) => {
        setLoadingMessage(message)
    }

    const ManageActions: Action<Type>[] = [
        {
            label: res.getStrings().Dialogs.EventDialog.DeleteAction,
            icon: <FontAwesomeIcon icon={faTrash} />,
            color: res.getColors().Red,
            onPress: ({ setLoading }) => {
                setLoading("Usuwanie...")
                api.deleteOne({ type: type, id: workingItem.id! })
                setLoading(null)
                onDismiss()
            },
        },
        {
            label: res.getStrings().Dialogs.EventDialog.EditAction,
            icon: <FontAwesomeIcon icon={faEdit} />,
            color: res.getColors().White,
            onPress: () => {
                onModeChanged(Mode.Editing)
            }
        }
    ]

    const EditActions: Action<Type>[] = [
        {
            label: "Anuluj",
            icon: <FontAwesomeIcon icon={faClose} />,
            color: res.getColors().Red,
            onPress: () => {
                onModeChanged(Mode.Viewing)
            }
        },
        {
            label: "Zapisz",
            icon: <FontAwesomeIcon icon={faCheck} />,
            color: res.getColors().Green,
            onPress: ({ setLoading }) => {
                setLoading("Zapisywanie...")

                api.updateOne({type, id: workingItem.id!}, workingItem as any).then(()=>{
                    setLoading(null)

                    onItemUpdated(workingItem)
                    onModeChanged(Mode.Viewing)
                })
            },
        }
    ]

    const params = {
        shake, startConfetti, currentIndex, setLoading, item: workingItem, dismiss: onDismiss, mode
    }

    const availableActions = (
        mode == Mode.Editing ? EditActions :
        mode == Mode.Viewing ? (actions??[]).filter(it => it.available !== false) :
        []
    )
    const availableSections = sections.filter(it => it.available !== false)

    return (
        <Modal
            animationType='slide'
            transparent
            visible={true}
            onDismiss={onDismiss}>

            <Pressable
                style={styles.pressable}
                onPress={onDismiss} >
                <View style={styles.modalContainer}>
                    <Animated.View
                        onStartShouldSetResponder={() => true}
                        onTouchEnd={(e) => {
                            e.stopPropagation();
                        }}
                        style={[
                            styles.animatedView,
                            {
                                transform: [
                                    { translateX: translationX }
                                ],
                                shadowOpacity: shadowAnim.interpolate({
                                    inputRange: [0, 10],
                                    outputRange: [0, 1],
                                }),
                            }
                        ]}>
                        <Animated.View style={[
                            styles.headerContainer,
                            {
                                shadowOpacity: shadowAnim.interpolate({
                                    inputRange: [0, 10],
                                    outputRange: [0, 1],
                                }),
                            }
                        ]}>
                            <TouchableOpacity onPress={onDismiss}>
                                <FontAwesomeIcon icon={faClose} color={res.getColors().White} size={20} />
                            </TouchableOpacity>

                            <WisbIcon icon={mainIcon} size={50} modificator={mode == Mode.Adding ? ModificatorType.Add : mode == Mode.Editing ? ModificatorType.Edit : undefined} />

                            <View>
                                {mode == Mode.Viewing && isAllowedToManage(currentUser, workingItem) ?
                                    <Menu
                                        visible={isMoreMenuVisible}
                                        onRequestClose={() => setIsMoreMenuVisible(false)}
                                        anchor={
                                            <TouchableOpacity style={styles.moreButton} onPress={() => setIsMoreMenuVisible(true)}>
                                                <FontAwesomeIcon icon={faEllipsisV} size={20} color={res.getColors().White} />
                                            </TouchableOpacity>
                                        }>
                                        {ManageActions.map((action, index) => (
                                            <MenuItem disabled={!(action.enabled ?? true)} key={`${index}|${action.label}`} onPress={() => { setIsMoreMenuVisible(false); action.onPress(params) }} style={{ ...styles.menuItem, backgroundColor: action.label }}>
                                                {action.icon}
                                                <Text style={styles.menuItemText}>{action.label}</Text>
                                            </MenuItem>
                                        ))}
                                    </Menu>
                                    : null}
                            </View>
                        </Animated.View>

                        <Swiper
                            loadMinimal
                            ref={swiperRef}
                            showsButtons={false}
                            showsPagination={false}
                            scrollEnabled={false}
                            loop={false}>
                            {availableSections.map((it, index) => (
                                <ScrollView>
                                    {it.renderPage(params, index)}
                                </ScrollView>
                            ))}
                        </Swiper>

                        <Animated.View style={[
                            styles.progressInputContainer,
                            {
                                shadowOpacity: shadowAnim.interpolate({
                                    inputRange: [0, 10],
                                    outputRange: [0, 1],
                                }),
                            }
                        ]}>
                            <Text style={styles.sectionName}>{sections[currentIndex].label}</Text>
                            <ProgressInput
                                translationAnimationTime={TranslationAnimationDuration}
                                selectedOptionIndex={currentIndex}
                                options={availableSections.map((it, index) => {
                                    return {
                                        ...it,
                                        disabled: !sections.slice(0, index).every(it => it.enabled())
                                    }
                                })}
                                style={styles.progressInput}
                                onSelectedOptionChanged={i => {
                                    setCurrentIndex(i)
                                    swiperRef.current?.scrollTo(i, true)
                                }} />

                            {availableActions.length == 0 ? null : (
                                <View style={[styles.actionsContainer, {justifyContent: availableActions.length==1 ? "center" : "space-between"}]}>
                                    {availableActions.filter(it => it.available !== false).map((action, index) => (
                                        <FAB size={40} key={`${index}|${action.label}`} {...action} onPress={() => action.onPress(params)} />
                                    ))}
                                </View>)}
                        </Animated.View>

                        {makeConfetti ?
                            <ConfettiCannon count={40} origin={{ x: 0, y: 0 }} autoStart={true} fadeOut /> :
                            null}

                        {loadingMessage != null ? (
                            <View style={styles.loadingContainer}>
                                <View style={styles.spinnerContainer}>
                                    <Spinner type='Circle' color='white' size={50} style={styles.spinner} />
                                    <Text style={styles.loadingText}>{loadingMessage}</Text>
                                </View>
                            </View>
                        ) : null}
                    </Animated.View>
                </View>
            </Pressable>
        </Modal>
    )
}

const styles = StyleSheet.create({
    addButtonContainer: {
        justifyContent: "center",
        alignItems: "center",
        flex: 1
    },
    addButton: {
        padding: 10,
        borderRadius: 15,
        backgroundColor: res.getColors().Beige
    },
    addButtonText: {
        fontWeight: "bold",
        fontSize: 25,
        color: res.getColors().Primary,
        fontFamily: res.getFonts().Secondary
    },
    pressable: {
        height: "100%",
        display: "flex"
    },
    modalContainer: {
        backgroundColor: res.getColors().BackdropBlack,
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "center"
    },
    animatedView: {
        minWidth: 50,
        minHeight: 50,
        width: "100%",
        height: "90%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: res.getColors().White,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        overflow: "hidden",
        flexDirection: "column",
        shadowColor: res.getColors().Black,
        shadowOffset: { height: 1, width: 1 },
        shadowRadius: 5
    },
    headerContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingLeft: 15,
        paddingRight: 15,
        alignItems: "center",
        width: "100%",
        backgroundColor: res.getColors().Primary,
        padding: 5,
        shadowColor: res.getColors().Black,
        shadowOffset: { height: 1, width: 1 },
        shadowRadius: 5
    },
    moreButton: {
        position: "absolute",
        right: 0,
        top: -9
    },
    menuItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 5,
        paddingLeft: 10
    },
    menuItemText: {
        flex: 1,
        fontFamily: res.getFonts().Secondary,
    },
    progressInputContainer: {
        width: "100%",
        paddingBottom: 5,
        paddingTop: 5,
        flexDirection: "column",
        alignItems: "center",
        shadowColor: res.getColors().Black,
        shadowOffset: { height: -1, width: 0 },
        shadowRadius: 5,
        backgroundColor: res.getColors().White
    },
    sectionName: {
        fontWeight: "bold",
        fontStyle: "italic",
        fontFamily: res.getFonts().Secondary
    },
    progressInput: {
        width: "95%"
    },
    actionsContainer: {
        flexDirection: 'row',
        justifyContent: "space-between",
        width: "100%",
        padding: 10,
        height: 80,
    },
    loadingContainer: {
        position: "absolute",
        width: "100%",
        height: "100%",
        backgroundColor: "#00000099",
        justifyContent: "center",
        alignItems: "center",
        pointerEvents: "none"
    },
    spinnerContainer: {
        justifyContent: "center",
        alignItems: "center"
    },
    spinner: {
        width: 63,
        height: 63,
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "center"
    },
    loadingText: {
        textAlign: "center",
        fontWeight: "bold",
        marginTop: 10,
        letterSpacing: 1,
        color: "white",
        fontSize: 20,
        fontFamily: res.getFonts().Secondary,
    },
    sharingContainer: {
        flex: 1
    },
    shareButtonContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    shareButton: {
        backgroundColor: res.getColors().DarkBeige,
        padding: 20,
        borderRadius: 15
    },
    shareButtonText: {
        fontFamily: res.getFonts().Secondary,
        color: "white",
        fontWeight: "600",
        letterSpacing: 1,
        fontSize: 15
    }
});
