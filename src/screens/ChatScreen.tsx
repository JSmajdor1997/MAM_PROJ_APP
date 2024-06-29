import React, { Component, ReactElement } from 'react';
import {
  View,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  Platform,
  TextInput,
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

interface Props extends NativeStackScreenProps<NavigationParamsList, WisbScreens.ChatScreen> {
}

interface State {
  messages: Array<any>;
  isImagePickerVisible: boolean;
  images: Array<string>;
}

export default function ChatScreen({ navigation, route: { params: { event } }  }: Props) {
  const menuRef = React.useRef<Menu>(null)

  const [isMoreMenuVisible, setIsMoreMenuVisible] = React.useState(false)

  const [state, setState] = React.useState<State>({
    isImagePickerVisible: false,
    messages: [
      {
        _id: 2,
        text: '🙏',
        createdAt: new Date(),
        user: {
          _id: 4,
          name: 'Maciej Moczała',
          avatar:
            'https://static.wikia.nocookie.net/gartenofbanbanfanon/images/c/ce/Soyjak.png/revision/latest?cb=20230705190047',
        },
      },
      {
        _id: 3,
        text: '🙏',
        createdAt: new Date(),
        user: {
          _id: 5,
          name: 'Franciszek Plisz',
          avatar:
            'https://upload.wikimedia.org/wiktionary/en/f/f1/Soyjak.jpg',
        },
      },
      {
        _id: 1,
        text: '🧹!',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'Jakub Smajdor',
          avatar:
            'https://e7.pngegg.com/pngimages/494/44/png-clipart-man-face-illustration-chad-internet-meme-know-your-meme-4chan-bill-clinton-celebrities-face.png',
        },
      },
    ],
    images: []
  })

  const onSend = (messages: any) => {
    // setState(previousState => ({
    //   messages: GiftedChat.append(previousState.messages, messages),
    // }));
  }

  const renderInputBar = () => {
    return (
      <View
        style={{
          bottom: 0,
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

    return <Message {...props} renderAvatar={avatar => <Avatar {...avatar}/>} messageTextStyle={messageTextStyle} />;
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
              onPress={()=>setIsMoreMenuVisible(true)}>
              <FontAwesomeIcon color={Resources.get().getColors().Primary} icon={faEllipsisV} />
            </TouchableOpacity>
          }>
          <MenuItem>
            Szukaj
          </MenuItem>
          <MenuItem>
            Wycisz
          </MenuItem>
          <MenuItem>
            Pokaż multimedia
          </MenuItem>
        </Menu>
      </View>
    );
  }

  return (
    <View
      onTouchStart={()=>{
        if(isMoreMenuVisible){
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
      {renderTopBar()}
      <GiftedChat
        messages={state.messages}
        onSend={messages => onSend(messages)}
        renderMessage={renderMessage}
        renderInputToolbar={() => null}
        user={{
          _id: 1,
        }}
      />
      {renderInputBar()}
    </View>
  );
}

const styles = StyleSheet.create({
    
})