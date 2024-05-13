import React, {ReactElement} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import FastImage from 'react-native-fast-image';
import {LatLng} from 'react-native-maps';
import Ripple from 'react-native-material-ripple';
import { Icon } from '@rneui/base';
import { map_pin_icon } from '../../res/icons/icons';
import Button from './Button';

export function LocalizationButton(props: {
  isOptional: boolean;
  readonly: boolean;
  onPress: () => void;
  position: LatLng;
}): ReactElement {
  return (
    <View
      style={{
        marginRight: 6,
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'flex-end',
        marginTop: 4,
      }}>
      <TouchableOpacity
        onPress={props.onPress}
        style={{flexDirection: 'row', alignItems: 'center'}}>
        <Text
          style={{
            fontFamily: 'roboto',
            color: 'white',
            fontSize: 10,
            marginRight: 6,
            opacity: 0.8,
          }}>
          {`Wybierz miejsce spotkania ${
            props.isOptional ? '(opcjonalnie)' : ''
          }`}
        </Text>
        <FastImage source={map_pin_icon} style={{aspectRatio: 1, width: 22}} />
      </TouchableOpacity>
    </View>
  );
}

export function DismissButton(props: {
  onPress: () => void;
  label: string;
}): ReactElement {
  return (
    <Button
      backgroundColor="#db887b"
      label={props.label}
      icon={<Icon type="material" name="close" color="white" />}
      isLoading={false}
      onPress={props.onPress}
    />
  );
}

export function ContinueButton(props: {
  onPress: () => void;
  label: string;
}): ReactElement {
  return (
    <Button
      backgroundColor="#60b580"
      label={props.label}
      icon={<Icon type="antdesign" name="arrowright" color="white" />}
      isLoading={false}
      onPress={props.onPress}
    />
  );
}

export function BackButton(props: {
  onPress: () => void;
  label: string;
}): ReactElement {
  return (
    <Button
      backgroundColor="#db887b"
      label={props.label}
      icon={<Icon type="antdesign" name="arrowleft" color="white" />}
      isLoading={false}
      onPress={props.onPress}
    />
  );
}

export function CheckButton(props: {
  onPress: () => void;
  label: string;
}): ReactElement {
  return (
    <Button
      backgroundColor="#60b580"
      label={props.label}
      icon={<Icon type="feather" name="check" color="white" />}
      isLoading={false}
      onPress={props.onPress}
    />
  );
}

export function PublishButton(props: {
  onPress: () => void;
  isLoading: boolean;
  label: string;
}): ReactElement {
  return (
    <Button
      backgroundColor="#60b580"
      label={props.label}
      icon={<Icon type="ionicon" name="md-send" color="white" />}
      isLoading={props.isLoading}
      onPress={props.onPress}
    />
  );
}

export function FBShareButton(props: {onPress: () => void}): ReactElement {
  return (
    <Button
      backgroundColor="#4267B2"
      icon={
        <Icon type="font-awesome" name="facebook" color="#FFFFFF" size={16} />
      }
      isLoading={false}
      onPress={props.onPress}
      size={40}
    />
  );
}

export function TwitterShareButton(props: {onPress: () => void}): ReactElement {
  return (
    <Button
      backgroundColor="#1dcaff"
      icon={<Icon type="entypo" name="twitter" color="#FFFFFF" size={16} />}
      isLoading={false}
      onPress={props.onPress}
      size={40}
    />
  );
}

export function renderFAB(
  icon: ReactElement,
  color: string,
  onPress: () => void,
  label?: string,
  size?: number,
): ReactElement {
  return (
    <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
      <Ripple
        rippleCentered={true}
        rippleSize={45}
        onPress={onPress}
        style={{
          aspectRatio: 1,
          width: size || 54,
          backgroundColor: color,
          borderRadius: 50,
          justifyContent: 'center',
          alignItems: 'center',

          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 5,
          },
          shadowOpacity: 1,
          shadowRadius: 16,

          elevation: 20,
        }}>
        {icon}
      </Ripple>
      {label && label != '' ? (
        <View
          style={{
            backgroundColor: 'white',
            paddingHorizontal: 5,
            paddingVertical: 3,
            borderRadius: 5,
            marginTop: 8,

            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 5,
            },
            shadowOpacity: 1,
            shadowRadius: 16,

            elevation: 20,
          }}>
          <Text style={{textAlign: 'center'}}>{label}</Text>
        </View>
      ) : null}
    </View>
  );
}
