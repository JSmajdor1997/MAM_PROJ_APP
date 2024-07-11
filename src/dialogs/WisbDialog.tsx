import React from 'react';
import {
    Animated,
    Modal,
    SafeAreaView,
    Pressable,
    Text,
    ScrollView,
    View,
    TouchableOpacity,
    StyleSheet,
    StyleProp,
    ViewStyle
} from 'react-native';
import WisbIcon from "../components/WisbIcon/WisbIcon"
import Swiper from 'react-native-swiper';
import Resources from '../../res/Resources';
import ProgressInput from '../components/ProgressInput';
import ConfettiCannon from 'react-native-confetti-cannon';
import useShaky from '../hooks/useShaky';
import FAB from '../components/FAB';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faClose, faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { Menu, MenuItem } from 'react-native-material-menu';
import WisbScreens from '../screens/WisbScreens';
import IconType from '../components/WisbIcon/IconType';
import ModificatorType from '../components/WisbIcon/ModificatorType';

const res = Resources.get()

export enum AddingPhases {
    None,
    Adding,
    Added
}

export interface RenderPageProps<IndexType> {
    currentIndex: IndexType
    shake: () => void
    startConfetti: () => void
}

export interface Section<IndexType> {
    icon: React.ReactNode
    color: string
    name: string

    enabled: () => boolean
    renderPage(props: RenderPageProps<IndexType>, index: number): React.ReactNode
}

export enum Mode {
    Adding,
    Viewing
}

export interface Action {
    label: string
    icon: React.ReactNode
    color: string
    onPress: (startConfetti: () => void) => void
}

export interface Props<IndexType extends number> {
    style?: ViewStyle
    mode: Mode
    onDismiss(): void
    visible: boolean

    sections: { [key in IndexType]: Section<IndexType> }
    sectionsOrder: IndexType[]

    mainIcon: IconType

    actions?: Action[]
    moreActions?: Action[]
}

const ShakeOffset = 15
const ShakingDuration = 15
const TranslationAnimationDuration = 300

export default function WisbDialog<IndexType extends number>({ style, mode, onDismiss, visible, sections, sectionsOrder, actions, moreActions, mainIcon }: Props<IndexType>) {
    const shadowAnim = React.useRef(new Animated.Value(0)).current;
    const swiperRef = React.useRef<Swiper>(null)
    const [currentIndex, setCurrentIndex] = React.useState<IndexType>(sectionsOrder[0])
    const [makeConfetti, setMakeConfetti] = React.useState(false)
    const [isMoreMenuVisible, setIsMoreMenuVisible] = React.useState(false)

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

    return (
        <Modal
            animationType='slide'
            transparent
            visible={visible}
            onDismiss={onDismiss}>

            <Pressable
                style={{ height: "100%", display: "flex", ...style }}
                onPress={onDismiss} >
                <View style={{ backgroundColor: res.getColors().BackdropBlack, flex: 1, justifyContent: "flex-end", alignItems: "center" }}>
                    <Animated.View
                        onStartShouldSetResponder={(event) => true}
                        onTouchEnd={(e) => {
                            e.stopPropagation();
                        }}
                        style={[
                            {
                                transform: [
                                    { translateX: translationX }
                                ],
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
                                flexDirection: "column"
                            }
                        ]}>
                        <Animated.View style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            paddingLeft: 15,
                            paddingRight: 15,
                            alignItems: "center",
                            width: "100%", backgroundColor: res.getColors().Primary, padding: 5, shadowColor: res.getColors().Black, shadowOffset: { height: 1, width: 1 }, shadowOpacity: shadowAnim.interpolate({
                                inputRange: [0, 10],
                                outputRange: [0, 1],
                            }), shadowRadius: 5,
                        }}>
                            <TouchableOpacity onPress={onDismiss}>
                                <FontAwesomeIcon icon={faClose} color={res.getColors().White} size={20} />
                            </TouchableOpacity>

                            <WisbIcon icon={mainIcon} size={80} modificator={mode == Mode.Adding ? ModificatorType.Add : undefined} />

                            <View>
                                {moreActions == null ? null :
                                    <Menu
                                        visible={isMoreMenuVisible}
                                        onRequestClose={() => setIsMoreMenuVisible(false)}
                                        anchor={
                                            <TouchableOpacity style={{ position: "absolute", right: 0, top: -9 }} onPress={() => setIsMoreMenuVisible(true)}>
                                                <FontAwesomeIcon icon={faEllipsisV} size={20} color={res.getColors().White} />
                                            </TouchableOpacity>
                                        }>
                                        {moreActions.map((action, index) => (
                                            <MenuItem key={`${index}|${action.label}`} onPress={() => { setIsMoreMenuVisible(false); action.onPress }} style={{ backgroundColor: action.label, flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 5, paddingLeft: 10 }}>
                                                {action.icon}
                                                <Text style={{ flex: 1 }}>{action.label}</Text>
                                            </MenuItem>
                                        ))}
                                    </Menu>
                                }
                            </View>
                        </Animated.View>

                        {
                            mode == Mode.Adding ? (
                                <Swiper
                                    loadMinimal
                                    ref={swiperRef}
                                    showsButtons={false}
                                    showsPagination={false}
                                    scrollEnabled={false}
                                    loop={false}>
                                    {sectionsOrder.map((it, index) => sections[it].renderPage({ shake, startConfetti, currentIndex }, index))}
                                </Swiper>
                            ) : <ScrollView>
                                {sectionsOrder.map((it, index) => sections[it].renderPage({ shake, startConfetti, currentIndex }, index))}
                            </ScrollView>
                        }

                        {
                            mode == Mode.Adding ?
                                <Animated.View style={{
                                    width: "100%", paddingBottom: 5, paddingTop: 5, flexDirection: "column", alignItems: "center", shadowColor: res.getColors().Black, shadowOffset: { height: -1, width: 0 }, shadowOpacity: shadowAnim.interpolate({
                                        inputRange: [0, 10],
                                        outputRange: [0, 1],
                                    }), shadowRadius: 5, backgroundColor: res.getColors().White
                                }}>
                                    <Text style={{ fontWeight: "bold", fontStyle: "italic" }}>{sections[currentIndex].name}</Text>
                                    <ProgressInput
                                        translationAnimationTime={TranslationAnimationDuration}
                                        selectedOptionIndex={sectionsOrder.indexOf(currentIndex)}
                                        options={sectionsOrder.map((it, index) => {
                                            const section = sections[it]

                                            return {
                                                ...section,
                                                disabled: !sectionsOrder.slice(0, index).every(it => sections[it].enabled())
                                            }
                                        })}
                                        style={{ width: "95%" }}
                                        onSelectedOptionChanged={i => {
                                            setCurrentIndex(sectionsOrder[i])
                                            swiperRef.current?.scrollTo(i, true)
                                        }} />
                                </Animated.View> : null
                        }

                        {makeConfetti ? <ConfettiCannon count={40} origin={{ x: 0, y: 0 }} autoStart={true} fadeOut /> : null}

                        {actions == null || mode == Mode.Adding ? null : (
                            <View style={{ flexDirection: 'row', justifyContent: "space-between", width: "100%", padding: 10, height: 100 }}>
                                {actions.map((action, index) => (
                                    <FAB key={`${index}|${action.label}`} {...action} onPress={() => action.onPress(startConfetti)} />
                                ))}
                            </View>
                        )}
                    </Animated.View>
                </View>
            </Pressable>
        </Modal>
    )
}

const styles = StyleSheet.create({

})