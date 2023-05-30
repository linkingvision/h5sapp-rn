import React from 'react'
import {
	Button,
	SafeAreaView,
	StyleSheet,
	ScrollView,
	View,
	Text,
	StatusBar,DeviceEventEmitter
  } from 'react-native';
import { useRef, useState, useEffect, } from 'react';
// import { Colors } from 'react-native/Libraries/NewAppScreen';

import {
	RTCPeerConnection,
	RTCIceCandidate,
	RTCSessionDescription,
	RTCView,
	MediaStream,
	MediaStreamTrack,
	mediaDevices,
	registerGlobals
} from 'react-native-webrtc';
//及时更新
// import useSyncCallback from '../../hooks/useSyncCallback';


//mobx 
import {observer, useLocalObservable, useObserver} from 'mobx-react'
import store from '../../store/store'
import { RootState } from '../../store/index'
import { useSelector, useDispatch } from 'react-redux'
interface Myplayer{
	width:number;
	height:number;
}




const Player3=()=>{
	const videoFour =  useSelector((state: RootState) =>state.replay.videoFour)
	console.log(videoFour,['hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh']);
	// console.log(RootState,11111111111111111111111111111111111);
	

	const [ stream, setStream] = useState(null );
	const [ remoteStream, setRemoteStream ] = useState( null );
	const remoteStreamRef = useRef(remoteStream);
	const [ pc, setPc ] = useState(new RTCPeerConnection());

	const  starttime= new Date()
	// console.log(RootState,11111111111111111111111111111111111);
	
	
	var year = starttime.getFullYear();
	var month = starttime.getMonth() + 1;
	var strDate = starttime.getDate();
	var strDate1 = starttime.getDate()-1;
	var localOffset = Math.abs(starttime.getTimezoneOffset() /60);
	console.log(starttime,year,month,strDate,strDate1,localOffset,['年月日']);
	var timevalues=year+"-"+month+"-"+strDate+"T"+"00:00:00"+"+0"+localOffset+":00";
	var timevalues1=year+"-"+month+"-"+strDate1+"T"+"00:00:00"+"+0"+localOffset+":00";
	var timevaluee=year+"-"+month+"-"+strDate+"T"+"23:59:59"+"+0"+localOffset+":00";
	// const [ ws, setWs ] = useState(
	// 	new WebSocket(
	// 		'ws://192.168.100.105:8080/api/v1/h5srtcapi?token='+''+'&profile=main&session=c1782caf-b670-42d8-ba90-2244d0b0ee83'
	// 	)
	// );
	// const [ws,setWs] = useState(new WebSocket('ws://'+store.data.host+':'+store.data.port+'/api/v1/h5srtcapi?token='+store.data.video2+'&profile=main&session='+store.data.session+''))
	const [ iceConnectionState, setIceConnectionState ] = useState();
	// const url = 'ws://'+'192.168.100.127'+':'+'8080'+'/api/v1/h5srtcapi?token='+'6aa4--0'+'&profile=main&session='+'cd004ffd-5e59-4a40-8096-5e8af4275c72';
	const url = 'ws://'+store.data.host+':'+store.data.port+'/api/v1/h5srtcapi?token='+videoFour+'&playback=true&profile=main&serverpb=true&begintime='+timevalues+'&endtime='+timevaluee+'&filename=fake&session='+store.data.session;
	console.log('====================================');
	console.log(url);
	console.log('====================================');
	const [ws,setWs] = useState(new WebSocket(url))
	// const setT1 = (s) => {
    //     setWs(new WebSocket('ws://192.168.100.105:8080/api/v1/h5srtcapi?token='+s+'&profile=main&session=c1782caf-b670-42d8-ba90-2244d0b0ee83'));
    //     func();
    // }
    // const func = useSyncCallback(() => {
    //    console.log('进去了回调函数')
    // })

	// useEffect(()=>{
	// //对WS进行初始化
	// console.log('ws的值为',ws)
	// setT1(store.data.token)
	// console.log('ws的值为',ws)
	// },[store.data.token])

	useEffect(() => {
		if (ws!= new WebSocket('ws://localhost:8080') ){
		// ws.close()
		ws.onopen = () => {
			console.log('连接开始了');

			let j = {};
			j.type = 'open';
			ws.send(JSON.stringify(j));
			let k = {};
			k.cmd = "H5_START";
			ws.send(JSON.stringify(k));
		};

		ws.onmessage = (msg) => {
			let data = JSON.parse(msg.data);
			console.log('[DATA:]',data);

			switch (data.type) {
				case 'offer':
					console.log('正在进入offer处理');

					handleOffer(data);
					break;
				case 'iceserver':
					console.log('iceserver 进入中······');
					break;
				case 'remoteice':
					console.log('remoteice,进入中里面是', data);
					onRemoteICECandidate(data);
					break;
				// case 'videochanged':

				default:
                    console.log('默认返回')
					break;
			}

			ws.onerror = function(err) {
				console.log('错误是：', err);
			};
		};
		

		// pc.onicecandidate =(event)=> {
		// 	console.log('====================================');
		// 	console.log(event);
		// 	console.log('====================================');
		//     if (event.candidate) {
		//       ws.send(JSON.stringify({
		//         type: 'candidate',
		//         candidate: event.candidate,
		//       }));
		//     }
		//   };

	}
		//  return function clean(){
		// 	 console.log('清除函数已执行');
		// 	 ws.close();
		//  }
		DeviceEventEmitter.addListener('ReplayCloseVideo',(node)=>{
			// setPosterImage(false)
			if (ws.readyState==1) {
				console.log(pc)
				// pc.close();
				ws.close();
				// setPosterImage(false)
				DeviceEventEmitter.emit('loadVideo')
				setTimeout(() => {
					setWs(new WebSocket(url))
				},100)
			}
		})
	},[ws]);

	useEffect(() => {
		pc.onaddstream = (event) => {
			console.log('on add Stream:', event.target._remoteStreams);
			console.log('EVENT.stream：', event.stream);
			setRemoteStream(event.stream);
			remoteStreamRef.current = event.stream;
			console.log('这里是远程流：', JSON.stringify(remoteStream));
		};
	},[remoteStream])

useEffect(()=>{
	console.log('[RS=]',remoteStream);
})
	//下面不是effect
	const handleOffer = async (data) => {
		console.log('handleOffer is running···········');
		// console.log('offer is : ',data);
		try {
			console.log('data是:');
			// pc.oniceconnectionstatechange = onICEConnectionchange(data);
			// pc.onicecandidate = onIceCandidate;
			await pc.setRemoteDescription(new RTCSessionDescription(data));
			const answer = await pc.createAnswer();
			console.log('answer是:', answer);
			await pc.setLocalDescription(answer);
			ws.send(JSON.stringify(answer));
			console.log('发送成功');
		} catch (err) {
			console.log('Offer ERROR :', err);
		}
	};
	//icecandidate部分
	const onRemoteICECandidate = async (data) => {
		if (pc) {
			console.log('进入了onremoteicecandidate这个函数了');
			console.log('====================================');
			console.log(data.sdpMLineIndex,data.sdpMid,data.candidate);
			console.log('====================================');
			// var candidate = new RTCIceCandidate({
			// 	sdpMLineIndex: data.sdpMLineIndex,
			// 	sdpMid: data.sdpMid,
			// 	candidate: data.candidate
			// });
			pc.addIceCandidate(
				new RTCIceCandidate({
					sdpMLineIndex: data.sdpMLineIndex,
					sdpMid: data.sdpMid,
					candidate: data.candidate
				})
			);
			console.log('====================================');
			console.log('====================================');
			// console.log('candidatecandidatecandidatecandidatecandidate',candidate);
			console.log('====================================');
			console.log('pcpcppcppcpcpcppcpc',pc);
			console.log('====================================');
		} else {
			console.log('pc丢失了');
		}
	};
	
	//  ice相关  局域网应该没用
	// const onICEConnectionchange =function on_ICE_Connection_State_Change(e) {
	//     console.info('ICE Connection State Changed:', e.target.iceConnectionState)
	//     setIceConnectionState(e.target.iceConnectionState);
	//     switch (e.target.iceConnectionState) {
	//       case 'closed':
	//       case 'disconnected':
	//       case 'failed':
	//           if (pc){
	//               console.log('pc该关掉了')
	//           }
	//         break
	//     }
	//   }
	return (
		<RTCView objectFit='cover'   streamURL={remoteStream?.toURL()} style={styles.stream} />
	);
};

const styles = StyleSheet.create({
	body:{
		flex:1,
		justifyContent:'center',
		alignItems:'center',
	},
	stream:{
		width: '100%',
		height:'100%'
	}
  });

  export default observer(Player3)