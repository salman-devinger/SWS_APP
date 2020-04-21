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
class Tools extends React.Component {
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
      console.log(data);
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
        <TouchableOpacity onPress={() => navigate('DownloadScreen', {name: 'Jane'})}>
          <View style={styles.menuBox}>
          <Image style={styles.icon} source={{uri: 'https://img.icons8.com/cotton/64/000000/circled-down--v2.png'}}/>
          <Text style={styles.info}>Download</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigate('Recorder')}>
        <View style={styles.menuBox}>
          <Image style={styles.icon} source={{uri: 'https://img.icons8.com/cute-clipart/80/000000/play-record.png'}}/>
          <Text style={styles.info}>Record</Text>
        </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigate('TrackList', {name: 'Jane'})}>
        <View style={styles.menuBox}>
          <Image style={styles.icon} source={{uri: 'https://img.icons8.com/color/96/000000/music-record--v1.png'}}/>
          <Text style={styles.info}>Practise</Text>
        </View>
        </TouchableOpacity>
        </View>
        <View style={styles.rowItem}>
        <View style={styles.menuBox}>
          <Image style={styles.icon} source={{uri: 'https://img.icons8.com/nolan/64/000000/data-backup.png'}}/>
          <Text style={styles.info}>Data</Text>
        </View>

        <View style={styles.menuBox}>
          <Image style={styles.icon} source={{uri: 'https://img.icons8.com/color/48/000000/classic-music.png'}}/>
          <Text style={styles.info}>Class</Text>
        </View>

        <View style={styles.menuBox}>
          <Image style={styles.icon} source={require('../assets/fees.png')}/>
          <Text style={styles.info}>Fees</Text>
        </View>
        </View>
        {1==21 ?(
        <View style={styles.rowItem}>
        <TouchableOpacity onPress={() => navigate('WebsitePage', {URL: 'http://swsstudio.in/portal/sws_pages/upload_exercise.php'})}>
        <View style={styles.menuBox}>
          <Image style={styles.icon} source={{uri: 'https://img.icons8.com/nolan/64/000000/upload.png'}}/>
          <Text style={styles.info}>Upload</Text>
        </View>
        </TouchableOpacity>

        <View style={styles.menuBox}>
          <Image style={styles.icon} source={{uri: 'https://img.icons8.com/color/48/000000/classic-music.png'}}/>
          <Text style={styles.info}>Classes</Text>
        </View>

        <View style={styles.menuBox}>
          <Image style={styles.icon} source={require('../assets/fees.png')}/>
          <Text style={styles.info}>Fees</Text>
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

export default Tools;