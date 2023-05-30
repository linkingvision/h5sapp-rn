import React ,{ useEffect ,useState} from 'react'
import { View, Text, ScrollView, StyleSheet, FlatList, StatusBar, SafeAreaView ,TouchableOpacity,Dimensions,Image,TextInput,Alert} from 'react-native'
import { Avatar, Chip, List, Colors, Button, Menu, Divider, Provider, RadioButton } from 'react-native-paper'
import axios from 'axios';
import { observer } from 'mobx-react';
import store from '../store/store';
import Icon from 'react-native-vector-icons/iconfont';
// import H5sAppVision from "./src/compoents/H5sAppVision";
import CheckBox from 'react-native-check-box';
// import CheckBox from './CheckBox '
import ScrollableTabView, { ScrollableTabBar, DefaultTabBar } from 'react-native-scrollable-tab-view';
import Ceshi from "./EventTree";
import DateTimePicker from "@react-native-community/datetimepicker"
import CheckBtn from './CheckBtn'
const WIDTH = Dimensions.get('screen').width;
const HEIGHT = Dimensions.get('screen').height;
var EventTableLength = '';
const Event=()=> {
    const [Data,setData]=useState([])
    const [Data1,setData1]=useState([]);
    const [ cardHeight, setcardHeight ] = useState(50);
    const [ cardOpenOff, setcardOpenOff ] = useState('center');
    const [ a, setA ] = useState(true);
    const [ b, setB ] = useState(false);
    const [tokenColor,setTokenColor] = useState('#3EADFF');
    const [TimeColor,setTimeColor] = useState('black');
    const [changTokencolor1,setchangTokencolor1] = useState('#3EADFF');
    const [changTimecolor1,setchangTimecolor1] = useState('white');
    const [EventContainer,setEventContainer] = useState(10);
    // 事件头部
    const [EventHeader,setEventHeader] = useState(true)
    // 全选
    const [checkedEvent,setcheckedEvent] = useState(false)
    // 单选
    const [seleceEventdata,setseleceEventdata] = useState([])
    // 事件底部
    const [EventFooter,setEventFooter] = useState(true)
    // const date1 = new Date();
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
    function handleClickCard() {
        cardHeight==50?setcardHeight(HEIGHT*0.7):setcardHeight(50);
        cardOpenOff=='center'?setcardOpenOff('flex-start'):setcardOpenOff('center');
    }
    function changeToken(){
        setA(true);
        setTokenColor('#3EADFF');
        setTimeColor('black');
        setchangTokencolor1('#3EADFF');
        setchangTimecolor1('white');
    }
    function changeTime(){
        setA(false);
        setTokenColor('black');
        setTimeColor('#3EADFF');
        setchangTokencolor1('white');
        setchangTimecolor1('#3EADFF');
    }
    function handleEvent(){
        EventContainer==10?setEventContainer(40):setEventContainer(10);
        setB(!b);
        setEventHeader(false)
        setEventFooter(false)
    }
    function CancelEvent(){
        setB(!b);
        setEventHeader(true)
        setEventFooter(true)
        if (checkedEvent) {
            setcheckedEvent(false)
        }
        setseleceEventdata([]);
    }
    function selectAllEvent(){
        setcheckedEvent(!checkedEvent)
        if (!checkedEvent) {
            if (seleceEventdata.length>0) {
                for (var key in seleceEventdata) {
                    seleceEventdata.splice(key, seleceEventdata.length)
                }
            }else{
                for (var key in Data) {
                    seleceEventdata.push(Data[key])
                    // console.log('true',seleceEventdata);
                }
            }
        }else{
            for (var key in seleceEventdata) {
                seleceEventdata.splice(key, seleceEventdata.length)
            }
        }
    }
    useEffect(() => {
        setseleceEventdata(seleceEventdata)
    },[checkedEvent]);
    function selectEvent(checked,data) {
        if (checked) {
            seleceEventdata.push(data)
        }else{
            for (var key in seleceEventdata) {
                if (seleceEventdata[key]['Uuid']==data.Uuid) {
                    seleceEventdata.splice(key, 1)
                }
            }
        }
        console.log(seleceEventdata);
    }
    // 查询事件
    function eventSearch(data) {
        var starttimevalues=date.replace('  ','T')+'%2B08:00';
        var endtimevalues = Enddate.replace('  ','T')+'%2B08:00';
        var url = ''
        if (Data.length>0) {
            Data.splice(0, Data.length);
            console.log('不为空');
        }else{
            console.log('空的');
        }
        if (store.data.EventToken.length>0) {
            for (const key in store.data.EventToken) {
                url=store.data.https+'://'+store.data.host+':'+store.data.port+"/api/v2/GetEventList?token=" +store.data.EventToken[key]+"&startTime=" + encodeURIComponent(starttimevalues) + "&endTime=" + encodeURIComponent(endtimevalues) +'&limit=32'+'&session='+store.data.session;
                axios.get(url).then(function(result) {
                    if (result.status == 200) {
                        if(result.data){
                            setTimeout(() => {
                                EventTableLength = result.data.length;
                                for (let i = 0; i < result.data.length; i++) {
                                    const data = result.data[i];
                                    Data.push(data);
                                }
                            }, 500);
                        }
                    }
                })
                .catch((error) => {
                    console.log('错误1', error);
                });
            }
        }else {
            url=store.data.https+'://'+store.data.host+':'+store.data.port+"/api/v2/GetEventList?startTime=" + encodeURIComponent(starttimevalues) + "&endTime=" + encodeURIComponent(endtimevalues) + '&session='+store.data.session+'&limit=32';
            axios.get(url).then(function(result) {
                if (result.status == 200) {
                    if (Data.length>0) {
                        for (var key in Data) {
                            Data.splice(key, Data.length)
                        }
                    }
                    EventTableLength = result.data.length;
                    for (let i = 0; i < result.data.length; i++) {
                        const data = result.data[i];
                        Data.push(data);
                    }
                }
            })
            .catch((error) => {
                console.log('错误1', error);
            });
        }
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
    // 全部处理
    const Handler =()=>{
        for (let i = 0; i < seleceEventdata.length; i++) {
            axios.get(store.data.https+'://'+store.data.host+':'+store.data.port+'/api/v2/Handler?uuid='+seleceEventdata[i].Uuid+"&handler=" + store.data.username +'&session='+store.data.session).then((response)=>{
                if (response.status == 200) {
                    if (response.data.data==true) {
                        let tabledata = {
                            Desc : seleceEventdata[i].Desc,
                            Handler : store.data.username,
                            Id : seleceEventdata[i].Id,
                            Name : seleceEventdata[i].Name,
                            Priority : seleceEventdata[i].Priority,
                            State : true,
                            StrTime : seleceEventdata[i].StrTime,
                            Token : seleceEventdata[i].Token,
                            Type : seleceEventdata[i].Type,
                            Uuid : seleceEventdata[i].Uuid,
                        };
                        setTimeout(() => {
                            Data.map((key,index)=>{
                                if (key.Uuid==seleceEventdata[i].Uuid) {
                                    setData1([...Data]);
                                    Data1.splice(index, 1, tabledata);
                                    console.log(Data1);
                                    setData(Data1);
                                }
                            })
                        }, 1000);
                    }
                }
            })
        }
    }
    // 确认单个处理
    function ConfirmEvent(name,type,uuid,itme){
        Alert.alert(name,`${type}是否已得到解决`,[{text:"取消"},{text:"确认",onPress: () => 
            axios.get(store.data.https+'://'+store.data.host+':'+store.data.port+'/api/v2/Handler?uuid='+uuid+"&handler=" + store.data.username +'&session='+store.data.session).then((response)=>{
                if (response.status == 200) {
                    if (response.data.data==true) {
                        let tabledata = {
                            Desc : itme.Desc,
                            Handler : store.data.username,
                            Id : itme.Id,
                            Name : itme.Name,
                            Priority : itme.Priority,
                            State : true,
                            StrTime : itme.StrTime,
                            Token : itme.Token,
                            Type : itme.Type,
                            Uuid : itme.Uuid,
                        };
                        Data.map((key,index)=>{
                            if (key.Uuid==uuid) {
                                let _items = [...Data];
                                _items.splice(index, 1, tabledata);
                                setData(_items);
                            }
                        })
                    }
                }
            })
        }]);
    }
    return (
        // <View>
            
            <SafeAreaView style={{flex: 1,
                backgroundColor:store.data.backgroundColor,}}>
                {/* <ScrollView> */}
                    <FlatList
                        ListHeaderComponent={
                            <>
                                {EventHeader?
                                    <View style={styles.header}>
                                        <Text style={styles.headerText}>全部事件  ({EventTableLength?EventTableLength:0})</Text>
                                        {/* <Button style={{ paddingRight:10,backgroundColor: 'white',}}   compact={true} mode="contained" onPress={() =>handleEvent()}>
                                            处理
                                        </Button> */}
                                        <TouchableOpacity activeOpacity={0.5}
                                            onPress={() =>handleEvent()} 
                                            >
                                                {/* <CheckBox style={{flex: 1, padding: 10}} isChecked={true} />  */}
                                            <Text style={{color: '#3EADFF', letterSpacing: 0,paddingRight:10,fontSize:20}}>处理</Text>
                                        </TouchableOpacity>
                                    </View>
                                    :<View style={styles.header}>
                                        
                                    <TouchableOpacity activeOpacity={0.5}
                                        onPress={() =>selectAllEvent()} 
                                        >
                                            {/* <CheckBox style={{flex: 1, padding: 10}} isChecked={true} />  */}
                                        <Text style={{color: '#3EADFF', letterSpacing: 0,paddingRight:10,fontSize:20}}>全选</Text>
                                    </TouchableOpacity>
                                    <Text style={styles.headerText}>选择事件</Text>
                                    <TouchableOpacity activeOpacity={0.5}
                                        onPress={() =>CancelEvent()} 
                                        >
                                            {/* <CheckBox style={{flex: 1, padding: 10}} isChecked={true} />  */}
                                        <Text style={{color: '#3EADFF', letterSpacing: 0,paddingRight:10,fontSize:20}}>取消</Text>
                                    </TouchableOpacity>
                                </View>}
                                <Divider/>
                                <View style={styles.TopSearch}>
                                    <Icon style={{alignSelf: 'center',paddingLeft:10}} name={'搜索'} color={'black'} size={25}/>
                                    <TextInput style={styles.search}  placeholder="搜索事件"  onChangeText={(value) => { }}></TextInput>
                                </View>
                                {/* <Divider/> */}
                            </>
                        }
                        data={Data}
                        renderItem={({ item }) => (
                            <View style={{width: WIDTH,
                                height: 80,
                                flexDirection: 'row',
                                paddingTop:5,
                                paddingBottom:5,
                                paddingLeft:10,
                                paddingRight:10,}}>
                                {b?
                                // <CheckBox
                                //     style={{height: 80,LineHeight:80,justifyContent: 'center',alignItems:'center'}}
                                //     isChecked={item.ischecked}
                                //     onClick={()=>onClick(item)}
                                //     // leftText='1' 
                                //     checkedImage={ <Icon name={'收藏夹'} size={20}/>}
                                //     unCheckedImage={<Icon name={'星'}  size={20}/>}
                                // />
                                <CheckBtn checked={checkedEvent} onCheckChange={(value)=>
                                    selectEvent(value,item)
                                }></CheckBtn>
                                : null}
                                <View style={{flexDirection: 'column',width: WIDTH,paddingTop:5,
                                paddingBottom:5,
                                paddingLeft:10,
                                paddingRight:10,}}>
                                    <View style={styles.ContainerTop}>
                                        <View style={styles.ContainerTopLeft}>
                                            {item.Priority=="middle" ? <View style={{width: 10,height:10,backgroundColor: '#FFE25C',borderRadius:5}}></View> : <View style={{width: 10,height:10,backgroundColor: '#8FC31F',borderRadius:5}}></View>}
                                            <Text  style={{fontSize:18,marginLeft:15,color: store.data.TextColor}}>{item.Name}</Text>
                                        </View>
                                        <View style={styles.ContainerTopRight}>
                                            {item.State==true? <Text>处理人:{store.data.username}</Text> : <Text style={{color: '#3EADFF'}}>处理人:未处理</Text>}
                                        </View>
                                    </View>
                                    <View style={styles.ContainerBottom}>
                                        <Text style={{fontSize:12,color: store.data.TextColor}}>{item.Type}</Text>
                                        <Text style={{color: store.data.TextColor}}>{item.StrTime.split('+')[0].replace("T"," ")}</Text>
                                        {item.State=="true" ?<TouchableOpacity  style={{marginRight:WIDTH * 0.05}}> 
                                            <View style={{width: 26, height:26, backgroundColor: 'white', borderRadius:15,borderWidth:1,borderColor:'#3DADFF',borderStyle:'solid',paddingLeft:9, justifyContent:'center'}}>
                                                <Icon name={'箭头 (1)'} color={'#3DADFF'} size={WIDTH * 0.03}/>
                                            </View>
                                        </TouchableOpacity> :<TouchableOpacity onPress={() => ConfirmEvent(item.Name,item.Type,item.Uuid,item)} style={{marginRight:WIDTH * 0.05}}>
                                            <View style={styles.confirmBtn}>
                                                <Icon name={'箭头 (1)'} color={'white'} size={WIDTH * 0.03}/>
                                            </View>
                                        </TouchableOpacity>}
                                    </View>
                                </View>
                            </View>
                        )}
                        keyExtractor={ (item, index) => item.Uuid + index.toString()}
                    />
                    {EventFooter?<View style={{width:WIDTH,
                        height:cardHeight,
                        zIndex: 9999,
                        flexDirection: 'column',
                        justifyContent: cardOpenOff,
                        alignItems: 'center',
                        borderWidth:1,
                        borderColor:'#3DADFF',
                        borderStyle:'solid',
                        borderBottomWidth: 0,
                        borderTopLeftRadius:20,
                        borderTopRightRadius:20}}>
                        <TouchableOpacity onPress={() => handleClickCard()}>
                            <View style={{ width:WIDTH,height:50,flexDirection: 'column',justifyContent: 'center',alignItems:'center'}} >
                                <View style={styles.Card1}></View>
                                <View style={styles.Card2}></View>
                                <View style={styles.Card3}></View>
                            </View>
                        </TouchableOpacity>
                        {cardHeight==50?null:
                        <View style={{justifyContent: 'flex-start',width:WIDTH,paddingLeft:20,marginTop:0.048*WIDTH,}}>
                            <View style={{flexDirection: 'row',justifyContent: 'flex-start'}}>
                                <TouchableOpacity style={{height:30,borderBottomColor:changTokencolor1,borderBottomWidth:2}} activeOpacity={0.8} onPress={() =>changeToken()} >
                                    <Text style={{color: store.data.TextColor, letterSpacing: 0,paddingRight:10,fontSize:20,marginLeft:10,}}>设备</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{height:30,borderBottomColor:changTimecolor1,borderBottomWidth:2,marginLeft:20}} activeOpacity={0.8} onPress={() => changeTime()}>
                                    <Text style={{color: store.data.TextColor,marginLeft:10, letterSpacing: 0,paddingRight:10,fontSize:20}}>时间</Text>
                                </TouchableOpacity>
                            </View>
                            <View>
                            <View>{a ? 
                                <View>
                                    <ScrollView>
                                    {/* <View style={styles.TopSearch}>
                                        <Icon style={{alignSelf: 'center'}} name={'搜索'} color={'black'} size={25}/>
                                        <TextInput style={styles.search}  placeholder="搜索事件"  onChangeText={(value) => { }}></TextInput>
                                    </View> */}
                                    <Ceshi />
                                    </ScrollView>
                                </View>
                                 : <View style={{marginTop:0.1*WIDTH,marginLeft: 0.04*WIDTH,}}>
                                     {/* <DatePicker
                                            style={{width: 200}}
                                            data={date}
                                            mode="datetime"
                                            format="YYYY-MM-DD HH:mm"
                                            confirmBtnText="确定"
                                            cancelBtnText="取消"
                                            showIcon={false}
                                            onDateChange={(date) => {console.log(date);
                                             }}
                                            /> */}
                                    <Text style={{color: store.data.TextColor}}>开始时间</Text>
                                    <View style={{ flexDirection: 'row',
                                        backgroundColor:'#eeeeee',
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
                                        backgroundColor:'#eeeeee',
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
                                        onPress={() => eventSearch(Ceshi['seleceEventdata'])}
                                        >
                                            {/* <CheckBox style={{flex: 1, padding: 10}} isChecked={true} />  */}
                                        <Text style={{color: 'white', letterSpacing: 0,paddingRight:10,fontSize:20}}>查询</Text>
                                    </TouchableOpacity>
                                 </View>}
                            </View>
                            </View>
                        </View>}
                    </View>
                    :<View style={{flexDirection:'column',justifyContent:'center',alignItems:'center',borderTopWidth:1,
                    borderTopColor:'#CBCBCB',padding:10}}>
                        <TouchableOpacity activeOpacity={0.5} onPress={() =>Handler()}>
                            <View style={{marginLeft:10}}>
                                <Icon name={'全选'} color={'black'} size={WIDTH * 0.06}/>
                            </View>
                            <Text style={{color: 'black',fontSize:WIDTH * 0.03}}>全部处理</Text>
                        </TouchableOpacity>
                    </View>}
                {/* </ScrollView> */}
            </SafeAreaView>
        // </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        // marginTop: StatusBar.currentHeight || 0,
        backgroundColor:'white',
    },
    header:{
        width: WIDTH,
        marginBottom: 5,
        marginLeft: 5,
        marginRight: 5,
        flexDirection: 'row', // View组件默认为纵向布局，这个改为横向布局
        flexWrap: 'wrap', // 宽度不足，可以换行
        justifyContent: 'space-between', // 等比例间距排列
        padding: 10,
        fontSize:16,
    },
    headerText:{
        color: '#3EADFF',
        fontSize:20,
    },
    TopSearch: {
        flexDirection: 'row',
        backgroundColor:'#eeeeee',
        width:WIDTH*0.9,
        marginLeft: 0.06*WIDTH,
        marginTop:0.048*WIDTH,
        marginBottom:0.048*WIDTH,
        borderRadius:0.048*WIDTH,
    },
    search: {
        paddingLeft:0.028*WIDTH,
        fontSize:0.043*WIDTH,
        height: 0.10*WIDTH,
    },
    // EventContainer:{
        // width: WIDTH,
        // height: 80,
        // flexDirection: 'column',
        // paddingTop:5,
        // paddingBottom:5,
        // paddingLeft:10,
        // paddingRight:10,
        // alignItems:'center',
    // },
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
    // changeTokenTimeCard:{
    // },
    Card1:{
        width:WIDTH*0.13,
        height:5,
        borderBottomColor:'#D9D9D9',
        borderBottomWidth: 1,
    },
    Card2:{
        width:WIDTH*0.13,
        height:5,
        borderBottomColor:'#D9D9D9',
        borderBottomWidth: 1,
    },
    Card3:{
        width:WIDTH*0.13,
        height:5,
        borderBottomColor:'#D9D9D9',
        borderBottomWidth: 1,
    }
})

export default observer(Event)