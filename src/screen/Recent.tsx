import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native'
import axios from 'axios'
import useSyncCallback from '../hooks/useSyncCallback';

import Icon from 'react-native-vector-icons/iconfont';

import store from '../store/store';
import { observer } from 'mobx-react'








const Recent = () => {
    const [snapsrc, setSnapsrc] = useState('')
    const [flag, setFlag] = useState(false)
    //函数及方法


    const setT = (data) => {
        setSnapsrc(data)
        func();
    }
    const func = useSyncCallback(() => {
        console.log('callback:');
    });



    const GETIMG = () => {
        axios.get(store.data.https+'://'+ store.data.host + ':' + store.data.port + '/api/v1/Snapshot?token='+ store.data.token+ '&session=' + store.data.session + '').
            then(function (response) {
                console.log(response.data);
                if (response.data.strCode === 'Snapshot start successfully') {
                    console.log('截图成功');
                 
                    let snap = response.data.strUrl
                    setSnapsrc(snap)
                    // setT(snap)
                    console.log('地址', snapsrc)
                }
            }
            ).catch(error => {

                console.log('错误1', error)
            })
    }

    const Layout = ()=> {

    }


    return (
        <View>
            <TouchableOpacity onPress={() => {
               GETIMG()
            }}>
                <Text style={{ fontSize: 50 }}>连接</Text>

            </TouchableOpacity>

            <TouchableOpacity onPress={() => {
                setFlag(!flag)
            }}>
                <Text style={{ fontSize: 50 }}>显示</Text>

            </TouchableOpacity>{console.log(flag)}
            {flag ? <View>
                <Text>进入</Text>{console.log('第十', snapsrc)}
                <Image style={{ width: 200, height: 200 }} source={{ uri:store.data.https+'://'+ store.data.host + ':' + store.data.port + snapsrc }} />
            </View> : null}
        </View>
    )

            }


export default observer(Recent)