import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet
  } from 'react-native';
  class Card extends Component{
    constructor(props){
    super();
    }

    render(){
      return(
        <View style={styles.containerStyle} >
          {this.props.children}
        </View>
      );
    }
    }
    const styles = StyleSheet.create({
      containerStyle:{
        borderWidth:1,
        borderRadius:2,
        borderColor:'#ddd',
        borderBottomWidth:0,
        shadowColor:'#000',
        shadowOffset: {width:0, height: 2},
        shadowOpacity: 0.2,
        shadowRadius:2,
        elevation:2,
        position:'relative',
        marginLeft:5,
        marginRight:10,
        marginTop:10
      },

    });


    export default Card;
