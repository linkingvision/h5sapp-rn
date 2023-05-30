import React, { useState, useEffect} from 'react';
import { View, Text, ScrollView, StyleSheet, FlatList, StatusBar, SafeAreaView ,TouchableOpacity,Dimensions,Image,Switch,DeviceEventEmitter} from 'react-native'
import { Avatar, Chip, List, Colors, Button, Menu, Divider, Provider, RadioButton } from 'react-native-paper'
import axios from 'axios';
import { observer } from 'mobx-react';
import store from '../store/store';
import data from "./confver.json";
import { useDarkMode,eventEmitter } from 'react-native-dark-mode'
import { Icon } from 'react-native-paper/lib/typescript/components/Avatar/Avatar';
import Icon2 from 'react-native-vector-icons/AntDesign';
import Icon3 from 'react-native-vector-icons/iconfont';
import AsyncStorage from '@react-native-community/async-storage';
import { event } from 'react-native-reanimated';

const WIDTH = Dimensions.get('screen').width;
const HEIGHT = Dimensions.get('screen').height;

export default function ThematicPattern({ navigation }) {
  const goback = ()=>{
    navigation.goBack();
  }
  const [isEnabled, setIsEnabled] = useState(false);
  const [isEnabledDark, setIsEnabledDark] = useState(false);
  const [confirm,setConfirm] = useState('#F9F9FA');
  const isDarkMode = useDarkMode()
  console.log('====================================');
  console.log('深色模式',isDarkMode);
  console.log('====================================');
  eventEmitter.on('currentModeChanged', newMode => {
    // console.log('Switched to', newMode, 'mode')
    if (isEnabled) {
      if (newMode=='light') {
        store.changeBackgroundColor('#111111')
        store.changeTextColor('#FFFFFF')
        DeviceEventEmitter.emit('background','#111111');
      }else{
        store.changeBackgroundColor('#FFFFFF')
        store.changeTextColor('#111111')
        DeviceEventEmitter.emit('background','#FFFFFF');
      }
    }
  })
  DeviceEventEmitter.addListener("EventReminder",(e)=>{
    console.log("guangy get event in DeviceEventEmitter")
  })
  //数据存储
  const storeData = async (key:string,value) => {
    try {
      await AsyncStorage.setItem(key, value)
    } catch (e) {
      // saving error
    }
  }

  //数据读取
  const getData = async (key:string) => {
		try {
		  const value = await AsyncStorage.getItem(key)
		  if(value !== null) {
			  console.log('值是',value)
			  if(key == 'FollowSystemTopic'){
				  setIsEnabled(JSON.parse(value));
          console.log('213',isEnabled);
			  }
		  }
		} catch(e) {
		  // error reading value
		}
  }
  const toggleSwitch = () => {
    setIsEnabled(previousState => !previousState);
  };
  const toggleSwitch2 = () => {
    setIsEnabledDark(previousState => !previousState);
  };
  const gobackgroundColor = ()=>{
    if (!isEnabled) {
      if (isEnabledDark) {
        store.changeBackgroundColor('#FFFFFF')
        store.changeTextColor('#111111')
        setConfirm('#F9F9FA')
        DeviceEventEmitter.emit('background','#FFFFFF');
      }else{
        store.changeBackgroundColor('#111111')
        store.changeTextColor('#FFFFFF')
        setConfirm('#111111')
        DeviceEventEmitter.emit('background','#111111');
      }
    }
  }
  useEffect(() => {
		getData('FollowSystemTopic')
    if (store.data.backgroundColor=='#FFFFFF') {
      setIsEnabledDark(false);
      setConfirm('#F9F9FA')
    }else{
      setIsEnabledDark(true);
      setConfirm('#111111')
    }
	},[])
  useEffect(() => {
		store.changeDarkMode(isEnabled);
    storeData('FollowSystemTopic',JSON.stringify(isEnabled));
    if (isEnabled) {
      if (isDarkMode) {
        store.changeBackgroundColor('#111111')
        store.changeTextColor('#FFFFFF')
        DeviceEventEmitter.emit('background','#111111');
      }else{
        // store.changeBackgroundColor('#FFFFFF')
        // store.changeTextColor('#111111')
        // DeviceEventEmitter.emit('background','#FFFFFF');
      }
		}
	},[isEnabled])
  return (
    <View style={{backgroundColor: confirm,height:'100%'}}>
      <View style={{flexDirection: 'row',justifyContent: 'space-between',alignItems:'center',height:70}}>
        <TouchableOpacity  onPress={() => goback()}>
          <Icon3 style={{paddingLeft:WIDTH*0.05,color:store.data.TextColor,fontSize:WIDTH * 0.07,}} name={'左箭头'}></Icon3>
        </TouchableOpacity>
        {store.data.backgroundColor=='#FFFFFF'? <Text style={{fontSize:WIDTH * 0.05,color: store.data.TextColor,}}>普通模式</Text> : <Text style={{fontSize:WIDTH * 0.05,color: store.data.TextColor,}}>深色模式</Text>}
        <View style={{width:WIDTH*0.15}}></View>
      </View>
      {store.data.backgroundColor=='#FFFFFF'?
      <View style={{height:65,paddingTop:5,flexDirection: 'row',justifyContent:'space-between',backgroundColor:'#FFFFFF',marginTop:4}}>
        <View style={{paddingTop:20,paddingLeft:15}}>
          <Text  style={{fontSize:WIDTH * 0.05,fontWeight: '500',color: store.data.TextColor}}>深色模式</Text>
        </View>
        <View style={{paddingTop:20}}>
          <Switch
            trackColor={{ false: "#767577", true: "#409EFF" }}
            thumbColor={isEnabledDark ? "#FFFFFF" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            value={isEnabledDark}
            onChange ={()=>{gobackgroundColor()}}
            onValueChange={toggleSwitch2}
          />
        </View>
      </View>:
      <View style={{height:65,paddingTop:5,flexDirection: 'row',justifyContent:'space-between',backgroundColor:'#181818',marginTop:4}}>
        <View style={{paddingTop:20,paddingLeft:15}}>
          <Text  style={{fontSize:WIDTH * 0.05,fontWeight: '500',color: store.data.TextColor}}>深色模式</Text>
        </View>
        <View style={{paddingTop:20}}>
        <Switch
            trackColor={{ false: "#767577", true: "#409EFF" }}
            thumbColor={isEnabledDark ? "#FFFFFF" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            value={isEnabledDark}
            onChange ={()=>{gobackgroundColor()}}
            onValueChange={toggleSwitch2}
          />
        </View>
      </View>}
      {store.data.backgroundColor=='#FFFFFF'?
        <View style={{marginTop:30}}>
          <View style={{flexDirection: 'row',justifyContent: 'space-between',alignItems:'center',paddingBottom:20,backgroundColor:'#FFFFFF',}}>
            <View style={{paddingTop:15,paddingLeft:15}}>
              <Text  style={{fontSize:WIDTH * 0.05,fontWeight: '500',color: store.data.TextColor}}>跟随系统设置</Text>
            </View>
            <View style={{paddingTop:15}}>
              <Switch
                trackColor={{ false: "#767577", true: "#409EFF" }}
                thumbColor={isEnabled ? "#FFFFFF" : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                value={isEnabled}
                onValueChange={toggleSwitch}
              />
            </View>
          </View>
          <View style={{paddingTop:10,paddingLeft:15}}>
            <Text style={{color: store.data.TextColor}}>开启后，将跟随系统打开或关闭深色模式</Text>
          </View>
        </View>:
        <View style={{marginTop:30}}>
          <View style={{flexDirection: 'row',justifyContent: 'space-between',alignItems:'center',paddingBottom:20,backgroundColor:'#181818',}}>
            <View style={{paddingTop:15,paddingLeft:15}}>
              <Text  style={{fontSize:WIDTH * 0.05,fontWeight: '500',color: store.data.TextColor}}>跟随系统</Text>
            </View>
            <View style={{paddingTop:15}}>
              <Switch
                trackColor={{ false: "#767577", true: "#409EFF" }}
                thumbColor={isEnabled ? "#FFFFFF" : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                value={isEnabled}
                onValueChange={toggleSwitch}
              />
            </View>
          </View>
          <View style={{paddingTop:10,paddingLeft:15}}>
            <Text style={{color: store.data.TextColor}}>开启后，将跟随系统打开或关闭深色模式</Text>
          </View>
        </View>}
    </View>
  );
}