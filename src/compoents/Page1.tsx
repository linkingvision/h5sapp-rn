import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView ,TouchableOpacity,Dimensions,Image,DeviceEventEmitter} from 'react-native'
import { Avatar, Chip, List, Colors, Button, Menu, Divider, Provider, RadioButton } from 'react-native-paper'
import axios from 'axios';
import { observer } from 'mobx-react';
import store from '../store/store';
import Icon from 'react-native-vector-icons/iconfont';
import data from "./confver.json";
const WIDTH = Dimensions.get('screen').width;
const HEIGHT = Dimensions.get('screen').height;


const Page1=({navigation})=> {

    const [value, setValue] = React.useState('first');
    const [confirm,setConfirm] = useState('#F9F9FA');
    const LOGOUT =()=>{
        axios.get(store.data.https+'://'+store.data.host+':'+store.data.port+'/api/v1/Logout?session='+store.data.session+'').then((response)=>
        {   
            console.log('登出');
            store.setDefault;
            store.changeReplayData([])
            navigation.navigate('Login')

        })
    }
    const gotoh5svision = ()=>{
        navigation.navigate("H5sAppVision");
    }
    const gotoThematicPattern = ()=>{
        navigation.navigate("ThematicPattern");
    }
    const gotoSetting = ()=>{
        navigation.navigate("Setting");
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
        <SafeAreaView style={{backgroundColor: confirm,height:'100%'}} >
            <ScrollView style={{backgroundColor: confirm,height:'100%'}}>
                <View style={{height: 0.15 * WIDTH,}}>
                    <View style={{justifyContent: 'center',alignItems: 'center',height:0.15*WIDTH}}>
                        <Text style={{fontSize:WIDTH*0.05,color: store.data.TextColor}}>设置</Text>
                    </View>
                </View>
                <View style={{height:0.23*WIDTH,width:WIDTH,flexDirection: 'row', alignItems: 'center',backgroundColor: store.data.backgroundColor}}>
                    {/* <Icon name={'用户名'} color={'black'} size={WIDTH * 0.15} /> */}
                    <Image style={{ width: 0.1 * WIDTH, height: 0.1 * WIDTH ,marginLeft:WIDTH*0.05,marginRight:WIDTH*0.05}} source={require('../assets/图层28.png')} resizeMode='contain' />
                    <Text style={{fontSize:WIDTH * 0.06,color: store.data.TextColor}}>{store.data.username}</Text>
                </View>
                {/* 菜单 */}
                <List.Section>
                    <TouchableOpacity onPress={() =>gotoThematicPattern()} style={{backgroundColor: store.data.backgroundColor}}>
                        <List.Item 
                            style={{width:WIDTH,height:0.14*WIDTH}}
                            titleStyle={{alignItems: 'center',marginLeft:WIDTH*0.03,color: store.data.TextColor}}
                            title="主题背景"
                            left={() =>  <Icon style={{paddingLeft:WIDTH*0.03,color: store.data.TextColor}} name={'主题'} color={'gray'} size={WIDTH * 0.08}/>}
                            right={() => <Icon style={{paddingRight:WIDTH*0.03,paddingTop:WIDTH*0.03}} name={'箭头 (1)'} color={store.data.TextColor} size={WIDTH * 0.03}/>}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() =>gotoh5svision()} style={{backgroundColor: store.data.backgroundColor,marginTop:HEIGHT*0.01}}>
                        <List.Item
                            style={{width:WIDTH,height:0.14*WIDTH}}
                            titleStyle={{alignItems: 'center',marginLeft:WIDTH*0.03,color: store.data.TextColor}}
                            title="关于"
                            left={() => <Icon style={{paddingLeft:WIDTH*0.03,color: store.data.TextColor}} name={'关于于'} color={'gray'} size={WIDTH * 0.08}/>}
                            right={() =>
                                <Text style={{paddingRight:WIDTH*0.03,fontSize:WIDTH * 0.04, color:store.data.TextColor,paddingTop:WIDTH*0.03}} >{data.Version}
                                <Icon style={{paddingRight:WIDTH*0.08,paddingTop:WIDTH*0.03}} name={'箭头 (1)'} color={store.data.TextColor} size={WIDTH * 0.03}/></Text>
                            }
                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() =>gotoSetting()} style={{backgroundColor: store.data.backgroundColor,marginTop:HEIGHT*0.01}}>
                        <List.Item
                            style={{width:WIDTH,height:0.14*WIDTH}}
                            titleStyle={{alignItems: 'center',marginLeft:WIDTH*0.03,color: store.data.TextColor}}
                            title="设置"
                            left={() =>  <Icon style={{paddingLeft:WIDTH*0.03,color: store.data.TextColor}} name={'设置'} color={'gray'} size={WIDTH * 0.08}/>}
                            right={() => <Icon style={{paddingRight:WIDTH*0.03,paddingTop:WIDTH*0.03}} name={'箭头 (1)'} color={store.data.TextColor} size={WIDTH * 0.03}/>}
                        />
                    </TouchableOpacity>
                </List.Section>
                <TouchableOpacity onPress ={()=> LOGOUT()} style={{marginTop:HEIGHT*0.20,marginLeft:HEIGHT*0.01,marginRight:HEIGHT*0.01,backgroundColor:store.data.backgroundColor}}>
                    <List.Item
                        titleStyle={{alignSelf:'center',color:'#0068B7',fontSize:WIDTH*0.045}}
                        style={{width:WIDTH,height:0.13*WIDTH,alignSelf:'center'}}
                        title="退出登录"
                    />
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    zhanweifu: {
        height: 4000
    },
    avatar:{
        alignSelf:'center',
    },
    lists:{

    },
    l:{
        flexDirection: 'row'
    }
})

export default observer(Page1)