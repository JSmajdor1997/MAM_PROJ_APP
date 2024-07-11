import React, { useEffect, useRef, useState } from "react";
import { FlatList, ListRenderItemInfo, StyleSheet, Text, View, ViewStyle } from "react-native";
import searchPlaces, { Place } from "../utils/GooglePlacesAPI/searchPlaces";
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
import CheckBox from 'react-native-check-box';
import WisbObjectType from "../API/WisbObjectType";
import { QueryMap, TypeMap } from "../API/API";
import { WisbDumpster, WisbEvent, WisbUser, WisbWasteland } from "../API/interfaces";

const res = Resources.get()

export type Multiple<MultiSelect extends boolean, T> = MultiSelect extends true ? T[] : T;

export type DataType<MultiSelect extends boolean, ItemType extends WisbObjectType> = Multiple<MultiSelect, TypeMap<ItemType>>;

export interface Props<MultiSelect extends boolean, ItemType extends WisbObjectType> {
    style?: ViewStyle;
    type: ItemType;
    multi: MultiSelect;
    filter?: {
        [WisbObjectType.Dumpster]?: QueryMap<WisbObjectType.Dumpster>;
        [WisbObjectType.Wasteland]?: QueryMap<WisbObjectType.Wasteland>;
        [WisbObjectType.User]?: QueryMap<WisbObjectType.User>;
        [WisbObjectType.Event]?: QueryMap<WisbObjectType.Event>;
    };
    onPressed?: (selected: TypeMap<ItemType>) => void;
    onSelected?: (selected: TypeMap<ItemType>) => void;
    selectedItemsIds?: number[];
    phrase?: string;
    currentUser: WisbUser;
    googleMapsApiKey: string;
    placesConfig?: {
        onPlaceSelected: (place: Place) => void;
        userLocation: LatLng;
    };
}

const PageSize = 10;

const api = getAPI();

export default function ObjectsList<MultiSelect extends boolean, ItemType extends WisbObjectType>({
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
}: Props<MultiSelect, ItemType>) {
    const flatListRef = useRef<FlatList>(null);

    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState<{
        items: (WisbWasteland | WisbEvent | WisbDumpster | WisbUser)[],
        hasMore: boolean
    }>({
        items: [],
        hasMore: true
    });
    const [places, setPlaces] = useState<Place[]>([]);
    const [_, setPageIndex] = useState(0);

    const updateItems = async (append: boolean, index: number) => {
        if (isLoading || (!data.hasMore && append)) {
            return;
        }

        setIsLoading(true);

        const range: [number, number] = [index * PageSize, (index + 1) * PageSize]

        const result = await api.getMany(type, { phrase, ...filter?.[type] as QueryMap<ItemType> }, range);
        if (result.error != null) {
            Toast.showWithGravityAndOffset("Unknown error", Toast.SHORT, Toast.CENTER, 0, 10);
            setIsLoading(false);
            return;
        }

        setData(data => append ? {
            items: [...data.items, ...result.data.items],
            hasMore: range[1] < result.data.totalLength
        } : {
            items: result.data.items,
            hasMore: range[1] < result.data.totalLength
        });

        setIsLoading(false);

        if (!append) {
            flatListRef.current?.scrollToOffset({ animated: true, offset: 0 });
        }
    };

    useEffect(() => {
        updateItems(false, 0);
    }, [type]);

    useEffect(()=>{
        updateItems(false, 0);
    }, Object.values(filter ?? {}))

    useEffect(() => {
        updateItems(false, 0);

        if (placesConfig == null) {
            return;
        }

        const searchPlacesTimeoutId = setTimeout(() => {
            setIsLoading(true);
            searchPlaces(googleMapsApiKey, phrase ?? "", res.getSettings().languageCode, placesConfig.userLocation, 1).then(places => {
                setPlaces(places ?? []);
                setIsLoading(false);
            });
        }, 200);

        return () => clearTimeout(searchPlacesTimeoutId);
    }, [phrase]);

    const renderFooter = () => {
        if (isLoading) {
            return (
                <View style={{ width: "100%", height: 50, justifyContent: "center", alignItems: "center" }}>
                    <Spinner type="FadingCircle" color={res.getColors().Primary} />
                </View>
            );
        }

        if (!data.hasMore) {
            return (
                <View>
                    <Text>{res.getStrings().Dialogs.ListDialog.NoMoreDataMessage}</Text>
                </View>
            );
        }

        return null;
    };

    const renderItem = ({ item }: ListRenderItemInfo<TypeMap<WisbObjectType>>) => (
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            {isWasteland(item) ? <WastelandItem widthCoeff={multi ? 0.7 : 0.9} item={item} onOpen={onPressed ?? onSelected ?? (() => { }) as any} /> : null}
            {isEvent(item) ? <EventItem widthCoeff={multi ? 0.7 : 0.9} item={item} onOpen={onPressed ?? onSelected ?? (() => { }) as any} isAdmin={item.members.get(currentUser.id.toString())?.isAdmin ?? false} /> : null}
            {isDumpster(item) ? <DumpsterItem widthCoeff={multi ? 0.7 : 0.9} googleMapsAPIKey={googleMapsApiKey} item={item} onOpen={onPressed ?? onSelected ?? (() => { }) as any} /> : null}
            {isUser(item) ? <UserItem widthCoeff={multi ? 0.7 : 0.9} item={item} onPress={() => { }} /> : null}
            
            {multi ? (
                <View style={{ width: "20%", justifyContent: "center", alignItems: "center" }}>
                    <CheckBox
                        onClick={() => onSelected?.(item as any)}
                        isChecked={selectedItemsIds?.some(id => id == item.id) || false}
                    />
                </View>
            ) : null}
        </View>
    );

    return (
        <View style={{ flex: 1, ...style }}>
            <FlatList
                ref={flatListRef}
                onEndReached={() => {
                    if (data.hasMore) {
                        setPageIndex(prev => {
                            const nextIndex = prev + 1;
                            updateItems(true, nextIndex);
                            return nextIndex;
                        });
                    }
                }}
                onEndReachedThreshold={0.5}
                initialNumToRender={PageSize}
                maxToRenderPerBatch={PageSize}
                extraData={data.items}
                removeClippedSubviews
                ListHeaderComponent={placesConfig != null && places.length > 0 ? (
                    <View>
                        {places.map(place => (
                            <LocationItem key={place.id} onPress={() => placesConfig.onPlaceSelected(place)} userLocation={placesConfig.userLocation} location={{ coords: place.location, asText: place.formattedAddress }} />
                        ))}
                    </View>
                ) : null}
                style={{ flex: 1 }}
                renderItem={renderItem}
                keyExtractor={(item) => (item as any).id.toString()}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={<View style={{ width: "100%", height: "100%", justifyContent: "center", alignItems: "center" }}><Text>Brak wyników</Text></View>}
                ListFooterComponent={renderFooter}
                data={data.items}
            />
            {isLoading && <View style={{ backgroundColor: "#00000055", ...StyleSheet.absoluteFillObject, justifyContent: "center", alignItems: "center" }}>
                <Spinner type="FadingCircle" color={res.getColors().Primary} size={80} />
            </View>}
        </View>
    );
}
