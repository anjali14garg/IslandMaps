import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity
  } from 'react-native';
  const Button = ({onPress,children}) =>{
    return(
      <TouchableOpacity onPress={onPress} underlayColor = {'transparent'} style={styles.buttonStyle}>
        <View>
        {children}
        </View>
      </TouchableOpacity>
    );
  };
  const styles=StyleSheet.create({
    buttonStyle:{
      flex:1,
    }
  });
  export default Button;
