import PropTypes from 'prop-types';
import React, { ReactElement } from 'react';
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
  Platform,
  ViewStyle,
  TextStyle,
} from 'react-native';

import { MessageText, MessageImage, Time, utils } from 'react-native-gifted-chat';
import { Resources } from '../../../res/Resources';

const { isSameUser, isSameDay } = utils;

interface Props {
  onLongPress: (context: any, message: any) => void;
  touchableProps: ViewStyle;
  renderMessageImage: (image: any) => ReactElement;
  renderMessageText: (text: any) => ReactElement;

  renderCustomView: (text: any) => ReactElement;
  renderUsername: (text: any) => ReactElement;
  renderTime: (text: any) => ReactElement;
  renderTicks: (text: any) => ReactElement;

  currentMessage: any;
  nextMessage: any;
  previousMessage: any;
  user: any;
  containerStyle: {
    left: ViewStyle;
    right: ViewStyle;
  };
  wrapperStyle: {
    left: ViewStyle;
    right: ViewStyle;
  };
  messageTextStyle: TextStyle;
  usernameStyle: TextStyle;
  tickStyle: TextStyle;
  containerToNextStyle: {
    left: ViewStyle;
    right: ViewStyle;
  };
  containerToPreviousStyle: {
    left: ViewStyle;
    right: ViewStyle;
  };
}

interface State { }

export default function Bubble(props: Props) {
  const onLongPress = () => {
    if (props.onLongPress) {
      props.onLongPress(context, props.currentMessage);
    } else {
      if (props.currentMessage.text) {
        const options = ['Copy Text', 'Cancel'];

        const cancelButtonIndex = options.length - 1;

        context.actionSbheet().showActionSheetWithOptions(
          {
            options,
            cancelButtonIndex,
          },
          (buttonIndex: number) => {
            switch (buttonIndex) {
              case 0:
                Clipboard.setString(props.currentMessage.text);
                break;
            }
          },
        );
      }
    }
  }

  const renderMessageText = () => {
    if (props.currentMessage.text) {
      const {
        containerStyle,
        wrapperStyle,
        messageTextStyle,
        ...messageTextProps
      } = props;
      if (props.renderMessageText) {
        return props.renderMessageText(messageTextProps);
      }
      return (
        <View style={{ backgroundColor: Resources.Colors.Beige, borderRadius: 4, paddingHorizontal: 4 }}>
          <MessageText
            {...messageTextProps}
            textStyle={{
              left: [
                styles.standardFont,
                styles.slackMessageText,
                messageTextProps.textStyle,
                messageTextStyle,
              ],
            }}
          />
        </View>
      );
    }
    return null;
  }
  
  const renderMessageImage = () => {
    if (props.currentMessage.image) {
      const { containerStyle, wrapperStyle, ...messageImageProps } = props;
      if (props.renderMessageImage) {
        return props.renderMessageImage(messageImageProps);
      }
      return (
        <MessageImage
          {...messageImageProps}
          imageStyle={[styles.slackImage, messageImageProps.imageStyle]}
        />
      );
    }
    return null;
  }
  
  const renderTicks = () => {
    const { currentMessage } = props;
    if (props.renderTicks) {
      return props.renderTicks(currentMessage);
    }
    if (currentMessage.user._id !== props.user._id) {
      return null;
    }
    if (currentMessage.sent || currentMessage.received) {
      return (
        <View style={[styles.headerItem, styles.tickView]}>
          {currentMessage.sent && (
            <Text
              style={[styles.standardFont, styles.tick, props.tickStyle]}>
              ✓
            </Text>
          )}
          {currentMessage.received && (
            <Text
              style={[styles.standardFont, styles.tick, props.tickStyle]}>
              ✓
            </Text>
          )}
        </View>
      );
    }
    return null;
  }
  
  const renderUsername = () => {
    const username = props.currentMessage.user.name;
    if (username) {
      const { containerStyle, wrapperStyle, ...usernameProps } = props;
      if (props.renderUsername) {
        return props.renderUsername(usernameProps);
      }
      return (
        <Text
          style={[
            styles.standardFont,
            styles.headerItem,
            styles.username,
            props.usernameStyle,
          ]}>
          {username}
        </Text>
      );
    }
    return null;
  }
  
  const renderTime = () => {
    if (props.currentMessage.createdAt) {
      const { containerStyle, wrapperStyle, ...timeProps } = props;
      if (props.renderTime) {
        return props.renderTime(timeProps);
      }
  
      const hours = props.currentMessage.createdAt.getHours() as number;
      const minutes = props.currentMessage.createdAt.getMinutes() as number;
  
      let hoursString = hours.toString() as string;
      let minutesString = minutes.toString() as string;
  
      if (hoursString.length == 1) hoursString = '0' + hoursString;
  
      if (minutesString.length == 1) minutesString = '0' + minutesString;
  
      return (
        <Text
          style={{
            opacity: 0.3,
            fontSize: 10,
          }}>{`${hoursString}:${minutesString}`}</Text>
      );
    }
    return null;
  }
  
  const renderCustomView = () => {
    if (props.renderCustomView) {
      return props.renderCustomView(props);
    }
    return null;
  }

  const isSameThread =
    isSameUser(props.currentMessage, props.previousMessage) &&
    isSameDay(props.currentMessage, props.previousMessage);

  const messageHeader = isSameThread ? null : (
    <View style={styles.headerView}>
      {renderUsername()}
      {renderTime()}
      {renderTicks()}
    </View>
  );

  return (
    <View style={[styles.container, props.containerStyle]}>
      <TouchableOpacity
        onLongPress={onLongPress}
        accessibilityTraits="text"
        {...props.touchableProps}>
        <View style={[styles.wrapper, props.wrapperStyle]}>
          <View>
            {renderCustomView()}
            {messageHeader}
            {renderMessageImage()}
            {renderMessageText()}
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}

// Note: Everything is forced to be "left" positioned with this component.
// The "right" position is only used in the default Bubble.
const styles = StyleSheet.create({
  standardFont: {
    fontSize: 15,
  },
  slackMessageText: {
    marginLeft: 0,
    marginRight: 0,
  },
  container: {
    flex: 1,
    alignItems: 'flex-start',
  },
  wrapper: {
    marginRight: 60,
    minHeight: 20,
    justifyContent: 'flex-end',
  },
  username: {
    fontWeight: 'bold',
  },
  time: {
    textAlign: 'left',
    fontSize: 12,
  },
  timeContainer: {
    marginLeft: 0,
    marginRight: 0,
    marginBottom: 0,
  },
  headerItem: {
    marginRight: 10,
  },
  headerView: {
    // Try to align it better with the avatar on Android.
    marginTop: Platform.OS === 'android' ? -2 : 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
  /* eslint-disable react-native/no-color-literals */
  tick: {
    backgroundColor: Resources.Colors.Transparent,
    color: Resources.Colors.White,
  },
  /* eslint-enable react-native/no-color-literals */
  tickView: {
    flexDirection: 'row',
  },
  slackImage: {
    borderRadius: 3,
    marginLeft: 0,
    marginRight: 0,
  },
});

Bubble.contextTypes = {
  actionSheet: PropTypes.func,
};

Bubble.defaultProps = {
  touchableProps: {},
  onLongPress: null,
  renderMessageImage: null,
  renderMessageText: null,
  renderCustomView: null,
  renderTime: null,
  currentMessage: {
    text: null,
    createdAt: null,
    image: null,
  },
  nextMessage: {},
  previousMessage: {},
  containerStyle: {},
  wrapperStyle: {},
  tickStyle: {},
  containerToNextStyle: {},
  containerToPreviousStyle: {},
};

Bubble.propTypes = {
  touchableProps: PropTypes.object,
  onLongPress: PropTypes.func,
  renderMessageImage: PropTypes.func,
  renderMessageText: PropTypes.func,
  renderCustomView: PropTypes.func,
  renderUsername: PropTypes.func,
  renderTime: PropTypes.func,
  renderTicks: PropTypes.func,
  currentMessage: PropTypes.object,
  nextMessage: PropTypes.object,
  previousMessage: PropTypes.object,
  user: PropTypes.object,
  containerStyle: PropTypes.shape({
    left: ViewPropTypes.style,
    right: ViewPropTypes.style,
  }),
  wrapperStyle: PropTypes.shape({
    left: ViewPropTypes.style,
    right: ViewPropTypes.style,
  }),
  messageTextStyle: Text.propTypes.style,
  usernameStyle: Text.propTypes.style,
  tickStyle: Text.propTypes.style,
  containerToNextStyle: PropTypes.shape({
    left: ViewPropTypes.style,
    right: ViewPropTypes.style,
  }),
  containerToPreviousStyle: PropTypes.shape({
    left: ViewPropTypes.style,
    right: ViewPropTypes.style,
  }),
};
