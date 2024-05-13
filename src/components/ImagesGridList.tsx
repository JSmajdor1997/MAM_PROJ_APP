import React, {Component, ReactElement} from 'react';
import {
  View,
  TouchableOpacity,
  ViewStyle,
  Text,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import ImagesPicker from './ImagesPicker';
import { Resources } from '../../res/Resources';
import { Icon } from '@rneui/base';

type Row = Array<{uri: 'nothing' | 'add' | string; ID: number}>;

interface Props {
  nrOfItemsPerRow: number;
  style?: ViewStyle;
  readonly?: boolean;
  imageContainerStyle?: ViewStyle;
  photoAddingStyle?: ViewStyle;
  centerIfNone?: boolean;
  onImagesChanged?: (imagesURIs: Array<string>) => void;
  initImagesURIs?: Array<string>;
  removeButtonStyle?: ViewStyle;
}

interface State {
  images: Array<{uri: string; ID: number}>;
  data: Array<Row>;
  isImagesPickerVisible: boolean;
}

export default class ImagesGridList extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    let images: Array<{uri: string; ID: number}>;

    if (this.props.initImagesURIs) {
      images = this.props.initImagesURIs.map((it, index) => {
        return {uri: it, ID: index};
      });
    } else {
      images = new Array<{uri: string; ID: number}>();
    }

    this.state = {
      images: images,
      data: [],
      isImagesPickerVisible: false,
    };
  }

  addImage(uri: string) {
    const {data, images} = this.state;

    let uniqueID: number = 0;
    images.forEach(item => {
      if (item.ID >= uniqueID) uniqueID = item.ID + 1;
    });

    images.push({uri, ID: uniqueID});

    this.setState({
      images,
      data: this.prepareData(images, this.props.nrOfItemsPerRow),
    });

    this.props.onImagesChanged &&
      this.props.onImagesChanged(images.map(it => it.uri));
  }

  removeImage(ID: number) {
    let {data, images} = this.state;
    console.log(ID);

    images = images.filter(it => it.ID != ID);

    this.setState({
      images,
      data: this.prepareData(images, this.props.nrOfItemsPerRow),
    });

    this.props.onImagesChanged &&
      this.props.onImagesChanged(images.map(it => it.uri));
  }

  componentDidMount() {
    this.setState({
      data: this.prepareData(this.state.images, this.props.nrOfItemsPerRow),
    });
  }

  //converts array of images into grid
  private prepareData(
    rawData: Array<{uri: string; ID: number}>,
    nrOfItemsPerRow: number,
  ): Array<Row> {
    const images = Array.from(rawData);

    const currentLength = images.length + 1; //+1 because adding button
    const nrOfItemsInLastRow = currentLength % nrOfItemsPerRow;
    let nrOfItemsToAdd = 0;

    if (nrOfItemsInLastRow != 0)
      nrOfItemsToAdd = nrOfItemsPerRow - nrOfItemsInLastRow;

    images.push({uri: 'add', ID: -1});

    if (!this.props.centerIfNone)
      for (let i = 0; i < nrOfItemsToAdd; ++i)
        images.push({uri: 'nothing', ID: -1});

    const data = new Array<Row>();

    for (let i = 0; i < images.length; i += nrOfItemsPerRow) {
      data.push(images.slice(i, i + nrOfItemsPerRow));
    }

    return data;
  }

  private renderImage(image: {uri: string; ID: number}): ReactElement {
    const {readonly, imageContainerStyle, removeButtonStyle} = this.props;

    return (
      <TouchableOpacity
        style={{flex: 1, aspectRatio: 1, ...imageContainerStyle}}>
        <FastImage
          resizeMode="cover"
          style={{
            flex: 1,
            aspectRatio: 1,
          }}
          source={{
            uri: image.uri,
          }}
        />
        {!readonly && (
          <TouchableOpacity
            onPress={this.removeImage.bind(this, image.ID)}
            style={{
              position: 'absolute',
              opacity: 0.68,
              right: 0,
              top: 0,
              ...removeButtonStyle,
            }}>
            <Icon
              type="material"
              name="close"
              color={Resources.Colors.White}
              reverse
              reverseColor={Resources.Colors.Black}
              size={8}
            />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
  }

  private renderAddingButton(): ReactElement | null {
    const {readonly, photoAddingStyle} = this.props;

    if (readonly) {
      return null;
    } else {
      return (
        <TouchableOpacity
          onPress={() => {
            this.setState({isImagesPickerVisible: true});
          }}
          style={{
            aspectRatio: 1,
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            opacity: 0.3,
            alignSelf: 'flex-end',
            borderWidth: 2,
            ...photoAddingStyle,
          }}>
          <Icon type="material" name="add" />
        </TouchableOpacity>
      );
    }
  }

  private renderEmpty(): ReactElement {
    return <View style={{flex: 1}} />;
  }

  private renderRow(item: Row, index: number): ReactElement {
    const final = item.map(it => {
      if (it.uri == 'nothing') return this.renderEmpty();
      else if (it.uri == 'add') return this.renderAddingButton();
      else return this.renderImage(it);
    });

    return <View style={{flexDirection: 'row'}}>{final}</View>;
  }

  render() {
    const {data, isImagesPickerVisible} = this.state;
    const {style} = this.props;

    return (
      <View style={style}>
        {data.map((row, index) => this.renderRow(row, index))}

        <ImagesPicker
          onDismiss={() => this.setState({isImagesPickerVisible: false})}
          visible={isImagesPickerVisible}
          onImage={(base64, uri) => {          
            if (base64 != undefined) this.addImage('data:image/jpeg;base64,' + base64);
          }}
        />
      </View>
    );
  }
}
