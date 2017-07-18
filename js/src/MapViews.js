import React, { Component } from "react";
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Animated,
  Image,
  Dimensions,
  TouchableOpacity,
  StatusBar,
  TouchableHighlight
} from "react-native";

import MapView from "react-native-maps";
import Modal from 'react-native-simple-modal';
import Drawer from 'react-native-drawer';
import SideMenu from './SideMenu.js';
import Share, {ShareSheet} from 'react-native-share';
import getDirections from 'react-native-google-maps-directions';
import DetailView from './DetailView.js';
import Communications from 'react-native-communications';
import axios from 'axios';
import {
  Navigator
} from 'react-native-deprecated-custom-components';
import GridView from 'react-native-super-grid';

const { width, height } = Dimensions.get("window");

const CARD_HEIGHT =  height/2.0;
const CARD_WIDTH = width-30;
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

export default class MapViews extends Component {


  state = {
    markers: [],
    region: {
      latitude: 19.320325,
      longitude: -81.127414,
      latitudeDelta: 0.40,
      longitudeDelta: 0.40,
    },
    drawerOpen: false,
    drawerDisabled: false,
    open: false,
    initialLatitude: 'unknown',
    initialLongitude: 'unknown',
    lastLatitude:'unknown',
    lastLongitude:'unknown',
    status:false,
    selectedFilters:[],
    categories:[]
  };

watchID: ?number = null;

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
  _handleButtonPressList = () => {
    this.props.navigator.push({
     name: 'Listing', // Matches route.name
    });
  };


  componentWillMount() {
    this.getCustomers();
    axios
      .get(
        'https://demo.armentum.co/islandmap/wp-json/business/v2/categories/'
      )
      .then(response => this.setState({ categories: response.data }))
      .catch(function(err) {
        return err
      })


    this.index = 0;
    this.animation = new Animated.Value(0);
  }
  getCustomers = (query = '') => {
    axios
      .get(
        'https://demo.armentum.co/islandmap/wp-json/wp/v2/business?filter[categories]=' +
          query
      )
      .then(response => this.setState({ markers: response.data }))
      .catch(function(err) {
        return err
      })
  }


  componentDidMount() {
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
    // We should detect when scrolling has stopped then animate
    // We should just debounce the event listener here
    this.animation.addListener(({ value }) => {
      let index = Math.floor(value / CARD_WIDTH + 0.3); // animate 30% away from landing on the next item
      if (index >= this.state.markers.length) {
        index = this.state.markers.length - 1;
      }
      if (index <= 0) {
        index = 0;
      }
      componentWillUnmount = () => {
         navigator.geolocation.clearWatch(this.watchID);
      }

      clearTimeout(this.regionTimeout);
      this.regionTimeout = setTimeout(() => {
        if (this.index !== index) {
          this.index = index;
          const { coordinate } = this.state.markers[index];
          this.map.animateToRegion(
            {
              ...coordinate,
              latitudeDelta: this.state.region.latitudeDelta,
              longitudeDelta: this.state.region.longitudeDelta,
            },
            350
          );
        }
      }, 10);
    });
  }
  handleGetDirections = (lat,long) => {
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

  _handleButtonPressDetails = (id, latitude,longitude) => {
    this.props.navigator.push({
    name: 'DetailView',
    props:{
      id:id,
      lat:latitude,
      long:longitude
    }
    })

  };

  _handleButtonCall(phone){
    Communications.phonecall(phone, true)
  };

  _handleButtonShare = (link) => {
    console.log(link)
    let shareOptions = {
        title: "React Native",
        message: "Island Maps",
        url:link,
        subject: "Share Link" //  for email
      };

  Share.open(shareOptions).catch((err) => { err && console.log(err); })
  };
  _handleCategoryPress(filter) {
    const { selectedFilters } = this.state

    // Check if category is already selected
    const newFilter =
      selectedFilters.indexOf(filter) !== -1
        ? selectedFilters.filter(a => a !== filter)
        : [...selectedFilters, filter]

    this.setState({ selectedFilters: newFilter })

    // Make category string, since we need all in one long string
    let filterString = ''

    newFilter.map(cat => {
      filterString = filterString.length === 0 ? cat : `${filterString},${cat}`
    })

    // Get items from server with category string
    this.getCustomers(filterString)
  }


  render() {
    const interpolations = this.state.markers.map((marker, index) => {
      const inputRange = [
        (index - 1) * CARD_WIDTH,
        index * CARD_WIDTH,
        ((index + 1) * CARD_WIDTH),
      ];
      const scale = this.animation.interpolate({
        inputRange,
        outputRange: [1, 1.5, 1],
        extrapolate: "clamp",
      });
      const opacity = this.animation.interpolate({
        inputRange,
        outputRange: [0.35, 1, 0.35],
        extrapolate: "clamp",
      });
      return { scale, opacity };
    });
console.log(this.state)
    return (

      <View style={styles.container}>
      <StatusBar
          barStyle="light-content"
        />
            <View style={styles.header}>
            <View style={styles.statusbar}></View>
              <View style={styles.headerTitle}>
                <View style={styles.headerTitleName}>
                    <Text style={styles.hTitleName}>Island Maps</Text>
                </View>
                <View style={styles.headerNavImg}>
                  <TouchableHighlight underlayColor = {'transparent'}
                                onPress={() => {this.openControlPanel()}} style={styles.hNavImg}>
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
         content={<SideMenu navigator={this.props.navigator} />}
         tapToClose={true}
         openDrawerOffset={0.25}
         panCloseMask={0.25}
         closedDrawerOffset={-5}
         styles={{
           drawer: {shadowColor: '#59acb2', shadowOpacity: 0.8, shadowRadius: 3},
           }}
         tweenHandler={(ratio) => ({ main: { opacity:(2-ratio)/2 } })}>
         <View style={styles.headerButtonsBoth}>
             <TouchableHighlight underlayColor = {'transparent'}
                   style={styles.headerButton} onPress={() => this.setState({open: true})}>
                   <View style={{flexDirection:'row'}}>
                       <Image source={require('../img/ic_filter.png')} style={styles.headerButtonImg}/>
                       <Text style={styles.headerButtonText}>Filter</Text>
                   </View>
             </TouchableHighlight>

             <TouchableHighlight underlayColor = {'transparent'}
                   style={styles.headerButton} onPress={this._handleButtonPressList}>
                   <View style={{flexDirection:'row'}}>
                       <Image source={require('../img/ic_list.png')} style={styles.headerButtonImg1}/>
                       <Text style={styles.headerButtonText}>List View</Text>
                   </View>
             </TouchableHighlight>
         </View>
      <View style={styles.BottomView} >
      <MapView
        ref={map => this.map = map}
        initialRegion={this.state.region}
        style={styles.container}
      >
        {this.state.markers.map((marker, index) => {
          const scaleStyle = {
            transform: [
              {
                scale: interpolations[index].scale,
              },
            ],
          };
          return (
            <MapView.Marker key={index} coordinate={marker.coordinate}>
              <Animated.View style={[styles.markerWrap, scaleStyle]}>

                <View>
                  <Image source={require('../img/Pin_small.png')}>
                <View >
                  <Image source={{uri:marker.marker_url}} style={{height:30,width:35, alignSelf:'center'}}></Image>
                </View>
                </Image>
                </View>
              </Animated.View>

            </MapView.Marker>
          );
        })}
      </MapView>
      <Animated.ScrollView
        horizontal
        scrollEventThrottle={1}
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARD_WIDTH}
        onScroll={Animated.event(
          [
            {
              nativeEvent: {
                contentOffset: {
                  x: this.animation,
                },
              },
            },
          ],
          { useNativeDriver: true }
        )}
        style={styles.scrollView}
        contentContainerStyle={styles.endPadding}
      >
        {this.state.markers.map((marker, index) => (

          <View style={styles.card} key={index}>
          <TouchableHighlight underlayColor={'transparent'} onPress={this._handleButtonPressDetails.bind(this,marker.id,marker.coordinate.latitude,marker.coordinate.longitude)}>
          <View>
            <View style={styles.ListbannerView}>
                  <Image source={{uri:marker.banner}} style={styles.BannerImg}/>
            </View>

            <View style={styles.textContent}>
              <Text numberOfLines={1} style={styles.cardtitle}>{marker.businessname.toUpperCase()}</Text>
            </View>
            <View style={styles.ListBottom}>

            <TouchableHighlight underlayColor = {'transparent'} style={styles.MilesTouch}>
                <View style={styles.MilesTouchView}>
                    <Image source={require('../img/ic_pin_list.png')} style={styles.ShareMilesImg} />
                    <Text style={styles.ShareMilesText}>{distance(parseFloat(marker.coordinate.latitude), parseFloat(marker.coordinate.longitude),parseFloat(this.state.initialLatitude), parseFloat(this.state.initialLongitude))}miles</Text>
                </View>
            </TouchableHighlight>

            <TouchableHighlight underlayColor = {'transparent'} style={styles.ShareTouch}
               onPress={this._handleButtonShare.bind(this,marker.link)} >
                <View style={styles.ShareTouchView}  >
                    <Image source={require('../img/ic_share_list.png')} style={styles.ShareMilesImg} />
                    <Text style={styles.ShareMilesText}>Share</Text>
                </View>
            </TouchableHighlight>

            <View style={styles.ListButtonView}>
              <TouchableHighlight underlayColor = {'transparent'} onPress={this.handleGetDirections.bind(this,marker.coordinate.latitude,marker.coordinate.longitude)}
                style={styles.ListButtonNavTouch}>
                  <Image source={require('../img/ic_navigation.png')} style={styles.ImgBtn} />
              </TouchableHighlight>
              <TouchableHighlight underlayColor = {'transparent'}  onPress={this._handleButtonCall.bind(this,marker.phone)}
                                  style={styles.ListButtonCallTouch}>
                <Image source={require('../img/ic_call.png')} style={styles.ImgBtn}/>
              </TouchableHighlight>

            </View>

          </View>

          </View>

          </TouchableHighlight>
        </View>

        ))}

      </Animated.ScrollView>
      <Modal
        offset={0}
        borderColor={'transparent'}
        open={this.state.open}
        visible={this.state.modalVisible}
        modalStyle={{
          borderRadius: 0,
          backgroundColor: 'transparent',
        }}
        overlayBackground={'rgba(0, 0, 0, 0.70)'}
        modalDidOpen={() => console.log('modal did open')}
        modalDidClose={() => this.setState({ open: false })}
        style={{ alignItems: 'center' }}
      >
        <View style={{ backgroundColor: 'transparent', }}>
          <GridView
            items={this.state.categories}
            renderItem={category =>
              <View>
                <TouchableHighlight
                  underlayColor={'transparent'}
                  onPress={() => this._handleCategoryPress(category)}
                >
                  <Text
                    style={{
                      borderWidth: 1,
                      borderColor:
                        this.state.selectedFilters.indexOf(category) !==
                        -1
                          ? '#5ac9b2'
                          : 'white',
                      borderRadius: 2,
                      padding: 10,
                      textAlign:'center',
                      color: 'white',
                      marginRight: 1.5,
                      marginLeft: 1.5,
                      backgroundColor:
                        this.state.selectedFilters.indexOf(category) !==
                        -1
                          ? '#5ac9b2'
                          : 'transparent',
                      fontWeight: '600',
                    }}
                  >
                    {category}
                  </Text>
                </TouchableHighlight>
              </View>}
          />
        </View>
      </Modal>
      </View>
      </Drawer>
      </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 10,
    backgroundColor: '#59acb2',
  },
  scrollView: {
    position: "absolute",
    bottom: 10,
    left: 0,
    right: 0,
    marginLeft:10,
    paddingVertical: 10,
  },
  endPadding: {
    paddingRight: width - CARD_WIDTH,
  },
  card: {
    height:height/3.3,
    backgroundColor:'white',
    justifyContent:'center',
    alignItems:'center',
    borderColor:'#cdcdcd',
    borderWidth:1,
    borderRadius:3,
    width: width-20,
    marginRight:10
  },
  cardImage: {
    flex: 3,
  },
  textContent: {
    flex: 1,
  },
  cardtitle: {
    fontSize: 27,
    marginTop: -40,
    fontWeight: "bold",
    backgroundColor:'transparent',
    color:'white',
    marginLeft:10
  },

  markerWrap: {
    alignItems: "center",
    justifyContent: "center",
  },
  marker: {
    width: 8,
    height: 8,
    borderRadius: 1,
    backgroundColor: "rgba(130,4,150, 0.9)",
  },
  ring: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(130,4,150, 0.3)",
    position: "absolute",
    borderWidth: 1,
    borderColor: "#59acb2",
  },
  ListbannerView:{
     flex:3,
   },
  BannerImg:{
    width: width-22,
    height:height/4,
    opacity:0.8,
    backgroundColor: 'black',
   },
   statusbar:{
     height:20,
     borderColor:'white',
     borderBottomWidth:0.5,
   },
   header:{
     flex:1.0,
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
   marginLeft:40,
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

   width:35,
   height:35,
 },
 headerButtonsBoth:{
   flex:0.8,
   backgroundColor:'#59acb2',
   flexDirection:'row',
   borderColor:'white',
   borderTopWidth:0.5,
 },
 headerButton:{
   flex:0.25,
   alignItems:'center',
   justifyContent:'center',
   borderColor:'white',
   borderRightWidth:0.5,
 },
 headerButtonImg:{
   width:24,
   height:24,
   marginRight:3,
 },
 headerButtonImg1:{
   width:24,
   height:24,
   marginRight:8,
   marginLeft:-5,
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
 BottomView:{
   flex:8.4,

 },
 buttonDefault:{
   marginLeft:1.5,
   marginRight:1.5,
   height:45,
   borderColor:'white',
   borderWidth:0.5,
   borderRadius:2,
   flex:0.25,
   alignItems:'center',
   justifyContent:'center',
   borderColor:'white',
   borderRightWidth:1,
 },
 ListBottom:{
    flexDirection:'row',
    flex:0.5,
    margin:5,
  },

  MilesTouchView:{
    flexDirection:'row',
    justifyContent:'flex-start',
    alignItems:'center',
    borderColor:'#cdcdcd',
    borderRightWidth:1,
    paddingRight:3
  },
  ShareMilesImg:{
    width:18,
    height:18,
    marginRight:3,
  },
  ShareMilesText:{

    color:'#2e7779',
    fontSize:11,
  },
  ShareTouch:{
    flexDirection:'row',
    flex:0.27,
  },
  ShareTouchView:{
    flexDirection:'row',
    justifyContent:'flex-start',
    alignItems:'center'
  },
 ListButtonView:{
    flex:0.5,
    marginRight:7,
    justifyContent:'flex-end',
    flexDirection:'row',
    alignItems:'center',
  },
 ListButtonNavTouch:{
    marginTop:-35,
    marginRight:3
  },
 ImgBtn:{
    width:50,
    height:50,
  },
 ListButtonCallTouch:{
    marginTop:-32,
    marginRight:15,
  },

});
