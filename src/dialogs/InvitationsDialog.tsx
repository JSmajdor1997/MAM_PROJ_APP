import { faArrowRight, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { Neomorph } from 'react-native-neomorph-shadows-fixes';
import Toast from 'react-native-simple-toast';
import Resources from '../../res/Resources';
import getAPI from '../API/getAPI';
import { Invitation } from '../API/interfaces';
import Dialog, { Position } from './Dialog';

const res = Resources.get()

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
        setInvitations(result.data)
      }
    })
  }, [])

  return (
    <Dialog
      onDismiss={onDismiss}
      animationDuration={300}
      visible={visible}
      backdropStyle={styles.backdropStyle}
      position={Position.Bottom}
      dialogStyle={styles.dialogStyle}
      dismissOnBackdropPress={true}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>ZAPROSZENIA</Text>
        </View>

        {invitations.map(invitation => (
          <Neomorph
            key={`E${invitation.event}|U${invitation.user.id}`}
            style={styles.neomorph}
          >
            <FontAwesomeIcon icon={faEnvelope} />

            <Text>{invitation.event.name}</Text>

            <TouchableOpacity
              style={styles.joinButtonContainer}
              onPress={() => {
                api.joinEvent(invitation).then(() => {
                  Toast.show(`Dołączono do wydarzenia ${invitation.event.name}!`, Toast.SHORT)
                })
              }}>
              <Neomorph
                inner
                style={styles.innerNeomorph}>
                <Text style={styles.joinText}>Dołącz</Text>

                <FontAwesomeIcon icon={faArrowRight} style={styles.arrowIcon} color='white' />
              </Neomorph>
            </TouchableOpacity>
          </Neomorph>
        ))}
      </View>
    </Dialog>
  );
}

const styles = StyleSheet.create({
  dialogStyle: {
    overflow: "hidden",
    borderBottomLeftRadius: 0, 
    borderBottomRightRadius: 0, 
    top: 140, 
    bottom: 0, 
    height: Dimensions.get("screen").height - 140, 
    backgroundColor: res.getColors().White, 
    justifyContent: "space-between", 
    width: "100%", 
    flexDirection: "column"
  },
  backdropStyle: {
    backgroundColor: "#00000088"
  },
  container: {
    flex: 1,
    borderRadius: 15,
    overflow: "hidden",
    alignItems: "center"
  },
  header: {
    width: "100%", 
    padding: 10, 
    backgroundColor: res.getColors().Primary, 
    alignItems: "center"
  },
  headerText: {
    fontSize: 20, 
    fontWeight: "600", 
    fontFamily: "Avenir", 
    color: "white", 
    letterSpacing: 2
  },
  neomorph: {
    shadowRadius: 10,
    borderRadius: 15,
    marginTop: 10,
    backgroundColor: '#E5E5E5',
    width: Dimensions.get("window").width * 0.9,
    height: 50,
    overflow: "hidden",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: 15,
    paddingRight: 5
  },
  joinButtonContainer: {
    width: 120, 
    height: 40, 
    alignItems: "center", 
    justifyContent: "center"
  },
  innerNeomorph: {
    shadowRadius: 5,
    shadowOpacity: 0.1,
    borderRadius: 15,
    flexDirection: "row",
    backgroundColor: "#CCC",
    width: 120,
    height: 40,
    alignItems: "center",
    justifyContent: "space-between",
    padding: 5,
    paddingHorizontal: 10
  },
  joinText: {
    color: "white", 
    fontFamily: "Avenir", 
    fontWeight: "500", 
    letterSpacing: 1
  },
  arrowIcon: {
    marginLeft: 5
  }
});
