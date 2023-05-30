import React,{useState,useEffect} from 'react'



import { View, Text } from 'react-native'








const useTreeState = (data:object[],onChange:Boolean,options={},customReucers={})=> {
    
    const [treeState,setTreeState] = useState(null);

    const [event,setEvent] = useState({
        type:'initalization',
        path:null,
        params:[]
    })
    
    const {
        initCheckedStatus,
        initOpenStatus,
    } = options;

 

}





