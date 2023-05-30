import React from 'react'
import {
	Button,
	SafeAreaView,
	StyleSheet,
	ScrollView,
	View,
	Text,
	StatusBar,DeviceEventEmitter,Image
  } from 'react-native';
import { useRef, useState, useEffect,createContext, useContext,useMemo } from 'react';
import { Colors } from 'react-native/Libraries/NewAppScreen';

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
import useSyncCallback from '../hooks/useSyncCallback';


//mobx 
import {observer, useLocalObservable, useObserver} from 'mobx-react'
import store from '../store/store'
import axios from 'axios'

interface Myplayer{
	width:number;
	height:number;
}


const Player=(config)=>{

	const [remoteVideoViewSnapshotOption,setRemoteVideoViewSnapshotOption] = useState (null)
	const [ stream, setStream] = useState(null );
	const [ remoteStream, setRemoteStream ] = useState( null );
	const remoteStreamRef = useRef(remoteStream);
	const [ pc, setPc ] = useState(new RTCPeerConnection());
	// const [ ws, setWs ] = useState(
	// 	new WebSocket(
	// 		'ws://192.168.100.105:8080/api/v1/h5srtcapi?token='+''+'&profile=main&session=c1782caf-b670-42d8-ba90-2244d0b0ee83'
	// 	)
	// );
	var url = '';
	if (store.data.https=="http") {
		url = 'ws://'+store.data.host+':'+store.data.port+'/api/v1/h5srtcapi?token='+store.data.video1+'&hevc=true'+'&profile='+store.data.streamprofile+'&session='+store.data.session+''
	}else{
		url = 'wss://'+store.data.host+':'+store.data.port+'/api/v1/h5srtcapi?token='+store.data.video1+'&hevc=true'+'&profile='+store.data.streamprofile+'&session='+store.data.session+''
	}
	
	console.log('====================================');
	console.log(url);
	console.log('====================================');
	var [ws,setWs] = useState(new WebSocket(url))
	console.log('====================================');
	// console.log(ws);
	console.log('====================================');
	const [ iceConnectionState, setIceConnectionState ] = useState();
	// const ws = new WebSocket('ws://'+store.data.host+':'+store.data.port+'/api/v1/h5srtcapi?token='+store.data.token+'&profile=main&session='+store.data.session+'')
	const [posterImage,setPosterImage] =useState(false);
	const changeImage = () => {
    setPosterImage(false)
  }
	useEffect(() => {
		console.log('====================================');
		console.log(posterImage);
		console.log('====================================');
	},[posterImage])
	DeviceEventEmitter.addListener('WebRTCViewSnapshotResult', onWebRTCViewSnapshotResult);

function	onWebRTCViewSnapshotResult(data) {
		// --- reset option after we got event. It's okey to not reset, since it will trigger a new screenshot as long as props did change again. (likely use shallow compare.)
		setRemoteVideoViewSnapshotOption(null)
		if (data) {
				// --- failed
				console.log(data);
				console.log('====================================');
				// console.log(data.error);
				console.log('====================================');
		}
		if (data) {
			console.log(111);
			
				// --- saved file path
		}
}

 async function onPressTakeSnapshot() {
		// if (PlatformOS.platform === 'android') {
						// --- check required permission, in the case of cameraRoll, you need: READ/WRITE EXTERNAL STORAGE permission
						// let hasEnoughPermission = await checkScreenshotPermission();
						// if (!hasEnoughPermission) {
						// 		return false;
						// }
						// --- if snapshotOption != null and changed, the remote RTCView will trigger snapshot once and fire an event for result.
						let snapshotOption = {
								id: 1234, // --- use any value you think it's unique for each screenshot
								saveTarget: 'cameraRoll',
						};
						setRemoteVideoViewSnapshotOption(snapshotOption)
						// this.setState({ remoteVideoViewSnapshotOption: snapshotOption });
		// }
}

	useEffect(() => {
		if (ws!= new WebSocket('ws://localhost:8080') ){
			console.log(ws);
			
		setPosterImage(true)
		// ws.close()
		ws.onopen = () => {
			console.log('连接开始了');

			let j = {};
			j.type = 'open';
			ws.send(JSON.stringify(j));
		};

		ws.onmessage = (msg) => {
			// http://localhost:8080/api/v1/GetImage?token=dbc1--33&session=6211e2bb-9316-4e33-962a-b57d28366e96&refresh=123279
			// axios.get('http://' + store.data.host + ':' + store.data.port + '/api/v1/GetImage?token='+store.data.video1+'&session=' + store.data.session).then(function (res) {
			// 	console.log('====================================');
			// 	console.log(url);
			// 	console.log(res);
			// 	console.log('====================================');
			// }).catch(function (err) {
			// 	console.log(err);
				console.log('http://' + store.data.host + ':' + store.data.port + '/api/v1/GetImage?token='+store.data.video1+'&session=' + store.data.session);
			// })
			let data = JSON.parse(msg.data);
			console.log(data);
			if (data.type=='videochanged') {
				changeImage()
				DeviceEventEmitter.emit('hideImage');
				DeviceEventEmitter.emit('browse');
			}
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
		

		// pc.onicecandidate = event => {
		//     if (event.candidate) {
		//       ws.send(JSON.stringify({
		//         type: 'candidate',
		//         candidate: event.candidate,
		//       }));
		//     }
		//   };

	}
	DeviceEventEmitter.addListener('allClose',(node)=>{
		console.log('====================================');
		console.log(node,'全部关闭11111');
		console.log('====================================');
		ws.close();
		setPosterImage(false)
	})
	DeviceEventEmitter.addListener('CloseVideo',(node)=>{
		// setPosterImage(false)
		if (ws.readyState==1) {
			console.log(pc)
			// pc.close();
			ws.close();
			setPosterImage(false)
			console.log(pc)
			console.log(ws);
			console.log('====================================');
			console.log('dierci',store.data.video1);
			console.log('====================================');
			console.log(ws);
			console.log('第二个',url)
			console.log('PeerConnection',pc);
			DeviceEventEmitter.emit('loadVideo')
			setTimeout(() => {
				setWs(new WebSocket(url))
			},100)
		}
	})
}, [JSON.stringify(ws)]);

	useEffect(() => {
		pc.onaddstream = (event) => {
			console.log('on add Stream:', event.target._remoteStreams);
			console.log('EVENT.stream：', event.stream);
			setRemoteStream(event.stream);
			remoteStreamRef.current = event.stream;
			console.log('这里是远程流：', JSON.stringify(remoteStream));
		};
	},[])
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
			pc.addIceCandidate(
				new RTCIceCandidate({
					sdpMLineIndex: data.sdpMLineIndex,
					sdpMid: data.sdpMid,
					candidate: data.candidate
				})
			);
		} else {
			console.log('pc丢失了');
		}
	};
	useEffect(() => {
		// pc.onFirstFrame = (event) => {
		// 	console.log('视频第一帧回调',11111111111111111);
			
		// };
	},[])
	function onSnapshot(event = {}) {
    if (event.error) {
      console.log('onSnapshot error', event.error);
      return;
    }

    console.log('Screenshot added', event.uri);
  }

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
		
		<RTCView objectFit='contain' streamURL={remoteStream?.toURL()} style={styles.stream}  onSnapshot={()=>{onSnapshot}}/>

		// <View style={{width: '100%', height: '100%'}}>
		// {posterImage ? <Image source={{
		// 	uri: 'http://' + store.data.host + ':' + store.data.port + '/api/v1/GetImage?token='+store.data.video1+'&session=' + store.data.session+' '}} resizeMode='contain' style={{width: '100%', height: '100%'}} />: <RTCView objectFit='cover' streamURL={remoteStream?.toURL()} style={styles.stream} onFirstFrame={() => {console.log('视频第一');
		// 	}}/>	}
		// </View>
	);
};

const styles = StyleSheet.create({
	body:{
		flex:1,
		justifyContent:'center',
		alignItems:'center',
	},
	stream:{
		flex:1,
	}
  });

  export default observer(Player)