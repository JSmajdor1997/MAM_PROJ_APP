import PropTypes from 'prop-types';
import React, {ReactElement} from 'react';
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
  Platform,
  ViewStyle,
  TextStyle,
} from 'react-native';

import {MessageText, MessageImage, Time, utils} from 'react-native-gifted-chat';

const {isSameUser, isSameDay} = utils;

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

interface State {}

export default class Bubble extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.onLongPress = this.onLongPress.bind(this);
  }

  onLongPress() {
    if (this.props.onLongPress) {
      this.props.onLongPress(this.context, this.props.currentMessage);
    } else {
      if (this.props.currentMessage.text) {
        const options = ['Copy Text', 'Cancel'];

        const cancelButtonIndex = options.length - 1;

        this.context.actionSbheet().showActionSheetWithOptions(
          {
            options,
            cancelButtonIndex,
          },
          (buttonIndex: number) => {
            switch (buttonIndex) {
              case 0:
                Clipboard.setString(this.props.currentMessage.text);
                break;
            }
          },
        );
      }
    }
  }

  renderMessageText() {
    if (this.props.currentMessage.text) {
      const {
        containerStyle,
        wrapperStyle,
        messageTextStyle,
        ...messageTextProps
      } = this.props;
      if (this.props.renderMessageText) {
        return this.props.renderMessageText(messageTextProps);
      }
      return (
        <View style={{backgroundColor: '#ebebeb', borderRadius: 4, paddingHorizontal: 4}}>
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

  renderMessageImage() {
    if (this.props.currentMessage.image) {
      const {containerStyle, wrapperStyle, ...messageImageProps} = this.props;
      if (this.props.renderMessageImage) {
        return this.props.renderMessageImage(messageImageProps);
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

  renderTicks() {
    const {currentMessage} = this.props;
    if (this.props.renderTicks) {
      return this.props.renderTicks(currentMessage);
    }
    if (currentMessage.user._id !== this.props.user._id) {
      return null;
    }
    if (currentMessage.sent || currentMessage.received) {
      return (
        <View style={[styles.headerItem, styles.tickView]}>
          {currentMessage.sent && (
            <Text
              style={[styles.standardFont, styles.tick, this.props.tickStyle]}>
              ✓
            </Text>
          )}
          {currentMessage.received && (
            <Text
              style={[styles.standardFont, styles.tick, this.props.tickStyle]}>
              ✓
            </Text>
          )}
        </View>
      );
    }
    return null;
  }

  renderUsername() {
    const username = this.props.currentMessage.user.name;
    if (username) {
      const {containerStyle, wrapperStyle, ...usernameProps} = this.props;
      if (this.props.renderUsername) {
        return this.props.renderUsername(usernameProps);
      }
      return (
        <Text
          style={[
            styles.standardFont,
            styles.headerItem,
            styles.username,
            this.props.usernameStyle,
          ]}>
          {username}
        </Text>
      );
    }
    return null;
  }

  renderTime() {
    if (this.props.currentMessage.createdAt) {
      const {containerStyle, wrapperStyle, ...timeProps} = this.props;
      if (this.props.renderTime) {
        return this.props.renderTime(timeProps);
      }

      const hours = this.props.currentMessage.createdAt.getHours() as number;
      const minutes = this.props.currentMessage.createdAt.getMinutes() as number;

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

  renderCustomView() {
    if (this.props.renderCustomView) {
      return this.props.renderCustomView(this.props);
    }
    return null;
  }

  render() {
    const isSameThread =
      isSameUser(this.props.currentMessage, this.props.previousMessage) &&
      isSameDay(this.props.currentMessage, this.props.previousMessage);

    const messageHeader = isSameThread ? null : (
      <View style={styles.headerView}>
        {this.renderUsername()}
        {this.renderTime()}
        {this.renderTicks()}
      </View>
    );

    return (
      <View style={[styles.container, this.props.containerStyle]}>
        <TouchableOpacity
          onLongPress={this.onLongPress}
          accessibilityTraits="text"
          {...this.props.touchableProps}>
          <View style={[styles.wrapper, this.props.wrapperStyle]}>
            <View>
              {this.renderCustomView()}
              {messageHeader}
              {this.renderMessageImage()}
              {this.renderMessageText()}
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
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
    backgroundColor: 'transparent',
    color: 'white',
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
