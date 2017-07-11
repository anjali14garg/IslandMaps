/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Listing from './js/src/Listing';
import ContactUs from './js/src/ContactUs';
import DetailView from './js/src/DetailView';
import MapViews from './js/src/MapViews';
import SideMenu from './js/src/SideMenu'
import {
  Navigator
} from 'react-native-deprecated-custom-components';

export default class IslandMap extends Component {
  renderScene(route, navigator) {
      console.log('dddd '+ navigator.getCurrentRoutes().length);
  if(route.name == 'Listing') {
    return <Listing navigator={navigator} />
  }
  if(route.name == 'MapViews') {
    return <MapViews navigator={navigator} />
  }
  if(route.name == 'SideMenu') {
    return <SideMenu navigator={navigator} />
  }
  if(route.name == 'DetailView') {
    return <DetailView navigator={navigator} {... route.props} />
  }
  if(route.name == 'ContactUs') {
    return <ContactUs navigator={navigator} />
  }

  }
  render() {
   return (
     <Navigator
       initialRoute={{ name: 'Listing' }}
       renderScene={ this.renderScene } />
   );
  }
  }


AppRegistry.registerComponent('IslandMap', () => IslandMap);
