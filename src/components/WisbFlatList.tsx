import React from 'react';
import { FlatList, FlatListProps, StyleSheet, Text, View, ViewStyle } from "react-native";
import Spinner from "react-native-spinkit";
import Resources from "../../res/Resources";
import WisbIcon from "./WisbIcon/WisbIcon";
import IconType from "./WisbIcon/IconType";

const res = Resources.get();

interface WrappedFlatListProps<T> extends Omit<FlatListProps<T>, 'data' | "style"> {
    data: T[];
    isLoading: boolean;
    hasMore: boolean;
    style?: ViewStyle;
}

const WisbFlatList = <T,>(
    { data, isLoading, hasMore, style, ...flatListProps }: WrappedFlatListProps<T>,
    ref: React.Ref<FlatList<T>>
): React.ReactElement => {
    const showNoMoreItemsIcon = !hasMore;
    const showLoadingIcon = isLoading;
    const showEmptyListIcon = data.length === 0 && !hasMore && !isLoading;

    return (
        <View style={{ ...styles.container, ...style }}>
            <FlatList
                ref={ref}
                data={data}
                contentContainerStyle={[{ flexGrow: 1 }]}
                ListEmptyComponent={showEmptyListIcon ? (
                    <View style={styles.emptyListContainer}>
                        <WisbIcon icon={IconType.EmptyList} size={50} />
                        <Text style={styles.noMoreText}>No results</Text>
                    </View>
                ) : null}
                ListFooterComponent={showNoMoreItemsIcon ? (
                    <View style={styles.footerContainer}>
                        <WisbIcon icon={IconType.NoMoreItems} size={50} />
                        <Text style={styles.noMoreText}>No more items</Text>
                    </View>
                ) : null}
                {...flatListProps}
            />

            {showLoadingIcon ? (
                <View style={styles.loadingContainer}>
                    <Spinner type="FadingCircle" color={res.getColors().Primary} size={80} />
                </View>
            ) : null}
        </View>
    );
};

const ForwardedWisbFlatList = React.forwardRef(WisbFlatList) as <T>(
    props: WrappedFlatListProps<T> & { ref?: React.Ref<FlatList<T>> }
) => React.ReactElement;

export default ForwardedWisbFlatList;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    spinner: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    noMoreText: {
        textAlign: 'center',
        padding: 16,
        fontSize: 26,
        color: "white",
        fontFamily: res.getFonts().Secondary,
        fontWeight: "bold"
    },
    emptyListContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    footerContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20
    },
    loadingContainer: {
        backgroundColor: "#00000055",
        justifyContent: "center",
        alignItems: "center",
        ...StyleSheet.absoluteFillObject,
    },
});
