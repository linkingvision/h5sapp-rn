import React from 'react'
import { View, Text,StyleSheet } from 'react-native'
import axios from 'axios'
import store from '../store/store';
import { observer } from 'mobx-react'

const PreSet= ()=> {
    return (
        <View style={styles.container}>
            <Text>1</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor:'blue'
    }
})

export default observer(PreSet)