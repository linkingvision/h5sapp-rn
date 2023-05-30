import React, { useState, useEffect, useRef } from 'react';
import {View,Text,StyleSheet, Modal,ScrollView,Dimensions,Button,TouchableOpacity,DeviceEventEmitter,Image,FlatList} from 'react-native'
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
// import Canvas from 'react-native-canvas';
// import { TimeLine } from "./timeline";
// import TimeLinemin from './TimeLinemin'
import axios from 'axios';
import Slider from '@react-native-community/slider';
// import  TimeSlider  from "./timeline-canvas1";
import DateTimePicker from "@react-native-community/datetimepicker"
import { DataTable } from 'react-native-paper';
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
const Replay=({ navigation})=>{
  const Temp =  useSelector((state: RootState) =>state.replay.temp)
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
  const [ icon5, setIcon5 ] = useState(icons.bofang);
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
  const date1 = new Date();
  const year = date1.getFullYear();
  const month = date1.getMonth() + 1;
  const day = date1.getDate();
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
  const [tool,settool] = useState(0);
  const [viewableItems,setviewableItems] = useState()
  const [currentPage,setcurrentPage] = useState(1)
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
  const [Data,setData]=useState([])
  const [Data1,setData1]=useState<any[]>([])
  var Data2 = []
  var Data3 = []
  var defaultdate = new Date(new Date().getTime() - 1 * 60 * 60 * 1000);
  var Y = defaultdate.getFullYear() + '-'
  var M = (defaultdate.getMonth() + 1 < 10 ? '0' + (defaultdate.getMonth() + 1) : defaultdate.getMonth() + 1) + '-'
  var D = (defaultdate.getDate() < 10 ? '0' + defaultdate.getDate() : defaultdate.getDate()) + ' '
  var h = (defaultdate.getHours() < 10 ? '0' + defaultdate.getHours() : defaultdate.getHours()) + ':'
  var m = (defaultdate.getMinutes() < 10 ? '0' + defaultdate.getMinutes() : defaultdate.getMinutes()) + ':'
  var s = (defaultdate.getSeconds() < 10 ? '0' + defaultdate.getSeconds() : defaultdate.getSeconds())
  const [date,setDate] = useState(Y + M + D +" "+ h + m + s);
  const [strdate,setStrDate] = useState(new Date());
  const [strtime,setStrtime] = useState(new Date());
  const [show,setShow] = useState(false);
  const [showtime,setShowtime] = useState(false);
  const [startdate,setstartdate] = useState([]);
  const [DevicesOrTime,setDevicesOrTime]= useState(true);
  const [videoList,setVideoList]=useState<any[]>([]); 
  const [tokenColor,setTokenColor] = useState('#3EADFF');
  const [TimeColor,setTimeColor] = useState('black');
  const [changTokencolor1,setchangTokencolor1] = useState('#3EADFF');
  const [changTimecolor1,setchangTimecolor1] = useState('white');
  // 结束时间
  var defaultEnddate = new Date();
  var Y1 = defaultEnddate.getFullYear() + '-'
  var M1 = (defaultEnddate.getMonth() + 1 < 10 ? '0' + (defaultEnddate.getMonth() + 1) : defaultEnddate.getMonth() + 1) + '-'
  var D1 = (defaultEnddate.getDate() < 10 ? '0' + defaultEnddate.getDate() : defaultEnddate.getDate()) + ' '
  var h1 = (defaultEnddate.getHours() < 10 ? '0' + defaultEnddate.getHours() : defaultEnddate.getHours()) + ':'
  var m1 = (defaultEnddate.getMinutes() < 10 ? '0' + defaultEnddate.getMinutes() : defaultEnddate.getMinutes()) + ':'
  var s1 = (defaultEnddate.getSeconds() < 10 ? '0' + defaultEnddate.getSeconds() : defaultEnddate.getSeconds())
  const [Enddate,setEndDate] = useState(Y1 + M1 + D1 +" "+ h1 + m1 + s1);
  const [Endstrdate,setEndstrdate] = useState(new Date(new Date().getTime() - 1 * 60 * 60 * 1000));
  const [Endstrtime,setEndstrtime] = useState(new Date(new Date().getTime() - 1 * 60 * 60 * 1000));
  const [enddateshow,setenddateshow] = useState(false);
  const [endshowtime,setendshowtime] = useState(false);
  const [enddate,setenddate] = useState([]);
  // var sliderMax:number=100;
  const [sliderMax,setsliderMax] = useState();
  const [sliderValue,setSliderValue] = useState(0);
  const [confirm,setConfirm] = useState(store.data.backgroundColor);
  const [page, setPage] = React.useState(0);
  const [pageSize, setpageSize] = React.useState(5);
  const [numberOfItemsPerPage, onItemsPerPageChange] = React.useState(pageSize);
  const from = page * numberOfItemsPerPage;
  const to = Math.min((page + 1) * numberOfItemsPerPage, Data.length);
  const [firstData,setFirstData] = useState(false);
	// const changeImage = () => {
  //   setPosterImage(true)
  // }
  function changeToken(){
    setDevicesOrTime(true);
    setTokenColor('#3EADFF');
    setTimeColor('black');
    setchangTokencolor1('#3EADFF');
    setchangTimecolor1('white');
  }
  function changeTime(){
    setDevicesOrTime(false);
    setTokenColor('black');
    setTimeColor('#3EADFF');
    setchangTokencolor1('white');
    setchangTimecolor1('#3EADFF');
  }
  function changeStrDate(event,time){
    if(event.type == "set"){
      setShow(false);
      setShowtime(true);
      var date2 = new Date(time);
      var Y = date2.getFullYear() + '-';
      var M = (date2.getMonth() + 1 < 10 ? '0' + (date2.getMonth() + 1) : date2.getMonth() + 1) + '-';
      var D = (date2.getDate() < 10 ? '0' + date2.getDate() : date2.getDate()) + ' ';
      setDate(Y + M + D);
    }else{
      setShow(false);
    }
  }
  useEffect(() => {
    getNum()
  }, [date])
  const getNum = () => {
    startdate.push(date)
  }
  function changeStrTime(event,time){
    if(event.type == "set"){
      var startTimevalue=  startdate[1]
      for (var key in startdate) {
        startdate.splice(key, startdate.length)
      }
      setShowtime(false);
      var date2 = new Date(time);
      var h = (date2.getHours() < 10 ? '0' + date2.getHours() : date2.getHours()) + ':';
      var m = (date2.getMinutes() < 10 ? '0' + date2.getMinutes() : date2.getMinutes()) + ':';
      var s = (date2.getSeconds() < 10 ? '0' + date2.getSeconds() : date2.getSeconds());
      setDate(startTimevalue+' '+h + m + s);
    }else{
      setShowtime(false);
    }
  }
  // 结束时间修改
  function changeEndStrDate(event,time){
    if(event.type == "set"){
      setenddateshow(false);
      setendshowtime(true);
      var date2 = new Date(time);
      var Y = date2.getFullYear() + '-';
      var M = (date2.getMonth() + 1 < 10 ? '0' + (date2.getMonth() + 1) : date2.getMonth() + 1) + '-';
      var D = (date2.getDate() < 10 ? '0' + date2.getDate() : date2.getDate()) + ' ';
      console.log(Y + M + D);
      console.log(date2,1221);
      setEndDate(Y + M + D);
      console.log(date,1221);
    }else{
      setenddateshow(false);
    }
  }
  useEffect(() => {
    getendNum()
  }, [Enddate])
  const getendNum = () => {
    enddate.push(Enddate)
  }
  function changeEndStrTime(event,time){
    if(event.type == "set"){
      var endTimevalue=  enddate[1]
      for (var key in enddate) {
        enddate.splice(key, enddate.length)
      }
      setendshowtime(false);
      var date2 = new Date(time);
      var h = (date2.getHours() < 10 ? '0' + date2.getHours() : date2.getHours()) + ':';
      var m = (date2.getMinutes() < 10 ? '0' + date2.getMinutes() : date2.getMinutes()) + ':';
      var s = (date2.getSeconds() < 10 ? '0' + date2.getSeconds() : date2.getSeconds());
      setEndDate(endTimevalue+' '+h + m + s);
    }else{
      // console.log('set-false');
      // console.log(enddate);
      // var endTimevalue=  enddate[0];
      // var endTimevalue2=  enddate[1]
      // for (var key in enddate) {
      //     enddate.splice(key, enddate.length)
      // }
      // console.log(endTimevalue.split(" ")[0],endTimevalue.split(" ")[1],endTimevalue.split(" ")[2]);
      // console.log(endTimevalue2);
      // setEndDate(endTimevalue2+' '+endTimevalue.split(" ")[1]);
      setendshowtime(false);
    }
  }
  // 查询回放
  function ReplaySearch(data) {
    // setData([])
    // if (store.data.replayData!==[]) {
    //   // setData([]);
    //   Data2.push([])
    //   store.changeReplayData([]);
    // }
    // Data2=[];
    var starttimevalues=date.replace('  ','T')+'%2B08:00';
    var endtimevalues = Enddate.replace('  ','T')+'%2B08:00';
    var url = ''
    // if (store.data.replayToken.length>0) {
    console.log(['store.data.replayToken'],store.data.replayToken);
    if (store.data.replayData.length>0) {
      store.data.replayData.splice(0, store.data.replayData.length);
      Data.splice(0, Data.length);
      console.log('不为空');
    }else{
      console.log('空的');
    }
    if (store.data.replayToken.length>0) {
      for (let i = 0; i < store.data.replayToken.length; i++) {
        // const element = store.data.replayToken[i];
        if (store.data.replayToken[i]['iconclass']) {
          let label=store.data.replayToken[i]['strName'];
          if (!Adswitch) {
            url=store.data.https+'://'+store.data.host+':'+store.data.port+"/api/v1/SearchDeviceRecordByTime?token=" +store.data.replayToken[i]['strToken']+"&start=" + encodeURIComponent(starttimevalues) + "&end=" + encodeURIComponent(endtimevalues) + '&session='+store.data.session;
          }else{
            url=store.data.https+'://'+store.data.host+':'+store.data.port+"/api/v1/Search?type=record&token=" +store.data.replayToken[i]['strToken']+"&start=" + encodeURIComponent(starttimevalues) + "&end=" + encodeURIComponent(endtimevalues) + '&session='+store.data.session;
          }
          axios.get(url).then(function(result) {
            if (result.status == 200) {
              // EventTableLength = result.data.length;
              var data1 = result.data;
              for (const value in data1.record) {
                var item = data1.record[value];
                var timeitem={
                  name: label,
                  token: store.data.replayToken[i]['strToken'],
                  starf : item['strStartTime'],
                  end : item['strEndTime'],
                  type: item['nType'],
                  percentage:0,
                  url:'',
                  urlto:'',
                  strFileName:""
                };
                Data.push(timeitem);
                setTimeout(() =>{
                  let _items = JSON.parse(JSON.stringify(firstData));
                  if (_items) {
                    let firstDataTrue = _items+1;
                    setFirstData(firstDataTrue)
                  }else{
                    setFirstData(!_items)
                  }
                },2000)
                setIsRegionshow(!isRegionshow);
              }
            }
          })
          .catch((error) => {
            console.log('错误1', error);
          });
        }else{
          var node = store.data.replayToken[i]['node']
          console.log(node.length)
          for (let k = 0; k < node.length; k++) {
            if (node[k]['iconclass']) {
              let label=node[k]['strName'];
              if (!Adswitch) {
                url=store.data.https+'://'+store.data.host+':'+store.data.port+"/api/v1/SearchDeviceRecordByTime?token=" +node[k]['strToken']+"&start=" + encodeURIComponent(starttimevalues) + "&end=" + encodeURIComponent(endtimevalues) + '&session='+store.data.session;
              }else{
                url=store.data.https+'://'+store.data.host+':'+store.data.port+"/api/v1/Search?type=record&token=" +node[k]['strToken']+"&start=" + encodeURIComponent(starttimevalues) + "&end=" + encodeURIComponent(endtimevalues) + '&session='+store.data.session;
              }
              axios.get(url).then(function(result) {
                if (result.status == 200) {
                  // EventTableLength = result.data.length;
                  var data1 = result.data;
                  for (const value in data1.record) {
                    var item = data1.record[value];
                    var timeitem={
                      name: label,
                      token: node[k]['strToken'],
                      starf : item['strStartTime'],
                      end : item['strEndTime'],
                      type: item['nType'],
                      percentage:0,
                      url:'',
                      urlto:'',
                      strFileName:""
                    };
                    Data.push(timeitem);
                    setTimeout(() =>{
                      let _items = JSON.parse(JSON.stringify(firstData));
                      if (_items) {
                        let firstDataTrue = _items+1;
                        setFirstData(firstDataTrue)
                      }else{
                        setFirstData(!_items)
                      }
                    },2000)
                    setIsRegionshow(!isRegionshow);
                  }
                }
              })
              .catch((error) => {
                console.log('错误1', error);
              });
            }
          }
        }
      }
    }
  }
  function group(array, subGroupLength) {
    let index = 0;
    let newArray = [];
    while(index < array.length) {
      newArray.push(array.slice(index, index += subGroupLength));
    }
    return newArray;
  }
  // 播放
  function Refresh1(row) {
    if (a1) {
      setT(false);
      setTimeout(() => {
        setT(true)
        setIcon5(icons.zanting);
      },50)
      DeviceEventEmitter.emit('ReplayCloseVideo','true');
    }else{
      setT(true)
      setIcon5(icons.zanting);
    }
    // DeviceEventEmitter.emit('Refresh1',row)
    store.changeRefreshToken(row.token);
    store.changeRefreshStart(row.starf);
    store.changeRefreshEnd(row.end);
    setPosterImage(true)
    var end=new Date(row.end).getTime();
    var starf=new Date(row.starf).getTime();
    // this.canvas(starf,end);
    var starfend=(end-starf)/1000;//时间差
    console.log(['max进度条'],starfend);
    // return false
    // sliderMax=starfend;
    setsliderMax(starfend);
  }
  // 修改进度
  function timelinn(timelink){
    console.log(timelink);
    // this.v1.seek(timelink);
    setSliderValue(timelink)
    if (icon5== icons.bofang) {
      setIcon5(icons.zanting);
    }
    DeviceEventEmitter.emit('timelinn',timelink);
  }
  DeviceEventEmitter.addListener('sliderValue',(value)=>{
    setTimeout(()=>{
      setSliderValue(value)
    },500)
  })
	DeviceEventEmitter.addListener('ReplayhideImage',(node)=>{
		setTimeout(()=>{
			setPosterImage(false)
		},500)
		console.log('几秒',posterImage);
	})
  DeviceEventEmitter.addListener('blur',(node)=>{
    if (a1) {
      setIcon5(icons.bofang);
      DeviceEventEmitter.emit('pause')
      setFirstData(false)
    }
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
// useEffect(() => {
//   var timevalue = (new Date()).getTime();
//   axios.get(store.data.https+'://'+store.data.host+':'+store.data.port+'/api/v1/SearchDeviceRecordByTime?token=b1a6--35&start=2022-12-12T00%3A00%3A00%2B08%3A00&end=2022-12-13T23%3A59%3A59%2B08%3A00&session='+store.data.session+'').then((res)=>{
//     if(res.status == 200){
//       var data=res.data;
//       for(var i=0;i<data.record.length;i++){
//         var item=data.record[i];
//         var item1
//         if (i < data.record.length-1) {
//           item1=data.record[i+1];
//         }
//         //时间转换
//         var starf=new Date(item['strStartTime']).getTime();
//         var starf1=new Date(item1['strStartTime']).getTime();
//         var end=new Date(item['strEndTime']).getTime();
        
//         var newDate=new Date(starf);
//         // var Datestarf=newDate.toString();
//         var newDate2=new Date(end);
//         // var Dateend=newDate2.toString();
        
//         var timeitem={
//             beginTime :newDate,
//             endTime :newDate2,
//             style:{background:"rgba(60,196,60, 0.498039)"}
//           };
//           // console.log(item["nType"]);
//         //console.log("录像段时间段颜色",timeitem["style"].background); //录像段时间段颜色
//         if(item["nType"]==="H5_REC_MANUAL"){
//           timeitem["style"].background="rgba(60,196,60, 0.498039)"
//           //console.log("录像段时间段颜色1",timeitem["style"].background);
//         }else if(item["nType"]==="H5_REC_SCHEDULE"){
//           timeitem["style"].background="#31b1ff"
//         }else{
//           timeitem["style"].background="rgba(238,17,17, 0.498039)"
//           //console.log("录像段时间段颜色2",timeitem["style"].background);
//         }
//         // timedata1.push(timeitem);
//       videoList.push(timeitem)
//       setTimeout(() => {
//         // DeviceEventEmitter.emit('timeline',timeline);
       
//         // timeline.init(timevalue,videoList)
//       }, 3000);
//       // console.log(videoList,['data']);
//       // TimeSlider(handleCanvas,videoList)
//     }
//   }
//   })
// },[])
  DeviceEventEmitter.addListener('background',(value)=>{
    console.log('监听',value);
    setConfirm(value)
  })
  function onViewableItemsChanged(viewableItems, changed) {
    setviewableItems(viewableItems)
  }
  function prevPage() {
    setcurrentPage(currentPage - 1)
  }

  function nextPage(){
    setcurrentPage(currentPage + 1)

  }
  // DeviceEventEmitter.addListener('firstData',(node)=>{
  //   getTabelData2()
	// })
   //获取表格数据，自行分页（splice）
  function getTabelData2() {
    console.log('====================================');
    console.log(page,pageSize);
    console.log('====================================');
    let data=JSON.parse(JSON.stringify(Data))
    Data2 = data.splice(
      (page - 1) * pageSize,
      pageSize
    );
    setData1(Data2)
    console.log(Data2);
    store.changeReplayData(Data2)
    settool(Data.length)
  }
  // useEffect(()=>{
  //   getTabelData2()
  // },[])
  // useEffect(()=>{
  //   setData1(Data2)
  // },Data2)
  useEffect(()=>{
    // console.log(Data);
    if (firstData!=false) {
      let data=JSON.parse(JSON.stringify(Data))
      Data2 = data.splice(0,pageSize);
      console.log(Data2);
      
      setData1(Data2)
      console.log(Data2);
      store.changeReplayData(Data2);
    }
  },[firstData])
  function sizeChange(page) {
    console.log("改变每页多少条，当前一页多少条数据", page, pageSize);
    setpageSize(pageSize)
    setPage(page)
    // this.page = 1; 
   getTabelData2();
  }
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
  // setTimeout(() => {
  // //   console.log('====================================');
  // // console.log(videoList,['canvas']);
  // // console.log('====================================');
  // var conf = {
  //   canvas:canvas,
  //   ctx : canvas.getContext('2d'),
  //   init_cells:videoList
  // }
  // // console.log(conf);
 
  // timeline = new TimeSlider(conf)
  // //  state.replay.canvas = timeline
  // DeviceEventEmitter.emit('timeline',timeline);

  // },2000)

  // TimeSlider.init(start_timestamp,timecell,false)
  // this.init(this.start_timestamp,this.timecell,false);
}
  return (
    // <ScrollView style={styles.container} automaticallyAdjustContentInsets={false}>
    <View style={{backgroundColor:confirm}}>
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
        position:'absolute',left:WIDTH*0.29,top:WIDTH*0.12}}> 
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
        position:'absolute',left:WIDTH*0.5,top:WIDTH*0.4}}> 
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
      <View style={{backgroundColor:confirm}}>
      {playern ? (
          <View style={styles.box2m}>
            <TouchableOpacity
             onPress={() => {
              dispatch(changeToken(Temp))
              dispatch(changeVideoOne(Temp))
              // store.changeToken(store.data.temp);
              // store.changeVideo1(store.data.temp);
              // setA(!a);
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
              // setB(!b);
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
              // setC(!c);
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
              // setD(!d);
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
              // setT(!a1);
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
            <View style={{width: WIDTH < HEIGHT ? WIDTH : HEIGHT, height: WIDTH * 9 / 16, backgroundColor: '#36363a', borderColor: store.data.backgroundColor, borderWidth: 1}}>
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
      <Slider
        disabled={false}
        style={{width: WIDTH, height: 20}}
        value={sliderValue}
        maximumValue={sliderMax}
        minimumTrackTintColor="#3DADFF"
        maximumTrackTintColor="#D4CAC2"
        onValueChange={(value)=>{timelinn(value)}}
        tapToSeek={true}
      />
      <Appbar style={{backgroundColor: store.data.backgroundColor,
		flexDirection: 'row',
		justifyContent: 'space-between',
		width: WIDTH < HEIGHT ? WIDTH : HEIGHT,
    height: WIDTH < HEIGHT ? WIDTH * 0.12 : HEIGHT * 0.12}}>
      <Appbar.Action
          animated={false}
          icon={() => <Icon name={icon5} size={22} color={store.data.TextColor} />}
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
          icon={() => <Icon name={"倍速"} size={30} color={store.data.TextColor}  style={{width:50,marginLeft:8}} />}
          onPress={() => {
            setreplaySpeedmodalVisible(!replaySpeedmodalVisible);
            console.log('replaySpeedmodalVisible')
          }}
        />
        <Appbar.Action
          animated={false}
          icon={() => <Icon name={"筛 选"} size={24} color={store.data.TextColor} />}
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
            animated={false}
						icon={() => <Icon name={"关  闭"} size={18} color={store.data.TextColor} />}
						onPress={() => {
							setA(false);
							setB(false);
							setC(false);
							setD(false);
							setT(false);
              setPosterImage(false);
              setSliderValue(0)
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
              if (icon5== icons.zanting) {
                setIcon5(icons.bofang);
              }
						}}
					/>
        {/* <Appbar.Action
          // icon={() => <Icon name={icon1} size={22} color={'black'} />}
          <Text ></Text>
          
        /> */}
        {/* <Appbar.Action
          icon={() => <Icon name={icon4} size={22} color={'black'} />}
          onPress={() => {
            if (icon4 == icons.yige) {
              setIcon4(icons.sige);
            } else {
              setIcon4(icons.yige);
            }
            setPlayern(!playern);
          }}
        /> */}
        <Appbar.Action
          animated={false}
          icon={() => <Icon name={icons.quanping} size={22} color={store.data.TextColor} />}
          onPress={() => {
            Orientation.lockToLandscapeLeft();

            setModalVisible(!modalVisible);
            let wocao = Dimensions.get('screen').width;
          }}
        />
      </Appbar>
    </View>
    <ScrollView showsVerticalScrollIndicator={true} style={{backgroundColor:confirm}}>
    <View style={{width: '100%',
    height: 1700,
    backgroundColor:confirm,}}>
    <List.Section>
      <List.Item
        title="资源列表"
        titleStyle={{color: store.data.TextColor}}
        left={() => <List.Icon icon={() => <Icon name={'资源列表'} size={25} color={store.data.TextColor} />} />}
        onPress={() => {
          setIsRegionshow(!isRegionshow);
        }}
      />
      {isRegionshow ? 
      <View style={{justifyContent: 'flex-start',width:WIDTH,paddingLeft:20,marginTop:0.048*WIDTH,}}>
        <View style={{flexDirection: 'row',justifyContent: 'flex-start'}}>
          <TouchableOpacity style={{height:30,borderBottomColor:changTokencolor1,borderBottomWidth:2}} activeOpacity={0.8} onPress={() =>changeToken()} >
              <Text style={{color: store.data.TextColor,letterSpacing: 0,paddingRight:10,fontSize:20,marginLeft:10,}}>设备</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{height:30,borderBottomColor:changTimecolor1,borderBottomWidth:2,marginLeft:20}} activeOpacity={0.8} onPress={() => changeTime()}>
              <Text style={{color: store.data.TextColor,marginLeft:10, letterSpacing: 0,paddingRight:10,fontSize:20}}>时间</Text>
          </TouchableOpacity>
        </View>
            <View>
            <View>{DevicesOrTime ? 
                <View>
                    <ScrollView>
                    <Ceshi />
                    </ScrollView>
                </View>
                  : <View style={{marginTop:0.1*WIDTH,marginLeft: 0.04*WIDTH,}}>
                    <Text style={{color: store.data.TextColor}}>开始时间</Text>
                    <View style={{ flexDirection: 'row',
                        backgroundColor:'#F6F6F6',
                        width:WIDTH*0.6,
                        marginLeft: 0.1*WIDTH,
                        marginTop:0.048*WIDTH,
                        marginBottom:0.048*WIDTH,
                        borderRadius:0.048*WIDTH,}}>
                        <TouchableOpacity style={{paddingLeft:0.028*WIDTH,height: 0.10*WIDTH,width:WIDTH*0.6,alignItems:'center',justifyContent:'center',}} activeOpacity={0.8} onPress={() =>{setShow(true)}}>
                            <Text style={{color: 'black',fontSize:18}}>{date}</Text>
                        </TouchableOpacity>
                        {/* <TextInput style={styles.search}  value={date.toString()}   onFocus={() => {setShow(show) }}></TextInput> */}
                        {show?<DateTimePicker
                            testID="dateTimePicker"
                            value={strdate}
                            mode="date"
                            minimumDate={new Date(1950, 0, 1)}
                            maximumDate={new Date()}
                            display="spinner"
                            onChange={(event,date)=>{changeStrDate(event,date)}}
                        />:null}
                        {showtime?<DateTimePicker
                            testID="dateTimePicker"
                            value={strtime}
                            mode="time"
                            minimumDate={new Date(1950, 0, 1)}
                            maximumDate={new Date()}
                            display="spinner"
                            onChange={(event,date)=>{changeStrTime(event,date)}}
                        />:null}
                    </View>
                    <Text style={{color: store.data.TextColor}}>结束时间</Text>
                    <View style={{flexDirection: 'row',
                        backgroundColor:'#F6F6F6',
                        width:WIDTH*0.6,
                        marginLeft: 0.1*WIDTH,
                        marginTop:0.048*WIDTH,
                        marginBottom:0.048*WIDTH,
                        borderRadius:0.048*WIDTH,}}>
                        <TouchableOpacity style={{paddingLeft:0.028*WIDTH,height: 0.10*WIDTH,width:WIDTH*0.6,alignItems:'center',justifyContent:'center',}} activeOpacity={0.8} onPress={() =>{setenddateshow(true)}}>
                            <Text style={{color: 'black',fontSize:18}}>{Enddate}</Text>
                        </TouchableOpacity>
                        {enddateshow?<DateTimePicker
                            testID="dateTimePicker"
                            value={Endstrdate}
                            mode="date"
                            minimumDate={new Date(1950, 0, 1)}
                            maximumDate={new Date()}
                            display="spinner"
                            onChange={(event,date)=>{changeEndStrDate(event,date)}}
                        />:null}
                        {endshowtime?<DateTimePicker
                            testID="dateTimePicker"
                            value={Endstrtime}
                            mode="time"
                            minimumDate={new Date(1950, 0, 1)}
                            maximumDate={new Date()}
                            display="spinner"
                            onChange={(event,date)=>{changeEndStrTime(event,date)}}
                        />:null}
                    </View>
                    <TouchableOpacity style={{width:WIDTH*0.6, marginLeft: 0.1*WIDTH,marginTop:0.048*WIDTH,backgroundColor:'#3EADFF',height:50,borderRadius:30,justifyContent: 'center',alignItems:'center'}} activeOpacity={0.6}
                       onPress={() => ReplaySearch(Ceshi['seleceEventdata'])}
                        >
                            {/* <CheckBox style={{flex: 1, padding: 10}} isChecked={true} />  */}
                        <Text style={{color: 'white', letterSpacing: 0,paddingRight:10,fontSize:20}}>查询</Text>
                    </TouchableOpacity>
                  </View>}
            </View>
            </View>
        </View> : null}
    </List.Section>
      <View style={{display: 'flex',flexDirection: 'column'}}>
      <View style={{height: '48%'}}>
      <FlatList 
        // extraData={Data1}
        data={store.data.replayData}
        initialNumToRender={5}
        renderItem={({ item }) => (
          <View style={{width: WIDTH,
              height: 80,
              flexDirection: 'row',
              paddingTop:5,
              paddingBottom:5,
              paddingLeft:10,
              paddingRight:10,}}>
              <View style={{flexDirection: 'column',width: WIDTH,paddingTop:5,
              paddingBottom:5,
              paddingLeft:10,
              paddingRight:10,}}>
                  <View style={styles.ContainerTop}>
                      <View style={styles.ContainerTopLeft}>
                          <Text  style={{fontSize:18,marginLeft:15,color:store.data.TextColor}}>{item.name}</Text>
                      </View>
                      <View style={styles.ContainerTopRight}>
                          {/* {item.state=="true" ? <Text>处理人:{store.data.username}</Text> : <Text style={{color: '#3EADFF'}}>处理人:未处理</Text>} */}
                      </View>
                  </View>
                  <View style={styles.ContainerBottom}>
                      {/* <Text style={{fontSize:12}}>{item.type}</Text> */}
                      <Text style={{color:store.data.TextColor}}>{item.starf.split('+')[0].replace("T"," ")}</Text>
                      <Text style={{color:store.data.TextColor}}>{item.end.split('+')[0].replace("T"," ")}</Text>
                      <TouchableOpacity style={{marginRight:WIDTH * 0.05}} onPress={() =>Refresh1(item)}>
                          <View style={styles.confirmBtn}>
                              <Icon name={'播放'} color={'white'} size={WIDTH * 0.03}/>
                          </View>
                      </TouchableOpacity>
                  </View>
              </View>
          </View>
      )}
        keyExtractor={(item,index) => item.starf+ index.toString()}
      />
      </View>
        <View style={{display:'flex',flexDirection:'row',justifyContent: 'center',marginBottom:20}}>
        </View>
        {store.data.backgroundColor=='#FFFFFF'?
        <View style={{width:'85%',display:'flex',justifyContent:'center'}}>
        <DataTable>
        <DataTable.Pagination
          page={page}
          numberOfPages={Math.ceil(Data.length / numberOfItemsPerPage)}
          onPageChange={page => sizeChange(page)}
          label={<Text style={{color:store.data.TextColor,fontSize:16}}>{`${from}-${to} of ${Data.length}`}</Text>}
          showFastPaginationControls
          numberOfItemsPerPage={pageSize}
          // style={{marginRight:'20%',}}
        />
        </DataTable>
        </View>:
        <View style={{backgroundColor:'rgba(245,245,245,0.5)',width:'95%',display:'flex',justifyContent:'center' }}>
        <DataTable>
        <DataTable.Pagination
          page={page}
          numberOfPages={Math.ceil(Data.length / numberOfItemsPerPage)}
          onPageChange={page => sizeChange(page)}
          label={<Text style={{color:store.data.TextColor,fontSize:16}}>{`${from}-${to} of ${Data.length}`}</Text>}
          showFastPaginationControls
          numberOfItemsPerPage={pageSize}
          // style={{marginRight:'20%',}}
        />
        </DataTable>
        </View>}
        </View>
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
    height: 1700,
    backgroundColor:'#FFFFFF',
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
  ContainerTop:{
    flexDirection: 'row', // View组件默认为纵向布局，这个改为横向布局
    justifyContent: 'space-between', // 等比例间距排列
    paddingTop:5,
    paddingBottom:10,
    borderTopWidth:1,
    borderTopColor:'#CBCBCB'
  },
  ContainerTopLeft:{
      flexDirection: 'row', // View组件默认为纵向布局，这个改为横向布局
      justifyContent: 'space-between', // 等比例间距排列
      alignItems:'center',
  },
  ContainerTopRight:{
      marginRight:WIDTH * 0.03
  },
  ContainerBottom:{
    flexDirection: 'row', // View组件默认为纵向布局，这个改为横向布局
    justifyContent: 'space-between', // 等比例间距排列
    paddingTop:5,
    paddingLeft:25,
  },
  confirmBtn:{
    width: 26,
    height:26,
    backgroundColor: '#3DADFF',
    // borderWidth:1,
    // borderColor:'green',
    // borderStyle:'solid',
    borderRadius:15,
    // paddingTop:1,
    paddingLeft:9,
    justifyContent:'center',
  },
});
export default Replay;