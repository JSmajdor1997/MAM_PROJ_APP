import { FlatListProps, ListRenderItemInfo, View, ViewStyle } from "react-native";
import { QueryMap, TypeMap } from "../../API/API";
import Ref from "../../API/Ref";
import WisbObjectType from "../../API/WisbObjectType";
import { WisbUser } from "../../API/interfaces";
import WisbFlatList from "./WisbFlatList";
import React from "react";
import getAPI from "../../API/getAPI";
import Toast from 'react-native-simple-toast';
import CheckBox from "react-native-check-box";
import { isWasteland, isEvent, isDumpster, isUser } from "../../API/type_guards";
import DumpsterItem from "../DumpsterItem";
import EventItem from "../EventItem";
import UserItem from "../UserItem";
import WastelandItem from "../WastelandItem";
import { CRUD, Notification, isObjectCRUDNotification } from "../../API/notifications";

const api = getAPI()

export interface Props<T extends WisbObjectType, MultiSelect extends boolean> extends Omit<FlatListProps<T>, "data" | "renderItem" | "keyExtractor" | "showsHorizontalScrollIndicator" | "showsVerticalScrollIndicator" | "removeClippedSubviews" |
    "extraData" | "maxToRenderPerBatch" | "initialNumToRender" | "onEndReachedThreshold" | "onEndReached" | "ref" | "style"> {
    multiselect: MultiSelect
    filter: QueryMap<T>

    type: T

    selectedItems?: Ref<T>[]

    onSelection(selected: TypeMap<T>): void

    currentUser: WisbUser;
    googleMapsAPIKey: string

    style?: ViewStyle

    readonly?: boolean
}

const PageSize = 10;

export default function ObjectsList<T extends WisbObjectType, MultiSelect extends boolean>({
    multiselect,
    readonly,
    filter,
    type,
    selectedItems,
    onSelection,
    currentUser,
    googleMapsAPIKey,
    ...restProps
}: Props<T, MultiSelect>) {
    const [data, setData] = React.useState<{
        items: TypeMap<T>[],
        index: number,
        hasMore: boolean
    }>({
        items: [],
        index: 0,
        hasMore: true
    })

    const [isLoading, setIsLoading] = React.useState(true)

    const setItems = async (index: number) => {
        setIsLoading(true)
        const range: [number, number] = [index * PageSize, (index + 1) * PageSize]

        const rsp = await api.getMany(type, filter, range)
        if (rsp.error != null) {
            Toast.show("Unknown error", Toast.SHORT);
            setIsLoading(false)
            return
        }

        const newItems = rsp.data?.items ?? []        

        setData({
            items: index > 0 ? [...data.items, ...newItems] : newItems,
            index,
            hasMore: rsp.data.totalLength <= range[1]
        })

        setIsLoading(false)
    }

    React.useEffect(() => {
        setItems(0)
    }, [filter, type])

    React.useEffect(()=>{
        const onNotification = (n: Notification)=>{
            if(isObjectCRUDNotification(n)) {
                if(n.action == CRUD.Deleted) {
                    setData(data=> ({
                        ...data,
                        items: data.items.filter(it => it.id !== n.ref.id)
                    }))
                }
            }
        }

        api.notifications.registerListener(onNotification, {
            observedIds: data.items.map(it => ({type, id: it.id})),
            allowFromSelf: true
        })

        return ()=>{
            api.notifications.unregisterListener(onNotification)
        }
    }, [])

    return (
        <WisbFlatList<any>
            showsHorizontalScrollIndicator={false}
            onEndReachedThreshold={0.5}
            readonly={readonly}
            showsVerticalScrollIndicator={false}
            isLoading={isLoading}
            hasMore={data.hasMore}
            onEndReached={() => {
                if (data.hasMore) {
                    setItems(data.index + 1);
                }
            }}
            maxToRenderPerBatch={PageSize}
            extraData={data.items}
            removeClippedSubviews
            keyExtractor={(item) => (item as any).id.toString()}
            data={data.items}
            renderItem={({ item }: ListRenderItemInfo<TypeMap<WisbObjectType>>) => (
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    {isWasteland(item) ? <WastelandItem
                        widthCoeff={multiselect ? 0.7 : 0.9}
                        item={item}
                        onPress={() => onSelection(item as TypeMap<T>)} /> : 
                    isEvent(item) ? <EventItem
                        widthCoeff={multiselect ? 0.7 : 0.9}
                        item={item}
                        onPress={() => onSelection(item as TypeMap<T>)}
                        isAdmin={item.members.get(currentUser.id.toString())?.isAdmin ?? false} /> : 
                    isDumpster(item) ? <DumpsterItem
                        widthCoeff={multiselect ? 0.7 : 0.9}
                        googleMapsAPIKey={googleMapsAPIKey}
                        item={item}
                        onPress={() => onSelection(item as TypeMap<T>)} /> : 
                    isUser(item) ? <UserItem
                        widthCoeff={multiselect ? 0.7 : 0.9}
                        item={item}
                        onPress={() => onSelection(item as TypeMap<T>)} /> : null}

                    {multiselect ? (
                        <View style={{ width: "20%", justifyContent: "center", alignItems: "center" }}>
                            <CheckBox
                                onClick={() => onSelection(item as TypeMap<T>)}
                                isChecked={selectedItems?.some(id => id.id == item.id && id.type == type) ?? false}
                            />
                        </View>
                    ) : null}
                </View>
            )}
            {...restProps}
        />
    )
}