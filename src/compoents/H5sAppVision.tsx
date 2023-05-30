import React from 'react'
import { View, Text,TouchableOpacity,Dimensions,Image} from 'react-native'
import store from '../store/store';
import data from "./confver.json";
import Icon from 'react-native-vector-icons/iconfont';
const WIDTH = Dimensions.get('screen').width;
const HEIGHT = Dimensions.get('screen').height;

export default function H5sAppVision({ navigation }) {
  const goback = ()=>{
    navigation.goBack();
  }
  return (store.data.backgroundColor=='#FFFFFF'?
    <View style={{backgroundColor:'#f6f6f6',flex:1}}>
      <View style={{backgroundColor:store.data.backgroundColor,height:HEIGHT*0.07,display:'flex',flexDirection:'row',alignItems:'center'}}>
        <TouchableOpacity  onPress={() => goback()} >
          <Icon style={{paddingRight:WIDTH*0.03,paddingLeft:WIDTH*0.05,color:store.data.TextColor,fontSize:WIDTH * 0.08,}} name={'左箭头'}></Icon>
        </TouchableOpacity>
      </View>
      <View style={{paddingTop:WIDTH*0.2}}>
        <Image style={{ width: 0.2 * WIDTH, height: 0.2* WIDTH ,marginLeft:WIDTH*0.4,marginRight:WIDTH*0.5,marginBottom:WIDTH*0.06}} source={require('../assets/pic/appVision.png')} resizeMode='contain' />
        <Image style={{ width: 0.45 * WIDTH, height: 0.1* WIDTH ,marginLeft:WIDTH*0.30,marginRight:WIDTH*0.5}} source={require('../assets/pic/H5S视频平台.png')} resizeMode='contain' />
        <Text  style={{fontSize:WIDTH * 0.04,marginLeft:WIDTH*0.33,color:'grey'}}>H5SAPP:&nbsp;{data.Version}</Text>
        <Text  style={{fontSize:WIDTH * 0.04,marginLeft:WIDTH*0.37,color:'grey'}}>H5S:&nbsp;{store.data.h5svision}</Text>
      </View>
    </View>:
    <View style={{backgroundColor:store.data.backgroundColor,flex:1}}>
      <View style={{backgroundColor:store.data.backgroundColor,height:HEIGHT*0.07,display:'flex',flexDirection:'row',alignItems:'center'}}>
        <TouchableOpacity  onPress={() => goback()} >
          <Icon style={{paddingRight:WIDTH*0.03,paddingLeft:WIDTH*0.05,color:store.data.TextColor,fontSize:WIDTH * 0.08,}} name={'左箭头'}></Icon>
        </TouchableOpacity>
      </View>
      <View style={{paddingTop:WIDTH*0.2}}>
        <Image style={{ width: 0.2 * WIDTH, height: 0.2* WIDTH ,marginLeft:WIDTH*0.4,marginRight:WIDTH*0.5,marginBottom:WIDTH*0.06}} source={require('../assets/pic/appVision.png')} resizeMode='contain' />
        <Image style={{ width: 0.45 * WIDTH, height: 0.1* WIDTH ,marginLeft:WIDTH*0.30,marginRight:WIDTH*0.5}} source={require('../assets/pic/H5S视频平台white.png')} resizeMode='contain' />
        <Text  style={{fontSize:WIDTH * 0.04,marginLeft:WIDTH*0.33,color:'grey'}}>H5SAPP:&nbsp;{data.Version}</Text>
        <Text  style={{fontSize:WIDTH * 0.04,marginLeft:WIDTH*0.37,color:'grey'}}>H5S:&nbsp;{store.data.h5svision}</Text>
      </View>
    </View>
  );
}