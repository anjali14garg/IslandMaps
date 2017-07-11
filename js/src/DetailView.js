import React, {Component, PropTypes} from 'react';
import {
StyleSheet,
View,
Text,
TouchableOpacity,
TouchableHighlight,
Image,
ListView,
Alert,
Dimensions,
Button,
ScrollView,
BackHandler,
Platform,
} from 'react-native'
import {
  Navigator
} from 'react-native-deprecated-custom-components';
import ViewMoreText from 'react-native-view-more-text';
import ReadMore from '@expo/react-native-read-more-text';
import Share, {ShareSheet} from 'react-native-share';
import Drawer from 'react-native-drawer';
import SideMenu from './SideMenu.js';
import Listing from './Listing.js';
import MapViews from './MapViews.js';
import getDirections from 'react-native-google-maps-directions';
import Communications from 'react-native-communications';
import axios from 'axios';
import AlbumDetail from './AlbumDetail';
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
export default class DetailView extends Component {

  state = {
    customerDetail:[],
    nearByPlaces:[],
    drawerOpen: false,
    drawerDisabled: false,

    initialLatitude: 'unknown',
    initialLongitude: 'unknown',
    lastLatitude:'unknown',
    lastLongitude:'unknown',
   };

   onCancel() {
    console.log("CANCEL")
    this.setState({visible:false});
   }

  onOpen() {
    console.log("OPEN")
    this.setState({visible:true});
  }

  openControlPanel = () => {
      if(this._drawer.open() == true)
        {
          this._drawer.close()
        }
        else if(this._drawer.close() == true)
        {
          this._drawer.open()
        }
      };

    componentWillMount() {
      let selected=this.props.id;
      console.log(selected);
      // axios.get('http://192.168.0.23:3000/Bussiness/'+selected)
      axios.get('https://islandmapwp-teamarmentum.c9users.io/wp-json/wp/v2/business/'+selected)
      .then(response => this.setState({
        customerDetail : response.data,

      }))
      .catch(function(err) {
         return err;
       });
       let latitude=this.props.lat;
       let longitude=this.props.long;
       axios.get('https://islandmapwp-teamarmentum.c9users.io/wp-json/business/v2/nearby?latitude='+latitude+'&longitude='+longitude+'&miles=10')
       .then(response => this.setState({
         nearByPlaces : response.data,

       }))
       .catch(function(err) {
          return err;
        });
       console.log(latitude);
       console.log(longitude);
    }
    watchID: ?number = null;

    componentDidMount = () => {
        navigator.geolocation.getCurrentPosition(
           (position) => {
              const initialLatitude = JSON.stringify(position.coords.latitude);
              const initialLongitude = JSON.stringify(position.coords.longitude);
              this.setState({ initialLatitude ,initialLongitude });
           },
           (error) => alert(error.message),
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
   _back = () => {
      this.props.navigator.pop();
   };
  handleNearByGetDirections = (lat,long) => {
    const data = {
        source: {
         latitude: parseFloat(this.state.initialLatitude),
         longitude: parseFloat(this.state.initialLongitude)
       },
       destination: {
         latitude:parseFloat(lat),
         longitude: parseFloat(long)
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
  handleGetDirections = () => {
    const data = {
          source: {
           latitude: parseFloat(this.state.lastLatitude),
           longitude: parseFloat(this.state.lastLongitude)
         },
         destination: {
           latitude:parseFloat(this.state.customerDetail.coordinate.latitude),
           longitude: parseFloat(this.state.customerDetail.coordinate.longitude)
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

  _renderTruncatedFooter = (handlePress) => {
    return (
      <Text style={{color:'blue',fontSize:12,}} onPress={handlePress}>
        Read more...
      </Text>
    );
  }

  _renderRevealedFooter = (handlePress) => {
    return (
      <Text style={{color:'blue',fontSize:12,}} onPress={handlePress}>
        Show less...
      </Text>
    );
  }
  renderViewMore(onPress){
			return(
				<Text style={{color:'blue',fontSize:12,marginLeft:-8 }} onPress={onPress}>  Read more......</Text>
			)
		}
		renderViewLess(onPress){
			return(
				<Text style={{color:'blue',fontSize:12,marginLeft:-8}} onPress={onPress}>  Show less......</Text>
			)
		}

  _handleButtonShare = () => {
    let shareOptions = {
        title: "React Native",
        message: "Island Map",
        url: this.state.customerDetail.link,
        subject: "Share Link" //  for email
      };

  Share.open(shareOptions).catch((err) => { err && console.log(err); })
  };
  _handleNearByButtonShare = (link) => {
    console.log(link)
    let shareOptions = {
        title: "React Native",
        message: "Island Maps",
        url:link,
        subject: "Share Link" //  for email
      };

  Share.open(shareOptions).catch((err) => { err && console.log(err); })
  };
  _handleButtonCall = () => {

    Communications.phonecall(this.state.customerDetail.phone, true)

  };
  _handleNearByButtonCall(phone){
    Communications.phonecall(phone, true)
  };

  _handleButtonPressDetails = (id,latitude,longitude) => {
    this.props.navigator.push({
    name: 'DetailView',
    props:{
      id:id,
      lat:latitude,
      long:longitude
    }
    })

  };

  render() {

    return (
    <View style={styles.container}>
        <View style={styles.header}>
        <View style={styles.statusbar}></View>
          <View style={styles.headerTitle}>
            <View style={styles.headerNavImg}>
                <TouchableHighlight underlayColor = {'transparent'} onPress={this._back}
                      style={styles.hNavImg}>
                    <Image source={require('../img/Back.png')} style={styles.BackImg} />
                </TouchableHighlight>
            </View>

            <View style={styles.headerTitleName}>
                <Text style={styles.hTitleName}>{this.state.customerDetail.businessname}</Text>
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
           styles={{
           drawer: {shadowColor: '#59acb2', shadowOpacity: 0.8, shadowRadius: 3},
           }}
           tweenHandler={(ratio) => ({ main: { opacity:(2-ratio)/2 } })}>
          <View style={styles.BannerView} >
            <View style={styles.BannerViewImg} >
               <Image source={{uri:this.state.customerDetail.banner}}  style={styles.BannerImg}/>
            </View>
            <View style={styles.ViewButton}>
              <TouchableHighlight underlayColor = {'#ee5748'} style={styles.ButtonShareTouch}
                  onPress={this._handleButtonShare} >
                  <View style={styles.ShareTouchView}>
                      <Image source={require('../img/ic_share_menu.png')} style={styles.ShareImg}/>
                      <Text style={styles.ShareText}>Share</Text>
                  </View>
              </TouchableHighlight>

              <View style={styles.ViewButtonBoth}>
                <TouchableHighlight underlayColor = {'transparent'} onPress={this.handleGetDirections}
                    style={styles.NavTouch}>
                    <Image source={require('../img/ic_navigation.png')} style={styles.NavCallImg} />
                </TouchableHighlight>
                <TouchableHighlight underlayColor = {'transparent'} onPress={this._handleButtonCall}
                  style={styles.CallTouch} >
                  <Image source={require('../img/ic_call.png')} style={styles.NavCallImg}/>
                </TouchableHighlight>
              </View>
            </View>
          </View>
            <View style={{flex:2.5 ,backgroundColor:'transparent',borderColor:'#cdcdcd',borderBottomWidth:0.5,borderTopWidth:0.5,}}>
                  <ScrollView>
                    <View style={styles.ViewScroll}>
                      <View style={styles.ViewScrollText}>
                      <ViewMoreText
                  		    numberOfLines={7}
                  		    renderViewMore={this.renderViewMore}
                  		    renderViewLess={this.renderViewLess}>
                  		    <Text>{this.state.customerDetail.description}</Text>
			                     </ViewMoreText>
                      </View>
                    </View>
                  </ScrollView>
            </View>
            <View style={{flex:3.5,justifyContent:'flex-start', alignItems:'flex-start', marginRight:12,marginLeft:6, bottom:0}}>
                <View style={{flex:.5, marginTop:10 }}>
                    <Text style={{fontSize:16,fontWeight:'500',
                    marginLeft:15,color:'black' ,}}>
                    Near By Places</Text>
                </View>
            <View style={{flex:3.0}}>
              <ScrollView horizontal >
                {this.state.nearByPlaces.map((customer, index) =>(
                  <View style={{ justifyContent:'center', alignItems:'center', marginTop:10, marginLeft:4, marginBottom:10,marginRight:3, borderColor:'#c7cbcc',
                    borderBottomWidth:1,
                    borderRadius:3,

                    shadowColor: '#000',
                    shadowOffset: { width: 0.5, height: 1},
                    shadowOpacity: 0.2,
                    shadowRadius: 2,
                    elevation: 1,}} key={index}>
                    <TouchableHighlight underlayColor={'transparent'} onPress={this._handleButtonPressDetails.bind(this,customer.id, customer.coordinate.latitude,customer.coordinate.longitude)}>
                      <View style={{flex:10, borderColor:'#cdcdcd',borderWidth:1, borderRadius:2}} >
                      <View style={{flex:6}} >
                        <Image source={{uri:customer.banner}} style={{width: width/1.5, height:height/5.8}}>
                          <View style={{flex:1}}>
                                <Text style={{marginTop:55,marginLeft:7, color:'white', fontSize:20, fontWeight:'bold'}}>
                                {customer.businessname.toUpperCase()}</Text>
                          </View>
                        </Image>
                      </View>

                        <View style={{flexDirection:'row', flex:1.5, margin:5, marginBottom:3,}}>
                          <TouchableHighlight underlayColor = {'transparent'}
                                  style={{flexDirection:'row', flex:0.25,
                                borderColor:'#cdcdcd',borderRightWidth:1,borderBottomWidth:0,
                                borderLeftWidth:0,borderTopWidth:0,}} >
                            <View style={{flexDirection:'row', justifyContent:'flex-start', alignItems:'center'}}>
                                <Image source={require('../img/ic_pin_list.png')} style={{width:14,
                                   height:14,marginRight:2}} />
                                <Text style={{marginRight:5,color:'#2e7779', fontSize:10}}>{distance(parseFloat(customer.coordinate.latitude), parseFloat(customer.coordinate.longitude),parseFloat(this.state.lastLatitude), parseFloat(this.state.lastLongitude))}miles</Text>
                            </View>
                          </TouchableHighlight>

                          <TouchableHighlight underlayColor = {'transparent'}
                              style={{marginLeft:3, flexDirection:'row', flex:0.25,}} onPress={this._handleNearByButtonShare.bind(this,customer.link)}>
                            <View style={{flexDirection:'row', justifyContent:'flex-start', alignItems:'center'}}>
                            <Image source={require('../img/ic_share_list.png')} style={{width:14,
                               height:14,marginRight:2}} />
                                <Text style={{marginRight:5, color:'#2e7779', fontSize:10}}>Share</Text>
                            </View>
                          </TouchableHighlight>

                          <View style={{flex:0.9,marginRight:7,justifyContent:'flex-end',flexDirection:'row',alignItems:'center',}}>
                            <TouchableHighlight underlayColor = {'transparent'} onPress={this.handleNearByGetDirections.bind(this,customer.coordinate.latitude,customer.coordinate.longitude)}
                              style={{marginTop:-30,marginRight:2}}>
                                <Image source={require('../img/ic_navigation.png')} style={{width:35, height:35, }} />
                            </TouchableHighlight>
                            <TouchableHighlight underlayColor = {'transparent'} onPress={this._handleNearByButtonCall.bind(this,customer.phone)}
                                                style={{marginTop:-30,marginRight:-7}} >
                                  <Image source={require('../img/ic_call.png')} style={{width:35, height:35,}}/>
                            </TouchableHighlight>
                          </View>
                        </View>
                      </View>
                    </TouchableHighlight>
                  </View>
                ))}
            </ScrollView>
            </View>
              </View>

          </Drawer>
        </View>
    </View>
  )}
  }

  var width    = Dimensions.get('window').width; //full width
  var height   = Dimensions.get('window').height; //full height

  DetailView.propTypes = {
    disableOnBackPress: PropTypes.bool,
  };

  DetailView.defaultProps = {
    disableOnBackPress: false,
  };

  DetailView.propTypes = {
    open: PropTypes.bool,
    disableOnBackPress: PropTypes.bool,
  };

  DetailView.defaultProps = {
    open: false,
    disableOnBackPress: false,
  };

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
headerNavImg:{
    flex:0.1,
    justifyContent:'center',
  },
BackImg:{

    width:18,
    height:18,
    marginLeft:8,
  },
hNavImg:{
    flex:0.1,
    justifyContent:'center',
  },
NavImg:{

    width:35,
    height:35,
  },
headerButtonsBoth:{
    flex:0.8,
    backgroundColor:'#59acb2',
    flexDirection:'row',
    borderColor:'white',
  },
headerButton:{
    flex:0.25,
    alignItems:'center',
    justifyContent:'center',
    borderColor:'white',
    borderRightWidth:1,
  },
headerButtonText:{
    fontSize:16,
    alignSelf:'center',
    color:'white',
  },
MiddleScroll:{
    flex:9.2,
    backgroundColor:'white',
  },
BannerView:{
    flex:4.0,
    justifyContent:'flex-start',
  },
BannerViewImg:{
    flex:2,
  },
BannerImg:{
    width:width,
    flex:2,
  },
ViewButton:{
    flexDirection:'row',
    flex:0.3,
    padding:10,
  },
ButtonShareTouch:{
    flexDirection:'row',
    backgroundColor:'#ee5748',
    borderColor:'#ee5748',
    borderWidth:0.5,
    borderRadius:3,
    paddingLeft:10,
    paddingRight:10,
    justifyContent:'center',
    marginLeft:10,
    alignItems:'center',
  },
ShareTouchView:{
  flexDirection:'row',
  justifyContent:'center',
  alignItems:'center',
},
ShareImg:{
  width:22,
  height:22,
},
ShareText:{
  color:'white',
  margin:4,
  fontSize:10,
  alignSelf:'center',
},
ViewButtonBoth:{
  flex:0.5,
  justifyContent:'flex-end',
  flexDirection:'row',
  alignItems:'center',
  marginRight:15,
},
NavTouch:{
  marginTop:-50,
  marginRight:1,
},
NavCallImg:{
  width:55,
  height:55,
},
CallTouch:{
  marginTop:-50,
  marginRight:-7,
},
NavCallImg:{
  width:55,
  height:55,},
ViewScrollMain:{
    flex:4.5 ,
    justifyContent:'flex-start',
    alignItems:'flex-start',
  },
ViewScroll:{
  marginLeft:5,
  marginRight:10,

},
ViewScrollText:{
  marginLeft:20,
  marginRight:20,
  marginTop:12,
  marginBottom:20,
},
ReadMoreText:{

  fontSize:11,
  color:'#3d3d3d',
},
})
