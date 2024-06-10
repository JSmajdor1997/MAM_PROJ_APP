import React, { Fragment } from "react";
import { View, Text, ViewStyle, Image, LayoutChangeEvent, TouchableHighlight, TouchableOpacity, StyleSheet } from "react-native";
import Resources from "../../res/Resources";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faAd, faAdd, faClose, faPen } from "@fortawesome/free-solid-svg-icons";

export interface Props {
    images: string[]
    onAddRequest?: () => void
    onRemoveRequest?: (image: string) => void
    nrOfImagesPerRow: number
    style?: ViewStyle
    interImagesSpace: number
}

export default function ImagesGallery({ images, onAddRequest, onRemoveRequest, nrOfImagesPerRow, style, interImagesSpace }: Props) {
    const [containerWidth, setContainerWidth] = React.useState(0)

    const nrOfRows = Math.ceil(images.length / nrOfImagesPerRow)
    const rowsIndices = new Array(nrOfRows).fill(0).map((_, index) => index)

    const imageWidth = (containerWidth - 2 * interImagesSpace * nrOfImagesPerRow) / nrOfImagesPerRow

    const onContainerLayout = ({ nativeEvent: { layout: { width: newWidth } } }: LayoutChangeEvent) => {
        if (newWidth != containerWidth) {
            setContainerWidth(newWidth)
        }
    }

    return (
        <View
            onLayout={onContainerLayout}
            style={{
                flexDirection: "column",
                justifyContent: "flex-start",
                alignItems: images.length > 0 ? "flex-start" : "center",
                ...style
            }}>
            {rowsIndices.map(rowIndex => (
                <Row key={rowIndex.toString()}>
                    {getImagesIndices(images.length, nrOfImagesPerRow, rowIndex).map((index) => (
                        <Fragment>
                            <ImageComponent key={index} imageSrc={images[index]} width={imageWidth} margin={interImagesSpace} onRemoveRequest={onRemoveRequest == null ? undefined : () => onRemoveRequest(images[index])} />
                            {onAddRequest != null && index == images.length-1  ? <ImageAddingComponent width={imageWidth} margin={interImagesSpace} onPress={onAddRequest} /> : null}
                        </Fragment>
                    ))}
                </Row>
            ))}

            {onAddRequest != null && images.length == 0 ? <ImageAddingComponent width={imageWidth} margin={interImagesSpace} onPress={onAddRequest} /> : null}
        </View>
    )
}

interface RowProps {
    children?: React.ReactNode
}

function Row({ children }: RowProps) {
    return (
        <View
            style={{
                flexDirection: "row",
                justifyContent: "flex-start"
            }}>
            {children}
        </View>
    )
}

interface ImageComponentProps {
    imageSrc: string
    width: number
    margin: number
    onRemoveRequest?: () => void
}

function ImageComponent({ imageSrc, width, margin, onRemoveRequest }: ImageComponentProps) {
    return (
        <View style={{
            padding: margin, shadowColor: Resources.get().getColors().Black,
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.5,
            shadowRadius: 3,
        }}>
            <Image src={imageSrc} style={{ width: width, height: width }} />

            {onRemoveRequest == null ? null : <TouchableOpacity style={{
                position: "absolute",
                right: 14,
                top: 10,
                backgroundColor: Resources.get().getColors().White,
                borderRadius: 100,
                width: 20,
                height: 20,
                justifyContent: "center",
                alignItems: "center",
                shadowColor: Resources.get().getColors().White,
                shadowOffset: {
                    width: 0,
                    height: 5,
                },
                shadowOpacity: 0.5,
                shadowRadius: 4,
            }}>
                <FontAwesomeIcon icon={faClose} color={Resources.get().getColors().Red} size={15} />
            </TouchableOpacity>
            }
        </View>
    )
}

function getImagesIndices(totalNrOfImages: number, nrOfImagesPerRow: number, rowIndex: number): number[] {
    const startingIndex = rowIndex * nrOfImagesPerRow
    const endingIndex = Math.min(startingIndex + nrOfImagesPerRow, totalNrOfImages - 1)

    return startingIndex >= totalNrOfImages ?
        [] :
        new Array(endingIndex - startingIndex + 1).fill(0).map((_, index) => index + startingIndex)
}

interface ImageAddingComponentProps {
    width: number
    margin: number
    onPress?: () => void
}

function ImageAddingComponent({ margin, width, onPress }: ImageAddingComponentProps) {
    return (
        <TouchableOpacity
            onPress={onPress}
            style={{
                margin,
                shadowColor: Resources.get().getColors().Black,
                width,
                height: width,
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 10,
                borderStyle: "dashed",
                borderWidth: 2,
                borderColor: Resources.get().getColors().Blue,
            }}>
            <FontAwesomeIcon icon={faAdd} color={Resources.get().getColors().Blue} />
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({

})