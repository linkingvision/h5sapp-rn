import React, {Component} from 'react';
import Icon from 'react-native-vector-icons/Feather'
import Icon2 from 'react-native-vector-icons/FontAwesome'
import Icon3 from 'react-native-vector-icons/Ionicons'
import {View,Text,TouchableOpacity} from 'react-native'
import store from '../store/store';
export default class CheckBtn extends Component{
    constructor(props){
        super(props);
        this.state = ({
            setCheckd:false
        })
    }
    
    componentDidMount(){
 
        let flag = this.props.checked;
        this.setState({
            setCheckd:flag
        })
    }
    componentWillReceiveProps(nextProp){
        this.setState({
            setCheckd:nextProp.checked
        })
    }
    shouldComponentUpdate(nextProps, nextState) {
        if (this.props.checked !== nextProps.checked) {
            return true;
        }
        if (this.state.setCheckd !== nextState.setCheckd) {
            return true;
        }
        return false;
    }
    render(){
            return(
                <View style={{flexDirection:'row',alignItems:'center',}}>
                {
                    this.state.setCheckd ?
                    <TouchableOpacity onPress={()=>{
                        this.props.onCheckChange(false);
                        this.setState({
                            setCheckd:false
                        })
                        }}>
                        <Icon2 name='square' size={18} color='#3DADFF' style={{marginTop:12,marginRight:5}}/>
                    </TouchableOpacity>
                    :
                    <TouchableOpacity onPress={()=>{
                        this.props.onCheckChange(true);
                        this.setState({
                            setCheckd:true
                        })
                        }}>
                        {store.data.backgroundColor=='#FFFFFF' ? <Icon name='square' size={18} style={{marginTop:12,marginRight:5}}/>:<Icon3 name='square-outline'  color='#ffffff' size={18} style={{marginTop:12,}}/>}
                    </TouchableOpacity>
                }   
                    {/* <Text style={{marginLeft:6}}>{this.props.label}</Text> */}
                </View>
            )
        }
        
    }