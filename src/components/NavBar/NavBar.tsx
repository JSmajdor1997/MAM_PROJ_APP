import React, { Fragment, ReactElement } from 'react';
import {
  Animated,
  Dimensions,
  StyleSheet,
  View,
  ViewStyle
} from 'react-native';
import Ripple from 'react-native-material-ripple';
import Svg, { Circle, Path } from 'react-native-svg';
import Resources from '../../../res/Resources';
import BubbleItem from './BubbleItem';

const res = Resources.get();

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedPath = Animated.createAnimatedComponent(Path);

interface Bubble {
  component: ReactElement;
  onPress: () => void;
}

interface Item {
  render: (isActive: boolean) => ReactElement;
  bubbles?: Array<Bubble>;
  onPress: () => void;
}

interface Props {
  style?: ViewStyle;
  visible: boolean;
  items: Array<Item>;
  selectedIndex: number;
  enabled: boolean;
}

interface State {
  showIcon: boolean;
  circleRadius: Animated.Value;
  pathD: Animated.Value;
  pathX: string;
  pathY: string;
  pathA: string;
  pathB: string;
  bubbleAnim: Animated.Value;
}

export default function NavBar({ style, visible, items, selectedIndex, enabled }: Props) {
  const circleRef = React.useRef<Circle>(null);

  const [state, setState] = React.useState<State>({
    circleRadius: new Animated.Value(546),
    pathD: new Animated.Value(357),
    pathX: '357',
    pathY: '675',
    pathA: '689',
    pathB: '706',
    showIcon: true,
    bubbleAnim: new Animated.Value(0)
  });

  const showBubbles = (show: boolean) => {
    if (show) {
      Animated.spring(state.bubbleAnim, {
        toValue: 1,
        useNativeDriver: false
      }).start();
    } else {
      state.bubbleAnim.setValue(0);
    }
  };

  React.useEffect(() => {
    state.circleRadius.addListener(circleRadius => {
      circleRef.current &&
        circleRef.current.setNativeProps({ cx: circleRadius.value.toString() });
    });

    state.pathD.addListener(a => {
      setState(state => ({
        ...state,
        pathX: a.value.toString(),
        pathY: (318 + parseInt(a.value.toString())).toString(),
        pathA: (330 + parseInt(a.value.toString())).toString(),
        pathB: (350 + parseInt(a.value.toString())).toString(),
      }));
    });

    showBubbles(true);
  }, []);

  React.useEffect(() => {
    showBubbles(false);

    setState(state => ({
      ...state,
      showIcon: false
    }));

    if (selectedIndex == 0) {
      Animated.spring(state.pathD, {
        toValue: 22,
        friction: 10,
        useNativeDriver: false
      }).start();

      Animated.spring(state.circleRadius, {
        toValue: 211,
        friction: 10,
        useNativeDriver: false
      }).start();
    } else if (selectedIndex == 2) {
      Animated.spring(state.pathD, {
        toValue: 691,
        friction: 10,
        useNativeDriver: false
      }).start();

      Animated.spring(state.circleRadius, {
        toValue: 880,
        friction: 10,
        useNativeDriver: false
      }).start();
    } else {
      Animated.spring(state.pathD, {
        toValue: 357,
        friction: 10,
        useNativeDriver: false
      }).start();

      Animated.spring(state.circleRadius, {
        toValue: 546,
        friction: 10,
        useNativeDriver: false
      }).start();
    }

    showBubbles(true);

    setTimeout(() => {
      setState(state => ({ ...state, showIcon: true }));
    }, 80);
  }, [selectedIndex]);

  const renderBubbles = () => {
    if (!enabled) return null;

    const bubbles = items[selectedIndex].bubbles;

    const styleForLeft = {
      left: state.bubbleAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [Dimensions.get('window').width / 2, 10],
      }),
    };

    const styleForRight = {
      right: state.bubbleAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [Dimensions.get('window').width / 2, 10],
      }),
    };

    if (bubbles != undefined) {
      return bubbles.map((bubble, index) => {
        let style: ViewStyle = {};

        if (bubbles.length == 2) {
          if (index == 0) {
            style = styleForLeft;
          } else {
            style = styleForRight;
          }
        } else if (bubbles.length == 3) {
          if (index == 0) {
            style = styleForLeft;
          } else if (index == 2) {
            style = styleForRight;
          } else if (index == 1) {
            style = {
              marginBottom: 20
            };
          }
        }

        return (
          <BubbleItem key={index} onPress={bubble.onPress} style={style} component={bubble.component} bubbleAnim={state.bubbleAnim} />
        );
      });
    }

    return null;
  };

  const showIcon = enabled ? state.showIcon : false;

  const d = `
  M30,
  60h
  ${state.pathX}
  ${enabled
      ? `c17.2,
  0,
  31,
  14.4,
  30,
  31.6c-0.2,
  2.7-0.3,
  5.5-0.3,
  8.2c0,
  71.2,
  58.1,
  129.6,
  129.4,
  130c72.1,
  0.3,
  130.6-58,
  130.6-130c0-2.7-0.1-5.4-0.2-8.1C`
      : ''
    }
  ${state.pathY}.7,74.5,
  ${state.pathA}.5,60,${state.pathB
    }.7,60H1062c16.6,0,30,13.4,30,30v94c0,42-34,76-76,
  76H76c-42,0-76-34-76-76V90C0,73.4,13.4,60,30,60z`;

  return (
    visible && (
      <Fragment>
        <View style={{ ...styles.content, ...style }}>
          <View style={styles.subContent}>
            {items.map((item: Item, index: number) => {
              const isSelected = selectedIndex == index && showIcon;
              const component =
                isSelected && showIcon ? (
                  <View
                    style={[
                      styles.circle,
                      {
                        justifyContent: 'center',
                        alignItems: 'center',
                        flex: 1,
                      },
                    ]}>
                    {item.render(true)}
                  </View>
                ) : (
                  item.render(false)
                );
              return (
                <Ripple
                  disabled={isSelected}
                  rippleCentered={true}
                  rippleSize={45}
                  key={index}
                  style={styles.navItem}
                  onPress={() => {
                    item.onPress();
                  }}>
                  {component}
                </Ripple>
              );
            })}
          </View>
          <Svg
            style={{
              shadowColor: res.getColors().Black,
              shadowOffset: {
                width: 0,
                height: 11,
              },
              shadowOpacity: 0.55,
              shadowRadius: 14.78,
            }}
            id="bottom-bar"
            width="100%"
            height="100"
            viewBox="0 0 1092 260">
            <AnimatedPath fill={res.getColors().LightBeige} stroke={res.getColors().LightBeige} d={d} />
            {enabled && (
              <AnimatedCircle
                ref={circleRef}
                fill={res.getColors().LightBeige}
                stroke={res.getColors().LightBeige}
                cx="546"
                cy="100"
                r="100"
              />
            )}
          </Svg>
        </View>
        {renderBubbles()}
      </Fragment>
    )
  );
}

const styles = StyleSheet.create({
  content: {
    flexDirection: 'column',
    width: Dimensions.get('window').width - 30,
    bottom: 5,
    alignSelf: 'center',
    position: 'absolute',
    zIndex: res.getZIndices().NavBarContainer,

    shadowColor: res.getColors().Black,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.51,
    shadowRadius: 13.16,
  },
  subContent: {
    flexDirection: 'row',
    zIndex: 100,
    marginLeft: 15,
    marginRight: 15,
    marginBottom: 9,
    position: 'absolute',
    bottom: 5,
    elevation: 20,
  },
  navItem: {
    flex: 1,
    paddingTop: 6,
    paddingBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    bottom: 18,
  },
});
