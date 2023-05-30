import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { BottomNavigation, Text ,} from 'react-native-paper';
import {Image, View,DeviceEventEmitter} from 'react-native'
import Player from './Player';
import Push from './Push';
import Login from './Login';
import Page1 from './Page1';
import Page from './Page';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';

import {StyleSheet} from 'react-native'
import Icon from 'react-native-vector-icons/iconfont'
import Replay from './replay/Replay';
import Yaogan from './Yaogan';
import Event from './Event'
import store from '../store/store';
import AsyncStorage from '@react-native-community/async-storage';
import { useDarkMode } from 'react-native-dark-mode'
//创建Tab

// const Tab = createMaterialBottomTabNavigator();

// const Test= ()=>{
//   return(
 
//       <Tab.Navigator   inactiveColor="#green"   activeColor="red"  

//       >
//         <Tab.Screen name='Player' component={Player} options={{tabBarIcon:require('../assets/setting.png')}} ></Tab.Screen>
//         <Tab.Screen name='Push' component={Push} options={{tabBarIcon:require('../assets/setting.png')}}></Tab.Screen>
//       </Tab.Navigator>
    
//   )
// }
// export default Test;




const Tab = createMaterialBottomTabNavigator();

function BottomNavigator() {
  const [confirm,setConfirm] = useState(store.data.backgroundColor);
  const isDarkMode = useDarkMode()
  console.log('====================================');
  console.log('深色模式Tab',isDarkMode);
  console.log('====================================');
  //数据读取
  const getData = async (key:string) => {
		try {
		  const value = await AsyncStorage.getItem(key)
		  if(value !== null) {
			  console.log('Btn值是',value)
			  if(key == 'FollowSystemTopic'){
				  if (value=='true') {
						if (isDarkMode) {
							setConfirm('#1B1B1B')
						}else{
							setConfirm('#FFFFFF')
						}
					}else{
            if (store.data.backgroundColor=='#FFFFFF') {
              setConfirm('#FFFFFF')
            }else{
              setConfirm('#1B1B1B')
            }
          }
			  }
		  }
		} catch(e) {
		  // error reading value
		}
  }
  DeviceEventEmitter.addListener('background',(value)=>{
    console.log('value',store.data.backgroundColor);
    if (store.data.backgroundColor=='#FFFFFF') {
      setConfirm('#FFFFFF')
    }else{
      setConfirm('#1B1B1B')
    }
  })
  useEffect(() => {
		getData('FollowSystemTopic')
	},[])
  return (
    <Tab.Navigator       activeColor="#4898D3"       barStyle={{ backgroundColor: confirm}} labeled={true}  shifting={false}  >
      <Tab.Screen name="实时视频" component={Page}   options={{tabBarIcon:() =><Icon name={'视频'} size={18} color={store.data.TextColor}/>} }   />
      {/* <Tab.Screen name="回放（测试页面）" component={Push}  options={{tabBarIcon:() =><Icon name={'iconfont图标_视频回放'} size={18}/>}}/> */}
      {/* <Tab.Screen name="事件监控（测试页面）" component={Yaogan} options={{tabBarIcon:() =><Icon name={'事件监控'} size={18}/>}}/> */}
      <Tab.Screen name="回放" component={Replay}   options={{tabBarIcon:() =><Icon name={'iconfont图标_视频回放'} size={18} color={store.data.TextColor}/>} }   listeners={{
        blur: (e) => {
          DeviceEventEmitter.emit('blur','true');
        },
      }}/>
      <Tab.Screen name="事件监控" component={Event}   options={{tabBarIcon:() =><Icon name={'事件监控'} size={18} color={store.data.TextColor}/>} }   />

      <Tab.Screen  name="设置" component={Page1} options={{tabBarIcon:() =><Icon name={'设置-01'} size={20} color={store.data.TextColor}/>}}/>

    </Tab.Navigator>
  );
}

export default BottomNavigator;

const styles = StyleSheet.create({
  
})

