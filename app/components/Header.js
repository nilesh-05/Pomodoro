import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

const Header = () => {
    return (
        <Text style={styles.heading}>Pomodoro Timer</Text>       
    )
}
export default Header

const styles = StyleSheet.create({
    heading:{
        fontSize: 24,
        alignSelf:'center',
        justifyContent: 'center'
    }
})
