import React from 'react';
import Button from './Button';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faFacebook, faFacebookF, faInstagram, faTwitter } from '@fortawesome/free-brands-svg-icons';

export enum ShareDestination {
  Twitter,
  Facebook,
  Instagram
}

export interface Props {
  onPress: () => void
  destination: ShareDestination
}

export default function ShareButton({ onPress, destination }: Props) {
  return (
    <Button
      backgroundColor="#4267B2"
      icon={
        <FontAwesomeIcon icon={destination == ShareDestination.Facebook ? faFacebookF : destination == ShareDestination.Instagram ? faInstagram : faTwitter} color="#FFFFFF" size={16} />
      }
      isLoading={false}
      onPress={onPress}
      size={40}
    />
  );
}