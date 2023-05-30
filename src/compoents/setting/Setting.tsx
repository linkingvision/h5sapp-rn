import React, { useState, useEffect} from 'react';
import { View, Text, ScrollView, StyleSheet, FlatList, StatusBar, SafeAreaView ,TouchableOpacity,Dimensions,Image,Switch,DeviceEventEmitter} from 'react-native'
import { Avatar, Chip, List, Colors, Button, Menu, Divider, Provider, RadioButton } from 'react-native-paper'
import axios from 'axios';
import { observer } from 'mobx-react';
import store from '../../store/store';
import { useDarkMode,eventEmitter } from 'react-native-dark-mode'
import Icon from 'react-native-vector-icons/iconfont';
import AsyncStorage from '@react-native-community/async-storage';
import { event } from 'react-native-reanimated';

const WIDTH = Dimensions.get('screen').width;
const HEIGHT = Dimensions.get('screen').height;

export default function ThematicPattern({ navigation }) {
  const [confirm,setConfirm] = useState('#F9F9FA');
  const goback = ()=>{
    navigation.goBack();
  }
  const gotoUser = ()=>{
    navigation.navigate("User");
  }
  DeviceEventEmitter.addListener('background',(value)=>{
    if (store.data.backgroundColor=='#FFFFFF') {
      setConfirm('#F9F9FA')
    }else{
      setConfirm('#111111')
    }
  })
  useEffect(() => {
    if (store.data.backgroundColor=='#FFFFFF') {
      setConfirm('#F9F9FA')
    }else{
      setConfirm('#111111')
    }
  },[])
  return (
    <View style={{backgroundColor: confirm,height:'100%'}}>
      <View style={{flexDirection: 'row',justifyContent: 'space-between',alignItems:'center',height:70}}>
        <TouchableOpacity  onPress={() => goback()}>
          <Icon style={{paddingLeft:WIDTH*0.05,color:store.data.TextColor,fontSize:WIDTH * 0.07,}} name={'左箭头'}></Icon>
        </TouchableOpacity>
         <Text style={{fontSize:WIDTH * 0.05,color: store.data.TextColor,}}>设置</Text>
        <View style={{width:WIDTH*0.15}}></View>
      </View>
      <List.Section>
        <TouchableOpacity onPress={() =>gotoUser()} style={{backgroundColor: store.data.backgroundColor}}>
          <List.Item 
            style={{width:WIDTH,height:0.14*WIDTH}}
            titleStyle={{alignItems: 'center',marginLeft:WIDTH*0.03,color: store.data.TextColor}}
            title="账号安全"
            // left={() =>  <Icon style={{paddingLeft:WIDTH*0.03,color: store.data.TextColor}} name={'主题'} color={'gray'} size={WIDTH * 0.08}/>}
            right={() => <Icon style={{paddingRight:WIDTH*0.03,paddingTop:WIDTH*0.03}} name={'箭头 (1)'} color={store.data.TextColor} size={WIDTH * 0.03}/>}
          />
        </TouchableOpacity>
      </List.Section>
    </View>
  );
}