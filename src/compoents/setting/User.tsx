import React, { useState, useEffect} from 'react';
import { View, Text,TouchableOpacity,Dimensions,DeviceEventEmitter,TextInput,Overlay} from 'react-native'
import { Avatar, Chip, List, Colors, Button, Menu, Divider, Provider, RadioButton } from 'react-native-paper'
import axios from 'axios';
import store from '../../store/store';
import Icon3 from 'react-native-vector-icons/iconfont';
import MD5 from 'crypto-js/md5'

const WIDTH = Dimensions.get('screen').width;
const HEIGHT = Dimensions.get('screen').height;

export default function ThematicPattern({ navigation }) {
  const [confirm,setConfirm] = useState('#F9F9FA');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordErrorHint, setPasswordErrorHint] = useState(false);
  const [newPasswordErrorHint, setNewPasswordErrorHint] = useState(false);
  const [confirmNewPasswordErrorHint, setConfirmNewPasswordErrorHint] = useState(false);
  const [rule1,setRule1] = useState(store.data.TextColor);
  const [rule2,setRule2] = useState(store.data.TextColor);
  const [rule3,setRule3] = useState(store.data.TextColor);
  const [rule4,setRule4] = useState(store.data.TextColor);
  const [rule5,setRule5] = useState(store.data.TextColor);
  const [rule6,setRule6] = useState(store.data.TextColor);
  const [rule7,setRule7] = useState(store.data.TextColor);
  // 密码规则
  const reg1 = new RegExp(/(?=.*[A-Z])/);
  const reg2 = new RegExp(/(?=.*[a-z])/);
  const reg3 = new RegExp(/(?=.*[0-9])/);
  const reg4 = new RegExp(/(?=(?:.*?[!@#$%*()_+^&}{:;?.]){1})/);
  const reg5 = new RegExp(/((?:0(?=1)|1(?=2)|2(?=3)|3(?=4)|4(?=5)|5(?=6)|6(?=7)|7(?=8)|8(?=9)|9(?=0)){1,2}\d)/);
  const reg6 = new RegExp(/((?:9(?=8)|8(?=7)|7(?=6)|6(?=5)|5(?=4)|4(?=3)|3(?=2)|2(?=1)|1(?=0)){1,2}\d)/);
  const reg7 = RegExp(store.data.username,"g");
  const [reg8,setReg8] = useState(false);
  const Toast = Overlay.Toast;
  const goback = ()=>{
    navigation.goBack();
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
  const passwordBlur=(_password: string)=>{
    console.log("旧密码失去焦点",_password);
    if (_password) {
      if (_password!=store.data.password) {
        setPasswordErrorHint(true)
      }else{
        setPasswordErrorHint(false)
      }
    }
  }
  const newPasswordBlur=(_newPassword: string)=>{
    console.log("新密码失去焦点",_newPassword);
    if (_newPassword) {
      if (_newPassword==store.data.password) {
        setNewPasswordErrorHint(true)
      }else{
        setNewPasswordErrorHint(false)
      }
    }
  }
  const confirmNewPasswordBlur=(_confirmNewPassword: string)=>{
    console.log("新密码失去焦点",_confirmNewPassword);
    if (_confirmNewPassword) {
      if (_confirmNewPassword!=newPassword) {
        setConfirmNewPasswordErrorHint(true)
      }else{
        setConfirmNewPasswordErrorHint(false)
      }
    }
  }
  const  newPasswordChangeText=(value: string)=>{
    setNewPassword(value);
    if (value.length>=8) {
      setRule1('#80C269');
    }else{
      setRule1('#EB3700');
    }
    if (reg1.test(value)) {
      setRule2('#80C269');
    }else{
      setRule2('#EB3700');
    }
    if (reg2.test(value)) {
      setRule3('#80C269');
    }else{
      setRule3('#EB3700');
    }
    if (reg3.test(value)) {
      setRule4('#80C269');
    }else{
      setRule4('#EB3700');
    }
    if (reg4.test(value)) {
      setRule5('#80C269');
    }else{
      setRule5('#EB3700');
    }
    if (value.length>=2) {
      if (reg5.test(value)||reg6.test(value)) {
        setRule6('#EB3700');
      }else{
        setRule6('#80C269');
      }
    }else if(value.length==1){
      setRule6('#80C269');
    }
    if (value) {
      if (reg7.exec(value)==null) {
        setRule7('#80C269');
        setReg8(true);
      }else{
        setRule7('#EB3700');
        setReg8(false);
      }
    }
    if (value=="") {
      setRule1(store.data.TextColor);
      setRule2(store.data.TextColor);
      setRule3(store.data.TextColor);
      setRule4(store.data.TextColor);
      setRule5(store.data.TextColor);
      setRule6(store.data.TextColor);
      setRule7(store.data.TextColor);
      setNewPasswordErrorHint(false)
    }
  }
  const UpdateUser=()=>{
    // 旧密码输入错误
    if (passwordErrorHint) {
      return false;
    }
    // 新密码和旧密码不能相同
    if(newPasswordErrorHint){
      return false;
    }
    // 确认密码和新密码不相同
    if (confirmNewPasswordErrorHint) {
      return false;
    }
    if (newPassword.length<8||!reg1.test(newPassword)||!reg2.test(newPassword)||!reg3.test(newPassword)||!reg4.test(newPassword)||reg5.test(newPassword)||reg6.test(newPassword)||reg8==false) {
      return false;
    }
    if (password&&newPassword&&confirmNewPassword) {
      var url = store.data.https+'://'+store.data.host+':'+store.data.port+'/api/v1/UpdateUser?user='+store.data.username+'&oldpassword='+MD5(store.data.password).toString()+'&newpassword='+MD5(newPassword).toString()+'&session='+store.data.session+'';
      axios.get(url).then((result)=>{ 
        if(result.status==200){
          if(result.data.bStatus==true){
            store.setDefault;
            store.changeReplayData([]);
            navigation.navigate('Login');
            Toast.show('修改成功',2000,{
              textStyle: {
                backgroundColor: 'white',
                color: '#67C23A',
              },
              position: Toast.Position.Top
            });
          }else{
            Toast.show('修改失败',2000,{
              textStyle: {
                backgroundColor: 'white',
                color: 'red',
              },
              position: Toast.Position.Top
            });
          }
        }
      })
    }
  }
  return (
    <View style={{backgroundColor: confirm,height:'100%'}}>
      <View style={{flexDirection: 'row',justifyContent: 'space-between',alignItems:'center',height:70}}>
        <TouchableOpacity  onPress={() => goback()}>
          <Icon3 style={{paddingLeft:WIDTH*0.05,color:store.data.TextColor,fontSize:WIDTH * 0.07,}} name={'左箭头'}></Icon3>
        </TouchableOpacity>
        <Text style={{fontSize:WIDTH * 0.05,color: store.data.TextColor,}}>设置账号密码</Text>
        <View style={{width:WIDTH*0.15}}></View>
      </View>
      {store.data.backgroundColor=='#FFFFFF'?
      <View>
        {/* 账号 */}
        <View style={{height:65,paddingTop:5,flexDirection: 'row',justifyContent:'flex-start',backgroundColor:'#FFFFFF',marginTop:4}}>
          <View style={{paddingTop:20,paddingLeft:15}}>
            <Text  style={{fontSize:WIDTH * 0.05,fontWeight: '500',color: store.data.TextColor}}>账号</Text>
          </View>
          <View style={{paddingTop:20,paddingLeft:80}}>
            <Text style={{fontSize:WIDTH * 0.05,color: '#5D5D5D'}}>{store.data.username}</Text>
          </View>
        </View>
        {/* 旧密码 */}
        <View style={{marginTop:9}}>
          <View style={{height:65,paddingTop:5,flexDirection: 'row',justifyContent:'flex-start',backgroundColor:'#FFFFFF',}}>
            <View style={{paddingTop:20,paddingLeft:15}}>
              <Text  style={{fontSize:WIDTH * 0.05,fontWeight: '500',color: store.data.TextColor}}>旧密码</Text>
            </View>
            <View style={{paddingTop:10,paddingLeft:52}}>
              <TextInput
                value={password}
                style={{color:store.data.TextColor,fontSize:WIDTH * 0.04,}}
                placeholderTextColor='#c1c1c1'
                keyboardType="default"
                placeholder="请填写旧密码"
                onChangeText={(value)=> setPassword(value)}
                onBlur={()=>{passwordBlur(password)}}
              />
            </View>
          </View>
          {passwordErrorHint?<View style={{paddingTop:10,paddingLeft:15}}>
            <Text style={{color:'#EB3700'}}>旧密码错误</Text>
          </View>:<></>}
        </View>
        {/* 新密码 */}
        <View style={{marginTop:9}}>
          <View style={{height:65,paddingTop:5,flexDirection: 'row',justifyContent:'flex-start',backgroundColor:'#FFFFFF',}}>
            <View style={{paddingTop:20,paddingLeft:15}}>
              <Text  style={{fontSize:WIDTH * 0.05,fontWeight: '500',color: store.data.TextColor}}>新密码</Text>
            </View>
            <View style={{paddingTop:10,paddingLeft:52}}>
              <TextInput
                value={newPassword}
                style={{color:store.data.TextColor,fontSize:WIDTH * 0.04,}}
                placeholderTextColor='#c1c1c1'
                keyboardType="default"
                placeholder="请输入新的密码"
                onChangeText={(value)=>newPasswordChangeText(value)}
                onBlur={()=>{newPasswordBlur(newPassword)}}
              />
            </View>
          </View>
          {newPasswordErrorHint?<View style={{paddingTop:10,paddingLeft:15}}>
            <Text style={{color:'#EB3700'}}>新密码与旧密码不能相同</Text>
          </View>:<></>}
          <View style={{paddingTop:10,paddingLeft:15}}>
            <Text style={{color:rule1}}>密码长度最少8个字符。</Text>
            <Text style={{color:rule2}}>密码至少包含一个大写字母。</Text>
            <Text style={{color:rule3}}>密码至少包含一个小写字母。</Text>
            <Text style={{color:rule4}}>密码至少包含一个数字。</Text>
            <Text style={{color:rule5}}>密码至少包含一个特殊字符。比如 @ # & 等。</Text>
            <Text style={{color:rule6}}>密码中不能有连续2个递增或者递减的数字。比如 12  321 5678等。</Text>
            <Text style={{color:rule7}}>密码中不能包含用户名。</Text>
          </View>
        </View>
        {/* 确认新密码 */}
        <View style={{marginTop:9}}>
          <View style={{height:65,paddingTop:5,flexDirection: 'row',justifyContent:'flex-start',backgroundColor:'#FFFFFF',marginTop:9}}>
            <View style={{paddingTop:20,paddingLeft:15}}>
              <Text  style={{fontSize:WIDTH * 0.05,fontWeight: '500',color: store.data.TextColor}}>确认密码</Text>
            </View>
            <View style={{paddingTop:10,paddingLeft:30}}>
              <TextInput
                value={confirmNewPassword}
                style={{color:store.data.TextColor,fontSize:WIDTH * 0.04,}}
                placeholderTextColor='#c1c1c1'
                keyboardType="default"
                placeholder="请再次输入密码"
                onChangeText={(value)=> setConfirmNewPassword(value)}
                onBlur={()=>{confirmNewPasswordBlur(confirmNewPassword)}}
              />
            </View>
          </View>
          {confirmNewPasswordErrorHint?<View style={{paddingTop:10,paddingLeft:15}}>
            <Text style={{color:'#EB3700'}}>两次输入密码不一致</Text>
          </View>:<></>}
        </View>
        <TouchableOpacity onPress={()=> UpdateUser()} style={{marginTop:9,marginLeft:HEIGHT*0.01,marginRight:HEIGHT*0.01,backgroundColor:store.data.backgroundColor}}>
          <List.Item
            titleStyle={{alignSelf:'center',color:'#0399FE',fontSize:WIDTH*0.045}}
            style={{width:WIDTH,height:0.13*WIDTH,alignSelf:'center'}}
            title="确认"
          />
        </TouchableOpacity>
      </View>:
      <View>
        {/* 账号 */}
        <View style={{height:65,paddingTop:5,flexDirection: 'row',justifyContent:'flex-start',backgroundColor:'#181818',marginTop:4}}>
          <View style={{paddingTop:20,paddingLeft:15}}>
            <Text  style={{fontSize:WIDTH * 0.05,fontWeight: '500',color: store.data.TextColor}}>账号</Text>
          </View>
          <View style={{paddingTop:20,paddingLeft:80}}>
            <Text style={{fontSize:WIDTH * 0.05,color: store.data.TextColor}}>{store.data.username}</Text>
          </View>
        </View>
        {/* 旧密码 */}
        <View style={{marginTop:9}}>
          <View style={{height:65,paddingTop:5,flexDirection: 'row',justifyContent:'flex-start',backgroundColor:'#181818',}}>
            <View style={{paddingTop:20,paddingLeft:15}}>
              <Text  style={{fontSize:WIDTH * 0.05,fontWeight: '500',color: store.data.TextColor}}>旧密码</Text>
            </View>
            <View style={{paddingTop:10,paddingLeft:52}}>
              <TextInput
                value={password}
                style={{color:store.data.TextColor,fontSize:WIDTH * 0.04,}}
                placeholderTextColor='#c1c1c1'
                keyboardType="default"
                placeholder="请填写旧密码"
                onChangeText={(value)=> setPassword(value)}
                onBlur={()=>{passwordBlur(password)}}
              />
            </View>
          </View>
          {passwordErrorHint?<View style={{paddingTop:10,paddingLeft:15}}>
            <Text style={{color:'#EB3700'}}>旧密码错误</Text>
          </View>:<></>}
        </View>
         {/* 新密码 */}
        <View style={{marginTop:9}}>
          <View style={{height:65,paddingTop:5,flexDirection: 'row',justifyContent:'flex-start',backgroundColor:'#181818',}}>
            <View style={{paddingTop:20,paddingLeft:15}}>
              <Text  style={{fontSize:WIDTH * 0.05,fontWeight: '500',color: store.data.TextColor}}>新密码</Text>
            </View>
            <View style={{paddingTop:10,paddingLeft:52}}>
              <TextInput
                value={newPassword}
                style={{color:store.data.TextColor,fontSize:WIDTH * 0.04,}}
                placeholderTextColor='#c1c1c1'
                keyboardType="default"
                placeholder="请输入新的密码"
                onChangeText={(value)=>newPasswordChangeText(value)}
                onBlur={()=>{newPasswordBlur(newPassword)}}
              />
            </View>
          </View>
          {newPasswordErrorHint?<View style={{paddingTop:10,paddingLeft:15}}>
            <Text style={{color:'#EB3700'}}>新密码与旧密码不能相同</Text>
          </View>:<></>}
          <View style={{paddingTop:10,paddingLeft:15}}>
            <Text style={{color:rule1}}>密码长度最少8个字符。</Text>
            <Text style={{color:rule2}}>密码至少包含一个大写字母。</Text>
            <Text style={{color:rule3}}>密码至少包含一个小写字母。</Text>
            <Text style={{color:rule4}}>密码至少包含一个数字。</Text>
            <Text style={{color:rule5}}>密码至少包含一个特殊字符。比如 @ # & 等。</Text>
            <Text style={{color:rule6}}>密码中不能有连续2个递增或者递减的数字。比如 12  321 5678等。</Text>
            <Text style={{color:rule7}}>密码中不能包含用户名。</Text>
          </View>
        </View>
        {/* 确认新密码 */}
        <View style={{marginTop:9}}>
          <View style={{height:65,paddingTop:5,flexDirection: 'row',justifyContent:'flex-start',backgroundColor:'#181818',marginTop:9}}>
            <View style={{paddingTop:20,paddingLeft:15}}>
              <Text  style={{fontSize:WIDTH * 0.05,fontWeight: '500',color: store.data.TextColor}}>确认密码</Text>
            </View>
            <View style={{paddingTop:10,paddingLeft:30}}>
              <TextInput
                value={confirmNewPassword}
                style={{color:store.data.TextColor,fontSize:WIDTH * 0.04,}}
                placeholderTextColor='#c1c1c1'
                keyboardType="default"
                placeholder="请再次输入密码"
                onChangeText={(value)=> setConfirmNewPassword(value)}
                onBlur={()=>{confirmNewPasswordBlur(confirmNewPassword)}}
              />
            </View>
          </View>
          {confirmNewPasswordErrorHint?<View style={{paddingTop:10,paddingLeft:15}}>
            <Text style={{color:'#EB3700'}}>两次输入密码不一致</Text>
          </View>:<></>}
        </View>
        <TouchableOpacity onPress={()=> UpdateUser()} style={{marginTop:9,marginLeft:HEIGHT*0.01,marginRight:HEIGHT*0.01,backgroundColor:'#181818'}}>
          <List.Item
            titleStyle={{alignSelf:'center',color:'#0399FE',fontSize:WIDTH*0.045}}
            style={{width:WIDTH,height:0.13*WIDTH,alignSelf:'center'}}
            title="确认"
          />
        </TouchableOpacity>
      </View>}
    </View>
  );
}