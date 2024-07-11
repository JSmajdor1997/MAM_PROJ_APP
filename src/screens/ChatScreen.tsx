import React, { Component, ReactElement } from 'react';
import {
  View,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  Platform,
  TextInput,
  ScrollView,
} from 'react-native';
import { Avatar, GiftedChat, IMessage, Message, MessageProps } from 'react-native-gifted-chat';
import { Menu, MenuItem } from 'react-native-material-menu';
import emojiUtils from 'emoji-utils';
import LoadingImage from "../components/LoadingImage"
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import Resources from '../../res/Resources';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import NavigationParamsList from './NavigationParamsList';
import WisbScreens from './WisbScreens';
import { faArrowLeft, faCamera, faEllipsisV, faGripVertical, faMessage, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import Swiper from 'react-native-swiper';
import ImagesGallery from '../components/ImagesGallery';
import { SafeAreaView } from 'react-native-safe-area-context';
import getAPI from '../API/getAPI';

const api = getAPI()

interface Props extends NativeStackScreenProps<NavigationParamsList, WisbScreens.ChatScreen> {
}

interface State {
  messages: Array<any>;
  isImagePickerVisible: boolean;
  images: Array<string>;
}

export default function ChatScreen({ navigation, route: { params: { event } } }: Props) {
  return null
  const [inputMessage, setInputMessage] = React.useState("")

  const [isMoreMenuVisible, setIsMoreMenuVisible] = React.useState(false)
  const [isMultimediaListVisible, setIsMultimediaListVisible] = React.useState(false)

  const [state, setState] = React.useState<State>({
    isImagePickerVisible: false,
    messages: event.messages.map(it => ({
      _id: it.date.getTime(),
      text: it.content,
      createdAt: it.date,
      user: {
        id: it.sender.id,
        name: it.sender.userName,
        avatar: it.sender.photoUrl,
      },
    })),
    images: []
  })

  const renderInputBar = () => {
    return (
      <View
        style={{
          backgroundColor: Resources.get().getColors().White,
          alignItems: 'center',
          width: '96%',
          marginBottom: 30,
          alignSelf: 'center',
          paddingVertical: 8,
          paddingHorizontal: 8,
          justifyContent: 'space-between',
          borderRadius: 20,
          flexDirection: 'row',

          shadowColor: Resources.get().getColors().Black,
          shadowOffset: {
            width: 0,
            height: 0,
          },
          shadowOpacity: 0.41,
          shadowRadius: 9.11,

          elevation: 10,
        }}>
        <TouchableOpacity
          // onPress={() => setState({ isImagePickerVisible: true })}
          style={{
            justifyContent: 'center',
            alignContent: 'center',
            padding: 4,
          }}>
          <FontAwesomeIcon icon={faCamera} color={Resources.get().getColors().Primary} size={18} />
        </TouchableOpacity>

        <View
          style={{
            flex: 1,
            backgroundColor: Resources.get().getColors().Beige,
            borderRadius: 20,
            paddingStart: 10,
            marginStart: 4,
            marginEnd: 4,
          }}>
          <TextInput
            value={inputMessage}
            onChange={e=>setInputMessage(e.nativeEvent.text)}
            placeholder="Wpisz wiadomość..."
            placeholderTextColor={Resources.get().getColors().DarkBeige}
            style={{ flex: 1, padding: 0 }}
          />
        </View>
        <TouchableOpacity
          style={{
            justifyContent: 'center',
            alignContent: 'center',
            padding: 4,
          }}
          onPress={()=>{
            // api.sendEventMessage(event, {
            //   content: inputMessage,
            //   photosUrls: [],
            // })
            setInputMessage("")
          }}>
          <FontAwesomeIcon icon={faPaperPlane} color={Resources.get().getColors().Primary} size={20} />
        </TouchableOpacity>
      </View>
    );
  }

  const renderMessage = (props: Readonly<MessageProps<IMessage>>) => {
    const {
      currentMessage: { text: currText },
    } = props;

    let messageTextStyle;

    // Make "pure emoji" messages much bigger than plain text.
    if (currText && emojiUtils.isPureEmojiString(currText)) {
      messageTextStyle = {
        fontSize: 28,
        // Emoji get clipped if lineHeight isn't increased; make it consistent across platforms.
        lineHeight: Platform.OS === 'android' ? 34 : 30,
      };
    }

    return <Message {...props} renderAvatar={avatar => <Avatar {...avatar} />} messageTextStyle={messageTextStyle} />;
  }

  const renderTopBar = () => {
    return (
      <View
        style={{
          width: '100%',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingBottom: 6,
          padding: 10,
          paddingTop: 45,
          backgroundColor: Resources.get().getColors().White,
          borderBottomLeftRadius: 15,
          borderBottomRightRadius: 15,

          shadowColor: Resources.get().getColors().Black,
          shadowOffset: {
            width: 0,
            height: 7,
          },
          shadowOpacity: 0.41,
          shadowRadius: 9.11,

          elevation: 14,
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{ marginLeft: 8 }}>
            <FontAwesomeIcon
              color={Resources.get().getColors().Primary}
              icon={faArrowLeft}
            />
          </TouchableOpacity>
          <LoadingImage
            style={{
              height: 36,
              width: 36,
              borderRadius: 50,
              borderWidth: 1.6,
              marginLeft: 14,
            }}
            image={
              state.images && state.images[0]
                ? state.images[0]
                : ''
            }
            isLoading={state.images == null}
          />
          <Text
            style={{
              marginLeft: 10,
              fontSize: 16.5,
              fontWeight: 'bold',
              color: Resources.get().getColors().Primary,
            }}>
            {event.name}
          </Text>
        </View>
        <Menu
          visible={isMoreMenuVisible}
          style={{
            top: (StatusBar.currentHeight ? StatusBar.currentHeight : 20) + 10,
          }}
          anchor={
            <TouchableOpacity
              style={{ alignSelf: 'flex-end', marginRight: 2 }}
              onPress={() => setIsMoreMenuVisible(true)}>
              <FontAwesomeIcon color={Resources.get().getColors().Primary} icon={faEllipsisV} />
            </TouchableOpacity>
          }>
          <MenuItem>
            Szukaj
          </MenuItem>
          <MenuItem>
            Wycisz
          </MenuItem>
          <MenuItem onPress={() => setIsMultimediaListVisible(true)}>
            Pokaż multimedia
          </MenuItem>
        </Menu>
      </View>
    );
  }

  return (
    <ScrollView automaticallyAdjustKeyboardInsets keyboardShouldPersistTaps
      onTouchStart={() => {
        if (isMoreMenuVisible) {
          setIsMoreMenuVisible(false)
        }
      }}
      style={{
        ...StyleSheet.absoluteFillObject,
        paddingBottom: 8,
      }}>
      <StatusBar
        backgroundColor={Resources.get().getColors().Transparent}
        barStyle="light-content"
        translucent
      />
      <Swiper
        index={isMultimediaListVisible ? 1 : 0}
        showsButtons={false}
        showsPagination={false}
        scrollEnabled={false}
        loop={false}>
        <View style={{ flex: 1 }}>
          {renderTopBar()}
          <GiftedChat
            messages={state.messages}
            renderMessage={renderMessage}
            renderInputToolbar={() => null}
            user={{
              _id: 1,
            }}
          />
          {renderInputBar()}
        </View>

        <SafeAreaView style={{ flex: 1 }}>
          <View>
            <TouchableOpacity onPress={() => setIsMultimediaListVisible(false)}>
              <FontAwesomeIcon icon={faArrowLeft} size={20} />
            </TouchableOpacity>
          </View>

          <Text>Multimedia czatu</Text>

          <ImagesGallery
            style={{ flex: 1 }}
            images={[event.iconUrl!]}
            nrOfImagesPerRow={4}
            interImagesSpace={10} />
        </SafeAreaView>
      </Swiper>
    </ScrollView>
  );
}

const styles = StyleSheet.create({

})