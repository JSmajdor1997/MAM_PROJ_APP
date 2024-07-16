import { faAdd, faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React from "react";
import { Image, StyleSheet, TouchableOpacity, View, ViewStyle } from "react-native";
import Resources from "../../../res/Resources";
import getSeededImage from "../../API/generators/getSeededImage";

const res = Resources.get();

export interface Props {
    images: string[];
    onAddRequest?: (image: string) => void;
    onRemoveRequest?: (image: string) => void;
    nrOfImagesPerRow: number;
    style?: ViewStyle;
    interImagesSpace: number;
    rowWidth: number;
    readonly: boolean
}

const ImagesGallery: React.FC<Props> = ({
    images,
    onAddRequest,
    onRemoveRequest,
    nrOfImagesPerRow,
    style,
    interImagesSpace,
    rowWidth,
    readonly
}) => {
    // Calculate the total space taken by all the gaps between images
    const totalSpacing = interImagesSpace * (nrOfImagesPerRow - 1);
    // Calculate the size of each image considering the total available width minus the spacing
    const imageSize = (rowWidth - totalSpacing) / nrOfImagesPerRow;

    return (
        <View
            style={[styles.container, style, { width: rowWidth }]}
        >
            {images.map((image, index) => (
                <View key={index} style={{ marginBottom: interImagesSpace, marginRight: (index + 1) % nrOfImagesPerRow === 0 ? 0 : interImagesSpace }}>
                    <ImageComponent
                        imageSrc={image}
                        size={imageSize}
                        onRemoveRequest={onRemoveRequest && !readonly ? () => onRemoveRequest(image) : undefined}
                    />
                </View>
            ))}
            {onAddRequest && !readonly ? (
                <TouchableOpacity
                    style={[styles.addButton, { width: imageSize, height: imageSize, marginBottom: interImagesSpace }]}
                    onPress={()=>onAddRequest(getSeededImage(new Date().getTime().toString()))}
                >
                    <FontAwesomeIcon icon={faAdd} size={30} color={res.getColors().Blue} />
                </TouchableOpacity>
            ) : null}
        </View>
    );
};

interface ImageComponentProps {
    imageSrc: string;
    size: number;
    onRemoveRequest?: () => void;
}

const ImageComponent: React.FC<ImageComponentProps> = ({ imageSrc, size, onRemoveRequest }) => {
    return (
        <View style={[styles.imageContainer, { width: size, height: size }]}>
            <Image source={{ uri: imageSrc }} style={styles.image} />
            {onRemoveRequest && (
                <TouchableOpacity style={styles.deleteButton} onPress={onRemoveRequest}>
                    <FontAwesomeIcon icon={faClose} color={res.getColors().Red} size={15} />
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        flexWrap: "wrap",
    },
    imageContainer: {
        position: 'relative',
        shadowColor: res.getColors().Black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 3,
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 8,
    },
    deleteButton: {
        position: "absolute",
        right: 10,
        top: 10,
        backgroundColor: res.getColors().White,
        borderRadius: 100,
        width: 20,
        height: 20,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: res.getColors().White,
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.5,
        shadowRadius: 4,
    },
    addButton: {
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 8,
        borderWidth: 1,
        borderColor: res.getColors().Blue,
    },
});

export default ImagesGallery;
