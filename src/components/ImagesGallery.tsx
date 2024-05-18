import React from "react";
import { View, Text, ViewStyle, Image, LayoutChangeEvent, TouchableHighlight, TouchableOpacity } from "react-native";
import { Resources } from "../../res/Resources";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faClose, faPen } from "@fortawesome/free-solid-svg-icons";

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
                ...style
            }}>
            {rowsIndices.map(rowIndex => (
                <Row>
                    {getImagesIndices(images.length + (onAddRequest == null ? 0 : 1), nrOfImagesPerRow, rowIndex).map(index => (
                        index == images.length ?
                            <ImageAddingComponent width={imageWidth} margin={interImagesSpace} onPress={onAddRequest} /> :
                            <ImageComponent imageSrc={images[index]} width={imageWidth} margin={interImagesSpace} onRemoveRequest={onRemoveRequest == null ? undefined : () => onRemoveRequest(images[index])} />
                    ))}
                </Row>
            ))}
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
            padding: margin, shadowColor: '#000',
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
                backgroundColor: Resources.Colors.White,
                borderRadius: 100,
                width: 20,
                height: 20,
                justifyContent: "center",
                alignItems: "center",
                shadowColor: 'white',
                shadowOffset: {
                    width: 0,
                    height: 5,
                },
                shadowOpacity: 0.5,
                shadowRadius: 4,
            }}>
                <FontAwesomeIcon icon={faClose} color={Resources.Colors.Red} size={15} />
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
                shadowColor: '#000',
                width,
                height: width,
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 10,
                borderStyle: "dashed",
                borderWidth: 2,
                borderColor: Resources.Colors.Blue,
            }}>
            <FontAwesomeIcon icon={faPen} color={Resources.Colors.Blue} />
        </TouchableOpacity>
    )
}