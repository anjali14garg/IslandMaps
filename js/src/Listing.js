import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableHighlight,
  DrawerLayoutAndroid,
  ScrollView,
  Image,
  LayoutAnimation,
  ListView,
  Alert,
  PixelRatio,
  TouchableOpacity,
  Dimensions,StatusBar, ActivityIndicator, Linking,
  TextInput,
  Picker
} from 'react-native';
import Share, {ShareSheet} from 'react-native-share';
import getDirections from 'react-native-google-maps-directions';
import Modal from 'react-native-simple-modal';
import Drawer from 'react-native-drawer'
import Toggle from 'react-native-toggle';
import SideMenu from './SideMenu';
import DetailView from './DetailView';
import MapViews from './MapViews';
import axios from 'axios';
import AlbumDetail from './AlbumDetail';
import Communications from 'react-native-communications';
import GridView from 'react-native-super-grid';
import Collection from 'react-native-collection';
import Cell from './Cell';
import CustomMultiPicker from "react-native-multiple-select-list";


var width    = Dimensions.get('window').width; //full width
var height   = Dimensions.get('window').height;
export default class Listing extends Component {

  state = {
    drawerOpen: false,
    drawerDisabled: false,
    open: false,
    customers : [],
    categories:[],
    selectedCategory: [],
    activeOptions:[],
    selectedFilters:[],

  };
  constructor(props){
    super(props);
    this.leftHandler = this.leftHandler.bind(this);
    this.rightHandler = this.rightHandler.bind(this);
    this.tapHandler = this.tapHandler.bind(this);
  }
  tapHandler(param: Object){
    console.log('item tapped'+ param);
  }
  leftHandler(param: Object){
    console.log('left button clicked');
  }
  rightHandler(param: Object){
    console.log('right button clicked: ' + param);
  }


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
      this._drawer.open()
    }
  };

  componentWillMount() {

    axios.get('https://islandmapwp-teamarmentum.c9users.io/wp-json/wp/v2/business/')
      .then(response => this.setState({
        customers : response.data,
      }))
      .catch(function(err) {
         return err;
       });

       axios.get('https://islandmapwp-teamarmentum.c9users.io/wp-json/business/v2/categories/')
       .then(response => this.setState({
         categories : response.data,
       }))
       .catch(function(err) {
          return err;
        });
      };

   renderCustomers(){
     if(this.state.activeOptions.length){
       return this.state.selectedFilters.map(customer =>
          <AlbumDetail key={customer.id} customer={customer} navigator={this.props.navigator} />
       );

     }
     else{
       return this.state.customers.map(customer =>
          <AlbumDetail key={customer.id} customer={customer} navigator={this.props.navigator} />
       );
     }
    }
  _handleButtonPressMap = () => {
    this.props.navigator.push({
      name: 'MapViews', // Matches route.name
    });

  };


  getItems = query => {
      axios
        .get(
          'https://islandmapwp-teamarmentum.c9users.io/wp-json/wp/v2/business?filter[categories]=' +
            query
        )
        .then(response =>
          this.setState({
            selectedFilters: response.data,
          })
        )
        .catch(function(err) {
          return err
        })
    }
    _handleCategoryPress(category) {
    const { categories } = this.state

    // Check if category is already selected
    const newCategories =
      this.state.categories.indexOf(category) !== -1
        ? categories.splice(categories.indexOf(category), 1)
        : [...categories, category]

    // Set new categories so the interface updates
    this.setState({ categories: newCategories })

    // Make category string, since we need all in one long string
    let categoryQuery = ''

    newCategories.map(cat => {
      categoryQuery = `${categoryQuery},${cat}`
    })

    // Get items from server with category string
    this.getItems(categoryQuery)
  }
  render() {
    console.log(this.state)

    return (
      <View style={styles.container}>
      <View style={styles.header}>
      <View style={styles.statusbar}></View>
        <View style={styles.headerTitle}>
          <View style={styles.headerTitleName}>
            <Text style={styles.hTitleName}>Island Maps</Text>
          </View>
          <View style={styles.headerNavImg}>
            <TouchableHighlight underlayColor = {'transparent'} onPress={() => {this.openControlPanel()}} style={styles.hNavImg}>
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
        <View style={styles.headerButtonsBoth}>
          <TouchableHighlight underlayColor = {'transparent'}
          style={styles.headerButton} onPress={() => this.setState({open: true})}>
            <View style={{flexDirection:'row'}}>
              <Image source={require('../img/ic_filter.png')} style={styles.headerButtonImg}/>
              <Text style={styles.headerButtonText}>Filter</Text>
            </View>
          </TouchableHighlight>

          <TouchableHighlight underlayColor = {'transparent'}
          style={styles.headerButton} onPress={this._handleButtonPressMap}>
            <View style={{flexDirection:'row'}}>
              <Image source={require('../img/ic_map.png')} style={styles.headerButtonImg}/>
              <Text style={styles.headerButtonText}>Map View</Text>
            </View>
          </TouchableHighlight>
        </View>

        <View style={styles.BottomView} >
          <View>
            <ScrollView>
                {this.renderCustomers()}
            </ScrollView>
          </View>
          <Modal
                offset={0}
                borderColor={'transparent'}
                open={this.state.open}
                visible={this.state.modalVisible}
                modalStyle={{
                   borderRadius: 0,
                   backgroundColor:'transparent'

                }}
                overlayBackground={'rgba(0, 0, 0, 0.70)'}
                modalDidOpen={() => console.log('modal did open')}
                modalDidClose={() => this.setState({open: false})}
                style={{alignItems: 'center', }}>
                <View style={{ backgroundColor: 'transparent',top:-170,}}>
                <GridView
                    items={this.state.categories}

                    renderItem={category => (
                      <View style={{top:30}}>
                      <TouchableHighlight
                        underlayColor={'transparent'}
                        onPress={() => this._handleCategoryPress(category)}
                      >
                        <Text
                          style={{
                            borderWidth: 1,
                            borderColor:
                              this.state.categories.indexOf(category) !== -1
                                ? '#5ac9b2'
                                : 'white',
                            borderRadius: 6,
                            padding: 10,
                            color: 'white',
                            marginRight: 1.5,
                            marginLeft: 1.5,
                            backgroundColor:
                              this.state.categories.indexOf(category) !== -1
                                ? '#5ac9b2'
                                : 'transparent',
                            marginBottom: 20,
                            fontWeight: '600',
                          }}
                        >
                          {category}
                        </Text>
                      </TouchableHighlight>
            </View>
          )}
        />
              </View>
            </Modal>
        </View>
        </Drawer>
      </View>
      </View>

    )}
  }

  const styles = StyleSheet.create({
    container: {
      flex: 10,
      backgroundColor: '#59acb2',
    },
    statusbar:{
      height:20,
      borderColor:'white',
      borderBottomWidth:0.5,
    },
    header:{
      flex: 0.8,
      flex:1.0,
    },
    headerTitle:{
      flex:0.5,
      backgroundColor: '#59acb2',
      justifyContent:'center',
      flexDirection:'row',
    },
    headerTitleName:{
      flex:0.8,
      justifyContent:'center',
      alignItems:'center',
    },
    hTitleName:{

      alignSelf:'center',
      fontSize:22,
      marginLeft:40,

      fontWeight:'400',
      color:'white',
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
      marginRight:2,
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
    BottomViewList:{
      flex:8.4,
      justifyContent:'center',
      alignItems:'center',
      borderColor:'#c7cbcc',
      borderWidth:1,
      borderRadius:3,
      marginTop:10,
      marginLeft:10,
      marginRight:10,
      width: width-20,
      shadowColor: '#000',
      shadowOffset: { width: 0.5, height: 1},
      shadowOpacity: 0.4,
      shadowRadius: 2,
      elevation: 1,
    },
    ListbannerView:{
      flex:4,
    },
    BannerImg:{
      width: width-22,
      height:height/4.5,
      backgroundColor: 'black',
    },
    ListTitleView:{
      flex:1
    },
    ListTitle:{
      marginTop:-75,
      marginLeft:10,
      color:'white',
      fontSize:28,

      fontWeight:'bold',
    },
    ListBottom:{
      flexDirection:'row',
      flex:1,
      margin:5,
    },
    MilesTouch:{
      marginRight:5,
      flexDirection:'row',
      flex:0.25,
      borderColor:'#cdcdcd',
      borderRightWidth:1,
      borderBottomWidth:0,
      borderLeftWidth:0,
      borderTopWidth:0,
    },
    MilesTouchView:{
      flexDirection:'row',
      justifyContent:'flex-start',
      alignItems:'center'
    },
    ShareMilesImg:{
      width:16,
      height:16,
      marginRight:3,
    },
    ShareMilesText:{

      color:'#2e7779',
      fontSize:11,
    },
    ShareTouch:{
      flexDirection:'row',
      flex:0.25,
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
      marginTop:-32,
      marginRight:2
    },
    ImgBtn:{
      width:50,
      height:50,
    },
    ListButtonCallTouch:{
      marginTop:-32,
    },
    buttonOnPress:{
      marginRight:1.5,
      marginLeft:1.5,
      height:45,
      borderColor:'#5ac9b2',
      borderWidth:0.5,
      borderRadius:2,
      backgroundColor:'#5ac9b2',
      flex:0.25,
      alignItems:'center',
      justifyContent:'center',
    },
    buttonDefault:{
      marginLeft:1.5,
      marginRight:1.5,
      height:45,
      borderWidth:0.5,
      borderRadius:2,
      flex:0.25,
      alignItems:'center',
      justifyContent:'center',
      borderColor:'white',
    },
  });
