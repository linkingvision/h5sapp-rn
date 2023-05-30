import React ,{useState}from 'react'
import { View, Text ,Animated, Easing} from 'react-native'

export default function Qiu() {
    const [anim_cx,setAnim_cx] = useState(new Animated.Value(0)) 
    const [anim_cy,setAnim_cy] = useState(new Animated.Value(0)) 
    const [anim_px,setAnim_px] = useState(new Animated.Value(0)) 
    const [anim_py,setAnim_py] = useState(new Animated.Value(0)) 



    const [state,setState] = useState({
        identifier:0,
        cx:0,
        cy:0,
        sx:0,
        sy:0,
        px:0,
        py:0,
        dx:0,
        dy:0,
        width:300,
        handler:100,

    })




    const centerAnimate = ()=>{
        Animated.timing(
            anim_cx,
            {
                
            }
        )
    }


    return (
        <View>
            <Text></Text>
        </View>
    )
}
