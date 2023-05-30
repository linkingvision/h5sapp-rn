//store
import { makeAutoObservable } from "mobx";


const store = makeAutoObservable({
    data:{
        token : '1',
        temp:'',
        host:'',
        port:'18085',
        username:'',
        session:'',
        flag1:false,
        password:'',
        camname:'',
        video1:'',
        video2:'',
        video3:'',
        video4:'',
        h5svision:'',
        advanch:false,
        EventToken:[],
        streamprofile:'',
        https:'',
        replayToken:[],
        RefreshToken:'',
        RefreshStart:'',
        RefreshEnd:'',
        timelink:0,
        backgroundColor:'#FFFFFF',
        TextColor:'#111111',
        DarkMode:false,
        replayData:[],
    },
  

    //登录获取的系列
  
    getLoginName(name){
        this.data.username = name
    },
    getLoginPassword(password){
        this.data.password = password
    },
    getLoginSession(session){
        this.data.session = session
    },
    getLoginIp(ip){
        this.data.host = ip
    },
    getLoginPort(port){
        this.data.port = port
    },
    getPassword(password){
        this.data.password =password
    }
    ,
    getCamname(camname){
        this.data.camname = camname
    },
    changeToken(val){
        this.data.token =val
    },
    changeVideo1(val){
        this.data.video1 = val
    },
    changeVideo2(val){
        this.data.video2= val
    },
    changeVideo3(val){
        this.data.video3 = val
    },
    changeVideo4(val){
        this.data.video4 = val
    },
    changeTemp(val){
        this.data.temp = val
    },
    changeFlag(){
        this.data.flag1 = !this.data.flag1
    },
    changeEventToken(val){
        this.data.EventToken=val
    },
    changeStreamprofile(val){
        this.data.streamprofile=val
    },
    getLoginHttps(val){
        this.data.https = val
    },
    changeReplayToken(val){
        this.data.replayToken=val
    },
    changeRefreshToken(val){
        this.data.RefreshToken=val
    },
    changeRefreshStart(val){
        this.data.RefreshStart=val
    },
    changeRefreshEnd(val){
        this.data.RefreshEnd=val
    },
    changeTimelink(val){
        this.data.timelink=val
    },
    changeBackgroundColor(val){
        this.data.backgroundColor=val
    },
    changeTextColor(val){
        this.data.TextColor=val
    },
    changeDarkMode(val){
        this.data.DarkMode=val
    },
    changeReplayData(val){
        this.data.replayData=val
    },
    
    setDefault(){
        this.data.username = '';
        this.data.session = '';
        this.data.host = '';
        this.data.port = '18085';
        this.data.token = '1';
        this.data.temp = '';
        this.data.password = '';
        this.data.https = '';
        this.data.replayData=[];
    },
  
    //action
})


export default store