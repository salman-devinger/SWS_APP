import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Video from 'react-native-video';
import * as en from '../locales/en.json';
import AsyncStorage from '@react-native-community/async-storage';
// https://pixabay.com/videos/search/animated%20background/
// https://medium.com/@hamed.taheri32/react-native-image-slider-box-6f18462ab836
import Slideshow from 'react-native-image-slider-show';
//https://www.npmjs.com/package/react-native-background-downloader
// Flex Box  https://code.tutsplus.com/tutorials/get-started-with-layouts-in-react-native--cms-27418
// https://facebook.github.io/react-native/docs/flexbox
class Home extends React.Component {
  //Home Menu : https://www.bootdey.com/react-native-snippet/13/User-home-menu
  /*static navigationOptions = {
    title: 'Home',
    headerMode: 'screen'
  };*/
  constructor(props) {
    super(props);
    this.state = {
      position: 1,
      interval: null,
      dataSource: [
        {
          title: 'Title 1',
          caption: 'Caption 1',
          url: require('../assets/13.jpg'),
        }, {
          title: 'Title 2',
          caption: 'Caption 2',
          url: require('../assets/7.jpg'),
        }, {
          title: 'Title 3',
          caption: 'Caption 3',
          url: 'https://source.unsplash.com/1024x768/?water',
        },
      ],
    };
  }
  async getToken() {
    try {
      let userData = await AsyncStorage.getItem("userData");
      let data = JSON.parse(userData);
      console.log('JSON DT: ', data);
    } catch (error) {
      console.log("Something went wrong", error);
    }
  }
  componentDidMount() {
    this.getToken();
    this.setState({
      interval: setInterval(() => {
        this.setState({
          position: this.state.position === this.state.dataSource.length ? 0 : this.state.position + 1
        });
      }, 2000)
    });
  }
  componentWillUnmount() {
    clearInterval(this.state.interval);
  }
  render() {
    const {navigate} = this.props.navigation;
    return (
      <View style={styles.container}>
        {/*<Video
          source={require("../assets/playerBG.mp4")}
          //source={{uri:"http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"}}
          style={styles.backgroundVideo}
          muted={true}
          repeat={true}
          resizeMode={"cover"}
          rate={1.0}
          ignoreSilentSwitch={"obey"}
        />*/}
        <View style={styles.rowItem2}>
        <Slideshow 
          dataSource={this.state.dataSource}
          position={this.state.position}
          //height={100}
          containerStyle={styles.imageBox}
          captionStyle={styles.imageCaption}
          titleStyle={styles.imageCaption}
          onPositionChanged={position => this.setState({ position })} 
        />
        </View>
        <View style={styles.rowItem3}>
        <View style={styles.rowItem}>
          <TouchableOpacity onPress={() => navigate('AboutScreen', {name: 'Jane'})}>
          <View style={styles.menuBox}>
          <Image style={styles.icon} source={{uri: 'https://img.icons8.com/color/64/000000/info--v2.png'}}/>
          <Text style={styles.info}>About</Text>
          </View>
          </TouchableOpacity>
        <TouchableOpacity onPress={() => navigate('WebsitePage', {URL: 'http://swsstudio.in'})}>
        <View style={styles.menuBox}>
          <Image style={styles.icon} source={{uri: 'https://img.icons8.com/cotton/64/000000/domain.png'}}/>
          <Text style={styles.info}>WebSite</Text>
        </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigate('WebsitePage', {URL: 'https://www.youtube.com/user/studiosws'})}>
        <View style={styles.menuBox}>
          <Image style={styles.icon} source={{uri: 'https://img.icons8.com/ultraviolet/40/000000/movies-folder.png'}}/>
          <Text style={styles.info}>Videos</Text>
        </View>
        </TouchableOpacity>
        </View>

        <View style={styles.rowItem}>
        <TouchableOpacity onPress={() => navigate('GalleryScreen', {name: 'Jane'})}>
        <View style={styles.menuBox}>
          <Image style={styles.icon} source={{uri: 'https://img.icons8.com/color/48/000000/gallery.png'}}/>
          <Text style={styles.info}>Pics</Text>
        </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigate('WebsitePage', {URL: 'https://www.facebook.com/swsstudio'})}>
        <View style={styles.menuBox}>
          <Image style={styles.icon} source={{uri: 'https://img.icons8.com/nolan/64/000000/facebook-like.png'}}/>
          <Text style={styles.info}>Soccial</Text>
        </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigate('WebsitePage', {URL: 'https://www.facebook.com/swsstudio'})}>
        <View style={styles.menuBox}>
          <Image style={styles.icon} source={{uri: 'https://img.icons8.com/color/48/000000/guitar.png'}}/>
          <Text style={styles.info}>Products</Text>
        </View>
        </TouchableOpacity>
        </View>
        {1==21 ?(
        <View style={styles.rowItem}>
        <View style={styles.menuBox}>
          <Image style={styles.icon} source={{uri: 'https://img.icons8.com/color/48/000000/classic-music.png'}}/>
          <Text style={styles.info}>Info</Text>
        </View>

        <View style={styles.menuBox}>
          <Image style={styles.icon} source={{uri: 'https://img.icons8.com/color/48/000000/classic-music.png'}}/>
          <Text style={styles.info}>Profile</Text>
        </View>

        <View style={styles.menuBox}>
          <Image style={styles.icon} source={{uri: 'https://img.icons8.com/color/48/000000/classic-music.png'}}/>
          <Text style={styles.info}>Friends</Text>
        </View>
        </View> ): null }
        </View>
      </View>
    );
  }
}
var {height, width} = Dimensions.get('window');
const styles = StyleSheet.create({
  container:{
    flex:1,
    padding:10,
    paddingTop:10,
    paddingLeft:20,
    paddingRight:20,
    flexDirection: 'column',
    flexWrap: 'wrap',
    backgroundColor: en.appColours.backGround,
  },
  backgroundVideo: {
    height: height,
    position: "absolute",
    top: 0,
    left: 0,
    alignItems: "stretch",
    bottom: 0,
    right: 0
  },
  imageBox:{
    width:width,
    height:50,
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight:10,
    paddingLeft:10,
    margin:10
  },
  rowItem:{
    flex:1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    
  },
  rowItem2:{
    flex:2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    
  },
  rowItem3:{
    flex:3,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    
  },
  menuBox:{
    //backgroundColor: "#FFFFFF",
    flex:1,
    flexDirection: 'column',
    width:100,
    height:100,
    alignItems: 'center',
    justifyContent: 'center',
    margin:12
  },
  icon: {
    width:60,
    height:60,
  },
  info:{
    fontSize:15,
    color: "#696969",
  },
  imageCaption:{
    fontSize:22,
    color: "#FFFFFF",
  }
});

export default Home;