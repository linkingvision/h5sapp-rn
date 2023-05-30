import React, { Component, Fragment } from 'react'
import {View,Text,StyleSheet,Button, Modal,ScrollView,Dimensions,TouchableOpacity,DeviceEventEmitter,Image} from 'react-native'
import Canvas from 'react-native-canvas';
// import styles from './index.less'
export default class timeLinemin extends Component {

  constructor(props) {
    super(props);
    this.state = {
      width: props.width,
      currentTime: props.currentTime,
      videoRecords: props.videoRecords,
      mouseSite: 0,
      tipShow: false,
      allowDarw: true
    };
  }

  componentDidMount() {
    this.timeChange(this.props.width, this.props.currentTime);
    this.addanvasEvent();
  }
  componentDidUpdate(prevProps, prevState, snapshotValue) {
    const { allowDarw } = this.state
    const { width, currentTime } = prevProps
    if (allowDarw) this.timeChange(width, currentTime);
  }
  //props发生变化时触发
  componentWillReceiveProps(props) {
    const { allowDarw } = this.state
    const { width, currentTime } = props
    if (allowDarw) {
      setTimeout(() => {
        this.timeChange(width, currentTime);
      }, 100);
    }

  }
  // canvas事件
  addanvasEvent = () => {
    console.log('监听事件');
    
    const { changCurrentTime } = this.props
    let canvasId = this.time_line_layer
    console.log('canvasId',canvasId)
    let date = null
    canvasId.onmouseleave = e => {

      // tipShow.value = false;
      this.setState({
        tipShow: false,
      })
      if (date !== null) {
        changCurrentTime(date * 1000)
        date = null
      }

      canvasId.onmousemove = e => {
        // this.pointSite(e)
      };

    }
    // 鼠标按下时的位置；
    let start = 0;
    // 鼠标按下时的currentTime
    let oldTime = 0;
    canvasId.onmousedown = e => {
      const { currentTime, width,videoRecords } = this.props
      // allowDarw.value = false;
      this.setState({
        allowDarw: false
      })
      start = e.layerX;
      oldTime = currentTime

      canvasId.onmousemove = e1 => {
        this.setState({
          tipShow: false
        })
        let end = e1.layerX;
        let current = (start - end) * 60 + oldTime;
        // 小于 开始时间或大于结束时间 终止执行
        if(videoRecords[0].beginTime>current||videoRecords[videoRecords.length-1].endTime<=current)return
        this.timeChange(width, current)
        date = current
      }

    }
    canvasId.onmouseup = e => {
      if (date == null) return
      let end = e.layerX;
      let current = (start - end) * 60 + oldTime;
      changCurrentTime(date * 1000)
      this.setState({
        allowDarw: true,
      })
      date = null

      canvasId.onmousemove = e1 => {
        // this.pointSite(e1)
      };
    };

    canvasId.onmousemove = e => {
      // this.pointSite(e)
    }
  }
  // 当前时间改变，重绘刻度，指针，时间
  timeChange = (width, time) => {
    this.carveTimeScale(width, time);
    this.carveVideoScope(width, time);
    this.drawLine(parseInt(width / 2), 25, parseInt(width / 2), 100, '#979EA7', 2)
    // document.getElementById('time_line');
    let canvasId = this.time_line
    
    // console.log(canvasId,1111111111111111111111111111111);
    
    let ctx = canvasId.getContext('2d');
    ctx.font = '12px Arial';
    ctx.fillStyle = "#2F90E5";

    let d = this.getTime(time)

    // ctx.fillText(` ${d[3]}:${d[4]}:${d[5]}`, parseInt(width / 2) - 50, 48)
    // ctx.stroke();

  }
  // 获取时间
  getTime = (timeStamp) => {
    let date = new Date(timeStamp * 1000);
    let year = date.getFullYear();
    let month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
    let currentDate = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    let hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
    let minute = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    let second = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
    return [year, month, currentDate, hour, minute, second];
  }
  // 有视频的区域渲染颜色
  carveVideoScope = (width, currentTime) => {
    console.log(['currentTime'],currentTime);
    
    const { videoRecords, changCurrentTime } = this.props
    
    console.log( videoRecords );
    
    let canvas = this.is_have_video
    
    // console.log(canvas,['绘制有视频区域canvas']);
    
    let ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, width, 50);
    // 当前时间轴包括的时间段；
    let maxTime = currentTime + parseInt(width / 2) * 60;
    let minTime = currentTime - parseInt(width / 2) * 60;
    
    // console.log(maxTime,minTime);
    
    // let videoList = videoRecords.filter(item => {
    //   // console.log(item,111111111111);
      
    //   // console.log(parseInt(item.strStartTime) < maxTime),parseInt(item.endTime) > minTime;
      
    //   return parseInt(item.strStartTime) < maxTime && parseInt(item.endTime) > minTime;
    //   // if (parseInt(item.strStartTime) < maxTime && parseInt(item.endTime) > minTime) {
    //   //   console.log(item);
        
    //   //   return item
    //   // return item
        
    //   // }
      
    // })
    
    // console.log(videoList);
  
    videoRecords.forEach((item,index)=> {
      // 
      // console.log(item);
      // 
      // return
      if (index == 0 && parseInt(item.beginTime) > currentTime) {
        // changCurrentTime(parseInt(item.beginTime) * 1000)
      }
      if (index < videoRecords.length) {
        if(parseInt(item.endTime) < currentTime){
          if(!videoRecords[index + 1]){
                this.setState({
                  allowDarw: false,
                })
          }        
        }
        // if (parseInt(item.endTime) < currentTime && parseInt(videoRecords[index + 1].beginTime) > currentTime) {
        //   changCurrentTime(parseInt(videoRecords[index + 1].beginTime) * 1000)
        //   console.log('第二个-------');
        // }
      } else {
        if (parseInt(item.endTime) < currentTime) {
          changCurrentTime(parseInt(item.endTime) * 1000)
        }
      }
      // console.log(beginTime,endTime);
      
      // let startPoint = (parseInt((starf + width * 60 / 2 - currentTime + currentTime % 60) / 60));
      // let endPoint = parseInt((end + width * 60 / 2 - currentTime + currentTime % 60) / 60);
      
      
      // 起点不能为负数，
      // starf = starf > 0 ? starf : 0;
      // // 终点不能超出时间尺总长度。
      // end = end < width ? end : width;
      console.log(typeof(item.beginTime));
      var start_timestamp = new Date().getTime() - 12*60*60*1000;
      
      console.log(start_timestamp,item.beginTime);
      
      let onePxsMS = width / (24 * 60 * 60 * 1000);
      
      console.log(onePxsMS);
      
     
      
      console.log('开始时间',item.beginTime - start_timestamp);
      
      let beginX = (item.beginTime - start_timestamp) * onePxsMS;
      let w = (item.endTime - item.beginTime)* onePxsMS+1;
      ctx.fillStyle = "#31AFFB";
      ctx.fillRect(beginX, -22, w, 52);
      console.log('渲染',beginX, 0, w, 8);
    });
    return
    // videoList.map((item, index) => {
    //   // console.log(['videoList'],item);
      
    //   // 当当前时间不在有视频区域，自动跳转到下一个视频区域
    //   // 拖拽到小于开始时间时---从开始时间播放
    //   if (index == 0 && parseInt(item.beginTime) > currentTime) {
    //     // changCurrentTime(parseInt(item.beginTime) * 1000)
    //   }
    //   if (index < videoList.length) {
    //     if(parseInt(item.endTime) < currentTime){
    //       if(!videoList[index + 1]){
    //             this.setState({
    //               allowDarw: false,
    //             })
    //       }        
    //     }
    //     // if (parseInt(item.endTime) < currentTime && parseInt(videoList[index + 1].beginTime) > currentTime) {
    //     //   changCurrentTime(parseInt(videoList[index + 1].beginTime) * 1000)
    //     //   console.log('第二个-------');
    //     // }
    //   } else {
    //     if (parseInt(item.endTime) < currentTime) {
    //       changCurrentTime(parseInt(item.endTime) * 1000)
    //     }
    //   }
    //   // console.log(beginTime,endTime);
      
    //   // let startPoint = (parseInt((starf + width * 60 / 2 - currentTime + currentTime % 60) / 60));
    //   // let endPoint = parseInt((end + width * 60 / 2 - currentTime + currentTime % 60) / 60);
      
      
    //   // 起点不能为负数，
    //   // starf = starf > 0 ? starf : 0;
    //   // // 终点不能超出时间尺总长度。
    //   // end = end < width ? end : width;
      
    //   var start_timestamp = new Date().getTime() - 12*60*60*1000;
    //   
    //   console.log(start_timestamp);
    //   
    //   let onePxsMS = width / (6 * 60 * 60 * 1000);
    //   
    //   console.log(onePxsMS);
    //   
    //   let beginX = (item.beginTime - start_timestamp) * onePxsMS;
    //   let w = (item.endTime - item.beginTime)* onePxsMS+1;
    //   ctx.fillStyle = "#31AFFB";
    //   ctx.fillRect(beginX, 0, w, 8);
    //   console.log(beginX, 0, w, 8);
      
    // })
  }
  // 计算时间偏移并画线，时间刻度线，半时短线，小时长线,一像素代表一分钟
  carveTimeScale = (width, currentTime) => {
    
    console.log('zhixinglm');
    
    let canvasId = this.time_line
    let ctx = canvasId.getContext('2d')
    ctx.clearRect(0, 0, width, 50)

    // 将时间戳转为分，再减去到时间轴中部所需分数（为了将指针所指出与startTime时间等同），再取除小时的余数（方便后续刻度显示准确），得到时间戳超过整小时的分数
    let remainder = (parseInt(currentTime / 60) - parseInt(width / 2)) % 60;
    // console.log(remainder);
    for (var i = 0; i < width; i++) {
      // 半时刻度；
      if ((remainder + i) % 30 == 0) {
        this.drawLine(i, 0, i, 10, '#2F90E5', 1)
      }
      // 获取当前刻度的秒数：  当前时间加上当前刻度再减去时间轴一半的时间（当前时间处于时间轴中间），再减去当前时间取小时的余数（方便后续刻度显示准确）
      let ct = currentTime + i * 60 - currentTime % 60 - parseInt(width / 2) * 60;

      // 小时刻度，及显示时间；
      if ((remainder + i) % 60 == 0) {
        this.drawLine(i, 15, i, 40, '#2F90E5', 1)
        let canvasId = this.time_line
        let ctx = canvasId.getContext('2d');
        ctx.font = '12px Arial';
        let d = this.getTime(ct);
        // console.log(d)
        ctx.fillStyle = "#2F90E5";
        ctx.fillText(`${d[3]}:${d[4]}`, i-15, 50);
      }

    }
  }
  // 鼠标指的时间
  pointSite = e => {
    this.setState({
      mouseSite: e.layerX,
      tipShow: true
    })
    // mouseSite.value = e.layerX;
    // tipShow.value = true;
    // let ele = this.tooltip_div
    // ele.style.left = (e.x - 40) + "px";
    // ele.style.top = (e.y - e.layerY - 32) + "px";
      }
  pointTime = () => {
    const { currentTime, width } = this.props
    const { mouseSite } = this.state
    let d = this.getTime(currentTime + mouseSite * 60 - currentTime % 60 - parseInt(width / 2) * 60);
    return `${d[3]}:${d[4]}:${d[5]}`
  }
  // 画线
  drawLine = (beginX, beginY, endX, endY, color, width) => {
    console.log(beginX, beginY, endX, endY, color, width)
    let canvasId = this.time_line
    let ctx = canvasId.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(beginX, beginY);
    ctx.lineTo(endX, endY);
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.stroke();
  }
  onPressIn(evt){
    console.log('====================================');
    console.log('点击开始（手指按下）');
    console.log('====================================');
  }
  onPressOut(evt){
    console.log('====================================');
    console.log('点击结束（手指离开）');
    console.log('====================================');
  }
  onLongPress(evt){
    console.log('====================================');
    console.log('长按点击');
    console.log('====================================');
  }
  onPress(evt){
    console.log('====================================');
    console.log('点击');
    console.log('====================================');
  }
  render() {
    const { width } = this.props
    return (
      <Fragment>
        <View style={{}}>
          {/* 鼠标指针 时间提示*/}
          {/* {tipShow ? <View  ref={(ref) => { this.tooltip_div = ref; }} id='tooltip_div'>{this.pointTime()}</View> : ''} */}
          <Canvas ref={(ref) => { this.is_have_video = ref; }} style={{position: 'absolute',transform: [
          { rotate: '90deg' },{translateY:100}
        ],width:300,height:80}}   id="is_have_video" ></Canvas>
          <Canvas ref={(ref) => { this.time_line = ref; }} id="time_line"  style={{position: 'absolute',transform: [
          { rotate: '90deg' },{translateY:100}
        ],width:300,height:80}} ></Canvas>
        {/* <TouchableOpacity 
          onPressIn={(evt)=>this.onPressIn(evt)}
          onPressOut={(evt)=>this.onPressOut(evt)}
          onLongPress={(evt)=>this.onLongPress(evt)}
          onPress={(evt)=>this.onPress(evt)}> */}
          <Canvas ref={(ref) => { this.time_line_layer = ref; }} id="time_line_layer"  style={{position: 'absolute',transform: [
          { rotate: '90deg' },{translateY:100}
        ],width:300,height:80}} ></Canvas>
        {/* </TouchableOpacity> */}
        </View>

      </Fragment>
    )
  }
}

