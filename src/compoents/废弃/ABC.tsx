import React, { useState ,useEffect} from 'react';
import { View, Text, StyleSheet ,Image} from 'react-native';
import { Button } from 'react-native-paper';
import Player from '../Player';

import axios from 'axios';







export default function ABC() {
  const [playern, setPlayern] = useState(false);
  const [root, setRoot] = useState([]);
  const [camdata,setCamdata] = useState([]);
  const [btn,setBtn] = useState(false);

  function getchild(arr,arr1) {
    for(let i in arr.cam){
        if(!arr.cam[i].strName){
            for(var j in arr1){
                if(arr.cam[i].strToken == arr1[j].strToken){
                    var node1=[{
                        strToken : arr1[j].strToken,
                        streamprofile : "main",
                        strName :'主码流',
                        name:arr1[j].strName+"--"+'主码流',
                        iconclass : 'listpng',
                    },{
                        strToken : arr1[j].strToken,
                        streamprofile : "sub",
                        strName :'辅码流',
                        name:arr1[j].strName+"--"+'辅码流',
                        iconclass : 'listpng',
                    }]
                    arr.cam[i].node=node1;
                    arr.cam[i].strName = arr1[j].strName;
                    arr.cam[i].name=arr1[j].strName+"--"+'主码流',
                    arr.cam[i].bOnline = arr1[j].bOnline;
                    arr.cam[i].iconclass="listpng2"
                    if(!arr1[j].bOnline)
                        arr.cam[i].iconclass = 'mdi mdi-camcorder-off fa-fw';

                    if(arr1[j].nConnectType == 'H5_CLOUD')
                        arr.cam[i].iconclass = 'listpng2';

                    if(arr1[j].bRec == true)
                        arr.cam[i].iconclass2  = 'iconfont icon-radioboxfill none';
                }
            }
        }
    }
    if(arr.node && arr.node.length>0){
        for (let i = 0; i < arr.node.length; i++) {
            arr.node[i] =getchild(arr.node[i],arr1);
        }
    }
    return arr;
}


  useEffect(() => {
    axios.get('http://192.168.100.105:8080/api/v1/GetRegion?session=90437319-3521-49ef-9684-53c5bc7ab7a4')
    .then(function (response){
      console.log('数据',response)
      setRoot(response.data.root)
      console.log('啊沙发沙发是:',root)

      let oldarr=response.data.root;
      let oldarr1=response.data.src;
      let dataroot=getchild(oldarr,oldarr1);
      console.log('老的数据',camdata)
      console.log('dataroot:',dataroot)
      console.log('新的data',JSON.stringify(dataroot))
   

    }).catch(error => {console.error(error)})
  
  },[btn])


  return (
<View>

  {/* 判断显示数量 */}
    { playern  ? 
      <View style={styles.box1}>
    	<View style={styles.item}>
      <Player />
    </View>
      <View style={styles.item}>
        <Player />
      </View>
      <View style={styles.item}>
        <Player />
      </View>
      <View style={styles.item}>
        <Player />
      </View>
      </View> : 
      <View style={styles.box1}>
        <View style={styles.item1}>
        
        </View>
      </View>
      }

      <Button onPress={()=>{
        setBtn(!btn)
      }}>点击换人</Button>


{/* <TreeSelect
            data={camdata}
            // isOpen
            // openIds={['A01']}
            
            isShowTreeId={false}
            // selectType="single"
            itemStyle={{
              // backgroudColor: '#8bb0ee',
              fontSize: 12,
              color: '#995962'
            }}
            selectedItemStyle={{
              fontSize: 16,
              color: '#171e99'
            }}
            
           
            treeNodeStyle={{
              openIcon: <Icon size={18} color="#171e99" style={{ marginRight: 10 }} name="arrow-down" />,
              closeIcon: <Icon size={18} color="#171e99" style={{ marginRight: 10 }} name="arrow-forward" />
           
            }}
          /> */}

	</View>



    



	);
}

const styles = StyleSheet.create({
  box1: {
    width: 411,
    marginTop: 25,
    marginBottom: 5,
    marginLeft: 5,
    marginRight: 5,
    backgroundColor: 'black', // 背景色为红色
    flexDirection: 'row', // View组件默认为纵向布局，这个改为横向布局
    flexWrap: 'wrap', // 宽度不足，可以换行
    justifyContent: 'space-around', // 等比例间距排列
    borderRadius: 5, // 设置圆角
    padding: 5
  },
  item: {
    width: 400 / 2,
    height: 100,
    backgroundColor: 'black',
    borderColor: 'white',
    borderWidth: 1,
  },
  item1:{
    width:400,
    height:200,
    backgroundColor: 'black',
    borderColor: 'white',
    borderWidth: 1,
}
  
});
