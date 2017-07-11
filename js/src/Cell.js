import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  Image,
  View,
  TouchableHighlight
} from 'react-native';


export default class Cell extends Component {
  constructor(props){
    super(props);
  }
  render(){
    console.log('////////////Cell/////////////////'+ this.props.item);
    return(
      <View style={{backgroundColor:'red', margin:10}}>
          <TouchableHighlight >
            <Text style={{color: 'white',
            marginRight:1.5,
            marginLeft:1.5,
            backgroundColor:'red',
            }}>
            Hi
            {this.props.item}
            </Text>
          </TouchableHighlight>
      </View>

    );
  }
}
