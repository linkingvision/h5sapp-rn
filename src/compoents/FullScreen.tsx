import React, { useEffect } from 'react';
import { View, Text, Dimensions, StyleSheet, TouchableOpacity } from 'react-native';
import { Immersive } from 'react-native-immersive';
import { Button } from 'react-native-paper';
import Player from './Player';
import Orientation from 'react-native-orientation';
import Icon from 'react-native-vector-icons/iconfont';


const WIDTH = Dimensions.get('screen').width;
const HEIGHT = Dimensions.get('screen').height;
export default function FS1({ navigation }) {
    //全屏
    const on = () => {
        Immersive.on();
        Immersive.setImmersive(true);
    };

    return (
        <View style={{ position: 'relative' }}>
            <View style={styles.box1}>
                <View style={styles.item1}>
                    <Player />
                </View>
                <View style={{ height: 80, width: WIDTH, backgroundColor: 'rgba(0,0,0,0.2)', marginTop: HEIGHT - 80, flexDirection: 'row', alignItems: 'center' ,justifyContent: 'space-around'}}>
                    <TouchableOpacity onPress={() => {
                        navigation.navigate('Page');
                        Orientation.lockToPortrait();
                        on();
                    }}>
                        <Icon name={'全屏'} color={'rgba(225,225,225,0.7)'} size={50} />
                    </TouchableOpacity>

                    <TouchableOpacity>
                        <Icon name={'声音'} color={'rgba(225,225,225,0.7)'} size={50} />
                    </TouchableOpacity>

                    <TouchableOpacity>
                        <Icon name={'全屏'} color={'rgba(225,225,225,0.7)'} size={50} />
                    </TouchableOpacity>

                    <TouchableOpacity>
                        <Icon name={'全屏'} color={'rgba(225,225,225,0.7)'} size={50} />
                    </TouchableOpacity>

                    <TouchableOpacity>
                        <Icon name={'全屏'} color={'rgba(225,225,225,0.7)'} size={50} />
                    </TouchableOpacity>

                    <TouchableOpacity>
                        <Icon name={'四宫格'} color={'rgba(225,225,225,0.7)'} size={50} />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}


const styles = StyleSheet.create(({
    box1: {
        width: WIDTH,
        marginBottom: 5,
        marginLeft: 5,
        marginRight: 5,
        backgroundColor: 'black', // 背景色为红色
        flexDirection: 'row', // View组件默认为纵向布局，这个改为横向布局
        flexWrap: 'wrap', // 宽度不足，可以换行
        justifyContent: 'space-around', // 等比例间距排列
        borderRadius: 5, // 设置圆角
        padding: 5
    },
    item1: {
        width: WIDTH,
        height: HEIGHT,
        backgroundColor: 'black',
        borderColor: 'white',
        borderWidth: 1,
        position: 'absolute',
    },
}))