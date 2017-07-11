
import React, {Component} from 'react';
import {
StyleSheet,
View,
Text,Navigator,
TouchableOpacity,
TouchableHighlight,
ListView,Dimensions,
Image,Alert,ScrollView,
Linking
} from 'react-native';

import Listing from './Listing.js';
import ContactUs from './ContactUs.js';
import Share, {ShareSheet} from 'react-native-share';




export default class SideMenu extends Component {


_pressListing = () => {

  this.props.navigator.push({
  name: 'Listing', // Matches route.name
  });
};

_pressShare = () => {
  let shareOptions = {
      title: "React Native",
      message: "Island Map",
      url: "https://itunes.apple.com/in/app/whatsapp-messenger/id310633997?mt=8",
      subject: "Share Link" //  for email
    };

  Share.open(shareOptions).catch((err) => { err && console.log(err); })

};

_pressRate = () => {

Linking.openURL('https://itunes.apple.com/in/app/whatsapp-messenger/id310633997?mt=8').catch(err => console.error('An error occurred', err));
};

_pressContact = () => {
  this.props.navigator.push({
  name: 'ContactUs', // Matches route.name
  });

};

constructor() {
   super();
   const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
   this.state = {
     dataSource: ds.cloneWithRows(['row 1']),
   };
 }


render() {
    return (
      <View style={styles.container}>
      <Image source={require('../img/bg.png')} style={{height:height, width:width,}}>

      <ScrollView style={styles.scrollview}>
          <View style={styles.MainView}>
            <TouchableHighlight underlayColor = {'transparent'} onPress={this._pressListing}
                                style={styles.MainViewItem}>
                  <View style={styles.MainItemList} >
                      <Image source={require('../img/Listview.png')} style={styles.Listimg}/>
                      <Text style={styles.Listtxt}>Listings</Text>
                  </View>
               </TouchableHighlight>

               <TouchableHighlight underlayColor = {'transparent'} style={styles.MainViewItem}
                                  onPress={this._pressShare}>
                 <View style={styles.MainItemList}>
                     <Image source={require('../img/Share.png')} style={styles.Listimg}/>
                     <Text style={styles.Listtxt}>Share this App</Text>
                 </View>
              </TouchableHighlight>

               <TouchableHighlight underlayColor = {'transparent'} style={styles.MainViewItem}
                                    onPress={this._pressRate}>
                 <View style={styles.MainItemList}>
                     <Image source={require('../img/Rate.png')} style={styles.Listimg}/>
                     <Text style={styles.Listtxt}>Rate this App</Text>
                 </View>
              </TouchableHighlight>
               <TouchableHighlight underlayColor = {'transparent'} style={styles.MainViewItem}
                                    onPress={this._pressContact}>
                 <View style={styles.MainItemList}>
                     <Image source={require('../img/Contact.png')} style={styles.Listimg} />
                     <Text style={styles.Listtxt}>Contact Us</Text>
                 </View>
              </TouchableHighlight>
          </View>
      </ScrollView>
      </Image>
      </View>

        )
    }
}

var width    = Dimensions.get('window').width; //full width
var height   = Dimensions.get('window').height; //full height

const styles = StyleSheet.create({
// main
container: {
  flex:9,
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  backgroundColor: '#60c9c5',


},
ImgView: {
  flex:0.5,
  width:width,
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor:'#abfeea',
},
MainView: {
  flex:1,

},
ImgDrawer:
{
  width:width/3.05,
  height:height/3.05,
  marginRight:width/4,
},
scrollview:{
  height:20,
width:width/1.1,
},
MainViewItem: {
  padding:11,
  paddingLeft:20,
  flex:0.2,
  borderColor:'white',
  borderBottomWidth:0.5,
  width:width,
},
MainItemList: {
  flexDirection:'row',
  justifyContent:'flex-start',
  alignItems:'center',
},
Listimg: {
  width: 20,
  height: 20,

},

Listtxt:
{
  paddingLeft: 15,
  color:'white',
  fontSize:16,
  padding:5,
},
totaltxt:
{
  margin:25,
  flexDirection:'row',
  backgroundColor: '#59acb2',
},
txtview:
{
  flexDirection:'row',
  justifyContent:'flex-start',
  alignItems:'center',
},
img:
{
  width:15,
  height:15,
  marginRight:9,
},
txt:
{
  color:'white',
}

})
