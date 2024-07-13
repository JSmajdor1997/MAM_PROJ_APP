import { faArrowLeft, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useState } from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { GiftedChat, IMessage, Message, MessageProps } from 'react-native-gifted-chat';
import Spinner from 'react-native-spinkit';
import Resources from '../../res/Resources';
import WisbObjectType from '../API/WisbObjectType';
import getAPI from '../API/getAPI';
import { WisbMessage } from '../API/interfaces';
import Avatar from '../components/Avatar';
import NavigationParamsList, { WisbScreens } from './NavigationParamsList';

const res = Resources.get();

const api = getAPI();

interface Props extends NativeStackScreenProps<NavigationParamsList, WisbScreens.ChatScreen> { }

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
    const result = await api.getEventMessages(event, range);

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
    <View style={styles.container}>
      <StatusBar
        backgroundColor={res.getColors().Transparent}
        barStyle="light-content"
        translucent
      />
      <View style={styles.chatContainer}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <TouchableOpacity
              onPress={() => navigate.goBack()}
              style={styles.backButton}
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
              style={styles.avatar}
              fontSize={10}
              colors={["black"]}
            />
            <Text style={styles.headerText}>
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
                style={styles.loadEarlierButton}
              >
                <Text style={styles.loadEarlierText}>
                  Pokaż wcześniejsze wiadomości
                </Text>
                <Spinner
                  style={styles.loadEarlierSpinner}
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
          messagesContainerStyle={styles.messagesContainer}
          renderMessage={renderMessage}
          renderInputToolbar={() => null}
          user={{ _id: currentUser.id }}
        />
        <View style={styles.inputContainer}>
          <View style={styles.textInputContainer}>
            <TextInput
              value={inputMessage}
              onChange={e => setInputMessage(e.nativeEvent.text)}
              placeholder="Wpisz wiadomość..."
              placeholderTextColor={res.getColors().DarkBeige}
              style={styles.textInput}
            />
          </View>
          <TouchableOpacity
            style={styles.sendButton}
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

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    paddingBottom: 8,
  },
  chatContainer: {
    minHeight: "100%",
  },
  header: {
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
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    marginLeft: 8,
  },
  avatar: {
    height: 50,
    width: 50,
    borderRadius: 50,
    borderWidth: 1.6,
    marginLeft: 14,
  },
  headerText: {
    marginLeft: 10,
    fontSize: 16.5,
    fontWeight: 'bold',
    color: res.getColors().Primary,
    fontFamily: res.getFonts().Secondary,
  },
  loadEarlierButton: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    padding: 10,
    backgroundColor: res.getColors().DarkBeige,
    borderRadius: 15,
  },
  loadEarlierText: {
    color: res.getColors().White,
    letterSpacing: 2,
    fontWeight: '500',
    marginLeft: 20,
    shadowColor: res.getColors().Black,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 13.16,
    elevation: 8,
    fontFamily: res.getFonts().Secondary,
  },
  loadEarlierSpinner: {
    marginLeft: 5,
    marginTop: -5,
    opacity: 1,
    width: 20,
  },
  messagesContainer: {
    height: "100%",
  },
  inputContainer: {
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
  },
  textInputContainer: {
    flex: 1,
    backgroundColor: res.getColors().Beige,
    borderRadius: 20,
    paddingStart: 10,
    marginStart: 4,
    marginEnd: 4,
  },
  textInput: {
    flex: 1,
    padding: 0,
    fontFamily: res.getFonts().Secondary,
  },
  sendButton: {
    justifyContent: 'center',
    alignContent: 'center',
    padding: 4,
  },
});
