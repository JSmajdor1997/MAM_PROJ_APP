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
import { GiftedChat, Message } from 'react-native-gifted-chat';
import { Menu, MenuItem } from 'react-native-material-menu';
import emojiUtils from 'emoji-utils';
import LoadingImage from "../components/LoadingImage"
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import Resources from '../../res/Resources';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import NavigationParamsList from './NavigationParamsList';
import WisbScreens from './WisbScreens';
import { faArrowLeft, faCamera, faGripVertical, faMessage } from '@fortawesome/free-solid-svg-icons';

interface Props extends NativeStackScreenProps<NavigationParamsList, WisbScreens.ChatScreen> {

}

interface State {
  messages: Array<any>;
  isImagePickerVisible: boolean;
  images: Array<string>;
}

export default function ChatScreen({ }: Props) {
  const menuRef = React.useRef<Menu>(null)

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
            'https://scontent.fktw1-1.fna.fbcdn.net/v/t1.0-1/p960x960/77065029_2952407231470050_465105715040616448_o.jpg?_nc_cat=100&_nc_ohc=eH3QR6wtqJ8AQk-lqZ1bw1CqJKDngg-kxH5GEONzAkG5c_ThKNY5BSb2g&_nc_ht=scontent.fktw1-1.fna&oh=722892778ca1154df33f5b968a8f45c0&oe=5E8A05A8',
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
            'https://scontent.fktw1-1.fna.fbcdn.net/v/t1.0-9/74707187_1457995377698693_2092391531263557632_n.jpg?_nc_cat=100&_nc_oc=AQkVu_xZvh8hZp8Kv4C6tdpCJGp1dBZEbP6wH5jIO4gn5y2rzDHp4_2KHiihtfXeGGo&_nc_ht=scontent.fktw1-1.fna&oh=f0a124aa74869ffd2e1668b2519b983c&oe=5E62F065',
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
            'https://scontent.fktw1-1.fna.fbcdn.net/v/t1.0-9/71112325_2439037926331390_3597365118507155456_n.jpg?_nc_cat=101&_nc_oc=AQmAzgD-kg_1IyYc4F3G2LWq9QnvTcWMy6qoxXYRDLHL5ufVwwQ_yXLCxv4CwyFQRl0&_nc_ht=scontent.fktw1-1.fna&oh=5fd2c8a165ed50e76b837c3861fefd99&oe=5E4F6796',
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
          position: 'absolute',
          bottom: 0,
          backgroundColor: Resources.get().getColors().White,
          alignItems: 'center',
          width: '96%',
          marginBottom: 8,
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
            backgroundColor: Resources.get().getColors().Black,
            borderRadius: 20,
            paddingStart: 10,
            marginStart: 4,
            marginEnd: 4,
          }}>
          <TextInput
            placeholder="Wpisz wiadomość..."
            style={{ flex: 1, padding: 0 }}
          />
        </View>
        <TouchableOpacity
          style={{
            justifyContent: 'center',
            alignContent: 'center',
            padding: 4,
          }}>
          <FontAwesomeIcon icon={faMessage} color={Resources.get().getColors().Primary} size={20} />
        </TouchableOpacity>
      </View>
    );
  }

  const renderMessage = (props: any) => {
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

    return <Message {...props} messageTextStyle={messageTextStyle} />;
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
          position: 'absolute',
          paddingTop: (StatusBar.currentHeight || 20) + 5,
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
            onPress={() => { }}
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
            TYTUL WYDARZENIA
          </Text>
        </View>
        <Menu
          style={{
            top: (StatusBar.currentHeight ? StatusBar.currentHeight : 20) + 10,
          }}
          anchor={
            <TouchableOpacity
              style={{ alignSelf: 'flex-end', marginRight: 2 }}>
              <FontAwesomeIcon color={Resources.get().getColors().Primary} icon={faGripVertical} />
            </TouchableOpacity>
          }
          ref={menuRef}>
          <MenuItem>
            Szukaj
          </MenuItem>
          <MenuItem>
            Wycisz
          </MenuItem>
        </Menu>
      </View>
    );
  }

  return (
    <View
      style={{
        ...StyleSheet.absoluteFillObject,
        paddingTop: StatusBar.currentHeight || 20,
        paddingBottom: 8,
      }}>
      <StatusBar
        backgroundColor={Resources.get().getColors().Transparent}
        barStyle="dark-content"
        translucent
      />
      <GiftedChat
        messages={state.messages}
        onSend={messages => onSend(messages)}
        renderMessage={renderMessage}
        renderInputToolbar={() => null}
        user={{
          _id: 1,
        }}
      />
      {renderTopBar()}
      {renderInputBar()}
    </View>
  );
}

const styles = StyleSheet.create({
    
})