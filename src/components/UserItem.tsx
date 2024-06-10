import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image
} from 'react-native';
import Resources from '../../res/Resources';
import User from '../API/data_types/User';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCrow, faCrown } from '@fortawesome/free-solid-svg-icons';;

interface Props {
  item: User;
  onPress: (item: User) => void
  isAdmin?: boolean
}

function UserItem({ item, onPress, isAdmin }: Props) {
  const [isExpanded, setIsExpanded] = React.useState(false)

  return (
    <TouchableOpacity
      onPress={() => onPress(item)}
      style={{
        padding: 8,
        flexDirection: 'row',
        alignItems: 'center',
      }}>
      <View
        style={{
          borderColor: Resources.get().getColors().Red,
          borderWidth: 1,
          borderRadius: 50,
          aspectRatio: 1,
          padding: 6,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
      </View>
      <View style={{ flex: 1, marginLeft: 8 }}>
        <Image
          source={{uri: item.photoUrl}}
          style={{
            maxWidth: '90%',
          }}/>
        <Text
          numberOfLines={1}
          style={{
            fontSize: 12,
            marginLeft: 4,
            maxWidth: '90%',
          }}>
          {item.userName}
        </Text>

        <View
          style={{
            flexDirection: 'row',
            marginTop: 8,
            justifyContent: 'space-between',
            opacity: 0.2,
          }}>
          <Text
            style={{
              alignSelf: 'flex-end',
              fontSize: 12,
            }}>
              {isAdmin ? <FontAwesomeIcon icon={faCrown}/> : null}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default React.memo(UserItem)

const styles = StyleSheet.create({
    
})