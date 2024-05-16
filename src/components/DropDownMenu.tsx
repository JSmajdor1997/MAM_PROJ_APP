import React, { ReactElement, Fragment } from 'react';

import {
  View,
  Text,
  ViewStyle,
  Animated,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Menu, MenuItem } from 'react-native-material-menu';
import Ripple from 'react-native-material-ripple';
import LinearGradient from 'react-native-linear-gradient';
import ComponentDisabler from './ComponentDisabler';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCircle, faDotCircle } from '@fortawesome/free-regular-svg-icons';
import { faExpand } from '@fortawesome/free-solid-svg-icons';

interface Props {
  data: Array<{ label: string; isActive?: boolean }>;
  label: string;
  onItemSelected: (selectedIndex: number, isActive: boolean) => void;
  enable?: boolean;
  currentItem: string | null;
  dismissOnItemPress?: boolean;
  style?: ViewStyle | Array<ViewStyle>;
}

interface State {
  spin: Animated.Value;
}

export default class DropDownMenu extends React.PureComponent<Props, State> {
  menu: any | null = null;

  constructor(props: Props) {
    super(props);

    this.state = {
      spin: new Animated.Value(0),
    };
  }

  animate(down: boolean) {
    Animated.timing(this.state.spin, {
      duration: 300,
      toValue: down ? 0 : 1,
      useNativeDriver: false
    }).start();
  }

  showMenu(show: boolean) {
    if (this.menu != null) {
      if (show) {
        this.animate(false);
        this.menu.show();
      } else {
        this.animate(true);
        this.menu.hide();
      }
    }
  }

  renderItems(): Array<ReactElement> {
    const { data, onItemSelected, dismissOnItemPress } = this.props;

    return data.map((it, index) => (
      <Fragment>
        <TouchableOpacity
          onPress={() => {
            onItemSelected(index, !it.isActive);
            if (dismissOnItemPress) this.showMenu(false);
          }}
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 14,
            paddingVertical: 14,
          }}>
          <Text>{it.label}</Text>
          {it.isActive != undefined ? (
            it.isActive ? (
              <FontAwesomeIcon icon={faDotCircle} />
            ) : (
              <FontAwesomeIcon icon={faCircle} />
            )
          ) : null}
        </TouchableOpacity>
        <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          colors={['#ffffff', '#e3e3e3', '#ffffff']}
          style={{ width: '100%', height: StyleSheet.hairlineWidth }}
        />
      </Fragment>
    ));
  }

  renderButton(): ReactElement {
    const { label, enable, currentItem, style } = this.props;
    const { spin } = this.state;

    return (
      <ComponentDisabler enable={enable == undefined ? true : enable}>
        <Ripple onPress={() => this.showMenu(true)}>
          <Text style={{ fontSize: 10, marginLeft: 2, marginBottom: -3 }}>
            {currentItem ? label : ''}
          </Text>
          <View style={{ flexDirection: 'row' }}>
            <Text
              numberOfLines={1}
              style={{
                flex: 1,
                fontSize: 16,
                color: 'black',
                paddingHorizontal: 1,
              }}>
              {currentItem ? currentItem : label}
            </Text>
            <Animated.View
              style={{
                transform: [
                  {
                    rotate: spin.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0deg', '90deg'],
                    }),
                  },
                ],
              }}>
              <FontAwesomeIcon icon={faExpand} />
            </Animated.View>
          </View>
          <View
            style={{
              backgroundColor: 'black',
              width: '100%',
              height: 1,
            }}
          />
        </Ripple>
      </ComponentDisabler>
    );
  }

  render() {
    const { style } = this.props;

    return (
      <View style={style}>
        <Menu
          ref={(ref: any) => (this.menu = ref)}
          button={this.renderButton()}
          onHidden={() => this.animate(true)}
          style={{ width: '92%' }}>
          {this.renderItems()}
        </Menu>
      </View>
    );
  }
}
