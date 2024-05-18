import React, { Component, ReactElement } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Dimensions,
} from 'react-native';
import EventItem from '../components/EventItem';
import WastelandItem from '../components/WastelandItem';
import { Resources } from '../../res/Resources';
import Dialog, { Position } from './Dialog';
import FAB from '../components/FAB';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import Wasteland from '../API/data_types/Wasteland';
import Event from '../API/data_types/Event';
import Dumpster from '../API/data_types/Dumpster';
import { MapObjects, Query, Type } from '../API/helpers';
import { GeneralError } from '../API/API';
import APIResponse from '../API/APIResponse';
import getAPI from '../API/getAPI';
import Toast from 'react-native-simple-toast';
import { isDumpster, isEvent, isWasteland } from '../API/data_types/type_guards';
import DumpsterItem from '../components/DumpsterItem';
import Separator from '../components/Separator';

export interface Props {
  visible: boolean;
  onDismiss: () => void;
  onItemSelected: (item: Wasteland | Event | Dumpster) => void;
  query: Query
}

const PageSize = 10

export default function ListDialog({ visible, onDismiss, onItemSelected, query }: Props) {
  const [index, setIndex] = React.useState(0)
  const [isLoading, setIsLoading] = React.useState(true)
  const [hasMore, setHasMore] = React.useState<Type[]>([Type.Dumpster, Type.Event, Type.Wasteland])

  const [mapObjects, setMapObjects] = React.useState<MapObjects>({
    [Type.Dumpster]: [],
    [Type.Event]: [],
    [Type.Wasteland]: []
  })

  const updateMapObjects = () => {
    if (isLoading || !hasMore) {
      return
    }

    setIsLoading(true)

    getAPI().getObjects(query.type, { phrase: query.phrase }).then(rsp => {
      setIsLoading(false)
      
      if (rsp.error == null) {
        setHasMore([
          ...(mapObjects[Type.Dumpster].length > 0 ? [] : [Type.Dumpster]),
          ...(mapObjects[Type.Event].length > 0 ? [] : [Type.Event]),
          ...(mapObjects[Type.Wasteland].length > 0 ? [] : [Type.Wasteland])
        ])

        setMapObjects(mapObjects => ({
          ...mapObjects,
          ...rsp.data
        }))
      } else {
        Toast.showWithGravityAndOffset(rsp.description ?? "Error", Toast.SHORT, Toast.CENTER, 0, 10)
      }
    })
  }

  React.useEffect(() => {
    setIndex(0)
    updateMapObjects()
  }, [query])

  React.useEffect(() => {
    updateMapObjects()
  }, [index])

  return (
    <Dialog
      onDismiss={onDismiss}
      animationDuration={300}
      visible={visible}
      backdropStyle={{ backgroundColor: undefined }}
      position={Position.Bottom}
      dialogStyle={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0, top: 140, bottom: 0, height: Dimensions.get("screen").height - 140, backgroundColor: "white", justifyContent: "space-between", width: "100%", flexDirection: "column" }}
      dismissOnBackdropPress={false}>
      <FlatList
        onEndReachedThreshold={0.5}
        onEndReached={() => setIndex(index + PageSize)}
        style={{ flex: 1 }}
        renderItem={({ item }) => (
          isWasteland(item) ? <WastelandItem key={`${Type.Wasteland}-${item.id}`} item={item} /> :
            isEvent(item) ? <EventItem key={`${Type.Event}-${item.id}`} item={item} /> :
              isDumpster(item) ? <DumpsterItem key={`${Type.Dumpster}-${item.id}`} item={item} /> :
                null
        )}
        keyExtractor={item => item.id.toString()}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => (
          <Separator />
        )}
        data={[
          ...mapObjects[Type.Dumpster],
          ...mapObjects[Type.Event],
          ...mapObjects[Type.Wasteland]
        ]}
      />

      <FAB
        color={Resources.Colors.Red}
        icon={<FontAwesomeIcon icon={faClose} color={Resources.Colors.White} size={25} />}
        style={{ marginBottom: 5 }}
        onPress={onDismiss} />
    </Dialog>
  );
}