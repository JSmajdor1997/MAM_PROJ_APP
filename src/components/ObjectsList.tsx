import { FlatList, StyleSheet, Text, View, ViewStyle } from "react-native";
import searchPlaces, { Place } from "../utils/GooglePlacesAPI/searchPlaces";
import React from "react";
import Spinner from "react-native-spinkit";
import Resources from "../../res/Resources";
import { isWasteland, isEvent, isDumpster, isUser } from "../API/type_guards";
import DumpsterItem from "./DumpsterItem";
import EventItem from "./EventItem";
import LocationItem from "./LocationItem";
import WastelandItem from "./WastelandItem";
import getAPI from "../API/getAPI";
import Toast from 'react-native-simple-toast';
import { LatLng } from "react-native-maps";
import UserItem from "./UserItem";
import CheckBox from 'react-native-check-box'
import WisbObjectType from "../API/WisbObjectType";
import { QueryMap, TypeMap } from "../API/API";
import { WisbDumpster, WisbUser, WisbWasteland } from "../API/interfaces";

export type Multiple<MiltiSelect extends boolean, T> = MiltiSelect extends true ? T[] : T

export type DataType<MiltiSelect extends boolean, ItemType extends WisbObjectType> = Multiple<MiltiSelect, TypeMap<ItemType>>

export interface Props<MiltiSelect extends boolean, ItemType extends WisbObjectType> {
    style?: ViewStyle
    type: ItemType
    multi: MiltiSelect

    filter?: {
        [WisbObjectType.Dumpster]?: QueryMap<WisbObjectType.Dumpster>,
        [WisbObjectType.Wasteland]?: QueryMap<WisbObjectType.Wasteland>,
        [WisbObjectType.User]?: QueryMap<WisbObjectType.User>,
        [WisbObjectType.Event]?: QueryMap<WisbObjectType.Event>,
    }

    onPressed?: (selected: TypeMap<ItemType>) => void
    onSelected?: (selected: TypeMap<ItemType>) => void
    selectedItemsIds?: number[]

    phrase?: string

    currentUser: WisbUser

    googleMapsApiKey: string
    placesConfig?: {
        onPlaceSelected: (place: Place) => void
        userLocation: LatLng
    }
}

const PageSize = 10

const api = getAPI()

export default function ObjectsList<MiltiSelect extends boolean, ItemType extends WisbObjectType>({
    style,
    type,
    multi,
    onSelected,
    googleMapsApiKey,
    currentUser,
    onPressed,
    phrase,
    selectedItemsIds,
    placesConfig,
    filter
}: Props<MiltiSelect, ItemType>) {
    const flatListRef = React.useRef<FlatList>(null)

    const [isLoading, setIsLoading] = React.useState(false)
    const [hasMore, setHasMore] = React.useState(true)

    const [items, setItems] = React.useState<{
        items: (WisbWasteland | (Event & { members: WisbEventUser[], admins: EventUser[] }) | WisbDumpster)[]
        index: number
        type: WisbObjectType
    }>({
        items: [],
        index: 0,
        type: WisbObjectType.Event
    })

    const [places, setPlaces] = React.useState<Place[]>([])

    const updateItems = (append: boolean, index: number) => {
        if (isLoading || (!hasMore && append)) {
            return;
        }

        setIsLoading(true)

        Promise.all([
            api.getWastelands({ phrase, ...filter?.[Type.Wasteland] }, [index * PageSize, (index + 1) + PageSize]),
            api.getDumpsters({ phrase, ...filter?.[Type.Dumpster] }, [index * PageSize, (index + 1) + PageSize]),
            api.getEvents({ phrase, ...filter?.[Type.Event] }, [index * PageSize, (index + 1) + PageSize], true),
            api.getUsers({ phrase, ...filter?.[Type.User] }, [index * PageSize, (index + 1) + PageSize]),
        ]).then(result => ({
            [Type.Wasteland]: result[0],
            [Type.Dumpster]: result[1],
            [Type.Event]: result[2],
            [Type.User]: result[3],
        })).then(rsp => {
            const typeRsp = rsp[type]

            if (typeRsp.error == null) {
                setHasMore(typeRsp.data.items.length > 0)

                setItems(current => ({
                    items: append ? [...current.items, ...typeRsp.data.items] : typeRsp.data.items,
                    index,
                    type
                }) as any)

                setIsLoading(false);

                if (!append) {
                    flatListRef.current?.scrollToOffset({ animated: true, offset: 0 })
                }
            } else {
                Toast.showWithGravityAndOffset("Unknown error", Toast.SHORT, Toast.CENTER, 0, 10)
            }
        })
    }

    React.useEffect(() => {
        updateItems(false, 0)
    }, [type])

    const searchPlacesTimeoutId = React.useRef<NodeJS.Timeout | null>(null)
    React.useEffect(() => {
        updateItems(false, 0)

        if (placesConfig == null) {
            return
        }

        if (searchPlacesTimeoutId.current != null) {
            clearTimeout(searchPlacesTimeoutId.current)
        }

        searchPlacesTimeoutId.current = setTimeout(() => {
            setIsLoading(true)
            searchPlaces(googleMapsApiKey, phrase ?? "", Resources.get().getSettings().languageCode, placesConfig.userLocation, 1).then(places => {
                setPlaces(places ?? [])
                setIsLoading(false)
            })
        }, 200)
    }, [phrase])

    return (
        <View style={{ flex: 1, ...style }}>
            <FlatList<WisbUser | WisbDumpster | WisbWasteland | WisbEvent>
                ref={flatListRef}
                onEndReached={() => updateItems(true, items.index + 1)}
                onEndReachedThreshold={0.5}
                initialNumToRender={PageSize}
                maxToRenderPerBatch={PageSize}
                extraData={items.items}
                removeClippedSubviews
                ListHeaderComponent={
                    placesConfig != null ? <View>
                        {places.length == 0 ? null : places.map(place => (
                            <LocationItem key={place.id} onPress={() => placesConfig?.onPlaceSelected(place)} userLocation={placesConfig.userLocation} location={{
                                coords: place.location,
                                asText: place.formattedAddress
                            }} />
                        ))}
                    </View> : null
                }
                style={{ flex: 1 }}
                renderItem={({ item }) => (
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                        {
                            isWasteland(item) ? <WastelandItem widthCoeff={multi ? 0.7 : 0.9} key={`${WisbObjectType.Wasteland}-${item.id}`} item={item} onOpen={onPressed ?? onSelected ?? (() => { }) as any} /> :
                                isEvent(item) ? <EventItem widthCoeff={multi ? 0.7 : 0.9} key={`${WisbObjectType.Event}-${item.id}`} item={item} onOpen={onPressed ?? onSelected ?? (() => { }) as any} isAdmin={(item as WisbEvent & { members: EventUser[], admins: EventUser[] }).admins.some(admin => admin.id == currentUser.id)} /> :
                                    isDumpster(item) ? <DumpsterItem widthCoeff={multi ? 0.7 : 0.9} googleMapsAPIKey={googleMapsApiKey} key={`${WisbObjectType.Dumpster}-${item.id}`} item={item} onOpen={onPressed ?? onSelected ?? (() => { }) as any} /> :
                                        isUser(item) ? <UserItem widthCoeff={multi ? 0.7 : 0.9} item={item} onPress={() => { }} /> :
                                            null
                        }

                        {multi ? (
                            <View style={{ width: "20%", justifyContent: "center", alignItems: "center" }}>
                                <CheckBox
                                    onClick={() => onSelected?.(item as any)}
                                    isChecked={selectedItemsIds?.some(id => id == item.id) || false} />
                            </View>
                        ) : null}
                    </View>
                )}
                keyExtractor={(item, index) => (item as any).key}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={<View style={{ width: "100%", height: "100%", justifyContent: "center", alignItems: "center" }}><Text>Brak wyników</Text></View>}
                ListFooterComponent={() => {
                    if (isLoading) {
                        return (
                            <View style={{ width: "100%", height: 50, justifyContent: "center", alignItems: "center" }}>
                                <Spinner type="FadingCircle" color={Resources.get().getColors().Primary} />
                            </View>
                        );
                    }

                    if (!hasMore) {
                        return (
                            <View>
                                <Text>{Resources.get().getStrings().Dialogs.ListDialog.NoMoreDataMessage}</Text>
                            </View>
                        );
                    }

                    return null;
                }}
                data={items.items}
            />

            {isLoading ? <View style={{ backgroundColor: "#00000055", ...StyleSheet.absoluteFillObject, justifyContent: "center", alignItems: "center" }}>
                <Spinner type="FadingCircle" color={Resources.get().getColors().Primary} size={80} />
            </View> : null}
        </View>
    )
}