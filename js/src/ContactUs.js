/**
* SplashScreen
* 启动屏
* from：http://www.devio.org
* Author:CrazyCodeBoy
* GitHub:https://github.com/crazycodeboy
* Email:crazycodeboy@gmail.com
* @flow
*/
//'use strict';

import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Alert,
  TouchableOpacity,
  TouchableHighlight,
  ListView,
  TextInput,
  Linking,
  ScrollView,
  Image,
  Dimensions,
  BackHandler, Keyboard
} from 'react-native';



import Drawer from 'react-native-drawer';
import SideMenu from './SideMenu.js';
import DetailView from './DetailView.js';
import axios from 'axios';


export default class ContactUs extends Component {

  state = {
    drawerOpen: false,
    drawerDisabled: false,
    email: '',
    name: '',
    contact: '',
    knowCompany:'',
    loading: false
  };

  closeControlPanel = () => {
    this._drawer.close()
  };

  openControlPanel = () => {
    if(this._drawer.open() == true)
    {
      this._drawer.close()
    }
    else if(this._drawer.close() == true)
    {
      Alert.alert(
        'Button pressed!',
        'You did it!',
      );
      this._drawer.open()
    }

  };

  constructor() {
    super();
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2, r3) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows(['row 1', 'row 2','row 3']),
    };
  }
  componentWillMount() {
    this.keyboardDidHideListener = Keyboard.addListener('keyboardWillHide', this.keyboardDidHide.bind(this))
}

componentWillUnmount() {
    this.keyboardDidHideListener.remove()
}

keyboardDidHide(e) {
    this.refs.scrollView.scrollTo({y: 0});
}

  _handleButtonPress = () => {

  axios.post('https://islandmapwp-teamarmentum.c9users.io/wp-json/business/v2/contact_us/?name='+this.state.name+'&email='+this.state.email+'&phone='+this.state.contact+'&content='+this.state.knowCompany)
  .then(function (response) {
    if(response.status=='200'){
      Alert.alert(
        'Submit',
        'Details Sucessfully Submitted!',
      );
    }
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });
  this.setState({
    email:'',
    name:'',
    contact:'',
    knowCompany:''
  })

  };

  _buttonClick = () => {
    if (navigator && navigator.getCurrentRoutes().length > 1){
      navigator.pop();
      return true; //avoid closing the app
    }
    return false; //close the app
  };
  scrolldown(ref) {
    const self = this;
    this.refs[ref].measure((ox, oy, width, height, px, py) => {
        self.refs.scrollView.scrollTo({y: oy -10});
    });
}
  render() {
    return (
      <View style={styles.container}>
          <View style={styles.header}>
          <View style={styles.statusbar}></View>
            <View style={styles.headerTitle}>
      <View style={styles.headerNavImg}>
      <TouchableHighlight underlayColor ={'transparent'} style={styles.hNavImg} onPress={this.props.navigator.pop} >
      <Image source={require('../img/Back.png')} style={styles.BackImg} />
      </TouchableHighlight>
      </View>
      <View style={styles.headerTitleName}>
      <Text style={styles.hTitleName}>Contact Us</Text>
      </View>
      <View style={styles.headerNavImg}>
      <TouchableHighlight underlayColor = {'transparent'} onPress={() => {this.openControlPanel()}}
      style={styles.hNavImg}>
      <Image source={require('../img/ic_menu_list.png')} style={styles.NavImg} />
      </TouchableHighlight>
      </View>
      </View>
      </View>

      <View style={styles.MiddleScroll}>
      <Drawer
      ref={(ref) => this._drawer = ref}
      type="overlay"
      side="right"
      content={<SideMenu navigator={this.props.navigator}/>}
      tapToClose={true}
      openDrawerOffset={0.25}
      panCloseMask={0.25}
      closedDrawerOffset={-5}
      styles={{ drawer: {shadowColor: '#59acb2', shadowOpacity: 0.8, shadowRadius: 3}, }}
      tweenHandler={(ratio) => ({ main:{ opacity:(2-ratio)/2 } })}>

      <View style={styles.MainImgView}>
      <Image source={require('../img/yoga.png')} style={styles.Img}/>
      </View>
      <View style={styles.MainView}>
      <ScrollView ref="scrollView" showsVerticalScrollIndicator={true} automaticallyAdjustContentInsets={false} keyboardDismissMode='on-drag' >
      <Text style={styles.txt}>{'enter your name'.toUpperCase()}</Text>
      <TextInput returnKeyType="next"
                 keyboardType="default"
                 maxLength = {30}
                 underlineColorAndroid='transparent'
                 style={styles.txtinput}
                 value={this.state.name}
                 onChangeText={name => this.setState({ name })}
                 />

      <Text style={styles.txt}>{'enter email id'.toUpperCase()}</Text>
      <TextInput returnKeyType="next"
                 keyboardType="email-address"
                 maxLength={40}
                 underlineColorAndroid='transparent'
                 style={styles.txtinput}
                 value={this.state.email}
                 onChangeText={email => this.setState({ email })}
                 />

      <Text style={styles.txt}>{'enter contact number'.toUpperCase()}</Text>
      <TextInput returnKeyType="next"
                 keyboardType="phone-pad"
                 maxLength = {20}
                 underlineColorAndroid='transparent'
                 style={styles.txtinput}
                 value={this.state.contact}
                 onChangeText={contact => this.setState({ contact })}
                />

      <Text style={styles.txt}>{'let us know about your company'.toUpperCase()}</Text>
      <TextInput multiline ={true}
                 ref="comments"
                 keyboardType="default"
                 maxLength={200}
                 onFocus={this.scrolldown.bind(this,'comments')}
                 numberOfLines={7}
                 underlineColorAndroid='transparent'
                 style={styles.txtarea}
                 value={this.state.knowCompany}
                 onChangeText={knowCompany => this.setState({ knowCompany })}
                 />
</ScrollView>

      <TouchableHighlight style={styles.touchSubmit} position={'fixed'} onPress={this._handleButtonPress}>
      <Text style={styles.submittxt}>Submit</Text>
      </TouchableHighlight>

      </View>
      </Drawer>
      </View>
      </View>
    )}
  }
  var width    = Dimensions.get('window').width; //full width
  var height   = Dimensions.get('window').height; //full height
  const styles = StyleSheet.create({
    // main
    container: {
        flex: 10,
        backgroundColor: '#59acb2',
      },
    header:{
         flex:1.0,
      },
      statusbar:{
        height:20,
        borderColor:'white',
        borderBottomWidth:0.5,
      },
    headerTitle:{
      flex:0.8,
      backgroundColor: '#59acb2',
      justifyContent:'center',
      flexDirection:'row',
      borderColor:'white',
    },
    headerTitleName:{
      flex:0.8,
      justifyContent:'center',
    },
    hTitleName:{

      alignSelf:'center',
      fontSize:22,
      fontWeight:'400',
      color:'white',
    },
    BackImg:{

      width:18,
      height:18,
      marginLeft:8,
    },
    headerNavImg:{
      flex:0.1,
      justifyContent:'center',
    },
    hNavImg:{
      flex:0.1,
      justifyContent:'center',
    },
    NavImg:{

      width:25,
      height:25,
    },
    MiddleScroll:{
      flex:9.2,
      backgroundColor:'white',
    },
    MainImgView:{
      flex:2.5,
    },
    Img:{
      width:width,
      flex:2,
    },
    MainView:{
      backgroundColor:'white',
      width:width,
      flex:7.3,
      paddingLeft:10,
      paddingRight:10,

      paddingBottom:10
    },
    txt:{
      margin:7,
      color:'#3d3d3d',
      fontSize:11,
    },
    txtarea:{
      paddingLeft:7,
      height:height/5,
      borderColor:'gray',
      borderWidth:0.5,
      borderRadius:4,
      color:'#3d3d3d',
      fontSize:16,
    },
    txtinput:{
      paddingLeft:7,
      height:40,
      borderColor:'gray',
      borderWidth:0.5,
      borderRadius:4,
      color:'#3d3d3d',
    },
    touchSubmit:{
      marginTop:10,
      height:46.5,
      justifyContent:'center',
      alignItems:'center',
      backgroundColor:'#ee5748',
      borderColor:'#ee5748',
      borderWidth:0.2,
      borderRadius:4,
      bottom:0,
    },
    submittxt:{

      color:'white',
      fontSize:18,
    },

  })
