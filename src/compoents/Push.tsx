import React,{useState,useEffect, useRef} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import WebSocketClient from 'reconnecting-websocket';
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


export default function Push() {
    const  [localStream,setLocalStream] = useState(null);
    const [ ws, setWs ] = useState(
		new WebSocketClient(
			'ws://192.168.100.105:8080/api/v1/h5srtcpushapi?token=user1&type=media&audio=true&session=c1782caf-b670-42d8-ba90-2244d0b0ee83'
		)
	);
    const [pc,setPc] = useState(new RTCPeerConnection());
    const localStreamRef = useRef(localStream);
    const mediaConstraints = {
        mandatory: {
          'offerToReceiveAudio': false,
          'offerToReceiveVideo': false,
        }
  }

    //添加流

    useEffect(() => {
            //添加流
        const Add = async()=>{
            let isFront = true;
            const devices = await mediaDevices.enumerateDevices();
            const facing = isFront ? 'front' : 'environment';
            const videoSourceId = devices.find(device => device.kind === 'video' && device.facing === facing);
            const facingMode = isFront ? 'user' : 'environment';
            const valueparam={
                mandatory: {
                //   minWidth:720,// Provide your own width, height and frame rate here
                  maxWidth:640,
                //   minHeight:480,
                  maxHeight:480,
                //   minFrameRate: 30,
                },
                facingMode,
                optional: videoSourceId ? [{sourceId: videoSourceId}] : [],
              }
            const constraints = {
                audio:true,
                video:valueparam,
            };
    
            const newStream = await mediaDevices.getUserMedia(constraints);
            setLocalStream(newStream);
            pc.addStream(newStream);
            localStreamRef.current = newStream;
            console.log('新stream：',newStream)
            console.log('localstream:',localStream)
            console.log('REF.current:',localStreamRef.current)
            
        }
       Add();
    },[pc])
    
useEffect(()=>{
    console.log('第二个EFFECT');
    //ws连接开始
    ws.onopen = () => {
        let j = {};
        j.type = 'open';
        console.log(j);
        ws.send(JSON.stringify(j));
        console.log('连接过程开始了哦');
    };
    //开始处理接受到的信息
    ws.onmessage = (msg) => {
        let data = JSON.parse(msg.data);
        console.log('data:', data);

        switch (data.type) {
            case 'iceserver':
                console.log('进入了iceserver');
                if(localStreamRef.current){
                    console.log('流不为空，可以进入下个过程')
                    handleProcess();
                }else{
                    console.log('媒体流没进来')
                }
                break;
            case 'answer':
                console.log('进入了answer');
                handleAnswer(data);
                break;
            case 'remoteice':
                console.log('进入了remoteice');
                handleRemoteice(data);
                break;
            default:
                console.log('默认返回');
                break;
        }}

//函数，应该都放里面
const handleProcess = async ()=>{
    console.log('handleProcess is running -----------------------');
    
    const offer = await pc.createOffer(mediaConstraints);
    console.log('offer1:',offer);
    pc.setLocalDescription(offer);
    ws.send(JSON.stringify(offer));
}

const handleAnswer = async(data)=>{
    console.log('进来了answer处理');
    await pc.setRemoteDescription(new RTCSessionDescription(data));
    console.log('answer处理完了');
};

const handleRemoteice = async (data) =>{
    console.log('进入了remoteice处理');
    await pc.addIceCandidate(new RTCIceCandidate({
        sdpMLineIndex: data.sdpMLineIndex,
        sdpMid: data.sdpMid,
        candidate: data.candidate
        }))
}



},[ws])



    return (

            <RTCView
            style={styles.stream}
			  streamURL={localStream?.toURL()}
			 />

    )
}
const styles = StyleSheet.create({
	stream:{
		flex: 1,
	}
  });

