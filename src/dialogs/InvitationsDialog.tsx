import React, { Component, ReactElement } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Dimensions,
  ScrollView,
} from 'react-native';
import Resources from '../../res/Resources';
import Dialog, { Position } from './Dialog';
import Toast from 'react-native-simple-toast';
import getAPI from '../API/getAPI';
import { Invitation } from '../API/data_types/Invitation';

export interface Props {
  visible: boolean;
  onDismiss: () => void;
}

const api = getAPI()

export default function InvitationsDialog({ visible, onDismiss }: Props) {
  const [invitations, setInvitations] = React.useState<Invitation[]>([])

  React.useEffect(() => {
    api.getMyInvitations().then(result => {
      if (result.data != null) {
        setInvitations(result.data.items)
      }
    })
  }, [])

  return (
    <Dialog
      onDismiss={onDismiss}
      animationDuration={300}
      visible={visible}
      backdropStyle={{ backgroundColor: undefined }}
      position={Position.Bottom}
      dialogStyle={styles.dialogStyle}
      dismissOnBackdropPress={false}>
      <View style={{ flex: 1 }}>
        <Text>ZAPROSZENIA</Text>
        {invitations.map(invitation => (
          <View style={{ padding: 10, flexDirection: "row", justifyContent: "space-between" }}>
            <Text>{invitation.event.name}</Text>

            <TouchableOpacity 
              style={{ backgroundColor: Resources.get().getColors().DarkBeige }}
              onPress={()=>{
                api.joinEvent(invitation.event).then(()=>{
                  Toast.show(`Dołączono do wydarzenia ${invitation.event.name}!`, Toast.SHORT)
                })
              }}>
              <Text style={{ color: "white" }}>Dołącz</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </Dialog>
  );
}

const styles = StyleSheet.create({
  dialogStyle: {
    borderBottomLeftRadius: 0, borderBottomRightRadius: 0, top: 140, bottom: 0, height: Dimensions.get("screen").height - 140, backgroundColor: Resources.get().getColors().White, justifyContent: "space-between", width: "100%", flexDirection: "column"
  },
  dismissButton: {
    marginBottom: 5
  }
})