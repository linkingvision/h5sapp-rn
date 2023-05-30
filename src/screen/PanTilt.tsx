import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet, TextInput, ImageBackground, Image, Dimensions, ScrollView,DeviceEventEmitter } from 'react-native'

import { IconButton, Colors, Button, } from 'react-native-paper';
import Icon from 'react-native-vector-icons/iconfont';
import Slider from '@react-native-community/slider';

import axios from 'axios'
import store from '../store/store';
import { observer } from 'mobx-react'
//获取宽度和高度
const WIDTH = Dimensions.get('screen').width;
const HEIGHT = Dimensions.get('screen').height;

const PanTilt = () => {
    const [text1, setText1] = useState('');
    const [text2, setText2] = useState('');
    const [text3, setText3] = useState('');
    const [text4, setText4] = useState('');
    const [list, setList] = useState();

    const [speed, setSpeed] = useState('0.5');
    const [confirm,setConfirm] = useState('rgb(243,243,243)');
    //方向 
    const chooseDir = (dir) => {
        axios.get(store.data.https+'://'+ store.data.host + ':' + store.data.port + '/api/v1/Ptz?token=' + store.data.token + '&action=' + dir + '&speed=' + speed + '&session=' + store.data.session + '')
            .then(function (response) {
                if (response.data.strCode == "PTZ successfully") {
                    console.log('任意方向')
                    console.log('转动成功')
                }
            }).catch(err => { console.log(err) });
    }

    //停 
    const stop = () => {
        axios.get(store.data.https+'://'+ store.data.host + ':' + store.data.port + '/api/v1/Ptz?token=' + store.data.token + '&action=stop&speed=0.5&session=' + store.data.session + '').then(
            function (response) {
                if (response.data.strCode == "PTZ successfully") {
                    console.log('停止成功')
                }

            }
        ).catch(err => { console.log(err) })
    }


    //预置位
    const preSet = (text, num) => {
        axios.get(store.data.https+'://'+ store.data.host + ':' + store.data.port + '/api/v1/SetPreset?token=' + store.data.token + '&presetname=' + text + '&presettoken=' + num + '&session=' + store.data.session + '').then(function (response) {
            if (response.data.strCode == "SetPreset successfully") {
                console.log('成功设置预置位')
                console.log(text)
            }
        }).catch(err => { console.log(err) })
    }

    //变到预置位

    const defaultPositions = (preset) => {
        axios.get(store.data.https+'://'+ store.data.host + ':' + store.data.port + '/api/v1/Ptz?token=' + store.data.token + '&action=preset&preset=' + preset + '&session=' + store.data.session + '').then(function (response) {
            if (response.data.strCode === 'PTZ successfully') {
                console.log('预置位调整成功')
            }
        }).catch(err => { console.log(err) })
    }


    //获取相关信息

    const getName = () => {
        axios.get(store.data.https+'://'+ store.data.host + ':' + store.data.port + '/api/v1/GetPresets?token=' + store.data.token + '&session=' + store.data.session + '')
            .then(function (response) {
                console.log('进来了');
                let data = [];
                let data1 = response.data.preset;
                data = data1;
                setList(data);
                console.log('预置位个数', data)

            })
    }

    useEffect(() => {
        getName()
    }, [text1, text2, text3, text4])

    DeviceEventEmitter.addListener('background',(value)=>{
        if (store.data.backgroundColor=='#FFFFFF') {
          setConfirm('rgb(243,243,243)')
        }else{
          setConfirm('#181818')
        }
      })
      useEffect(() => {
        if (store.data.backgroundColor=='#FFFFFF') {
          setConfirm('rgb(243,243,243)')
        }else{
          setConfirm('#181818')
        }
      },[])
    return (

        <ScrollView>

            <View style={{flexDirection: 'row',height: HEIGHT * 0.148,backgroundColor: store.data.backgroundColor}}>
                <TouchableOpacity onPressIn={() => { store.changeFlag() }} >
                    <Icon style={{ marginLeft: WIDTH * 0.05, marginTop: WIDTH * 0.05 }} name={'关  闭'} color={'gray'} size={WIDTH * 0.04} />
                </TouchableOpacity>

                <View style={{ marginLeft: WIDTH * 0.45, marginTop: WIDTH * 0.05, flexDirection: 'row' }}>
                    <Text style={{ fontSize: WIDTH * 0.03, color: 'rgb(45,158,251)' }}>{speed}</Text>
                    <Slider
                        style={{ width: WIDTH * 0.42, height: WIDTH * 0.05 }}
                        minimumValue={0}
                        maximumValue={1}
                        value={0.5}
                        minimumTrackTintColor="rgb(45,158,251)"
                        maximumTrackTintColor="rgb(45,158,251)"
                        onValueChange={(value) => { console.log(value); let a = value.toFixed(2); setSpeed(a); }}
                        onSlidingComplete={(value) => { console.log(value); let a = value.toFixed(2); setSpeed(a); }}
                        step={0.10}
                    />
                </View>

            </View>



            <View style={{ flex: 1,flexDirection: 'row',height: 0.48 * HEIGHT,backgroundColor:  store.data.backgroundColor}} >

                <View style={styles.box1}>
                    <TouchableOpacity onPressIn={() => { chooseDir('focusout') }} onPressOut={() => { chooseDir('stop') }}>
                        <Icon  name={'聚焦01'} color={'gray'} size={WIDTH * 0.118} />
                    </TouchableOpacity>

                    <TouchableOpacity onPressIn={() => { chooseDir('irisin') }} onPressOut={() => { chooseDir('stop') }}>
                        <Icon style={styles.icon} name={'光圈加'} color={'gray'} size={WIDTH * 0.118} />
                    </TouchableOpacity>

                    <TouchableOpacity onPressIn={() => { chooseDir('iriout') }} onPressOut={() => { chooseDir('stop') }}>
                        <Icon style={styles.icon} name={'光圈减'} color={'gray'} size={WIDTH * 0.118} />
                    </TouchableOpacity>


                    {/* 预置位 */}
                    {store.data.backgroundColor=='#FFFFFF'?<TouchableOpacity>
                        <Image style={{ width: 0.16*WIDTH, height: 0.16 * WIDTH, marginTop: 0.11 * WIDTH}} source={require('../assets/预置位.png')} resizeMode='contain' />
                    </TouchableOpacity>:<TouchableOpacity>
                        <Image style={{ width: 0.16*WIDTH, height: 0.16 * WIDTH, marginTop: 0.11 * WIDTH}} source={require('../assets/ptz/预置位_white.png')} resizeMode='contain' />
                    </TouchableOpacity>}

                </View>

                <View style={styles.box2}>
                    <TouchableOpacity onPressIn={() => { chooseDir('focusin') }} onPressOut={() => { chooseDir('stop') }}>
                        <Icon style={{ marginBottom: 0.073 * WIDTH }} name={'聚焦2'} color={'gray'} size={WIDTH * 0.118} />
                    </TouchableOpacity>
                    <View style={styles.ctrl}>
                        {/* 0hang */}
                        <View style={{ height: 0.04 * WIDTH, width: 0.48 * WIDTH }}></View>
                        {/* 第一行 */}
                        <View style={{ flexDirection: 'row', height: 0.08 * WIDTH, width: 0.48 * WIDTH }}>
                            <View style={{ width: 0.2 * WIDTH, height: 0.08 * WIDTH }}></View>
                            <TouchableOpacity onPressIn={() => { chooseDir('up') }} onPressOut={() => { chooseDir('stop') }}>
                                <Image style={{ width: 38.4, height: 0.04 * WIDTH }} source={require('../assets/云台/4.png')} resizeMode='contain' />
                            </TouchableOpacity>
                            <View style={{ width: 0.2 * WIDTH, height: 0.08 * WIDTH }}></View>
                        </View>
                        {/* 第二行 */}
                        <View style={{ flexDirection: 'row', height: 0.08 * WIDTH, justifyContent: 'flex-start', width: 0.48 * WIDTH }}>
                            <View style={{ height: 0.08 * WIDTH, width: 0.12 * WIDTH }}></View>
                            <TouchableOpacity onPressIn={() => { chooseDir('upleft') }} onPressOut={() => { chooseDir('stop') }}>
                                <Image style={{ width: 0.04 * WIDTH, height: 0.04 * WIDTH }} source={require('../assets/云台/8.png')} resizeMode='contain' />
                            </TouchableOpacity>
                            <View style={{ height: 0.08 * WIDTH, width: 0.16 * WIDTH }}></View>
                            <TouchableOpacity onPressIn={() => { chooseDir('upright') }} onPressOut={() => { chooseDir('stop') }}>
                                <Image style={{ width: 0.04 * WIDTH, height: 0.04 * WIDTH }} source={require('../assets/云台/6.png')} resizeMode='contain' />
                            </TouchableOpacity>
                            <View style={{ height: 0.08 * WIDTH, width: 0.12 * WIDTH }}></View>

                        </View>

                        {/* 第三行 */}
                        <View style={{ height: 0.12 * WIDTH, width: 0.48 * WIDTH, flexDirection: 'row' }}>
                            <View style={{ height: 0.04 * 3 * WIDTH, width: 0.04 * WIDTH }}></View>
                            <TouchableOpacity onPressIn={() => { chooseDir('left') }} onPressOut={() => { chooseDir('stop') }}>
                                <Image style={{ width: 0.04 * WIDTH, height: 0.04 * 2 * WIDTH }} source={require('../assets/云台/1.png')} resizeMode='contain' />
                            </TouchableOpacity>
                            <View style={{ height: 0.04 * 3 * WIDTH, width: 0.04 * 8 * WIDTH }}></View>
                            <TouchableOpacity onPressIn={() => { chooseDir('right') }} onPressOut={() => { chooseDir('stop') }}>
                                <Image style={{ width: 0.04 * WIDTH, height: 0.04 * 2 * WIDTH }} source={require('../assets/云台/2.png')} resizeMode='contain' />
                            </TouchableOpacity>
                            <View style={{ height: 0.04 * 3 * WIDTH, width: 0.04 * WIDTH }} ></View>
                        </View>

                        {/* 第四行 */}
                        <View style={{ flexDirection: 'row', width: 0.48 * WIDTH, height: 0.04 * 2 * WIDTH }}>

                            <View style={{ height: 0.04 * 2 * WIDTH, width: 0.04 * 3 * WIDTH }}></View>
                            <TouchableOpacity onPressIn={() => { chooseDir('downleft') }} onPressOut={() => { chooseDir('stop') }}>
                                <Image style={{ width: 0.04 * WIDTH, height: 0.04 * WIDTH }} source={require('../assets/云台/5.png')} resizeMode='contain' />
                            </TouchableOpacity>

                            <View style={{ height: 0.04 * WIDTH, width: 0.04 * 4 * WIDTH }}></View>

                            <TouchableOpacity onPressIn={() => { chooseDir('downright') }} onPressOut={() => { chooseDir('stop') }}>
                                <Image style={{ width: 0.04 * WIDTH, height: 0.04 * WIDTH }} source={require('../assets/云台/7.png')} resizeMode='contain' />
                            </TouchableOpacity>
                            <View style={{ height: 0.04 * 2 * WIDTH, width: 0.04 * 3 * WIDTH }}></View>
                        </View>

                        {/* 第五行 */}
                        <View style={{ height: 0.04 * 2 * WIDTH, width: 0.48 * WIDTH, flexDirection: 'row' }}>
                            <View style={{ height: 0.04 * 2 * WIDTH, width: 0.04 * 5 * WIDTH }}></View>
                            <TouchableOpacity onPressIn={() => { chooseDir('down') }} onPressOut={() => { chooseDir('stop') }}>
                                <Image style={{ width: 0.04 * 2 * WIDTH, height: 0.04 * WIDTH }} source={require('../assets/云台/3.png')} resizeMode='contain' />

                            </TouchableOpacity>

                            <View style={{ height: 0.04 * 2 * WIDTH, width: 0.04 * 5 * WIDTH }}></View>
                        </View>
                    </View>
                </View>

                <View style={styles.box3}>
                    <View style={styles.jiajian}>
                    <TouchableOpacity onPressIn={() => { chooseDir('zoomin') }} onPressOut={() => { chooseDir('stop') }}>
                        <Icon name={'加'} color={'gray'} size={WIDTH * 0.08} />
                        </TouchableOpacity>
                        <TouchableOpacity onPressIn={() => { chooseDir('zoomout') }} onPressOut={() => { chooseDir('stop') }}>

                        <Icon style={styles.icon} name={'减'} color={'gray'} size={WIDTH * 0.08} />
                        </TouchableOpacity>

                    </View>
                </View>

            </View>


            <View style={{flexDirection: 'row', backgroundColor:  store.data.backgroundColor}}>
                {store.data.backgroundColor=='#FFFFFF'?
                <View style={styles.box4}>
                    <TouchableOpacity onPress={() => { defaultPositions('1') }}>
                        <Image style={{ width: 0.1 * WIDTH, height: 0.1 * WIDTH ,marginTop:0.02*WIDTH}} source={require('../assets/1.png')} resizeMode='contain' />

                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => { defaultPositions('2') }}>
                        <Image style={{ width: 0.1 * WIDTH, height: 0.1 * WIDTH ,marginTop:0.122*WIDTH}} source={require('../assets/2.png')} resizeMode='contain' />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => { defaultPositions('3') }}>
                        <Image style={{ width: 0.1 * WIDTH, height: 0.1 * WIDTH ,marginTop:0.13*WIDTH}} source={require('../assets/3.png')} resizeMode='contain' />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => { defaultPositions('4') }}>
                        <Image style={{ width: 0.1 * WIDTH, height: 0.1 * WIDTH ,marginTop:0.13*WIDTH}} source={require('../assets/4.png')} resizeMode='contain' />
                    </TouchableOpacity>
                </View>:
                <View style={styles.box4}>
                    <TouchableOpacity onPress={() => { defaultPositions('1') }}>
                        <Image style={{ width: 0.1 * WIDTH, height: 0.1 * WIDTH ,marginTop:0.02*WIDTH}} source={require('../assets/ptz/1.png')} resizeMode='contain' />

                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => { defaultPositions('2') }}>
                        <Image style={{ width: 0.1 * WIDTH, height: 0.1 * WIDTH ,marginTop:0.122*WIDTH}} source={require('../assets/ptz/2.png')} resizeMode='contain' />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => { defaultPositions('3') }}>
                        <Image style={{ width: 0.1 * WIDTH, height: 0.1 * WIDTH ,marginTop:0.13*WIDTH}} source={require('../assets/ptz/3.png')} resizeMode='contain' />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => { defaultPositions('4') }}>
                        <Image style={{ width: 0.1 * WIDTH, height: 0.1 * WIDTH ,marginTop:0.13*WIDTH}} source={require('../assets/ptz/4.png')} resizeMode='contain' />
                    </TouchableOpacity>
                </View>}


                <View style={{ width: 0.741 * WIDTH,height: HEIGHT,marginLeft: 0.027 * WIDTH,backgroundColor:  store.data.backgroundColor}}>
                    <View style={{ flexDirection: 'row', backgroundColor: confirm, borderRadius: 0.06 * WIDTH, width: 0.741 * WIDTH,marginTop: 0.015 * WIDTH }}>
                        <TextInput style={{ width: 0.56 * WIDTH, paddingLeft: 0.06 * WIDTH }} value={text1} onChangeText={(value) => { setText1(value) }} placeholder={list != undefined ? list[0].strName : '默认'} placeholderTextColor={store.data.TextColor}/>
                        <TouchableOpacity onPress={() => { defaultPositions('1') }}>
                            <Icon style={{ marginTop: 0.04 * WIDTH }} name={'飞机'} color={store.data.TextColor} size={0.04 * WIDTH} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { if (text1 && text1 != '') { preSet(text1, '1') } }}>
                            <Icon style={{ marginTop: 0.04 * WIDTH, marginLeft: 0.048 * WIDTH }} name={'设置_管理'} color={store.data.TextColor} size={0.04 * WIDTH} />
                        </TouchableOpacity>
                    </View>
                    <View style={{ flexDirection: 'row', backgroundColor: confirm, borderRadius: 0.06 * WIDTH, width: 0.741 * WIDTH, marginTop: 0.1 * WIDTH }}>
                        <TextInput style={{ width: 0.56 * WIDTH, paddingLeft: 0.06 * WIDTH }} value={text2} onChangeText={(value) => { setText2(value) }} placeholder={list != undefined ? list[1].strName : '默认'} placeholderTextColor={store.data.TextColor}/>
                        <TouchableOpacity onPress={() => { defaultPositions('2') }}>
                            <Icon style={{ marginTop: 0.04 * WIDTH }} name={'飞机'} color={store.data.TextColor} size={0.04 * WIDTH} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { if (text2 && text2 != '') { preSet(text2, '2') } }}>
                            <Icon style={{ marginTop: 0.04 * WIDTH, marginLeft: 0.048 * WIDTH }} name={'设置_管理'} color={store.data.TextColor} size={0.04 * WIDTH} />
                        </TouchableOpacity>
                    </View>
                    <View style={{ flexDirection: 'row', backgroundColor: confirm, borderRadius: 0.06 * WIDTH, width: 0.741 * WIDTH, marginTop: 0.11 * WIDTH }}>
                        <TextInput style={{ width: 0.56 * WIDTH, paddingLeft: 0.06 * WIDTH }} value={text3} onChangeText={(value) => { setText3(value) }} placeholder={list != undefined ? list[2].strName : '默认'} placeholderTextColor={store.data.TextColor}/>
                        <TouchableOpacity onPress={() => { defaultPositions('3') }}>
                            <Icon style={{ marginTop: 0.04 * WIDTH }} name={'飞机'} color={store.data.TextColor} size={0.04 * WIDTH} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { if (text3 && text3 != '') { preSet(text3, '3') } }}>
                            <Icon style={{ marginTop: 0.04 * WIDTH, marginLeft: 0.048 * WIDTH }} name={'设置_管理'} color={store.data.TextColor} size={0.04 * WIDTH} />
                        </TouchableOpacity>
                    </View>
                    <View style={{ flexDirection: 'row', backgroundColor: confirm, borderRadius: 0.06 * WIDTH, width: 0.741 * WIDTH, marginTop: 0.12 * WIDTH }}>
                        <TextInput style={{ width: 0.56 * WIDTH, paddingLeft: 0.06 * WIDTH }} value={text4} onChangeText={(value) => { setText4(value) }} placeholder={list != undefined ? list[3].strName : '默认'} placeholderTextColor={store.data.TextColor}/>
                        <TouchableOpacity onPress={() => { defaultPositions('4') }}>
                            <Icon style={{ marginTop: 0.04 * WIDTH }} name={'飞机'} color={store.data.TextColor} size={0.04 * WIDTH} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { if (text4 && text4 != '') { preSet(text4, '4') } }}>
                            <Icon style={{ marginTop: 0.04 * WIDTH, marginLeft: 0.048 * WIDTH }} name={'设置_管理'} color={store.data.TextColor} size={0.04 * WIDTH} />
                        </TouchableOpacity>
                    </View>


                </View>
            </View>

        </ScrollView>




    )

}
const styles = StyleSheet.create(({
    top: {
        // flexDirection: 'row',
        // height: HEIGHT * 0.148,
        // backgroundColor: 'white'

    },
    container: {
        // flex: 1,
        // flexDirection: 'row',
        // height: 0.48 * HEIGHT,
        // backgroundColor: 'white'
    },
    box1: {
        width: WIDTH * 0.16,
        height: HEIGHT * 0.55,
        marginLeft: WIDTH * 0.06,
        alignItems: 'center',
        // backgroundColor: 'green'

    },
    box2: {
        width: 0.493 * WIDTH,
        height: HEIGHT * 0.48,
        marginLeft: WIDTH * 0.084,
    },
    box3: {
        width: WIDTH * 0.1,
        height: HEIGHT * 0.48,
        marginLeft: WIDTH * 0.03,
        marginRight: WIDTH * 0.06,
    },
    icon: {
        marginTop: WIDTH * 0.11,
    },
    ctrl: {
        height: 0.48 * WIDTH,
        width: 0.48 * WIDTH,
        borderRadius: 0.24 * WIDTH,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: '#aaaaaa',
    },
    jiajian: {
        borderWidth: 1, borderStyle: 'solid', borderRadius: 0.02 * WIDTH, borderColor: '#aaaaaa', alignItems: 'center'
    },
    container1: {
        // flexDirection: 'row', backgroundColor: 'white'
    },
    box4: {
        width: 0.08 * WIDTH,
        marginLeft: WIDTH * 0.06,
        // backgroundColor: 'gray',
        height: HEIGHT,

    },
    box5: {
        // width: 0.741 * WIDTH,
        // height: HEIGHT,
        // marginLeft: 0.027 * WIDTH,

        // backgroundColor: 'white',
    }

}))

export default observer(PanTilt);