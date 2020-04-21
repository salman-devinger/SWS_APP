import React from 'react';
import { Button, Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import {createAppContainer, createSwitchNavigator, TabNavigator, CreateTabNavigator} from 'react-navigation';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import {createStackNavigator, StackNavigator} from 'react-navigation-stack';
import { StatusBar } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import * as en from './src/locales/en.json';
import AboutScreen from './src/screens/AboutScreen';
import SplashScreen from './src/screens/SplashScreen';
import Home from './src/screens/Home';
import About from './src/screens/About';
import Tools from './src/screens/Tools';
import TrackList from './src/screens/TrackList';
import TrackPlayer from './src/screens/TrackPlayer';
import WebsitePage from './src/screens/WebsitePage';
import Recorder from './src/screens/Recorder';
import DownloadScreen from './src/screens/DownloadScreen';
import GalleryScreen from './src/screens/GalleryScreen';
import login from './src/screens/login';

StatusBar.setBarStyle('light-content', true);
StatusBar.setBackgroundColor(en.appColours.statusBar);

const HomeNavigator = createStackNavigator(
  {
    //Defination of Navigaton from home screen
    Home: { screen: Home },
    AboutScreen: {screen: AboutScreen},
    WebsitePage: { screen: WebsitePage },
    GalleryScreen: { screen: GalleryScreen }
  },
  {
    defaultNavigationOptions: {
      //Header customization of the perticular Screen
      headerStyle: {
        backgroundColor: en.appColours.navBar
      },
      headerTintColor: en.appColours.headerTint,
      title: 'Home',
    },
  }
);
const SettingsStack = createStackNavigator(
  {
    //Defination of Navigaton from setting screen
    //Settings: { screen: global.isLogedIN ? Tools : login },
    Settings: { screen: Tools },
    Tools: { screen: Tools },
    Profile: { screen: login },
    TrackList: { screen: TrackList },
    TrackPlayer: { screen: TrackPlayer },
    Recorder: {screen: Recorder},
    DownloadScreen: {screen: DownloadScreen}
  },
  {
    defaultNavigationOptions: {
      //Header customization of the perticular Screen
      headerStyle: {
        backgroundColor: en.appColours.navBar
      },
      headerTintColor: en.appColours.headerTint,
      title: en.navigation.tools,
      //Header title
    },
  }
);
const AboutStack = createStackNavigator(
  {
    //Defination of Navigaton from setting screen
    About: { screen: About },
    Details: { screen: AboutScreen },
    Profile: { screen: login },
  },
  {
    defaultNavigationOptions: {
      //Header customization of the perticular Screen
      headerStyle: {
        backgroundColor: en.appColours.navBar
      },
      headerTintColor: en.appColours.headerTint,
      title: 'Settings',
      //Header title
    },
  }
);

const AppNavigator = createBottomTabNavigator(
  {
    HighScores: {
      screen: AboutStack,
      navigationOptions: {
        tabBarLabel: ({ tintColor }) => (
          <Text style={{ fontSize: 15, color: tintColor, alignSelf:'center' }}>
            {en.navigation.about}
          </Text>
        ),
        tabBarIcon: ({ horizontal, tintColor }) =>
          <Icon name="chart-bar" size={horizontal ? 18 : 22} color={tintColor} />
      }
    },
    Home: {
      screen: HomeNavigator,
      navigationOptions: {
        tabBarLabel: ({ tintColor }) => (
          <Text style={{ fontSize: 15, color: tintColor, alignSelf:'center' }}>
            {en.navigation.home}
          </Text>
        ),
        tabBarIcon: ({ horizontal, tintColor }) =>
          <Icon name="home" size={horizontal ? 18 : 22} color={tintColor} />
      }
    },
    Settings: {
      screen: SettingsStack,
      navigationOptions: {
        tabBarLabel: ({ tintColor }) => (
          <Text style={{ fontSize: 15, color: tintColor, alignSelf:'center' }}>
            {en.navigation.tools}
          </Text>
        ),
        tabBarIcon: ({ horizontal, tintColor }) =>
          <Icon name="cogs" size={horizontal ? 18 : 22} color={tintColor} />
      }
    }
  },
  {
    tabBarOptions: {
      activeTintColor: en.appColours.activeTint,
      inactiveTintColor: en.appColours.inActiveTint,
      style: {
        backgroundColor: en.appColours.tabBar,
        paddingTop: 10
      }
    },
    //initialRouteName: global.isLogedIN ? "Settings" : "Home"
    initialRouteName: "Settings"
    
  }
  
);

const InitialNavigator = createSwitchNavigator({
  Splash: SplashScreen,
  App: AppNavigator,
  //AboutScreen: { screen: AboutScreen }, 
  //Home: { screen: Home }, 
  //TrackList: { screen: TrackList }
  //TrackNavigator : TrackNavigator
});

const AppContainer = createAppContainer(InitialNavigator);

export default AppContainer;
