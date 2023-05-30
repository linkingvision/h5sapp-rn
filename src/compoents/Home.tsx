import React from 'react'
import { View, Text ,TouchableOpacity,Button,StyleSheet} from 'react-native'

export default function Home({navigation}) {
    return (
        <View>
            <TouchableOpacity  style={styles.loginBtn} onPress={() => navigation.navigate('Login')}>
                <Text style={styles.loginText}>主页跳转测试</Text>
            </TouchableOpacity>
            <TouchableOpacity  style={styles.loginBtn} onPress={() => navigation.navigate('Player')}>
                <Text style={styles.loginText}>视频拉流</Text>
            </TouchableOpacity>
            <TouchableOpacity  style={styles.loginBtn} onPress={() => navigation.navigate('Push')}>
                <Text style={styles.loginText}>视频推流</Text>
            </TouchableOpacity>
            <TouchableOpacity  style={styles.loginBtn} onPress={() => navigation.navigate('BottomNavigator')}>
                <Text style={styles.loginText}>测试页面</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    loginBtn: {
        width: "80%",
        borderRadius: 25,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 40,
        backgroundColor: "green",
      },
      loginText:{
        textAlign: 'center',
        color: 'white',
        textAlignVertical: 'center',
      }
})
