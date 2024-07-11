import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { GiftedChat, IMessage, Message, MessageProps } from 'react-native-gifted-chat';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import Resources from '../../res/Resources';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import WisbScreens from './WisbScreens';
import { faArrowLeft, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import Spinner from 'react-native-spinkit';
import getAPI from '../API/getAPI';
import { WisbMessage } from '../API/interfaces';
import Avatar from '../components/Avatar';
import WisbObjectType from '../API/WisbObjectType';
import NavigationParamsList from './NavigationParamsList';

const res = Resources.get();

const api = getAPI();

interface Props extends NativeStackScreenProps<NavigationParamsList, WisbScreens.ChatScreen> {}

const PageSize = 25;

export default function ChatScreen({ route: { params: { event, navigate } } }: Props) {
  const currentUser = api.getCurrentUser();

  if (currentUser == null) {
    return null;
  }

  const [inputMessage, setInputMessage] = useState("");
  const [index, setPageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<{
    items: WisbMessage[],
    hasMore: boolean
  }>({
    items: [],
    hasMore: true
  });

  const renderMessage = (props: Readonly<MessageProps<IMessage>>) => {
    return <Message {...props} />;
  }

  const updateMessages = useCallback(async (index: number) => {
    setIsLoading(true);

    const range: [number, number] = [index * PageSize, (index + 1) * PageSize];
    const result = await api.getEventMessages(event, {}, range);

    if (result.data != null) {
      setData(prevData => ({
        hasMore: result.data.totalLength > range[1],
        items: index === 0 ? result.data.items : [...prevData.items, ...result.data.items]
      }));
    }

    setIsLoading(false);
  }, [event]);

  useEffect(() => {
    updateMessages(0);
  }, [updateMessages]);

  return (
    <View style={{ ...StyleSheet.absoluteFillObject, paddingBottom: 8 }}>
      <StatusBar
        backgroundColor={res.getColors().Transparent}
        barStyle="light-content"
        translucent
      />
      <View style={{ minHeight: "100%" }}>
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingBottom: 6,
            padding: 10,
            paddingTop: 20,
            backgroundColor: res.getColors().White,
            borderBottomLeftRadius: 15,
            borderBottomRightRadius: 15,
            shadowColor: res.getColors().Black,
            shadowOffset: { width: 0, height: 7 },
            shadowOpacity: 0.41,
            shadowRadius: 9.11,
            elevation: 14,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <TouchableOpacity
              onPress={() => navigate.goBack()}
              style={{ marginLeft: 8 }}
            >
              <FontAwesomeIcon
                color={res.getColors().Primary}
                icon={faArrowLeft}
              />
            </TouchableOpacity>
            <Avatar
              image={event.iconUrl}
              username={event.name}
              size={40}
              style={{
                height: 50,
                width: 50,
                borderRadius: 50,
                borderWidth: 1.6,
                marginLeft: 14,
              }}
              fontSize={10}
              colors={["black"]}
            />
            <Text
              style={{
                marginLeft: 10,
                fontSize: 16.5,
                fontWeight: 'bold',
                color: res.getColors().Primary,
              }}
            >
              {event.name}
            </Text>
          </View>
        </View>
        <GiftedChat
          loadEarlier={true}
          renderLoadEarlier={(e) => (
            data.hasMore ? (
              <TouchableOpacity
                onPress={e.onLoadEarlier}
                style={{
                  marginTop: 20,
                  flexDirection: "row",
                  alignItems: "center",
                  alignSelf: "center",
                  padding: 10,
                  backgroundColor: res.getColors().DarkBeige,
                  borderRadius: 15
                }}
              >
                <Text
                  style={{
                    color: res.getColors().White,
                    letterSpacing: 2,
                    fontWeight: '500',
                    marginLeft: 20,
                    shadowColor: res.getColors().Black,
                    shadowOffset: { width: 0, height: 10 },
                    shadowOpacity: 0.2,
                    shadowRadius: 13.16,
                    elevation: 8,
                  }}
                >
                  Pokaż wcześniejsze wiadomości
                </Text>
                <Spinner
                  style={{ marginLeft: 5, marginTop: -5, opacity: e.isLoadingEarlier ? 1 : 0, width: 20 }}
                  size={16}
                  type="Circle"
                  color={res.getColors().Primary}
                />
              </TouchableOpacity>
            ) : null
          )}
          onLoadEarlier={() => {
            if (data.hasMore) {
              const nextPageIndex = index + 1;
              setPageIndex(nextPageIndex);
              updateMessages(nextPageIndex);
            }
          }}
          isLoadingEarlier={isLoading}
          messages={data.items.map(it => ({
            _id: it.date.getTime(),
            text: it.content,
            createdAt: it.date,
            user: {
              _id: it.sender.id,
              name: it.sender.userName,
              avatar: it.sender.photoUrl
            }
          }))}
          messagesContainerStyle={{ height: "100%" }}
          renderMessage={renderMessage}
          renderInputToolbar={() => null}
          user={{ _id: currentUser.id }}
        />
        <View
          style={{
            backgroundColor: res.getColors().White,
            alignItems: 'center',
            width: '96%',
            marginBottom: 15,
            alignSelf: 'center',
            paddingVertical: 8,
            paddingHorizontal: 8,
            justifyContent: 'space-between',
            borderRadius: 20,
            flexDirection: 'row',
            shadowColor: res.getColors().Black,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.41,
            shadowRadius: 9.11,
            elevation: 10,
          }}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: res.getColors().Beige,
              borderRadius: 20,
              paddingStart: 10,
              marginStart: 4,
              marginEnd: 4,
            }}
          >
            <TextInput
              value={inputMessage}
              onChange={e => setInputMessage(e.nativeEvent.text)}
              placeholder="Wpisz wiadomość..."
              placeholderTextColor={res.getColors().DarkBeige}
              style={{ flex: 1, padding: 0 }}
            />
          </View>
          <TouchableOpacity
            style={{ justifyContent: 'center', alignContent: 'center', padding: 4 }}
            disabled={inputMessage.length == 0}
            onPress={async () => {
              await api.sendEventMessage({
                event: { type: WisbObjectType.Event, id: event.id },
                content: inputMessage,
              });
              setInputMessage("");
              setPageIndex(0);
              updateMessages(0);
            }}
          >
            <FontAwesomeIcon icon={faPaperPlane} color={res.getColors().Primary} size={20} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({});
