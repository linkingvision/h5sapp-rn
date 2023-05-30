import React, { useState, useEffect, useRef } from 'react';
import {View,Text,StyleSheet,Button, Modal,ScrollView,Dimensions,TouchableOpacity,DeviceEventEmitter,Image} from 'react-native'
import { List ,Appbar} from 'react-native-paper';
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/iconfont';
import Orientation from 'react-native-orientation';
// import Ceshi from "../Ceshi";
import Ceshi from "./RePlayTree";
import store from '../../store/store';
const ExtraDimensions = require('react-native-extra-dimensions-android');
import AsyncStorage from '@react-native-community/async-storage';
import useSyncCallback from '../../hooks/useSyncCallback';


// import Player from "./Replayer";
import Player from "./RePlayer";
import Player1 from '../replayer/RePlayer1';
import Player2 from '../replayer/RePlayer2';
import Player3 from '../replayer/RePlayer3';

import { RootState } from '../../store/index'
import { useSelector, useDispatch } from 'react-redux'
import { changeToken,changeVideoOne,changeVideoTwo,changeVideoThree,changeVideoFour,changeTemp,changeAdswitch} from '../../redux/ReSlice';
import {Calendar, CalendarList, Agenda,LocaleConfig} from 'react-native-calendars';
import Canvas from 'react-native-canvas';
import { TimeLine } from "./timeline";
import TimeLinemin from './TimeLinemin'
import axios from 'axios';
import Slider from '@react-native-community/slider';
import  TimeSlider  from "./timeline-canvas1";
var timeline = null;
LocaleConfig.locales['fr'] = {
  monthNames: ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'],
  monthNamesShort: ['Janv.','Févr.','Mars','Avril','Mai','Juin','Juil.','Août','Sept.','Oct.','Nov.','Déc.'],
  dayNames: ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'],
  dayNamesShort: ['六','日','一','二','三','四','五']
};

LocaleConfig.defaultLocale = 'fr';
//获取宽度和高度
const WIDTH = Dimensions.get('screen').width;
const HEIGHT = Dimensions.get('screen').height;
const B1 = 9 / 16;
const STATUS_BAR_HEIGHT = ExtraDimensions.get('STATUS_BAR_HEIGHT');
const SOFT_MENU_BAR_HEIGHT = ExtraDimensions.get('SOFT_MENU_BAR_HEIGHT');


//播放器组件列表
let playerName = {
	list: [ '1', '2', '3' ],
	pic: [ '1', '2', '3' ],
	token: [ '1', '2', '3' ],
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
const thumbImage = require('../.././assets/圆圈2.png');
const Replay=({ navigation})=>{
  const Temp =  useSelector((state: RootState) =>state.replay.temp)
	console.log(Temp,['hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh']);
  const dispatch = useDispatch()
  const [ playern, setPlayern ] = useState(false);
  const [ isRegionshow, setIsRegionshow ] = useState(false);
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
    zanting: '暂停 停止',
    bofang:'播放',
    // beishu: '倍数',
    shaixuan:"筛 选"
	};
  const [ icon1, setIcon1 ] = useState(icons.shoucang1);
	const [ icon2, setIcon2 ] = useState(icons.shaixuan);
	const [ icon3, setIcon3 ] = useState(icons.shengyin);
	const [ icon4, setIcon4 ] = useState(icons.sige);
  const [ icon5, setIcon5 ] = useState(icons.zanting);
  const [h11,setH11] = useState(false);
	const [h12,setH12] = useState(false);
	const [h13,setH13] = useState(false);
	const [h14,setH14] = useState(false);
  const [ a, setA ] = useState(false);
	const [ b, setB ] = useState(false);
	const [ c, setC ] = useState(false);
	const [ d, setD ] = useState(false);
	const [ a1, setA1 ] = useState(false);
  console.log( new Date());
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const str = year + '-' + month + '-' + day
  console.log(str);
  const datetitle = new Date();
  const yeartitle = datetitle.getFullYear();
  const monthtitle = datetitle.getMonth() + 1;
  const daytitle = datetitle.getDate();
  const strtitle = yeartitle + '年' + monthtitle + '月' + daytitle+'日'
  console.log(strtitle);
  const [h5container,seth5container] =useState('1')
  const [ time, setTime ] = useState(str);
  const [ timetitle, setTimetitle ] = useState(strtitle);
  const [rili,setrili] = useState(false);
  const setT = (data) => {
		setA1(data);
		func();
	};
	const func = useSyncCallback(() => {
		console.log('callback:');
	});

	const [ modalVisible, setModalVisible ] = useState(false);
  const [ replaymodalVisible, setreplayModalVisible ] = useState(false);
  const [ replaySpeedmodalVisible, setreplaySpeedmodalVisible ] = useState(false);
  const videoOne =  useSelector((state: RootState) =>state.replay.videoOne)
  const [posterImage,setPosterImage] =useState(false);
  const [Adswitch,setAdswitch] = useState(false);
  const [Speed,setSpeed] = useState('1');
  // const handleCanvas = useRef(null);
  const [videoList,setVideoList]=useState<any[]>([]); 
	// const changeImage = () => {
  //   setPosterImage(true)
  // }
	useEffect(() => {
		console.log('====================================');
		console.log('trueOrfalse',posterImage);
		console.log('====================================');
	},[posterImage])
	DeviceEventEmitter.addListener('ReplayhideImage',(node)=>{
		setTimeout(()=>{
			setPosterImage(false)
		},500)
		console.log('几秒',posterImage);
	})
  useEffect(() => {
    const jianting = DeviceEventEmitter.addListener('Replaytoken',(node)=>{
		if (playern) {
      setTimeout(() => {
        if (h11||h12||h13||h14) {
          switch(true) {
            case h11:
              dispatch(changeToken(node.strToken))
              dispatch(changeVideoOne(node.strToken))
              setH11(false)
              setA(true)
              setH12(true)
              jianting.remove();
              break;
            case h12:
              dispatch(changeToken(node.strToken))
              dispatch(changeVideoTwo(node.strToken))
              setB(true)
              setH12(false)
              setH13(true)
              jianting.remove();
              break;
            case h13:
              console.log('====================================');
              console.log('====================================');
              dispatch(changeToken(node.strToken))
              dispatch(changeVideoThree(node.strToken))
              setC(true)
              setH13(false)
              setH14(true)
              jianting.remove();
              break;
            case h14:
              dispatch(changeToken(node.strToken))
              dispatch(changeVideoFour(node.strToken))
              setD(true)
              setH14(true)
              jianting.remove();
              break;
          } 
        }else{
          if (a1) {
            dispatch(changeToken(node.strToken))
            dispatch(changeVideoTwo(node.strToken))
            setB(true)
            setH12(false)
            setH13(true)
            jianting.remove();
          }else{
            dispatch(changeToken(node.strToken))
            dispatch(changeVideoOne(node.strToken))
            setA(true)
            setH12(true)
            jianting.remove();
          }
        }
    }, 1000);
		}else{
      console.log('====================================');
      console.log(node,'第三次切换');
      console.log('====================================');
      setPosterImage(true)
      if (node.strToken!='root') {
        dispatch(changeToken(node.strToken))
        dispatch(changeVideoOne(node.strToken))
      }
      console.log('====================================');
      console.log(11111111111111,a1);
      console.log('====================================');
      if (a1) {
				setT(false);
				setTimeout(() => {
					setT(true)
				},50)
			}else{
				setT(true)
			}	
      DeviceEventEmitter.emit('ReplayCloseVideo')
		}
	  })
  }, [Temp])
  function changeSpeed(speed) {
    DeviceEventEmitter.emit('Speed',speed)
  }

  var timeParts1 = [
    {
      start: new Date().getTime() - 3 * 3600 * 1000,
      end: new Date().getTime() - 1 * 3600 * 1000,
      style: {
        background: "rgba(132, 244, 180, 0.498039)"
      }
    }
  ];
  var timeParts2 = [
    {
      start: new Date().getTime() - 6 * 3600 * 1000,
      end: new Date().getTime() - 4 * 3600 * 1000,
      style: {
        background: "rgba(255,0,0,0.5)"
      }
    }
  ];
  function changeCallback(time) {
    console.log("TCL: time", time);
  }
//   useEffect(() => {
//     if (handleCanvas.current) {
//      console.log(handleCanvas.current);
//     //  new TimeLine(handleCanvas.current, new Date().getTime(), timeParts1, true, changeCallback);
//     }
// })
console.log('屏幕宽度',WIDTH);
useEffect(() => {
  var timevalue = (new Date()).getTime();
  axios.get(store.data.https+'://'+store.data.host+':'+store.data.port+'/api/v1/SearchDeviceRecordByTime?token=b1a6--35&start=2022-12-12T00%3A00%3A00%2B08%3A00&end=2022-12-13T23%3A59%3A59%2B08%3A00&session='+store.data.session+'').then((res)=>{
    if(res.status == 200){
      var data=res.data;
      for(var i=0;i<data.record.length;i++){
        var item=data.record[i];
        var item1
        if (i < data.record.length-1) {
          item1=data.record[i+1];
        }
        //时间转换
        var starf=new Date(item['strStartTime']).getTime();
        var starf1=new Date(item1['strStartTime']).getTime();
        var end=new Date(item['strEndTime']).getTime();
        
        var newDate=new Date(starf);
        // var Datestarf=newDate.toString();
        var newDate2=new Date(end);
        // var Dateend=newDate2.toString();
        
        var timeitem={
            beginTime :newDate,
            endTime :newDate2,
            style:{background:"rgba(60,196,60, 0.498039)"}
          };
          // console.log(item["nType"]);
        //console.log("录像段时间段颜色",timeitem["style"].background); //录像段时间段颜色
        if(item["nType"]==="H5_REC_MANUAL"){
          timeitem["style"].background="rgba(60,196,60, 0.498039)"
          //console.log("录像段时间段颜色1",timeitem["style"].background);
        }else if(item["nType"]==="H5_REC_SCHEDULE"){
          timeitem["style"].background="#31b1ff"
        }else{
          timeitem["style"].background="rgba(238,17,17, 0.498039)"
          //console.log("录像段时间段颜色2",timeitem["style"].background);
        }
        // timedata1.push(timeitem);
      videoList.push(timeitem)
      setTimeout(() => {
        // DeviceEventEmitter.emit('timeline',timeline);
       
        // timeline.init(timevalue,videoList)
      }, 3000);
      // console.log(videoList,['data']);
      // TimeSlider(handleCanvas,videoList)
    }
  }
  })
},[])



// new TimeLine(this.refs.handleCanvas, new Date().getTime(), timeParts1, true, changeCallback);
function handleCanvas(canvas){
  // return canvas;
  // const ctx = canvas.getContext('2d');
  // ctx.fillStyle = 'purple';
  // ctx.fillRect(0, 0, 100, 100);
  // console.log('====================================');
  // console.log(canvas);
  // console.log( canvas.getContext('2d'),);
  
  // console.log('====================================');
  // console.log('====================================');
  // console.log(1111111111111111111111111111);
  // console.log('====================================');
  setTimeout(() => {
  //   console.log('====================================');
  // console.log(videoList,['canvas']);
  // console.log('====================================');
  var conf = {
    canvas:canvas,
    ctx : canvas.getContext('2d'),
    init_cells:videoList
  }
  // console.log(conf);
 
  timeline = new TimeSlider(conf)
  //  state.replay.canvas = timeline
  DeviceEventEmitter.emit('timeline',timeline);

  },2000)

  // TimeSlider.init(start_timestamp,timecell,false)
  // this.init(this.start_timestamp,this.timecell,false);
}
  return (
    // <ScrollView style={styles.container} automaticallyAdjustContentInsets={false}>
    <View>
      {/* <View style={{flex: 1,
    justifyContent: "center",
    alignItems: "center",}}> */}
    <Modal
        transparent={true}
        visible={replaySpeedmodalVisible}
      >
      <TouchableOpacity
        style={{flex:1}}
        onPress={() => {
          setreplaySpeedmodalVisible(!replaySpeedmodalVisible);
      }}>
      <View style={{width:80,
        height:170,
        backgroundColor: 'rgba(0,0,0,0.25)',
        justifyContent: 'center',
        alignItems: 'center',
        flex:1,
        position:'absolute',left:WIDTH*0.25,top:WIDTH*0.12}}> 
        <Text style={Speed=='0.5'?styles.Speed:styles.Speed1} onPress={() =>{setreplaySpeedmodalVisible(!replaySpeedmodalVisible);changeSpeed(0.5);setSpeed('0.5')}}>1/2x</Text>
        <Text style={Speed=='1'?styles.Speed:styles.Speed1} onPress={() =>{setreplaySpeedmodalVisible(!replaySpeedmodalVisible);changeSpeed(1);setSpeed('1')}}>1x</Text>
        <Text style={Speed=='2'?styles.Speed:styles.Speed1} onPress={() =>{setreplaySpeedmodalVisible(!replaySpeedmodalVisible);changeSpeed(2);setSpeed('2')}}>2x</Text>
        <Text style={Speed=='4'?styles.Speed:styles.Speed1} onPress={() =>{setreplaySpeedmodalVisible(!replaySpeedmodalVisible);changeSpeed(4);setSpeed('4')}}>4x</Text>
        <Text style={Speed=='8'?styles.Speed:styles.Speed1} onPress={() =>{setreplaySpeedmodalVisible(!replaySpeedmodalVisible);changeSpeed(8);setSpeed('8')}}>8x</Text>
        <Text style={Speed=='16'?styles.Speed:styles.Speed1} onPress={() =>{setreplaySpeedmodalVisible(!replaySpeedmodalVisible);changeSpeed(16);setSpeed('16')}}>16x</Text>
      </View>
      </TouchableOpacity>
    </Modal>
      <Modal
        transparent={true}
        visible={replaymodalVisible}
        // onRequestClose={() => {
        //   setreplayModalVisible(!replaymodalVisible);
        // }}
      >
        <TouchableOpacity
          style={{flex:1}}
          onPress={() => {
            setreplayModalVisible(!replaymodalVisible)
        }}>
        <View style={{width:80,
        height:60,
        backgroundColor: 'rgba(0,0,0,0.25)',
        justifyContent: 'center',
        alignItems: 'center',
        flex:1,
        position:'absolute',left:WIDTH*0.4,top:WIDTH*0.4}}> 
        <Text style={Adswitch?styles.Adswitch:styles.Adswitch1} onPress={() =>{setreplayModalVisible(!replaymodalVisible);dispatch(changeAdswitch(false));setAdswitch(!Adswitch)}}>远端存储</Text>
        <Text style={Adswitch?styles.Adswitch1:styles.Adswitch} onPress={() =>{setreplayModalVisible(!replaymodalVisible);dispatch(changeAdswitch(true));setAdswitch(!Adswitch)}}>服务存储</Text>
      </View>
   </TouchableOpacity>
      
    </Modal>
    {/* </View> */}
    {/* <View style={styles.replay}> */}
    <Modal
      statusBarTranslucent={true}
      animationType="fade"
      visible={modalVisible}
      onRequestClose={() => {
        Orientation.unlockAllOrientations();
        setModalVisible(!modalVisible);
      }}
    >
      <View>
      {playern ? (
          <View style={styles.box2m}>
            <TouchableOpacity
             onPress={() => {
              dispatch(changeToken(Temp))
              dispatch(changeVideoOne(Temp))
              // store.changeToken(store.data.temp);
              // store.changeVideo1(store.data.temp);
              setA(!a);
              playerName.list.unshift(store.data.camname);
              playerName.token.unshift(store.data.token);
              storeData(playerName);
            }}
            >
              <View style={styles.itemm} onAccessibilityTap={() =>{
                seth5container('1');
              }}>
                {a || a1 ? <Player /> : null}
              </View>
            </TouchableOpacity>

            <TouchableOpacity
            onPress={() => {
              dispatch(changeToken(Temp))
              dispatch(changeVideoTwo(Temp))
              // store.changeToken(store.data.temp);
              // store.changeVideo2(store.data.temp);
              setB(!b);
              playerName.list.unshift(store.data.camname);
              playerName.token.unshift(store.data.token);
              storeData(playerName);
            }}
            >
              <View style={styles.itemm}>{b ? <Player1 /> : null}</View>
            </TouchableOpacity>

            <TouchableOpacity
            onPress={() => {
              dispatch(changeToken(Temp))
              dispatch(changeVideoThree(Temp))
              // store.changeToken(store.data.temp);
              // store.changeVideo3(store.data.temp);
              setC(!c);
              playerName.list.unshift(store.data.camname);
              playerName.token.unshift(store.data.token);
              // GETIMG();
              storeData(playerName);
            }}
            >
              <View style={styles.itemm}>{c ? <Player2 /> : null}</View>
            </TouchableOpacity>

            <TouchableOpacity
            onPress={() => {
              dispatch(changeToken(Temp))
              dispatch(changeVideoFour(Temp))
              // store.changeToken(store.data.temp);
              // store.changeVideo4(store.data.temp);
              setD(!d);
              playerName.list.unshift(store.data.camname);
              playerName.token.unshift(store.data.token);
              // GETIMG();
              storeData(playerName);
            }}
            >
              <View style={styles.itemm}>{d ? <Player3 /> : null}</View>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.box2m}>
            <TouchableOpacity
            onPress={() => {
              dispatch(changeToken(Temp))
              dispatch(changeVideoOne(Temp))
              console.log('zaizhe',Temp);
              
              // store.changeToken(store.data.temp);
              // store.changeVideo1(store.data.temp);
              setT(!a1);
              console.log(a1);
              console.log('这里的是:', store.data.temp);
              playerName.list.unshift(store.data.camname);
              playerName.token.unshift(store.data.token);
              // GETIMG();
              storeData(playerName);
            }}
            >
              <View style={styles.item1m}>
                {console.log('下面的是', a1)}
                {a1 ? <Player /> : null}
              </View>
            </TouchableOpacity>
          </View>
        )}
         <ActionButton buttonColor="rgba(211,211,211,0.5)">
          <ActionButton.Item
            buttonColor="#DCDCDC"
            // title="全屏"
            onPress={() => {
              Orientation.lockToPortrait();
              setModalVisible(!modalVisible);
            }}
          >
            <Icon name={icons.quanping} size={22}  />
          </ActionButton.Item>

          <ActionButton.Item
            buttonColor="#DCDCDC"
            // title="声音"
            onPress={() => {
              if (icon3 == icons.shengyin) {
                setIcon3(icons.jingyin);
              } else {
                setIcon3(icons.shengyin);
              }
            }}
          >
            <Icon name={icon3} size={22}  />
          </ActionButton.Item>

          {/* <ActionButton.Item
            buttonColor="#DCDCDC"
            onPress={() => {
              if (icon2 == icons.biaoqing) {
                setIcon2(icons.gaoqing);
              } else {
                setIcon2(icons.biaoqing);
              }
            }}
          >
            <Icon name={icon2} size={24} color={'white'} />
          </ActionButton.Item> */}

          <ActionButton.Item
            buttonColor="#DCDCDC"
            onPress={() => {
              if (icon4 == icons.yige) {
                setIcon4(icons.sige);
              } else {
                setIcon4(icons.yige);
              }
              setPlayern(!playern);
            }}
          >
            <Icon name={icon4} size={22}  />
          </ActionButton.Item>
        </ActionButton>
      </View>
     
    </Modal>
    <View>
      {playern ? (
        <View style={styles.box1}>
          <TouchableOpacity activeOpacity={1}
            onPress={() => {
              dispatch(changeToken(Temp))
              dispatch(changeVideoOne(Temp))
              // store.changeToken(store.data.temp);
              // store.changeVideo1(store.data.temp);
              // setA(!a);
              setH11(true)
              setH12(false)
              setH13(false)
              setH14(false)
              playerName.list.unshift(store.data.camname);
              playerName.token.unshift(store.data.token);
              storeData(playerName);
            }}
          >
           <View style={h11?styles.confirmItem:styles.item}>{a || a1 ? <Player /> : null}</View>
            {/* <Player />  */}
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={1}
            onPress={() => {
              dispatch(changeToken(Temp))
              dispatch(changeVideoTwo(Temp))
              // store.changeToken(store.data.temp);
              // store.changeVideo2(store.data.temp);
              // setB(!b);
              setH11(false)
              setH12(true)
              setH13(false)
              setH14(false)
              playerName.list.unshift(store.data.camname);
              playerName.token.unshift(store.data.token);
              storeData(playerName);
            }}
          >
            <View style={h12?styles.confirmItem:styles.item}>{b ?<Player1 /> : null}</View>
            {/* <Player />  */}
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={1}
            onPress={() => {
              dispatch(changeToken(Temp))
              dispatch(changeVideoThree(Temp))
              // store.changeToken(store.data.temp);
              // store.changeVideo3(store.data.temp);
              // setC(!c);
              setH11(false)
              setH12(false)
              setH13(true)
              setH14(false)
              playerName.list.unshift(store.data.camname);
              playerName.token.unshift(store.data.token);
              // GETIMG();
              storeData(playerName);
            }}
          >
            <View style={h13?styles.confirmItem:styles.item}>{c ? <Player2 /> : null}</View>
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={1}
            onPress={() => {
              dispatch(changeToken(Temp))
              dispatch(changeVideoFour(Temp))
              // store.changeToken(store.data.temp);
              // store.changeVideo4(store.data.temp);
              // setD(!d);
              setH11(false)
              setH12(false)
              setH13(false)
              setH14(true)
              playerName.list.unshift(store.data.camname);
              playerName.token.unshift(store.data.token);
              // GETIMG();
              storeData(playerName);
            }}
          >
            <View style={h14?styles.confirmItem:styles.item}>{d ? <Player3 /> : null}</View>
            {/* <Player3 />  */}
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.box1}>
          <TouchableOpacity activeOpacity={1}
            onPress={() => {
              // dispatch(changeToken(Temp))
              // dispatch(changeVideoOne(Temp))
              // store.changeToken(store.data.temp);
              // store.changeVideo1(store.data.temp);
              // setT(!a1);
              console.log(a1);
              console.log('===============',Temp);
              
              console.log('这里的是:', store.data.temp);
              playerName.list.unshift(store.data.camname);
              playerName.token.unshift(store.data.token);
              // GETIMG();
              storeData(playerName);
            }}
          >
            <View style={styles.item1}>
              {console.log('下面的是', a1)}
              {a1 ? <Player /> : null}
              {/* <Player />  */}
            </View>
		 {posterImage?
		 <View style={styles.item1opcity} ><Image source={{
		 	uri: store.data.https+'://'+store.data.host + ':' + store.data.port + '/api/v1/GetLoadingImage?token='+Temp+'&session=' + store.data.session+' '}} resizeMode='contain' style={{width: '100%', height: '100%'}} /></View>
			: null}
          </TouchableOpacity>
        </View>
      )}
      <Appbar style={styles.echart}>
      <Appbar.Action
          icon={() => <Icon name={icon5} size={22} color={'black'} />}
          onPress={() => {
            if (icon5== icons.bofang) {
              setIcon5(icons.zanting);
              DeviceEventEmitter.emit('Replay')
            } else {
              setIcon5(icons.bofang);
              DeviceEventEmitter.emit('pause')
            }
          }}
        />
        <Appbar.Action
          icon={() => <Icon name={icon3} size={22} color={'black'} />}
          onPress={() => {
            if (icon3 == icons.shengyin) {
              setIcon3(icons.jingyin);
            } else {
              setIcon3(icons.shengyin);
            }
          }}
        />
        <Appbar.Action
          style={{width:50}}
          icon={() => <Icon name={"倍速"} size={30} color={'black'}  style={{width:50,marginTop:-4,marginLeft:-10}} />}
          onPress={() => {
            setreplaySpeedmodalVisible(!replaySpeedmodalVisible);
            console.log('replaySpeedmodalVisible')
          }}
        />
        <Appbar.Action
          icon={() => <Icon name={"筛 选"} size={24} color={'black'} />}
          onPress={() => {
            setreplayModalVisible(!replaymodalVisible);
            // if (icon2 == icons.beishu) {
            //   setIcon2(icons.beishu);
            // } else {
            //   setIcon2(icons.beishu);
            // }
            // store.data.advanch=!store.data.advanch
          }}
        />
        <Appbar.Action
						icon={() => <Icon name={"关  闭"} size={18} color={'black'} />}
						onPress={() => {
							setA(false);
							setB(false);
							setC(false);
							setD(false);
							setT(false);
							// // setH11(false);
							// // setH12(false);
							// // setH13(false);
							// // setH14(false);
							// store.changeVideo1('')
							// store.changeVideo2('')
							// store.changeVideo3('')
							// store.changeVideo4('')
							// console.log('手动关闭',a1);
							
							// store.data.video1='';
							// store.data.video2='';
							// store.data.video3='';
							// store.data.video4='';
							DeviceEventEmitter.emit('ReplayCloseVideo','true');
							// console.log('====================================');
							// console.log('全部关闭',a,b,h11);
							// console.log('====================================');
							// console.log(store.data);
							// console.log('====================================');
							// console.log('====================================');
							// if (icon1 == icons.shoucang2) {
							// 	setIcon1(icons.shoucang1);
							// }
						}}
					/>
        {/* <Appbar.Action
          // icon={() => <Icon name={icon1} size={22} color={'black'} />}
          <Text ></Text>
          
        /> */}
        <Appbar.Action
          icon={() => <Icon name={icon4} size={22} color={'black'} />}
          onPress={() => {
            if (icon4 == icons.yige) {
              setIcon4(icons.sige);
            } else {
              setIcon4(icons.yige);
            }
            setPlayern(!playern);
          }}
        />
        <Appbar.Action
          icon={() => <Icon name={icons.quanping} size={22} color={'black'} />}
          onPress={() => {
            Orientation.lockToLandscapeLeft();

            setModalVisible(!modalVisible);
            let wocao = Dimensions.get('screen').width;
          }}
        />
      </Appbar>
    </View>
    <ScrollView showsVerticalScrollIndicator={true} style={{}}>
    <View style={styles.openTree}>
    <List.Section>
      <List.Item
        title="资源列表"
        left={() => <List.Icon icon={() => <Icon name={'资源列表'} size={25} />} />}
        onPress={() => {
          setIsRegionshow(!isRegionshow);
        }}
      />
      {isRegionshow ? <Ceshi /> : null}
      <View style={styles.changedate}>
        <Button 
          onPress={() => {setrili(!rili)}}
          title={`${time}`}
          color="grey"
        ></Button>
        
        {/* <View style={styles.opendate}> */}
        {rili?<Modal  animationType="fade"
                transparent={true}>
            <View style={styles.openchangedate}>
            <View style={{backgroundColor:"#3EADFF",height : 60 , width:350}}>
              {/* <Button 
                onPress={() => {}}
                title={`${time}`}
                color="grey"
              ></Button> */}
              <Text style={styles.innerText} onPress={() => {}}>
                {timetitle}
              </Text>
            </View>
            <Calendar style = { { height : 350 , width:350} } 
            // Initially visible month. Default = Date()
            // current={'2022-02-22'}
            // Minimum date that can be selected, dates before minDate will be grayed out. Default = undefined
            // minDate={'2012-05-10'}
            // Maximum date that can be selected, dates after maxDate will be grayed out. Default = undefined
            // maxDate={'2012-05-30'}
            // Handler which gets executed on day press. Default = undefined
            onDayPress ={(day)=> {console.log('selected day',day)
              setT(false);
              setTimeout(() => {
                setT(true)
              },50)
              DeviceEventEmitter.emit('changetime',day)
              setrili(!rili)
              setTime(day.dateString)
              setTimetitle(day.dateString)
              DeviceEventEmitter.emit('ReplayCloseVideo','true');
              // dispatch(changereplaytime(day.timestamp))
            }}
            // showWeekNumbers={true}
            // Month format in calendar title. Formatting values: http://arshaw.com/xdate/#Formatting

            monthFormat={'yyyy MM' }


            // Handler which gets executed when visible month changes in calendar. Default = undefined

            onMonthChange={( month)=> {console.log('month changed',month)}}


            // Hide month navigation arrows. Default = false

            hideArrows={false}
            // Replace default arrows with custom ones (direction can be 'left' or 'right')

            // Do not show days of other months in month page. Default = false

            hideExtraDays={true}

            // If hideArrows=false and hideExtraDays=false do not switch month when tapping on greyed out

            // day from another month that is visible in calendar page. Default = false

            disableMonthChange={true}

            // If firstDay=1 week starts from Monday. Note that dayNames and dayNamesShort should still start from Sunday.

            firstDay={1}
            onPressArrowLeft = { subtractMonth =>  subtractMonth ( ) } 
            // 向右按下箭头图标时执行的处理程序。收到回调可以去下个月
            onPressArrowRight = { addMonth  =>  addMonth ( ) } 
            enableSwipeMonths = { true } 

            // Hide day names. Default = false

            // hideDayNames={true}
            />
            </View>
            </Modal> : null}
          </View>
        {/* </View> */}
        <View style={styles.timeSliderstyle}>
        {/* <WebCanvas 
          
         
          height={80} 
          width={100}
        /> */}
        {/* <canvas class="timeline" :id="'timeline'+r+c" style="width:100%;" width="1500" height="55px"
          @mousedown ="timelinndown($event)"
          @mouseout="mouseoutcanvas"
          @mouseup="timetz"
          ondragstart="return false;">
        </canvas> */}
         <Canvas ref={handleCanvas}  style={{transform: [{rotate: '90deg' },{translateY:100}],height:220,marginLeft:50}}/>
         {/* <View>
         <TimeLinemin
        width={WIDTH}
        currentTime={1665936000000}//开始时间
        videoRecords={videoList}//视频时间段用于绘制有视频的时间段颜色
        // changCurrentTime={(e) => { changCurrentTime(e) }}
      />
        </View> */}
      {/* <View style={{transform: [
          { rotate: '90deg' }
        ],}}>
      <Slider
            style={{width:300,height:80}}
            value={0.3}
            step={0}
            minimumValue={0}
            maximumValue={1}
            minimumTrackTintColor={'red'}
            maximumTrackTintColor={'#2F90E5'}
            thumbImage={thumbImage}
            onValueChange={ (value) => {console.log('value:'+value)}}
            onSlidingComplete={ () => {console.log('onSlidingComplete')}}
          />
      </View> */}
      <View style={styles.box3}>
        <View style={styles.jiajian}>
          <TouchableOpacity onPressIn={() => {  }} onPressOut={() => {  }} style={{paddingTop:10}} onPress={() => {
            timeline.mousewhs(-1) 
          }}>
            <Icon name={'加'} color={'steelblue'} size={WIDTH * 0.06} />
            </TouchableOpacity>
            <TouchableOpacity onPressIn={() => {  }} onPressOut={() => {  }} style={{paddingBottom:10}} onPress={() => {
              timeline.mousewhs(1)
            }}>
            <View
              style={{
                borderTopWidth:1,borderTopColor:'steelblue',height:25
              }}
            />
            <Icon style={styles.icon} name={'减'} color={'steelblue'} size={WIDTH * 0.06} />
            </TouchableOpacity>

        </View>
    </View>
        </View>
      </List.Section>
    </View>
    </ScrollView>
    </View>
   
    
  // </ScrollView>
  )
}
const styles = StyleSheet.create({
  container: {
		flex: 1
	},
  replay:{
    width: '100%',
    height: '100%',
  },
  topVideo:{
    width: '100%',
    height: '30%',
    // backgroundColor:'#2D2D2D'
  },
  openTree:{
    width: '100%',
    height: 1700
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
  confirmItem:{
		width: WIDTH < HEIGHT ? WIDTH / 2 : HEIGHT / 2,
		height: WIDTH < HEIGHT ? WIDTH / 2 * (9 / 16) : HEIGHT / 2 * (9 / 16),
		backgroundColor: '#36363a',
		borderColor: '#f44336',
		borderWidth: 1
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
	item1: {
		width: WIDTH < HEIGHT ? WIDTH : HEIGHT,
		height: WIDTH * 9 / 16,
		backgroundColor: '#36363a',
		borderColor: 'white',
		borderWidth: 1
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
  
  changedate:{
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: 'space-between',
    // marginTop:0.25*HEIGHT,
  },
  TimefullButton:{
    flexDirection: "row",
    flexWrap: "wrap",
    width:100,
    justifyContent: 'space-around',
    
    // marginTop:0.25*HEIGHT,
  },
  // opendate:{
  //   opcity:
  // },
  openchangedate:{
    flex:1,
    justifyContent:'center',
    alignItems:'center', 
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  innerText:{
    color: 'white',
    fontSize: 16,
    marginTop:20,
    marginLeft:20,
  },
  timeSliderstyle:{
    // backgroundColor: 'grey',
    // borderWidth: 1,
    marginTop:0.16*HEIGHT,
    marginLeft:10,
    paddingRight:50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems:'center'
  },
  Adswitch:{
    color:'#9a9a9a'
  },
  Adswitch1:{
    color:'white'
  },
  Speed:{
    color:'#9a9a9a',
    marginTop:10
  },
  Speed1:{
    color:'white',
    marginTop:10
  },
  box3: {
    width: WIDTH * 0.08,
    height: 130,
    // height: HEIGHT * 0.48,
    marginLeft: WIDTH * 0.03,
    marginRight: WIDTH * 0.04,
    position: 'absolute',
    top: -45,
    right:15,
  },
  icon: {
      // marginTop: WIDTH * 0.11,
  },
  jiajian: {
    borderWidth: 1, borderStyle: 'solid', borderRadius: 0.04 * WIDTH, borderColor: 'steelblue', alignItems: 'center', 
    justifyContent:'space-between',height: 130, flexDirection:'column', 
  },
});
export default Replay;