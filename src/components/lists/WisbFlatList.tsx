import React from 'react';
import { Dimensions, FlatList, FlatListProps, StyleSheet, Text, View, ViewStyle } from "react-native";
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import Spinner from "react-native-spinkit";
import Resources from '../../../res/Resources';
import IconType from '../WisbIcon/IconType';
import WisbIcon from '../WisbIcon/WisbIcon';

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
                ) : isLoading ? (
                    <View style={{ justifyContent: "center" }}>
                    {Array.from({ length: 3 }, () => (
                        <SkeletonPlaceholder borderRadius={4} backgroundColor="white">
                            <SkeletonPlaceholder.Item flexDirection="row" alignItems="center" width={"90%"} height={50}>
                                <SkeletonPlaceholder.Item width={20} height={20} borderRadius={100} left={10} />
                                <SkeletonPlaceholder.Item marginLeft={20}>
                                    <SkeletonPlaceholder.Item width={Dimensions.get("window").width - 100} height={20} />
                                    <SkeletonPlaceholder.Item marginTop={6} width={80} height={20} />
                                </SkeletonPlaceholder.Item>
                            </SkeletonPlaceholder.Item>
                        </SkeletonPlaceholder>
                    ))}
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
        backgroundColor: "#00000011",
        justifyContent: "center",
        alignItems: "center",
        ...StyleSheet.absoluteFillObject,
    },
});
