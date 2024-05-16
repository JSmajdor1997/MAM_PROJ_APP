import React from 'react';
import {
    Animated,
    Modal,
    SafeAreaView,
    Pressable,
    Text,
    ScrollView,
    View,
    TouchableOpacity
} from 'react-native';
import WisbIcon, { IconType, ModificatorType } from "../components/WisbIcon"
import Swiper from 'react-native-swiper';
import { Resources } from '../../res/Resources';
import ProgressInput from '../components/ProgressInput';
import ConfettiCannon from 'react-native-confetti-cannon';
import useShaky from './useShaky';
import IdType from '../utils/IdType';
import FAB from '../components/FAB';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { Menu, MenuItem } from 'react-native-material-menu';
import WisbScreens from '../screens/WisbScreens';

export interface RenderPageProps<IndexType> {
    currentIndex: IndexType
    shake: () => void
    startConfetti: () => void
}

export interface Section<IndexType> {
    icon: React.ReactNode
    color: string
    name: string

    enabled?: () => boolean
    renderPage(props: RenderPageProps<IndexType>): React.ReactNode
}

export enum Mode {
    Adding,
    Viewing
}

export interface Action {
    label: string
    icon: React.ReactNode
    color: string
    onPress: () => void
}

export interface Props<IndexType extends IdType> {
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

export default function WisbDialog<IndexType extends IdType>({ mode, onDismiss, visible, sections, sectionsOrder, actions, moreActions }: Props<IndexType>) {
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
                style={{ height: "100%", display: "flex" }}
                onPress={onDismiss} >
                <SafeAreaView style={{ backgroundColor: "#00000055", flex: 1, justifyContent: "flex-end", alignItems: "center" }}>
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
                                height: "95%",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                backgroundColor: "white",
                                borderTopLeftRadius: 15,
                                borderTopRightRadius: 15,
                                overflow: "hidden",
                                flexDirection: "column"
                            }
                        ]}>
                        <Animated.View style={{
                            width: "100%", backgroundColor: Resources.Colors.Primary, padding: 5, shadowColor: "black", shadowOffset: { height: 1, width: 1 }, shadowOpacity: shadowAnim.interpolate({
                                inputRange: [0, 10],
                                outputRange: [0, 1],
                            }), shadowRadius: 5, zIndex: 2
                        }}>
                            <WisbIcon icon={IconType.Calendar} size={80} modificator={mode == Mode.Adding ? ModificatorType.Add : undefined} />

                            {moreActions == null ? null :
                                <Menu
                                    visible={isMoreMenuVisible}
                                    onRequestClose={() => setIsMoreMenuVisible(false)}
                                    anchor={
                                        <TouchableOpacity style={{ position: "absolute", right: 0, top: 0 }}>
                                            <FontAwesomeIcon icon={faEllipsisV} />
                                        </TouchableOpacity>
                                    }>
                                    {moreActions.map(action => (
                                        <MenuItem onPress={() => { setIsMoreMenuVisible(false); action.onPress }} style={{ backgroundColor: action.label, flexDirection: "row", justifyContent: "space-between" }}>
                                            {action.icon}
                                            <Text style={{ flex: 1 }}>{action.label}</Text>
                                        </MenuItem>
                                    ))}
                                </Menu>
                            }
                        </Animated.View>

                        {
                            mode == Mode.Adding ? (
                                <Swiper
                                    ref={swiperRef}
                                    showsButtons={false}
                                    showsPagination={false}
                                    scrollEnabled={false}
                                    loop={false}>
                                    {sectionsOrder.map(it => sections[it].renderPage({ shake, startConfetti, currentIndex }))}
                                </Swiper>
                            ) : <ScrollView>
                                {sectionsOrder.map(it => sections[it].renderPage({ shake, startConfetti, currentIndex }))}
                            </ScrollView>
                        }

                        {
                            mode == Mode.Adding ?
                                <Animated.View style={{
                                    width: "100%", paddingBottom: 5, paddingTop: 5, flexDirection: "column", alignItems: "center", shadowColor: "black", shadowOffset: { height: -1, width: 0 }, shadowOpacity: shadowAnim.interpolate({
                                        inputRange: [0, 10],
                                        outputRange: [0, 1],
                                    }), shadowRadius: 5, backgroundColor: "white"
                                }}>
                                    <Text style={{ fontWeight: "bold", fontStyle: "italic" }}>{sections[currentIndex].name}</Text>
                                    <ProgressInput
                                        translationAnimationTime={TranslationAnimationDuration}
                                        selectedOptionIndex={sectionsOrder.indexOf(currentIndex)}
                                        options={sectionsOrder.map(it => {
                                            const section = sections[it]

                                            return {
                                                ...section,
                                                disabled: section.enabled == null ? false : !section.enabled()
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

                        {actions == null ? null : (
                            <View style={{ flexDirection: 'column', justifyContent: "space-around" }}>
                                {actions.map(action => (
                                    <FAB {...action} />
                                ))}
                            </View>
                        )}
                    </Animated.View>
                </SafeAreaView>
            </Pressable>
        </Modal>
    )
}