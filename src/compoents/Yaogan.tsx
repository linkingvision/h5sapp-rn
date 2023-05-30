import React from 'react'
import { StyleSheet, View } from 'react-native';
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Ionicons';
import Draggable from 'react-native-draggable';
export default function Yaogan() {
    return (
        <View style={{flex:1, backgroundColor: '#f3f3f3'}}>
                   <Draggable >
                     <View style={{width:200,height:200,backgroundColor:'red'}}></View>           
             </Draggable>

      </View>
    )
}
const styles = StyleSheet.create({
    actionButtonIcon: {
      fontSize: 20,
      height: 22,
      color: 'white',
    },
  });