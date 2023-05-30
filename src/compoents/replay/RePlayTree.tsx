import React, { useEffect, useState, useRef, useReducer, useCallback, createContext } from 'react'
import { View, Text, ActivityIndicator, Alert, TextInput, StyleSheet,Dimensions,DeviceEventEmitter } from 'react-native'
import TreeView from 'react-native-final-tree-view'
import axios from 'axios'
import { Button,Divider } from 'react-native-paper';
import useSyncCallback from '../../hooks/useSyncCallback';
import Icon from 'react-native-vector-icons/iconfont';

import store from '../../store/store'
import { observer } from 'mobx-react'

import { RootState } from '../../store/index'
import { useSelector, useDispatch } from 'react-redux'
import { changeName, changeTemp } from '../../redux/ReSlice';
import CheckBtn from '.././CheckBtn'
const WIDTH = Dimensions.get('screen').width;
const HEIGHT = Dimensions.get('screen').height;


const Ceshi = () => {
    // const selectTemp =  useSelector((state: RootState) =>state.replay.temp)
    // console.log(selectTemp,['hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh']);
    const dispatch = useDispatch()
    
    const [flag, setFlag] = useState(false);
    const [treelist, setTreelist] = useState();
    const treeRef = useRef(treelist);
    const [camconf, setCamconf] = useState('')

    const [search, setSearch] = useState('')
    // 全选
    const [checkedEvent,setcheckedEvent] = useState(false)
    // 单选
    const [seleceEventdata,setseleceEventdata] = useState([])

    function selectEvent(checked,data) {
        console.log('====================================');
        console.log(data);
        console.log('====================================');
        if (checked) {
            if (data.strName=="根节点") {
                setcheckedEvent(!checkedEvent)
                // console.log(checkedEvent);
                if (!checkedEvent) {
                    // console.log(seleceEventdata);
                    // console.log(treelist);
                    for (var key in treelist) {
                        // console.log(treelist[key].node);
                        treelist[key].node.map((item)=>{
                            // console.log(item.strToken);
                            seleceEventdata.push(item)
                            
                        })
                        // console.log('true',seleceEventdata);
                    }
                }
            }else{
                seleceEventdata.push(data)
                store.changeReplayToken(seleceEventdata);
                console.log('dantrue',seleceEventdata);
                
            }
        }else{
            if (data.strName=="根节点") {
                setcheckedEvent(!checkedEvent)
                if (checkedEvent) {
                    for (var key in seleceEventdata) {
                        seleceEventdata.splice(key, seleceEventdata.length)
                        // console.log(seleceEventdata);
                        setseleceEventdata([...seleceEventdata])
                        
                    }
                }
            }else{
                console.log(seleceEventdata);
                
                for (var key in seleceEventdata) {
                    if (seleceEventdata[key]==data.strToken) {
                        seleceEventdata.splice(key, 1)
                        console.log('logdamuak,eo,eo',);
                        
                        setseleceEventdata([...seleceEventdata])
                        console.log(seleceEventdata);
                    }
                }
                // console.log(seleceEventdata);
            }
        }
    }
    useEffect(() => {
        console.log(111111111111,'jiushi');
        
        console.log(seleceEventdata);
        store.changeReplayToken(seleceEventdata);
        // store.data.EventToken.push()
        console.log('tokenaaa',store.data.EventToken);
        
    },[checkedEvent]);
    useEffect(() => {

        console.log('122222222222222222222');
        
        store.changeReplayToken(seleceEventdata);
        
    },[seleceEventdata]);

    function getchild(arr, arr1) {
        for (let i in arr.cam) {
            if (!arr.cam[i].strName) {
                for (var j in arr1) {
                    if (arr.cam[i].strToken == arr1[j].strToken) {
                        var node1 = [{
                            strToken: arr1[j].strToken,
                            streamprofile: "main",
                            strName: '主码流',
                            name: arr1[j].strName + "--" + '主码流',
                            iconclass: 'listpng',
                        }, {
                            strToken: arr1[j].strToken,
                            streamprofile: "sub",
                            strName: '辅码流',
                            name: arr1[j].strName + "--" + '辅码流',
                            iconclass: 'listpng',
                        }]
                        arr.cam[i].node = node1;
                        arr.cam[i].strName = arr1[j].strName;
                        arr.cam[i].name = arr1[j].strName + "--" + '主码流';
                        arr.cam[i].bOnline = arr1[j].bOnline;
                        arr.cam[i].iconclass = "shipin"
                        if (!arr1[j].bOnline)
                            arr.cam[i].iconclass = 'mdi mdi-camcorder-off fa-fw';

                        if (arr1[j].nConnectType == 'H5_CLOUD')
                            arr.cam[i].iconclass = 'shipin';

                        if (arr1[j].bRec == true)
                            arr.cam[i].iconclass2 = 'iconfont icon-radioboxfill none';
                    }
                }
            }
        }
        var camarr=[]
        var camarr1=[]
        for(var i in arr.cam){
            camarr.push(arr.cam[i].strToken)
        }
        for(var i in arr1){
            camarr1.push(arr1[i].strToken)
        }
        let diff = camarr.filter(item => !new Set(camarr1).has(item))
        for(var i in arr.cam){
            for(var j in diff){
                if(arr.cam[i].strToken == diff[j]){
                    arr.cam[i].strName = '设备暂时不可用';
                    arr.cam[i].iconclass = 'shipin';
                }
            }
        }
        if (arr.node && arr.node.length > 0) {
            for (let i = 0; i < arr.node.length; i++) {
                arr.node[i] = getchild(arr.node[i], arr1);
            }
        }
        return arr;
    }
    function datapush(data) {
        a(data)
        return data;
    }

    const a = (data) => {
        console.log('datacam:', data.cam);
        if (data.cam.length != 0) {
            for (let i = 0; i < data.cam.length; i++) {
                data.node.unshift(data.cam[i])
            }
        }
        delete data.cam
        if (data.node) {
            for (let i = 0; i < data.node.length; i++) {
                b(data.node[i]);
                let data1 = [];
                data1.unshift(data);
            }
        }
    };
    const b = (data) => {
        if (data.cam) {
            for (let i = 0; i < data.cam.length; i++) {
                if (data.node) {
                    data.node.unshift(data.cam[i])
                }
            }
        }
        delete data.cam;
        if (data.node) {
            for (let i = 0; i < data.node.length; i++) {
                if (data.node[i].node) {
                    c(data.node[i])
                }
            }
        }
    };
    const c = (data) => {
        if (data.cam) {
            for (let i = 0; i < data.cam.length; i++) {
                if (data.node) {
                    data.node.unshift(data.cam[i])
                }
            }
            delete data.cam;
            if (data.node) {
                for (let i = 0; i < data.node.length; i++) {
                    if (data.node[i].node) {
                        d(data.node[i])
                    }
                }
            }
        }
    }


    const d = (data) => {
        if (data.cam) {
            for (let i = 0; i < data.cam.length; i++) {
                if (data.node) {
                    data.node.unshift(data.cam[i])
                }
            }
            delete data.cam;
            if (data.node) {
                for (let i = 0; i < data.node.length; i++) {
                    if (data.node[i].node) {
                        e(data.node[i])
                    }
                }
            }
        }
    }

    const e = (data) => {
        if (data.cam) {
            for (let i = 0; i < data.cam.length; i++) {
                if (data.node) {
                    data.node.unshift(data.cam[i])
                }
            }
            delete data.cam;
            
        }
    }
    //Ceshi

    const changeName = (arr) => {
        let a = JSON.stringify(arr).replace(/cam/g, "node")
        let b = JSON.parse(a);
        return b;
    }

    //展开
    function getIndicator(isExpanded, hasChildrenNodes,node) {
        if (!hasChildrenNodes) {
            if (node.iconclass) {
                return <Icon name={'下拉圆点'} color={store.data.TextColor} size={20}/>
            }else{
                return <View>
                    <Icon name={'区域'} color={store.data.TextColor} size={20} style={{marginLeft: 42,}}/>
                </View>
            }
        } else if (isExpanded) {
            return <View style={{display:'flex',flexDirection: 'row',alignItems: 'center', }}>
                <Icon name={'方向-01'} color={store.data.TextColor} size={20} style={{marginTop:10,}}></Icon>
                <CheckBtn checked={checkedEvent} onCheckChange={(value)=> selectEvent(value,node)}></CheckBtn>
                {node.strToken=='root'||(!node['bOnline']&&!node['iconclass']) ?<Icon name={'区域'} color={store.data.TextColor} size={18} style={{marginTop:10,}}/>:<Icon name={'视频'} color={store.data.TextColor} size={20} style={{marginTop:10,}}/>}
            </View>
        } else {
            return <View style={{display:'flex',flexDirection: 'row',alignItems: 'center'}}>
                <Icon name={'方向-03'} color={store.data.TextColor} size={20} style={{marginTop:10,}}></Icon>
                <CheckBtn checked={checkedEvent} onCheckChange={(value)=>selectEvent(value,node)}></CheckBtn>
                {node.strToken=='root'||(!node['bOnline']&&!node['iconclass']) ?<Icon name={'区域'} color={store.data.TextColor} size={18} style={{marginTop:10,}}/>:<Icon name={'视频'} color={store.data.TextColor} size={20} style={{marginTop:10,}}/>}
            </View> 
        }
    }



    const setT = (data) => {
        setTreelist(data);
        func();
    }
    const func = useSyncCallback(() => {
        console.log('callback:', treelist);
    });

    const fuzzySearch1 = (tree, search) => {

        const treeToList = (tree) => {
            let n, result = tree.map(n => (n.level = 1, n))
            for (let i = 0; i < result.length; i++) {
                if (!result[i].node) continue
                let list = result[i].node.map(n => (n.level = result[i].level + 1, n))
                result.splice(i + 1, 0, ...list)
            }
            return result
        }
        let arr1 = [];
        arr1 = treeToList(tree);
        // let newarr = arr1.filter(result => result.strName != undefined);
        let newarr1 = [];
        newarr1 = arr1.filter(result => result.strName.includes(search));

        return newarr1;
    }

    const filterTree = (tree = [], map = [], arr = []) => {
        if (!tree.length) return [];//为空的情况
        for (let item of tree) {
            //筛选条件
            // console.log('我进来了筛选',JSON.stringify(item))
            console.log('名字是：', map.includes(item.strName))
            //如果不在判断数组中并且没有孩子节点
            if (!map.includes(item.strName) && !item.node) continue;

            let node1 = { ...item, node: [] }
            console.log('node1111', node1)
            arr.push(node1)

            if (item.node && item.node.length) filterTree(item.node, map, node1.node)
        }
        return arr

    }

    useEffect(() => {
        axios.get(store.data.https+'://'+ store.data.host + ':' + store.data.port + '/api/v1/GetRegion?session=' + store.data.session + '')
            .then(function (response) {
                console.log('数据', response)
                let oldarr = response.data.root;
                let oldarr1 = response.data.src;


                let dataroot = getchild(oldarr, oldarr1);
                console.log('原始数据', JSON.stringify(dataroot));
                let nodelist = datapush(dataroot);
                let nodelist2 = [];
                // let obj = {  "node": nodelist.node }
                let obj = { "strName": '根节点', "strToken": nodelist.strToken, "node": nodelist.node }

                nodelist2.push(obj);

                // let nodelist3 = JSON.parse(JSON.stringify(nodelist2));
                // let nodelist4 = changeName(nodelist3)
                if (search != '') {
                    let nodelist5 = [];
                    setT(nodelist5);
                    nodelist5 = fuzzySearch1(nodelist2, search);
                    setT(nodelist5)
                    // let arr1 = []
                    // for (let data of nodelist5)
                    //     {
                    //         let strName = data.strName
                    //         arr1.push(strName)
                    //     }
                    // console.log('这里是arr1',arr1)
                    // let nodelist6 = filterTree(nodelist4, arr1)
                    // console.log('这里是nodelist111',nodelist6)

                    console.log('nodelist5:', nodelist5)
                } else {
                    setTreelist([]);
                    setT(nodelist2);
                    console.log('nodelist4:', nodelist2)
                }


            }).catch(error => { console.error(error) })

    }, [search])




    return (
        <View style={{backgroundColor: store.data.backgroundColor}}>
            {console.log(WIDTH,'Pingmukuanku')}
            <Divider/>
            <View style={{flexDirection: 'row',
                backgroundColor:store.data.backgroundColor,
                width:WIDTH*0.6,
                marginLeft: 0.06*WIDTH,
                marginTop:0.048*WIDTH,
                marginBottom:0.048*WIDTH,
                borderRadius:0.048*WIDTH,}}>
                <Icon style={{alignSelf: 'center',paddingLeft:10}} name={'搜索'} color={store.data.TextColor} size={20}/>
                <TextInput style={{paddingLeft:0.048*WIDTH, fontSize:0.033*WIDTH, height: 0.12*WIDTH,color:store.data.TextColor,}} placeholderTextColor={store.data.TextColor}  placeholder="请输入关键字进行检索" value={search} onChangeText={(value) => { setSearch(value); console.log(search) }}></TextInput>
             
            </View>
            <Divider/>
            {/* <span>{selectTemp}</span> */}
            {treelist ? <View style={styles.tree}>
                <TreeView
                    data={treelist} // defined above
                    getCollapsedNodeHeight={() => 32}
                    renderNode={({ node, level, isExpanded, hasChildrenNodes }) => {
                        return (
                            <View style={{flexDirection:'row',justifyContent:'space-between',}}>
                                <View style={{}}>
                                <Text
                                    style={{
                                        marginLeft: 0.06*WIDTH * level,
                                        marginRight: 0.06*WIDTH * level,
                                        lineHeight:32,
                                        fontFamily:'',
                                        fontSize:16,
                                        color: store.data.TextColor
                                    }}
                                >
                                    {getIndicator(isExpanded, hasChildrenNodes,node)} {node.strName}
                                </Text>
                                </View>
                                {/* <CheckBtn checked={checkedEvent} onCheckChange={(value)=>
                                    selectEvent(value,node)
                                } ></CheckBtn> */}
                            </View>
                        )
                    }}

                    onNodePress={({ node, level }) => {
                        setCamconf(camconf => node.strToken)
                        // store.changeTemp(node.strToken)
                        // store.getCamname(node.strName)
                        if (node.strToken!='root') {
                           dispatch(changeTemp(node.strToken))
                        }
                        // dispatch(selectTemp(node.strName))}
                        if (node.strToken!='root'&&node.iconclass||node.streamprofile) {
                            // storeData(node.strToken)
                            // DeviceEventEmitter.emit('Replaytoken',node);
                        }
                        // if(store.data.v1 = false) {
                        //     store.changev1()
                        //     store.changeVideo1(store.data.temp)
                        // }
                        // else if (store.data.v2 = false) {
                        //     store.changev2();
                        //     store.changeVideo2(store.data.temp)
                        // }
                        // else if (store.data.v3 = false) {
                        //     store.changev3();
                        //     store.changeVideo3(store.data.temp)
                        // }
                        // else if (store.data.v4 = false) {
                        //     store.changev4();
                        //     store.changeVideo4(store.data.temp)
                        // }
                    }}

                    idKey="strToken"
                    childrenKey="node"
                />
            </View> : <ActivityIndicator size="large" color="#0000ff" />}
        </View>
    )
}
const styles = StyleSheet.create({
    box:{
        backgroundColor: 'white'
    },
    container: {
        flexDirection: 'row',
        backgroundColor:'#eeeeee',
        width:WIDTH*0.9,
        marginLeft: 0.06*WIDTH,
        marginTop:0.048*WIDTH,
        marginBottom:0.048*WIDTH,
        borderRadius:0.048*WIDTH,
    },
    search: {
        paddingLeft:0.048*WIDTH,
        fontSize:0.043*WIDTH,
        height: 0.12*WIDTH,

    },
    tree: {
        marginTop:0.048*WIDTH,
        paddingLeft: 0.125*WIDTH,
    }
})



export default observer(Ceshi)