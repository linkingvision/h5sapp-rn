import React, { useState, useEffect, useRef } from 'react';
import {
	View,
	Text,
	StyleSheet,
	ImageBackground,
	TouchableNativeFeedback,
	ScrollView,
	Dimensions,
	StatusBar,
	FlatList,
	TouchableOpacity,
	Alert,
	Modal,
	Image,DeviceEventEmitter,
	Animated,
	PanResponder,
	Overlay,
} from 'react-native';
import Player from './Player';
import Player1 from './Player/Player1';
import Player2 from './Player/Player2';
import Player3 from './Player/Player3';

import { List, Divider, Appbar, Button } from 'react-native-paper';
import Ceshi from './Ceshi';
import Icon from 'react-native-vector-icons/iconfont';
import useSyncCallback from '../hooks/useSyncCallback';
import ActionButton from 'react-native-action-button';

import { white } from 'react-native-paper/lib/typescript/styles/colors';
import PanTilt from '../screen/PanTilt';
import { observer } from 'mobx-react';
import store from '../store/store';
import { Immersive } from 'react-native-immersive';
import Orientation from 'react-native-orientation';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import Draggable from 'react-native-draggable';
import { autorun } from 'mobx'
import ViewShot, { captureScreen, captureRef } from "react-native-view-shot";
import CameraRoll from '@react-native-community/cameraroll';
const ExtraDimensions = require('react-native-extra-dimensions-android');

//获取宽度和高度
const WIDTH = Dimensions.get('screen').width;
const HEIGHT = Dimensions.get('screen').height;
const B1 = 9 / 16;
const STATUS_BAR_HEIGHT = ExtraDimensions.get('STATUS_BAR_HEIGHT');
const SOFT_MENU_BAR_HEIGHT = ExtraDimensions.get('SOFT_MENU_BAR_HEIGHT');

//播放器组件列表
let playerName = {
	list: [],
	pic: [],
	token: [],
	shoucang: [],
	shoucangname: []
};
//数据库存储
const storeData = async (value) => {
	try {
		const jsonValue = JSON.stringify(value);
		await AsyncStorage.setItem('playerName', jsonValue);
	} catch (e) {
		// saving error
	}
};

//数据读取
const getData = async () => {
	try {
		const jsonValue = await AsyncStorage.getItem('playerName');
		if (jsonValue != null) {
			console.log(typeof JSON.parse(jsonValue));
			playerName = JSON.parse(jsonValue);
			console.log('这里是显眼的位置', jsonValue);
		}
	} catch (e) {
		// error reading value
	}
};

// storeData(playerName)
getData();

//Video队列
const videoToken = [ '1', '2', '3', '4', '5' ];

const Page = ({ navigation }) => {
	const [ playern, setPlayern ] = useState(false);
	const [ isRegionshow, setIsRegionshow ] = useState(false);
	const [h11,setH11] = useState(false);
	const [h12,setH12] = useState(false);
	const [h13,setH13] = useState(false);
	const [h14,setH14] = useState(false);
	const [ a, setA ] = useState(false);
	const [ b, setB ] = useState(false);
	const [ c, setC ] = useState(false);
	const [ d, setD ] = useState(false);
	const [ a1, setA1 ] = useState(false);
	const [ isc, setIsc ] = useState(false);
	const [ flag, setFlag ] = useState(true);
	const icons = {
		sige: '四宫格',
		yige: '一宫格',
		shoucang1: '收藏夹',
		shoucang2: '星',
		biaoqing: '标清',
		gaoqing: '高清',
		shengyin: '声音',
		jingyin: '52静音',
		quanping: '全屏',
		zhumaliu:'主码流',
		fumaliu:'辅码流'
	};
	const [ icon1, setIcon1 ] = useState(icons.shoucang1);
	const [ icon2, setIcon2 ] = useState(icons.zhumaliu);
	const [ icon3, setIcon3 ] = useState(icons.shengyin);
	const [ icon4, setIcon4 ] = useState(icons.sige);

	const [ modalVisible, setModalVisible ] = useState(false);
	const [ fv, setFv ] = useState(false);
	const [ fv2, setFv2 ] = useState(false);
	const [ rc, setRc ] = useState(false);

	const Toast = Overlay.Toast;
	const [currtoken,setCurrtoken] = useState('');
	const [fvtoken,setFvtoken] = useState('');
	const ref1 = useRef(null);
	var timer = null;
	var timer2 = null
	// 本地抓图
	// function DoSnapshotWeb(){
	// 	ref1.current.capture().then(uri => {
  //     console.log("do something with ", uri);
	// 		// CameraRoll.saveToCameraRoll(uri);
	// 		// let promise = CameraRoll.saveToCameraRoll(uri);
	// 		// promise.then((result) => {
	// 		// 	console.log(result);
	// 		// })
	// 		// .catch((error) => {
	// 		// 	console.log(error);
	// 		// });

	// 			var promise = CameraRoll.saveToCameraRoll(uri);
			 
	// 			promise.then(function(result) {
	// 				console.log(result);
	// 			// resolve({statusCode:200});
			 
	// 			//alert('保存成功！地址如下：\n' + result);
	// 				Toast.show('已保存到系统相册'+ result,2000,{
	// 					textStyle: {
	// 						backgroundColor: 'white',
	// 						color: '#67C23A',
	// 					},
	// 					position: Toast.Position.Top
	// 				});
	// 			}).catch(function(error) {
			 
	// 			console.log('error', error);
			 
	// 			// alert('保存失败！\n' + error);
			 
	// 			});
			 
	// 		// let img="http://yushangjun.oss-cn-shanghai.aliyuncs.com/ysmz/assets/image/wxContact.png";
	// 		// const RNFS = require('react-native-fs'); //文件处理
	// 		// const storeLocation = `${RNFS.DocumentDirectoryPath}`;
	// 		// let pathName = new Date().getTime() + Math.random(1000, 9999) + ".png";
	// 		// let downloadPath = `${storeLocation}/${pathName}`;
	// 		// console.log(downloadPath);
			
	// 		// const ret = RNFS.downloadFile({fromUrl: img, toFile: downloadPath});
	// 		// console.log('====================================');
	// 		// console.log(ret);
	// 		// console.log('====================================');
	// 		// ret.promise.then(res => {
	// 		// 	console.log(res);
				
	// 		// 	if (res && res.statusCode === 200) {
	// 		// 		let promise = CameraRoll.saveToCameraRoll("file://" + downloadPath);
	// 		// 		promise.then(function (result) {
	// 		// 			console.log('已保存到系统相册');
	// 		// 		}).catch(function (error) {
	// 		// 			console.log('保存失败！\n' + error);
	// 		// 		})
	// 		// 	}
	// 		// })
  //   }).catch(function (error) {
	// 		console.log(error);
			
	// 	})
	// }
  useEffect(() => {
    // on mount
    
  }, []);
	
	const setT = (data) => {
		setA1(data);
		func();
	};
	const func = useSyncCallback(() => {
		console.log('callback:');
	});

	const GETIMG = () => {
		axios
			.get(
				store.data.https+'://'+
					store.data.host +
					':' +
					store.data.port +
					'/api/v1/Snapshot?token=' +
					store.data.token +
					'&session=' +
					store.data.session +
					''
			)
			.then(function(response) {
				console.log(response.data);
				if (response.data.strCode === 'Snapshot start successfully') {
					console.log('截图成功');
					let snap = response.data.strUrl;
					playerName.pic.unshift(snap);
				}
			})
			.catch((error) => {
				console.log('错误1', error);
			});
	};
	const [posterImage,setPosterImage] =useState(false);
	// const changeImage = () => {
  //   setPosterImage(true)
  // }
	useEffect(() => {
		console.log('====================================');
		console.log('trueOrfalse',posterImage);
		console.log('====================================');
	},[posterImage])
	DeviceEventEmitter.addListener('hideImage',(node)=>{
		setTimeout(()=>{
			setPosterImage(false)
		},500)
		console.log('几秒',posterImage);
	})
	
	  // autorun写法
		var disposer = autorun(() => {
			if (store.data.camname!="根节点") {
				// console.log('监听', store.data.camname);
				// console.log('====================================');
				// console.log('null还是',timer);
				// console.log('====================================');
				// playerName.list.unshift(store.data.camname);
				return
				if(timer) {
					clearTimeout(timer)
					console.log('====================================');
					console.log(timer);
					console.log('====================================');
					timer = null
			}
			timer = setTimeout(() => {
				console.log('====================================');
				console.log('haizhixing?');
				console.log('====================================');
					
				},1000)
			} else {
				// console.log('监听2', store.data.camname);
			}
			// if (store.data.token!="根节点") {
			// 	console.log('监听', store.data.token);
			// 	if(timer2) {
			// 		clearTimeout(timer2)
			// 		timer2 = null
			// }
			// 	timer2 =setTimeout(() => {
			// 		playerName.token.unshift(store.data.token);
			// 	},1000)
				
			// } else {
			// 	console.log('监听2', store.data.token);
			// }
		});
		// 
		useEffect(() => {
			DeviceEventEmitter.addListener('browse',(node)=>{
				if(timer) {
					clearTimeout(timer)
					timer = null
				}
				timer = setTimeout(() => {
					playerName.list.unshift(store.data.camname);
					playerName.token.unshift(store.data.token);
					GETIMG();
					storeData(playerName);
				},1000)
		})
		},[])
	useEffect(() => {
		const jianting =  DeviceEventEmitter.addListener('token',(node)=>{
			if(timer) {
				clearTimeout(timer)
				console.log('====================================');
				console.log(timer);
				console.log('时间timer',timer)
				console.log('====================================');
				timer = null
			}
			timer = setTimeout(() => {
				// playerName.list.unshift(store.data.camname);
				// playerName.token.unshift(store.data.token);
				// GETIMG();
				// storeData(playerName);
				
			},1000)
		// playerName.list.unshift(store.data.camname);
		// playerName.token.unshift(store.data.token);
		console.log(1111111);
		
		console.log(playerName.list);
		console.log(playerName.token);
		console.log('====================================');
		console.log(node);
		console.log('====================================');
		console.log('几宫格',playern);
		console.log(h13);
		if (node.strName=="主码流") {
			setIcon2(icons.zhumaliu);
		}else if (node.strName=="辅码流"){
			setIcon2(icons.fumaliu);
		}else{
			setIcon2(icons.zhumaliu);
		}
		if (playern) {
			setTimeout(() => {
					if (h11||h12||h13||h14) {
						switch(true) {
							case h11:
								store.changeToken(store.data.temp);
								store.changeVideo1(store.data.temp);
								setH11(false)
								setA(true)
								setH12(true)
								jianting.remove();
								break;
							case h12:
								store.changeToken(store.data.temp);
								store.changeVideo2(store.data.temp);
								setB(true)
								setH12(false)
								setH13(true)
								jianting.remove();
								break;
							case h13:
								console.log('====================================');
								console.log('====================================');
								store.changeToken(store.data.temp);
								store.changeVideo3(store.data.temp);
								setC(true)
								setH13(false)
								setH14(true)
								jianting.remove();
								break;
							case h14:
								store.changeToken(store.data.temp);
								store.changeVideo4(store.data.temp);
								setD(true)
								setH14(true)
								jianting.remove();
								break;
						} 
					}else{
						if (a1) {
							store.changeToken(store.data.temp);
							store.changeVideo2(store.data.temp);
							setB(true)
							setH12(false)
							setH13(true)
							jianting.remove();
						}else{
							store.changeToken(store.data.temp);
							store.changeVideo1(store.data.temp);
							setA(true)
							setH12(true)
							jianting.remove();
						}
					}
			}, 1000);
		}else{
			console.log('====================================');
			console.log('a1是否正在播放',a1);
			console.log('====================================');
			setPosterImage(true)
			store.changeToken(store.data.temp);
			store.changeVideo1(store.data.temp);
			// setT(true)
			console.log('====================================');
			console.log('a1是否正在播放2',a1);
			console.log('====================================');
			if (a1) {
				console.log('收藏',icon1);
				
				if (icon1 == icons.shoucang2) {
					setIcon1(icons.shoucang1);
				}
				console.log(icon1);
				
				setT(false);
				setTimeout(() => {
					setT(true)
				},50)
			}else{
				setT(true)
			}	
			console.log('====================================');
			console.log(a1);
			console.log('====================================');
			DeviceEventEmitter.emit('CloseVideo')
			console.log('切换关闭')
		}
	});
}, [store.data.temp])
// DeviceEventEmitter.addListener('loadVideo',(node)=>{
// 	setTimeout(() => {
// 		setA1(false)
// 		setA1(true)
// 	},500)
// 	console.log('是否关闭',a1)
// })
	// const pan = useRef(new Animated.ValueXY()).current;
	// const panResponder = useRef(
  //   PanResponder.create({
  //     onMoveShouldSetPanResponder: () => true,
  //     onPanResponderGrant: () => {
  //       pan.setOffset({
  //         x: pan.x._value,
  //         y: pan.y._value
  //       });
  //     },
  //     onPanResponderMove: Animated.event(
  //       [
  //         null,
  //         { dx: pan.x, dy: pan.y }
  //       ]
  //     ),
  //     onPanResponderRelease: () => {
  //       pan.flattenOffset();
  //     }
  //   })
  // ).current;
	// const onResponderMove = (e) =>{
	// 	let pageX = e.nativeEvent.pageX;
	// 	let pageY = e.nativeEvent.pageY;
	// 	console.log('====================================');
	// 	console.log(pageX,pageY);
	// 	console.log('====================================');
	// 	// if(this.state.isDelete){
	// 	// 		this.setState({
	// 	// 				m_top:pageY-15,
	// 	// 				m_left:pageX-15,
	// 	// 				isShow:false
	// 	// 		})
	// 	// }else {
	// 	// 		this.setState({
	// 	// 				m_top:pageY-15,
	// 	// 				m_left:pageX-15,
	// 	// 				isShow:true
	// 	// 		})
	// 	}
	// const 	onResponderRelease = (e) =>{
	// 		// let smallY = this.state.m_top;
	// 		// let smallX = this.state	
	// 		console.log('送开屏幕');
			
	// 		// if(smallY>=height-200&&smallX>=width-200){
	// 		// 		this.setState({
	// 		// 				m_top:'40%',
	// 		// 				m_left:width-40,
	// 		// 				isDelete:true,
	// 		// 				isShow:false
	// 		// 		})
	// 		// }else {
	// 		// 		this.setState(
	// 		// 				{
	// 		// 						m_top:'40%',
	// 		// 						m_left:width-40,
	// 		// 						isShow:false
	// 		// 				}
	// 		// 		)
	// 		// }

	// }
	// 远端抓图
	function DoSnapshot(){
		console.log('====================================');
		console.log(currtoken);
		console.log('====================================');
		var url ='';
		if(!playern){
			console.log(store.data.video1);
			url = 	store.data.https+'://'+store.data.host+':'+store.data.port+'/api/v1/Snapshot?token='+store.data.video1+'&session='+store.data.session+''
		}else{
		  url = 	store.data.https+'://'+store.data.host+':'+store.data.port+'/api/v1/Snapshot?token='+currtoken+'&session='+store.data.session+''
		}
		axios.get(url).then((response)=>{       
			if(response.status == 200){
				// console.log(response);
				if(response.data.bStatus){
					Toast.show('抓图成功',2000,{
						textStyle: {
							backgroundColor: 'white',
							color: '#67C23A',
						},
						position: Toast.Position.Top
					});
				}else{
					Toast.show('抓图失败',2000,{
						textStyle: {
							backgroundColor: 'white',
							color: 'red',
						},
						position: Toast.Position.Top
					});
				}
			}
		}).catch((error)=>{
			Toast.show('抓图失败',2000,{
				textStyle: {
					backgroundColor: 'white',
					color: 'red',
				},
				position: Toast.Position.Top
			});
		})
	}

	return (
		// <ScrollView style={styles.scroll}>
		// <ScrollView style={styles.container} automaticallyAdjustContentInsets={false}>	
		<View>
			{/* 播放组件 */}
			<Modal
				statusBarTranslucent={true}
				animationType="fade"
				visible={modalVisible}
				onRequestClose={() => {
					Orientation.unlockAllOrientations();
					setModalVisible(!modalVisible);
				}}
			>
				{/* <View>
					<View style={{ width: 720}}>
						<Player />
					</View>
				</View> */}

				<View>
					{/* 判断显示数量 */}
					{playern ? (
						<View style={styles.box2m}>
							<TouchableOpacity
								onPress={() => {
									store.changeToken(store.data.temp);
									store.changeVideo1(store.data.temp);
									setA(!a);
									// playerName.list.unshift(store.data.camname);
									// playerName.token.unshift(store.data.token);
									// GETIMG();
									// storeData(playerName);
								}}
							>
								<View style={styles.itemm}>{a || a1 ? <Player /> : null}</View>
							</TouchableOpacity>

							<TouchableOpacity
								onPress={() => {
									store.changeToken(store.data.temp);
									store.changeVideo2(store.data.temp);
									setB(!b);
									// playerName.list.unshift(store.data.camname);
									// playerName.token.unshift(store.data.token);
									// GETIMG();
									// storeData(playerName);
								}}
							>
								<View style={styles.itemm}>{b ? <Player1 /> : null}</View>
							</TouchableOpacity>

							<TouchableOpacity
								onPress={() => {
									store.changeToken(store.data.temp);
									store.changeVideo3(store.data.temp);
									setC(!c);
									// playerName.list.unshift(store.data.camname);
									// playerName.token.unshift(store.data.token);
									// GETIMG();
									// storeData(playerName);
								}}
							>
								<View style={styles.itemm}>{c ? <Player2 /> : null}</View>
							</TouchableOpacity>

							<TouchableOpacity
								onPress={() => {
									store.changeToken(store.data.temp);
									store.changeVideo4(store.data.temp);
									setD(!d);
									// playerName.list.unshift(store.data.camname);
									// playerName.token.unshift(store.data.token);
									// GETIMG();
									// storeData(playerName);
								}}
							>
								<View style={styles.itemm}>{d ? <Player3 /> : null}</View>
							</TouchableOpacity>
						</View>
					) : (
						<View style={styles.box2m}>
							<TouchableOpacity
								onPress={() => {
									store.changeToken(store.data.temp);
									store.changeVideo1(store.data.temp);
									setT(!a1);
									console.log(a1);
									console.log('这里的是:', store.data.temp);
									// playerName.list.unshift(store.data.camname);
									// playerName.token.unshift(store.data.token);
									// GETIMG();
									// storeData(playerName);
								}}
							>
								<View style={styles.item1m}>
									{/* {console.log('下面的是', a1)} */}
									{a1 ? <Player /> : null}
								</View>
							</TouchableOpacity>
						</View>
					)}
					{/* <View style={{ width:50,height:50,backgroundColor:'white',position:'absolute',top:200,left:200}}><Text>1111111</Text></View> */}

					<ActionButton buttonColor="rgba(211,211,211,0.5)">
						<ActionButton.Item
							buttonColor="##DCDCDC"
							// title="全屏"
							onPress={() => {
								Orientation.lockToPortrait();
								setModalVisible(!modalVisible);
							}}
						>
							<Icon name={icons.quanping} size={22} color={'white'} />
						</ActionButton.Item>

						<ActionButton.Item
							buttonColor="##DCDCDC"
							// title="声音"
							onPress={() => {
								if (icon3 == icons.shengyin) {
									setIcon3(icons.jingyin);
								} else {
									setIcon3(icons.shengyin);
								}
							}}
						>
							<Icon name={icon3} size={22} color={'white'} />
						</ActionButton.Item>

						<ActionButton.Item
							buttonColor="##DCDCDC"
							onPress={() => {
								if (icon2 == icons.biaoqing) {
									setIcon2(icons.gaoqing);
								} else {
									setIcon2(icons.biaoqing);
								}
							}}
						>
							<Icon name={icon2} size={24} color={'white'} />
						</ActionButton.Item>

						<ActionButton.Item
							buttonColor="##DCDCDC"
							onPress={() => {
								if (icon4 == icons.yige) {
									setIcon4(icons.sige);
								} else {
									setIcon4(icons.yige);
								}
								setPlayern(!playern);
							}}
						>
							<Icon name={icon4} size={22} color={'white'} />
						</ActionButton.Item>
					</ActionButton>

					{/* <Appbar style={styles.echartm1}>
                        <Appbar.Action
                            icon={() => <Icon name={icons.quanping} size={22} color={'white'} />}
                            onPress={() => {
                                Orientation.lockToPortrait();
                                setModalVisible(!modalVisible);

                            }}
                        />
                        <Appbar.Action
                            icon={() => <Icon name={icon3} size={22} color={'white'} />}
                            onPress={() => {
                                if (icon3 == icons.shengyin) {
                                    setIcon3(icons.jingyin);
                                } else {
                                    setIcon3(icons.shengyin);
                                }
                            }}
                        />
                        <Appbar.Action
                            icon={() => <Icon name={icon2} size={24} color={'white'} />}
                            onPress={() => {
                                if (icon2 == icons.biaoqing) {
                                    setIcon2(icons.gaoqing);
                                } else {
                                    setIcon2(icons.biaoqing);
                                }
                            }}
                        />
                        <Appbar.Action
                            icon={() => <Icon name={icon1} size={22} color={'white'} />}
                            onPress={() => {
                                if (icon1 == icons.shoucang1) {
                                    setIcon1(icons.shoucang2);
                                } else {
                                    setIcon1(icons.shoucang1);
                                }
                            }}
                        />
                        <Appbar.Action
                            icon={() => <Icon name={icon4} size={22} color={'white'} />}
                            onPress={() => {
                                if (icon4 == icons.yige) {
                                    setIcon4(icons.sige);
                                } else {
                                    setIcon4(icons.yige);
                                }
                                setPlayern(!playern);
                            }}
                        />
                    </Appbar> */}
				</View>
			</Modal>

			<View>
				{/* 判断显示数量 */}

				{playern ? (
					<View style={styles.box1} >
						{/* <Animated.View style={{transform: [{ translateX: pan.x }, { translateY: pan.y }]}} {...panResponder.panHandlers}> */}
						{/* <View onStartShouldSetResponderCapture={()=>{return true;}} onResponderGrant={() => {console.log('kaishi1');
						}} onResponderStart={()=>{console.log('开始了')}} onResponderMove={()=>{console.log('移动了')}}>
						<Button><Text style={{color: 'white'}}>主题</Text></Button> */}
						<TouchableOpacity activeOpacity={1}
							onPress={() => {
								// store.changeToken(store.data.temp);
								// store.changeVideo1(store.data.temp);
								// setA(true);
								// playerName.list.unshift(store.data.camname);
								// playerName.token.unshift(store.data.token);
								// GETIMG();
								// storeData(playerName);
								setH11(true)
								setH12(false)
								setH13(false)
								setH14(false)
								setCurrtoken(store.data.video1)
								
							}}
						>
							{/* <View style={styles.item}>{a || a1 ? <Player /> : null}</View> */}
							<View style={h11?styles.confirmItem:{width: WIDTH < HEIGHT ? WIDTH / 2 : HEIGHT / 2,height: WIDTH < HEIGHT ? WIDTH / 2 * (9 / 16) : HEIGHT / 2 * (9 / 16),backgroundColor: '#36363a',borderColor: store.data.backgroundColor,borderWidth: 1}}>{a || a1 ? <Player /> : null}</View>
							{/* {h11?<View style={{width: WIDTH < HEIGHT ? WIDTH / 2 : HEIGHT / 2,
							height: WIDTH < HEIGHT ? WIDTH / 2 * (9 / 16) : HEIGHT / 2 * (9 / 16),
							backgroundColor: '#36363a',
							borderColor: '#f44336',
							borderWidth: 1}}>{a || a1 ? <Player /> : null}</View>:<View style={styles.item}>{a || a1 ? <Player /> : null}</View>} */}
							
						</TouchableOpacity>
						{/* </Animated.View> */}
						{/* </View> */}
						<TouchableOpacity activeOpacity={1}
							onPress={() => {
								// store.changeToken(store.data.temp);
								// store.changeVideo2(store.data.temp);
								// setB(true);
								// playerName.list.unshift(store.data.camname);
								// playerName.token.unshift(store.data.token);
								// GETIMG();
								// storeData(playerName);
								setH11(false)
								setH12(true)
								setH13(false)
								setH14(false)
								setCurrtoken(store.data.video2)
							}}
						>
							<View style={h12?styles.confirmItem:{width: WIDTH < HEIGHT ? WIDTH / 2 : HEIGHT / 2,height: WIDTH < HEIGHT ? WIDTH / 2 * (9 / 16) : HEIGHT / 2 * (9 / 16),backgroundColor: '#36363a',borderColor: store.data.backgroundColor,borderWidth: 1}}>{b ?<Player1 /> : null}</View>
							{/* {h12?<View style={{width: WIDTH < HEIGHT ? WIDTH / 2 : HEIGHT / 2,
							height: WIDTH < HEIGHT ? WIDTH / 2 * (9 / 16) : HEIGHT / 2 * (9 / 16),
							backgroundColor: '#36363a',
							borderColor: '#f44336',
							borderWidth: 1}}>{b ? <Player1 /> : null}</View>:<View style={styles.item}>{b ? <Player1 /> : null}</View>} */}
						</TouchableOpacity>

						<TouchableOpacity activeOpacity={1}
							onPress={() => {
								// store.changeToken(store.data.temp);
								// store.changeVideo3(store.data.temp);
								// setC(true);
								// playerName.list.unshift(store.data.camname);
								// playerName.token.unshift(store.data.token);
								// GETIMG();
								// storeData(playerName);
								setH11(false)
								setH12(false)
								setH13(true)
								setH14(false)
								setCurrtoken(store.data.video3)
							}}
						>
							<View style={h13?styles.confirmItem:{width: WIDTH < HEIGHT ? WIDTH / 2 : HEIGHT / 2,height: WIDTH < HEIGHT ? WIDTH / 2 * (9 / 16) : HEIGHT / 2 * (9 / 16),backgroundColor: '#36363a',borderColor: store.data.backgroundColor,borderWidth: 1}}>{c ? <Player2 /> : null}</View>
							{/* {h13?<View style={{width: WIDTH < HEIGHT ? WIDTH / 2 : HEIGHT / 2,
							height: WIDTH < HEIGHT ? WIDTH / 2 * (9 / 16) : HEIGHT / 2 * (9 / 16),
							backgroundColor: '#36363a',
							borderColor: '#f44336',
							borderWidth: 1}}>{c ? <Player2 /> : null}</View>:<View style={styles.item}>{c ? <Player2 /> : null}</View>} */}
						</TouchableOpacity>

						<TouchableOpacity activeOpacity={1}
							onPress={() => {
								// store.changeToken(store.data.temp);
								// store.changeVideo4(store.data.temp);
								// setD(true);
								// playerName.list.unshift(store.data.camname);
								// playerName.token.unshift(store.data.token);
								// GETIMG();
								// storeData(playerName);
								console.log('这里的是:', store.data);
								setH11(false)
								setH12(false)
								setH13(false)
								setH14(true)
								setCurrtoken(store.data.video4)
							}}
						>
							<View style={h14?styles.confirmItem:{width: WIDTH < HEIGHT ? WIDTH / 2 : HEIGHT / 2,height: WIDTH < HEIGHT ? WIDTH / 2 * (9 / 16) : HEIGHT / 2 * (9 / 16),backgroundColor: '#36363a',borderColor: store.data.backgroundColor,borderWidth: 1}}>{d ? <Player3 /> : null}</View>
							{/* {h14?<View style={{width: WIDTH < HEIGHT ? WIDTH / 2 : HEIGHT / 2,
							height: WIDTH < HEIGHT ? WIDTH / 2 * (9 / 16) : HEIGHT / 2 * (9 / 16),
							backgroundColor: '#36363a',
							borderColor: '#f44336',
							borderWidth: 1}}>{d ? <Player3 /> : null}</View>:<View style={styles.item}>{d ? <Player3 /> : null}</View>} */}
						</TouchableOpacity>
					</View>
				) : (
					<View style={styles.box1}>
						<TouchableOpacity activeOpacity={1}
							onPress={() => {
								// store.changeToken(store.data.temp);
								// store.changeVideo1(store.data.temp);
								// setT(!a1);
								console.log('====================================');
								console.log('camname',store.data.camname);
								console.log('token',store.data.token);
								console.log('====================================');
								
								// playerName.list.unshift(store.data.camname);
								// playerName.token.unshift(store.data.token);
								// GETIMG();
								// storeData(playerName);
								console.log(a1);
								console.log('这里的是:', store.data.temp);
								setCurrtoken(store.data.video1)
								console.log( store.data.temp);
								console.log(store.data.video1)
							}}
						>
							{/* <View style={styles.item1}>
								{console.log('下面的是', a1)}
								{a1 ? <Player /> : null}
							</View> */}
							<View style={{width: WIDTH < HEIGHT ? WIDTH : HEIGHT,height: WIDTH * 9 / 16,backgroundColor: '#36363a',borderColor: store.data.backgroundColor,borderWidth: 1,}}>
			 {a1 ? <Player /> : null}
		 </View>
		 {posterImage?
		 <View style={styles.item1opcity} ><Image source={{
		 	uri: store.data.https+'://'+store.data.host + ':' + store.data.port + '/api/v1/GetImage?token='+store.data.video1+'&session=' + store.data.session+' '}} resizeMode='contain' style={{width: '100%', height: '100%'}} /></View>
			: null}
			
							{/* {posterImage?<View style={styles.item1opcity} >{console.log('调用image了吗', a1)}{a1 ?<Image source={{
		 	uri: 'http://' + store.data.host + ':' + store.data.port + '/api/v1/GetImage?token='+store.data.video1+'&session=' + store.data.session+' '}} resizeMode='contain' style={{width: '100%', height: '100%'}} /> : null}</View> :<View style={styles.item1}>
			 {console.log('调用player了吗', a1)}
			 {a1 ? <Player /> : null}
		 </View>} */}
						</TouchableOpacity>
					</View>
				)}
				<Appbar style={{backgroundColor: store.data.backgroundColor,
		flexDirection: 'row',
		justifyContent: 'space-between',
		width: WIDTH < HEIGHT ? WIDTH : HEIGHT,
		height: WIDTH < HEIGHT ? WIDTH * 0.12 : HEIGHT * 0.12}}>
					<Appbar.Action
						animated={false}
						icon={() => <Icon name={icons.quanping} size={22} color={store.data.TextColor} />}
						onPress={() => {
							Orientation.lockToLandscapeLeft();

							setModalVisible(!modalVisible);
							let wocao = Dimensions.get('screen').width;
						}}
					/>
					<Appbar.Action
						animated={false}
						icon={() => <Icon name={icon3} size={22} color={store.data.TextColor} />}
						onPress={() => {
							if (icon3 == icons.shengyin) {
								setIcon3(icons.jingyin);
							} else {
								setIcon3(icons.shengyin);
							}
						}}
					/>
					<Appbar.Action
						animated={false}
						style={{width:50}}
						icon={() => <Icon name={icon2} size={40} color={store.data.TextColor}  style={{width:50,marginLeft:8}} />}
						onPress={() => {
							if (icon2 == icons.fumaliu) {
								
								DeviceEventEmitter.emit('CloseVideo')
								setIcon2(icons.zhumaliu);
								store.changeStreamprofile('main')
								setT(false);
								setPosterImage(true)
								setTimeout(() => {
									setT(true)
								},50)
							
								console.log('====================================');
								console.log(store.data.streamprofile);
								console.log('====================================');
							} else {
								
								DeviceEventEmitter.emit('CloseVideo')
								setIcon2(icons.fumaliu);
								store.changeStreamprofile('sub')
								setT(false);
								setPosterImage(true)
								setTimeout(() => {
									setT(true)
								},50)
								
								console.log(store.data.streamprofile);
							}
						}}
					/>
					<Appbar.Action
						animated={false}
						icon={() => <Icon name={icon1} size={22} color={store.data.TextColor} />}
						onPress={() => {
							if (icon1 == icons.shoucang1) {
								setIcon1(icons.shoucang2);
								console.log('====================================');
								console.log(store.data.camname);
								console.log(store.data.token);

								console.log('====================================');
								playerName.shoucang.unshift(store.data.token);
								playerName.shoucangname.unshift(store.data.camname);
								storeData(playerName);
							} else {
								setIcon1(icons.shoucang1);
							}
						}}
					/>
					<Appbar.Action
						animated={false}
						icon={() => <Icon name={"关  闭"} size={18} color={store.data.TextColor} />}
						onPress={() => {
							setA(false);
							setB(false);
							setC(false);
							setD(false);
							setT(false);
							setH11(false);
							setH12(false);
							setH13(false);
							setH14(false);
							store.changeVideo1('')
							store.changeVideo2('')
							store.changeVideo3('')
							store.changeVideo4('')
							console.log('手动关闭',a1);
							
							// store.data.video1='';
							// store.data.video2='';
							// store.data.video3='';
							// store.data.video4='';
							DeviceEventEmitter.emit('allClose','true');
							console.log('====================================');
							console.log('全部关闭',a,b,h11);
							console.log('====================================');
							console.log(store.data);
							console.log('====================================');
							console.log('====================================');
							if (icon1 == icons.shoucang2) {
								setIcon1(icons.shoucang1);
							}
						}}
					/>
					<Appbar.Action
						animated={false}
						icon={() => <Icon name={icon4} size={22} color={store.data.TextColor} />}
						onPress={() => {
							if (icon4 == icons.yige) {
								setIcon4(icons.sige);
							} else {
								setIcon4(icons.yige);
							}
							setPlayern(!playern);
						}}
					/>
				</Appbar>
			</View>
			{/*列表 */}
			{/* <ViewShot ref={ref1} options={{ format: "png", quality: 0.9 ,result:'tmpfile'}}><Text>123333333</Text></ViewShot> */}
			{!store.data.flag1 ? (
				// <ScrollView showsVerticalScrollIndicator={true} style={{}}>
				<View style={{backgroundColor: store.data.backgroundColor,height: 1100}}>
					<Appbar style={{backgroundColor: store.data.backgroundColor,flexDirection: 'row', justifyContent: 'space-around', flexWrap: 'wrap', width: WIDTH < HEIGHT ? WIDTH : HEIGHT, height: 70}}>
						<View style={styles.appbartcontainer}>
							<Appbar.Action
								animated={false}
								icon={() => <Icon name={'归档查询'} size={20} color={store.data.TextColor}/>}
								onPress={() => {
									// DoSnapshotWeb()
									DeviceEventEmitter.emit('localhostSnapshot','true');
									DeviceEventEmitter.emit('WebRTCViewSnapshotResult');
								}}
							/>
							<Text style={{ color: store.data.TextColor }}> 本地抓图</Text>
						</View>

						<View style={styles.appbartcontainer}>
							<Appbar.Action
								animated={false}
								icon={() => <Icon name={'抓图'} size={20} color={store.data.TextColor}/>}
								onPress={() => {
									DoSnapshot()
								}}
							/>
							<Text style={{ color: store.data.TextColor }}> 远端抓图</Text>
						</View>
						<View style={styles.appbartcontainer}>
							<Appbar.Action
								animated={false}
								icon={() => <Icon name={'yuntai'} size={20} color={store.data.TextColor}/>}
								onPress={() => {
									setIsc(!isc);
									store.changeFlag();
								}}
							/>
							<Text style={{ color: store.data.TextColor }}> 云台</Text>
						</View>
					</Appbar>
					<Divider />
					<ScrollView showsVerticalScrollIndicator={true} style={{}}>
					<View style={{height: 2500,}}>
					<List.Section>
						<List.Item
							title="资源列表"
							titleStyle={{color: store.data.TextColor}}
							left={() => <List.Icon icon={() => <Icon name={'资源列表'} size={25} color={store.data.TextColor}/>} />}
							onPress={() => {
								setIsRegionshow(!isRegionshow);
							}}
						/>
						{isRegionshow ? <Ceshi /> : null}
						<List.Item
							title="最近浏览"
							titleStyle={{color: store.data.TextColor}}
							left={() => <List.Icon icon={() => <Icon name={'时 间'} size={25} color={store.data.TextColor}/>} />}
							onPress={() => {
								setRc(!rc);
								console.log(store.data.https+'://'+
								store.data.host +
								':' +
								store.data.port +
								playerName.pic[0]);
								
							}}
						/>
						{rc ? 
						(	playerName.pic.length>0 ?<ScrollView style={{ flexDirection: 'row', backgroundColor: store.data.backgroundColor,}} horizontal={true}>
							<View>
								<TouchableOpacity
									onPress={() => {
										store.changeTemp(playerName.token[0]);
										store.changeToken(playerName.token[0]);
										store.changeVideo1(playerName.token[0]);
										setA(true);
									}}
								>
									<Image
										style={{
											width: 0.42 * WIDTH,
											height: 0.28 * WIDTH,
											marginLeft: 0.04 * WIDTH,
											marginTop: 0.03 * WIDTH
										}}
										source={{
											uri:
											store.data.https+'://'+
												store.data.host +
												':' +
												store.data.port +
												playerName.pic[0]
										}}
									/>
								</TouchableOpacity>
								<Text
									style={{
										fontSize: 0.03 * WIDTH,
										marginLeft: 0.04 * WIDTH,
										paddingTop: 0.01 * WIDTH,
										paddingBottom: 0.01 * WIDTH,
										color:store.data.TextColor
									}}
								>
									{playerName.list[0]}
								</Text>
							</View>
							<View>
								<TouchableOpacity
									onPress={() => {
										store.changeTemp(playerName.token[1]);
										store.changeToken(playerName.token[1]);
										store.changeVideo2(playerName.token[1]);
										setB(true);
									}}
								>
									<Image
										style={{
											width: 0.42 * WIDTH,
											height: 0.28 * WIDTH,
											marginLeft: 0.04 * WIDTH,
											marginTop: 0.03 * WIDTH
										}}
										source={{
											uri:
											store.data.https+'://'+
												store.data.host +
												':' +
												store.data.port +
												playerName.pic[1]
										}}
									/>
								</TouchableOpacity>
								<Text
									style={{
										fontSize: 0.03 * WIDTH,
										marginLeft: 0.04 * WIDTH,
										paddingTop: 0.01 * WIDTH,
										paddingBottom: 0.01 * WIDTH,
										color:store.data.TextColor
									}}
								>
									{playerName.list[1]}
								</Text>
							</View>
							<View>
								<TouchableOpacity
									onPress={() => {
										store.changeTemp(playerName.token[2]);
										store.changeToken(playerName.token[2]);
										store.changeVideo3(playerName.token[2]);
										setC(true);
									}}
								>
									<Image
										style={{
											width: 0.42 * WIDTH,
											height: 0.28 * WIDTH,
											marginLeft: 0.04 * WIDTH,
											marginTop: 0.03 * WIDTH
										}}
										source={{
											uri:
											store.data.https+'://'+
												store.data.host +
												':' +
												store.data.port +
												playerName.pic[2]
										}}
									/>
								</TouchableOpacity>
								<Text
									style={{
										fontSize: 0.03 * WIDTH,
										marginLeft: 0.04 * WIDTH,
										paddingTop: 0.01 * WIDTH,
										paddingBottom: 0.01 * WIDTH,
										color:store.data.TextColor
									}}
								>
									{playerName.list[2]}
								</Text>
							</View>
						</ScrollView> :<View style={{flexDirection: 'row',justifyContent:'center',width:'100%',height:'100%',backgroundColor: store.data.backgroundColor,}}><Text style={{fontSize: 0.03 * WIDTH,
						marginLeft: 0.04 * WIDTH,
						paddingTop: 0.01 * WIDTH,
						paddingBottom: 0.01 * WIDTH,width:'100%',height:'100%',textAlign: 'center',color:store.data.TextColor}}>暂无数据</Text></View>)
						 : null}
						<List.Item
							title="收藏夹"
							titleStyle={{color: store.data.TextColor}}
							left={() => <List.Icon color="#000" icon={() => <Icon name={'收藏夹'} size={25} color={store.data.TextColor}/>} />}
							onPress={() => {
								setFv(!fv);
								if (playerName.shoucang) {
									setFv2(false);
									console.log(playerName.shoucang)
								}else{
								}
							}}
						/>
					</List.Section>
					{fv ?
					 (playerName.shoucang.length>0 ? <ScrollView style={{ flexDirection: 'row',backgroundColor: store.data.backgroundColor, }} horizontal={true}>
						<View>
								<TouchableOpacity
									onPress={() => {
										store.changeTemp(playerName.token[0]);
									}}
								>
									<Image
										style={{
											width: 0.42 * WIDTH,
											height: 0.28 * WIDTH,
											marginLeft: 0.04 * WIDTH,
											marginTop: 0.03 * WIDTH
										}}
										source={{
											uri:
											store.data.https+'://'+
												store.data.host +
												':' +
												store.data.port +
												'/api/v1/GetImage?token='+playerName.shoucang[0]+'&session=' + store.data.session+' '
										}}
									/>
								</TouchableOpacity>
								<Text
									style={{
										fontSize: 0.03 * WIDTH,
										marginLeft: 0.04 * WIDTH,
										paddingTop: 0.01 * WIDTH,
										paddingBottom: 0.01 * WIDTH,
										color:store.data.TextColor
									}}
								>
									{playerName.shoucangname[0]}
								</Text>
							</View>
							<View>
								<TouchableOpacity
									onPress={() => {
										store.changeTemp(playerName.token[1]);
									}}
								>
									<Image
										style={{
											width: 0.42 * WIDTH,
											height: 0.28 * WIDTH,
											marginLeft: 0.04 * WIDTH,
											marginTop: 0.03 * WIDTH
										}}
										source={{
											uri:
											store.data.https+'://'+
												store.data.host +
												':' +
												store.data.port +
												'/api/v1/GetImage?token='+playerName.shoucang[1]+'&session=' + store.data.session+' '
										}}
									/>
								</TouchableOpacity>
								<Text
									style={{
										fontSize: 0.03 * WIDTH,
										marginLeft: 0.04 * WIDTH,
										paddingTop: 0.01 * WIDTH,
										paddingBottom: 0.01 * WIDTH,
										color:store.data.TextColor
									}}
								>
									{playerName.shoucangname[1]}
								</Text>
							</View>
							<View>
								<TouchableOpacity
									onPress={() => {
										store.changeTemp(playerName.token[2]);
									}}
								>
									<Image
										style={{
											width: 0.42 * WIDTH,
											height: 0.28 * WIDTH,
											marginLeft: 0.04 * WIDTH,
											marginTop: 0.03 * WIDTH
										}}
										source={{
											uri:
											store.data.https+'://'+
												store.data.host +
												':' +
												store.data.port +
												'/api/v1/GetImage?token='+playerName.shoucang[2]+'&session=' + store.data.session+' '
										}}
									/>
								</TouchableOpacity>
								<Text
									style={{
										fontSize: 0.03 * WIDTH,
										marginLeft: 0.04 * WIDTH,
										paddingTop: 0.01 * WIDTH,
										paddingBottom: 0.01 * WIDTH,
										color:store.data.TextColor
									}}
								>
									{playerName.shoucangname[2]}
								</Text>
							</View>
						</ScrollView> :<View style={{flexDirection: 'row',justifyContent:'center',width:'100%',height:'100%',backgroundColor: store.data.backgroundColor, }}><Text style={{fontSize: 0.03 * WIDTH,
						marginLeft: 0.04 * WIDTH,
						paddingTop: 0.01 * WIDTH,
						paddingBottom: 0.01 * WIDTH,width:'100%',height:'100%',textAlign: 'center',color:store.data.TextColor}}>暂无数据</Text></View>
					) : null}
					</View>
					</ScrollView>
					{/* </View> */}
					
				</View>
				// </ScrollView>
			) : (
				<PanTilt />
			)}

			{/* 底部区域 */}
			{/* 底部导航栏 */}
		{/* </ScrollView> */}
		</View>
		// </ScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	//提供浮动的盒子
	t1: {
		position: 'relative'
	},

	//播放器盒子
	box1: {
		width: WIDTH < HEIGHT ? WIDTH : HEIGHT,
		// marginBottom: 5,

		marginRight: 5,
		backgroundColor: 'black', // 背景色为红色
		flexDirection: 'row', // View组件默认为纵向布局，这个改为横向布局
		flexWrap: 'wrap', // 宽度不足，可以换行
		justifyContent: 'space-around', // 等比例间距排列
		borderRadius: 5 // 设置圆角
	},
	box2: {
		width: WIDTH > HEIGHT ? WIDTH : HEIGHT,

		backgroundColor: 'black', // 背景色为红色
		flexDirection: 'row', // View组件默认为纵向布局，这个改为横向布局
		flexWrap: 'wrap', // 宽度不足，可以换行
		justifyContent: 'space-around' // 等比例间距排列
		// borderRadius: 5, // 设置圆角
	},
	box2m: {
		width: WIDTH > HEIGHT ? WIDTH - SOFT_MENU_BAR_HEIGHT : HEIGHT - SOFT_MENU_BAR_HEIGHT,

		backgroundColor: 'black', // 背景色为红色
		flexDirection: 'row', // View组件默认为纵向布局，这个改为横向布局
		flexWrap: 'wrap', // 宽度不足，可以换行
		justifyContent: 'space-around', // 等比例间距排列
		borderRadius: 5 // 设置圆角
		// padding: 5
	},
	item: {
		width: WIDTH < HEIGHT ? WIDTH / 2 : HEIGHT / 2,
		height: WIDTH < HEIGHT ? WIDTH / 2 * (9 / 16) : HEIGHT / 2 * (9 / 16),
		backgroundColor: '#36363a',
		borderColor: 'white',
		borderWidth: 1
	},
	itemm: {
		width: WIDTH > HEIGHT ? (WIDTH - SOFT_MENU_BAR_HEIGHT) / 2 : (HEIGHT - SOFT_MENU_BAR_HEIGHT) / 2,
		// height:  WIDTH>HEIGHT ? ((WIDTH-SOFT_MENU_BAR_HEIGHT)/2)*B1 : ((HEIGHT-SOFT_MENU_BAR_HEIGHT)/2)*B1,
		height: WIDTH < HEIGHT ? WIDTH / 2 : HEIGHT / 2,
		backgroundColor: '#36363a',
		borderColor: 'white',
		borderWidth: 1
	},
	confirmItem:{
		width: WIDTH < HEIGHT ? WIDTH / 2 : HEIGHT / 2,
		height: WIDTH < HEIGHT ? WIDTH / 2 * (9 / 16) : HEIGHT / 2 * (9 / 16),
		backgroundColor: '#36363a',
		borderColor: '#f44336',
		borderWidth: 1
	},
	item1: {
		width: WIDTH < HEIGHT ? WIDTH : HEIGHT,
		height: WIDTH * 9 / 16,
		backgroundColor: '#36363a',
		borderColor: 'white',
		borderWidth: 1,
	},
	item1opcity: {
		width: WIDTH < HEIGHT ? WIDTH : HEIGHT,
		height: WIDTH * 9 / 16,
		backgroundColor: 'rgba(255, 255, 0, 0)',
		borderColor: 'white',
		borderWidth: 1,
		position: 'absolute',
		left: 0,
		top: 0,
	},
	item1m: {
		width: WIDTH > HEIGHT ? WIDTH - SOFT_MENU_BAR_HEIGHT : HEIGHT - SOFT_MENU_BAR_HEIGHT,
		// height:  WIDTH>HEIGHT ? (WIDTH-SOFT_MENU_BAR_HEIGHT)*B1 : (HEIGHT-SOFT_MENU_BAR_HEIGHT)*B1,
		height: WIDTH < HEIGHT ? WIDTH : HEIGHT,
		backgroundColor: '#36363a',
		borderColor: 'white',
		borderWidth: 1
	},
	//悬浮窗
	echart: {
		backgroundColor: 'white',
		flexDirection: 'row',
		justifyContent: 'space-between',
		width: WIDTH < HEIGHT ? WIDTH : HEIGHT,
		height: WIDTH < HEIGHT ? WIDTH * 0.12 : HEIGHT * 0.12
	},
	echartm: {
		backgroundColor: 'rgba(0,0,0,0.2)',
		flexDirection: 'row',
		justifyContent: 'space-between',
		position: 'absolute',
		top: WIDTH < HEIGHT ? WIDTH - 70 : HEIGHT - 70,
		width: WIDTH > HEIGHT ? WIDTH - 50 : HEIGHT - 50,
		height: WIDTH < HEIGHT ? WIDTH * 0.12 : HEIGHT * 0.12
	},
	echartm1: {
		top: WIDTH < HEIGHT ? WIDTH * 0.83 : HEIGHT * 0.83,
		backgroundColor: 'rgba(0,0,0,0.1)',
		flexDirection: 'row',
		justifyContent: 'space-between',
		position: 'absolute',
		width: WIDTH > HEIGHT ? WIDTH - SOFT_MENU_BAR_HEIGHT : HEIGHT - SOFT_MENU_BAR_HEIGHT,
		height: WIDTH < HEIGHT ? WIDTH * 0.12 : HEIGHT * 0.12
	},
	// echart1: {marginRight:40},
	appbar: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		backgroundColor: 'white',
		flexWrap: 'wrap',
		width: WIDTH < HEIGHT ? WIDTH : HEIGHT,
		height: 70
	},
	appbarm: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		backgroundColor: 'white',
		flexWrap: 'wrap',
		width: WIDTH > HEIGHT ? WIDTH : HEIGHT,
		height: 70
	},
	appbartcontainer: {
		flexDirection: 'column',
		justifyContent: 'flex-start'
	},

	blank: {
		height: 1100,
		backgroundColor: 'white'
	}
});
export default observer(Page);
