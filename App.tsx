import React ,{useState}from 'react'
import { View, Text } from 'react-native'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
// import Home from './src/compoents/Home';
import Login from './src/compoents/Login'


// import Push from './src/compoents/Push';
import Page1 from './src/compoents/Page1';
import Page from './src/compoents/Page';
import Ceshi from './src/compoents/Ceshi';
import Yaogan from './src/compoents/Yaogan';
import BottomNavigator from './src/compoents/BottomNavigator';
import FS1 from './src/compoents/FullScreen';
import Replay from "./src/compoents/replay/Replay";
import Event from "./src/compoents/Event";
import H5sAppVision from "./src/compoents/H5sAppVision";
import ThematicPattern from "./src/compoents/ThematicPattern";
import User from './src/compoents/setting/User';
import Setting from './src/compoents/setting/Setting';
//状态管理
// import {Provider} from 'mobx-react';
// import store from './src/store/store'
import {Provider} from "react-redux";
import { store } from "./src/store/index";



const Stack = createNativeStackNavigator(

);

export default function App() {
  return (
      <Provider store={store}>
      <NavigationContainer >
        <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
          {/* <Stack.Screen name="Home" component={Home} /> */}
          <Stack.Screen name="Login" component={Login} />
   
          {/* <Stack.Screen name="Push" component={Push} /> */}
          <Stack.Screen name="BottomNavigator" component={BottomNavigator} />
          <Stack.Screen name="Page1" component={Page1} />
          <Stack.Screen name="Page" component={Page} />
          <Stack.Screen name="ceshi" component={Ceshi} />
          <Stack.Screen name="Yaogan" component={Yaogan}/>
          <Stack.Screen name="Fu" component={FS1}/>
          <Stack.Screen name="Replay" component={Replay} />
          <Stack.Screen name="Event" component={Event}/>
          <Stack.Screen name="H5sAppVision" component={H5sAppVision}/>
          <Stack.Screen name="ThematicPattern" component={ThematicPattern}/>
          <Stack.Screen name="User" component={User}/>
          <Stack.Screen name="Setting" component={Setting}/>
        </Stack.Navigator>
      </NavigationContainer>
      </Provider>
  )
}
