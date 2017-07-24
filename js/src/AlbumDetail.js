import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    Linking,
    Dimensions,
    TouchableHighlight
  } from 'react-native';
  import Card from './Card';
  import Button from './Button';
  import Share, {ShareSheet} from 'react-native-share';
  import getDirections from 'react-native-google-maps-directions';
  import {Navigator} from 'react-native-deprecated-custom-components';
  import DetailView from './DetailView.js';
  import Communications from 'react-native-communications';
  var width    = Dimensions.get('window').width; //full width
  var height   = Dimensions.get('window').height; //full height
  function distance(lat1, lon1, lat2, lon2) {
    var radlat1 = Math.PI * lat1/180
    var radlat2 = Math.PI * lat2/180
    var theta = lon1-lon2
    var radtheta = Math.PI * theta/180
    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    dist = Math.acos(dist)
    dist = dist * 180/Math.PI
    dist = dist * 60 * 1.1515
    return dist.toFixed(2)
}
function convertHTMLEntity(text){
  // var text = React.createElement("textarea");
  //     text.innerHTML = html;
  //     return text.value;
  /*
    const span = document.createElement('span');

    return text
    .replace(/&[#A-Za-z0-9]+;/gi, (entity,position,text)=> {
        span.innerHTML = entity;
        return span.innerText;
    });*/

    return text;
}

  class AlbumDetail extends Component{
    state = {
      initialLatitude: 'unknown',
      initialLongitude: 'unknown',
      lastLatitude:'unknown',
      lastLongitude:'unknown',
   }
   watchID: ?number = null;

  componentDidMount = () => {
     navigator.geolocation.getCurrentPosition(
        (position) => {
           const initialLatitude = JSON.stringify(position.coords.latitude);
           const initialLongitude = JSON.stringify(position.coords.longitude);
           this.setState({ initialLatitude ,initialLongitude });
        },
        (error) => console.log(error.message),
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
     );

     this.watchID = navigator.geolocation.watchPosition((position) => {

       const lastLatitude = JSON.stringify(position.coords.latitude);
       const lastLongitude = JSON.stringify(position.coords.longitude);
       this.setState({ lastLatitude ,lastLongitude });
     });

  }

  componentWillUnmount = () => {
     navigator.geolocation.clearWatch(this.watchID);
  }

    handleGetDirections = () => {

       const data = {
             source: {
              latitude: parseFloat(this.state.lastLatitude),
              longitude: parseFloat(this.state.lastLongitude)
            },
            destination: {
              latitude:parseFloat(this.props.customer.coordinate.latitude),
              longitude: parseFloat(this.props.customer.coordinate.longitude)
            },
            params: [
              {
                key: "dirflg",
                value: "w"
              }
            ]
          }
          getDirections(data)
        }


    _handleButtonCall = () => {
      Communications.phonecall(this.props.customer.phone, true)
    };

    _handleButtonShare = () => {
      let shareOptions = {
        title: "React Native",
        message: "Island Maps",
        url: this.props.customer.link,
        subject: "Share Link" //  for email
      };
      Share.open(shareOptions).catch((err) => { err && console.log(err); })
    };
    _handleCustomersDetails=()=>{
      this.props.navigator.push({
      name: 'DetailView',
      props:{
        id:this.props.customer.id,
        lat:this.props.customer.coordinate.latitude,
        long:this.props.customer.coordinate.longitude
      }
      })
    }
    render(){

      return(
      <Button onPress={this._handleCustomersDetails}>
      <Card>
        <View style={styles.ListbannerView}>
          <Image style={styles.BannerImg} source={{uri:this.props.customer.banner}}>
            <Text style={styles.ListTitle}>{convertHTMLEntity(this.props.customer.businessname.toUpperCase())} </Text>
          </Image>
        </View>
        <View style={styles.ListBottom}>
          <TouchableHighlight underlayColor = {'transparent'} style={styles.MilesTouch}>
            <View style={styles.MilesTouchView}>
                <Image source={require('../img/ic_pin_list.png')} style={styles.ShareMilesImg} />
                <Text style={styles.ShareMilesText}>{distance(parseFloat(this.props.customer.coordinate.latitude), parseFloat(this.props.customer.coordinate.longitude),parseFloat(this.state.lastLatitude), parseFloat(this.state.lastLongitude))}miles</Text>
            </View>
          </TouchableHighlight>
          <TouchableHighlight underlayColor = {'transparent'} style={styles.ShareTouch}
             onPress={this._handleButtonShare} >
              <View style={styles.ShareTouchView} >
                  <Image source={require('../img/ic_share_list.png')} style={styles.ShareMilesImg} />
                  <Text style={styles.ShareMilesText}>Share</Text>
              </View>
          </TouchableHighlight>
          <View style={styles.ListButtonView}>
            <TouchableHighlight underlayColor = {'transparent'} onPress={this.handleGetDirections}
              style={styles.ListButtonNavTouch}>
                <Image source={require('../img/ic_navigation.png')} style={styles.ImgBtn} />
            </TouchableHighlight>
            <TouchableHighlight underlayColor = {'transparent'} onPress={this._handleButtonCall}
                                style={styles.ListButtonCallTouch}>
              <Image source={require('../img/ic_call.png')} style={styles.ImgBtn}/>
            </TouchableHighlight>
          </View>
        </View>
      </Card>
    </Button>
        );
      }
    }
  const styles = StyleSheet.create({
    headerContentStyle:{
      flexDirection:'row',
      justifyContent:'space-around'
    },
    headerTextStyle :{
      fontSize:18
    },
    ListButtonView:{
      flex:0.5,
      marginRight:7,
      justifyContent:'flex-end',
      flexDirection:'row',
      alignItems:'center',
      marginTop:-30,

    },
    ListbannerView:{
      flex:4,
    },
    BannerImg:{
      height:height/4.5,

      backgroundColor: 'transparent',
    },
    ListTitle:{
      marginTop:50,
      color:'white',
      fontSize:28,
      fontWeight:'bold'
    },

    ListBottom:{
      flexDirection:'row',
      flex:1,
      margin:5,
    },
    ShareMilesImg:{
      width:20,
      height:20,
      marginRight:1,
    },
    ShareMilesText:{
      color:'grey',
      fontSize:12,
    },
    ShareTouch:{
      flexDirection:'row',
      flex:0.25,
    },
    ShareTouchImg:{
      width:20,
      height:20,
    },
    MilesTouchView:{
      flexDirection:'row',
      justifyContent:'flex-start',
      alignItems:'center',
      borderColor:'#cdcdcd',
      borderRightWidth:1,
      paddingRight:3
    },
    ShareTouchView:{
      flexDirection:'row',
      justifyContent:'flex-start',
      alignItems:'center',
      paddingLeft:3
    },


  });
  export default AlbumDetail;
