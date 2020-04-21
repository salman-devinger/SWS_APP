import React, { Component } from 'react';
import  {
  Dimensions,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Slider } from 'react-native-elements';
import * as en from '../locales/en.json';
import Video from 'react-native-video';
var RNFS = require('react-native-fs');
import { AnimatedCircularProgress } from 'react-native-circular-progress';
const window = Dimensions.get('window');
// https://www.npmjs.com/package/react-native-simple-toast
// https://github.com/devnacho/react-native-music-player/blob/master/app/components/player/Player.js
class TrackPlayer extends Component {
  constructor(props){
    super(props);
    const { navigation } = this.props;  
    const user_name = navigation.getParam('name', 'NO-User');
    //console.log("usr,", en.appColours.navBar)
    //this.props.screenProps.setTitle('Dashboard');
    this.state = {
      playing: true,
      muted: false,
      shuffle: false,
      sliding: false,
      currentTime: 0,
      songIndex: 1,
      name: user_name.name,
      path: user_name.path,
      playRate: 1.0,
      isLoading: true
    };
  }
  componentDidMount() {
    this.props.navigation;
  }
  static navigationOptions = ({ navigation }) => ({
    title: `${navigation.getParam('name', 'NO-User').name}`,
    headerStyle: {
      backgroundColor: en.appColours.navBar
    },
    headerTintColor: en.appColours.headerTint
  });
  
  togglePlay(){
    this.setState({ playing: !this.state.playing });
  }

  toggleVolume(){
    this.setState({ muted: !this.state.muted });
  }

  toggleShuffle(){
    this.setState({ shuffle: !this.state.shuffle });
  }

  goBackward(){
    if(this.state.currentTime < 3 && this.state.songIndex !== 0 ){
      this.setState({
        songIndex: this.state.songIndex - 1,
        currentTime: 0,
      });
    } else {
      this.refs.audio.seek(0);
      this.setState({
        currentTime: 0,
      });
    }
  }

  goForward(){
    this.setState({
      songIndex: this.state.shuffle ? this.randomSongIndex() : this.state.songIndex + 1,
      currentTime: 0,
    });
    this.refs.audio.seek(0);
  }

  randomSongIndex(){
    //let maxIndex = this.props.songs.length - 1;
    let maxIndex = 1;
    return Math.floor(Math.random() * (maxIndex - 0 + 1)) + 0;
  }

  setTime(params){
    if( !this.state.sliding ){
      if(params.currentTime >= this.state.timeB){
        this.refs.audio.seek( this.state.timeA );
        this.setState({ currentTime: this.state.timeA });
      }
      else{
        this.setState({ currentTime: params.currentTime });
      }
    }
  }

  onLoadVid(params){
    console.log("Vid Params: ", params);
    this.setState({ isLoading: false });
  }

  onLoad(params){
    console.log(params);
    this.setState({ songDuration: params.duration, timeB: params.duration, timeA: 0, isLoading: false });
  }

  onSlidingStart(){
    this.setState({ sliding: true });
  }

  onSlidingChange(value){
    let newPosition = value;
    this.setState({ currentTime: newPosition });
  }

  onSlidingComplete(){
    this.refs.audio.seek( this.state.currentTime );
    this.setState({ sliding: false });
  }
  // Loop SLider Setup
  onSlidingStartA(){
    this.setState({ sliding: true });
  }
  onSlidingChangeA(value){
    this.setState({ timeA: value });
  }

  onSlidingCompleteA(value){
    let valueB = this.state.timeB;
    let newPosition = value>=valueB ? valueB-1 : value;
    this.refs.audio.seek( newPosition );
    this.setState(() => {
      return {
        timeA: newPosition, sliding: false
      };
    });
  }

  onSlidingStartB(){
    this.setState({ sliding: true });
  }

  onSlidingChangeB(value){
    //this.setState({ timeB: newPosition });
    this.setState(() => {
      return {
        timeB: value,
      };
    });
  }

  onSlidingCompleteB(value){
    //this.refs.audio.seek( this.state.currentTime );
    //this.setState({ sliding: false });
    let valueA = this.state.timeA;
    let newPosition = value<=valueA ? valueA+1 : value;
    this.setState(() => {
      return {
        timeB: newPosition, sliding: false
      };
    });
  }
  timeSecMinus(bt){
    let valA = this.state.timeA,
      valB = this.state.timeB;
    bt=='A' ? this.setState({ timeA: (valA >= 0.1) ? (valA - 0.10) : 0  }) : valB >= valA+1 ?  
    this.setState({ timeB: (valB >= 0.1) ? (valB - 0.10) : 0 }) : 1;
  }
  timeSecPlus(bt){
    let valA = this.state.timeA,
      valB = this.state.timeB;
    bt=='B' ? this.setState({ timeB: valB + 0.10 }) : valA+1 <= valB ? 
    this.setState({ timeA: valA + 0.10 }) : 1;
  }
  timeBt(bt){
    let valA = this.state.timeA,
      valB = this.state.timeB,
      curTime = this.state.currentTime;
    
    bt=='A' ? this.setState({ timeA: valB-valA >= 1 ? curTime : valB-1 }) : 
    this.setState({ timeB: valB-valA >= 1 ? curTime : valA+1 });
  }
  clearLoop(){
    let valA = 0,
      valB = this.state.songDuration;
    this.refs.audio.seek(0);
    this.setState({ timeA: valA, timeB: valB });
  }
  resetPlay(){
    let valA = this.state.timeA;
    this.setState({ playRate: 1.0, currentTime: valA });
    this.refs.audio.seek(valA);
  }
  changeSpeed(act){
    let curRate = this.state.playRate;
    if(act=='fst'){
      this.setState({ playRate: curRate<2.0 ? curRate+0.10 : 2.0 });
    }
    else{
      this.setState({ playRate: curRate>0.5 ? curRate-0.1 : 0.5 });
    }
  }

  onEnd(){
    this.setState({ playing: false });
  }


  render() {
    let bgVideo = <Video
      source={require("../assets/playerBG3.mp4")}
      //source={{uri:"http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"}}
      onLoad={ this.onLoadVid.bind(this) }
      //poster={"https://www.fillmurray.com/360/640"}
      style={styles.backgroundVideo}
      paused={!this.state.playing}
      muted={true}
      repeat={true}
      hideShutterView={true}
      resizeMode={"cover"}
      rate={1}
      ignoreSilentSwitch={"obey"}
    />;
    if (this.state.isLoading) {
      //Loading View while data is loading
      return (
        <View style={{ flex: 1, paddingTop: 20, backgroundColor: en.appColours.background }}>
          {bgVideo}
          <ActivityIndicator size="large" color="purple" style = { styles.loader }/>
        </View>
      );
    }
    //let songPlaying = this.props.songs[this.state.songIndex];
    let songPlaying = {"title": this.state.name, "album": "sal"};
    let songPercentage;
    const {timeB} = this.state;
    if( this.state.songDuration !== undefined ){
      songPercentage = this.state.currentTime / this.state.songDuration;
    } else {
      songPercentage = 0;
    }

    let playButton;
    if( this.state.playing ){
      playButton = <Icon onPress={ this.togglePlay.bind(this) } style={ styles.play } name="pause" size={60} color="#fff" />;
    } else {
      playButton = <Icon onPress={ this.togglePlay.bind(this) } style={ styles.play } name="play" size={60} color="#fff" />;
    }

    /*let forwardButton;
    //if( !this.state.shuffle && this.state.songIndex + 1 === this.props.songs.length ){
    if(1){
      forwardButton = <Icon style={ styles.forward } name="md-play-circle" size={25} color="#333" />;
    } else {
      forwardButton = <Icon onPress={ this.goForward.bind(this) } style={ styles.forward } name="md-pause-circle" size={25} color="#fff" />;
    }

    let volumeButton;
    if( this.state.muted ){
      volumeButton = <Icon onPress={ this.toggleVolume.bind(this) } style={ styles.volume } name="ios-play" size={18} color="#fff" />;
    } else {
      volumeButton = <Icon onPress={ this.toggleVolume.bind(this) } style={ styles.volume } name="ios-play" size={18} color="#fff" />;
    }

    let shuffleButton;
    if( this.state.shuffle ){
      shuffleButton = <Icon onPress={ this.toggleShuffle.bind(this) } style={ styles.shuffle } name="ios-play" size={18} color="#f62976" />;
    } else {
      shuffleButton = <Icon onPress={ this.toggleShuffle.bind(this) } style={ styles.shuffle } name="ios-play" size={18} color="#fff" />;
    }
    */
    //let image = songPlaying.albumImage ? songPlaying.albumImage : this.props.artist.background;
    return (
      <View style={styles.container}>
        {bgVideo}
        <View style={ styles.headerClose }>
          <Icon name="file-search" size={30} color="#fff" />
        </View>
        {/*Vide Source :https://www.pexels.com/*/}
        <Video 
            //source={{uri: RNFS.ExternalStorageDirectoryPath + '/Download/test_sal12.aac' }}
            source={{uri: this.state.path }}
            ref="audio"
            volume={ this.state.muted ? 0 : 1.0}
            muted={false}
            paused={!this.state.playing}
            onLoad={ this.onLoad.bind(this) }
            onProgress={ this.setTime.bind(this) }
            progressUpdateInterval={100}
            onEnd={ this.onEnd.bind(this) }
            resizeMode="cover"
            rate={this.state.playRate}
            repeat={true}/>
            <View style={styles.topPart} >
            <AnimatedCircularProgress
                //style={styles.bar} 
                style={{alignSelf: 'center'}}
                size={window.width/5}
                width={10}
                backgroundWidth={3}
                lineCap="round"
                rotation={-90}
                fill={songPercentage*100}
                tintColor="#00e0ff"
                backgroundColor="#3d5875">
                {
                (fill) => (
                    <Text style={styles.songTitle}>
                        {parseInt(songPercentage*100)}%
                    </Text>
                )
                }
        </AnimatedCircularProgress>
        {/*<Text style={ styles.songTitle }>
          { songPlaying.title }
          </Text>*/}
        <View style={ styles.sliderContainer }>
          <Slider
            onSlidingStart={ this.onSlidingStart.bind(this) }
            onSlidingComplete={ this.onSlidingComplete.bind(this) }
            onValueChange={ this.onSlidingChange.bind(this) }
            maximumValue={this.state.songDuration}
            minimumTrackTintColor={en.appColours.button}
            //style={ styles.slider }
            trackStyle={ styles.sliderTrack }
            thumbStyle={ styles.sliderThumb }
            value={ this.state.currentTime }/>
          
          <View style={ styles.timeInfo }>
            <Text style={ styles.time }>{ formattedTime(this.state.currentTime)  }</Text>
            <Text style={ styles.speed }>{`${this.state.playRate.toFixed(1)}X`}</Text>
            <Text style={ styles.timeRight }>- { formattedTime( this.state.songDuration - this.state.currentTime ) }</Text>
          </View>
        </View>
        <View style={ styles.controls }>
            <Icon onPress={ this.clearLoop.bind(this) } style={ styles.back } name="loop" size={30} color="#fff" />
            <Icon onPress={ this.changeSpeed.bind(this, 'slw') } style={ styles.back } name="rewind" size={30} color="#fff" />
            { playButton }
            <Icon onPress={ this.changeSpeed.bind(this, 'fst') } style={ styles.forward } name="fast-forward" size={30} color="#fff" />
            <Icon onPress={ this.resetPlay.bind(this) } style={ styles.forward } name="play-speed" size={30} color="#fff" />
        </View>
        <View
          style={{
            backgroundColor: '#A2A2A2',
            height: 2,
            width: window.width,
            marginTop: window.width/19,
            marginBottom: window.width/19,
          }}
        />
        </View>
        <View style={ styles.bottomPart }>
        <View style={ styles.controls }>
            <Icon onPress={ this.timeSecMinus.bind(this,'A') } style={ styles.back } name="rewind" size={30} color="#fff" />
            <TouchableOpacity onPress={ this.timeBt.bind(this,'A') } >
            <View style={styles.menuBox}>
              <Text style={styles.headerText}>A</Text>
              <Text style={styles.headerText}>{formattedTime(this.state.timeA)}</Text>
            </View>
            </TouchableOpacity>
            <Icon onPress={ this.timeSecPlus.bind(this,'A') } style={ styles.forward } name="fast-forward" size={30} color="#fff" />
            
        </View>
        <View style={ styles.sliderContainer }>
          <Slider
            onSlidingStart={ this.onSlidingStartA.bind(this) }
            onSlidingComplete={ this.onSlidingCompleteA.bind(this) }
            onValueChange={ this.onSlidingChangeA.bind(this) }
            //minimumTrackTintColor='#851c44'
            maximumTrackTintColor={en.appColours.button}
            maximumValue={this.state.songDuration}
            //style={ styles.slider }
            trackStyle={ styles.sliderTrack }
            thumbStyle={ styles.sliderThumb }
            value={ this.state.timeA }/>
        </View>
        
        <View style={ styles.controls }>
          <Icon onPress={ this.timeSecMinus.bind(this,'B') } style={ styles.back } name="rewind" size={30} color="#fff" />
            <TouchableOpacity onPress={ this.timeBt.bind(this,'B') } >
            <View style={styles.menuBox}>
              <Text style={styles.headerText}>B</Text>
              <Text style={styles.headerText}>{formattedTime(this.state.timeB)}</Text>
            </View>
            </TouchableOpacity>
            <Icon onPress={ this.timeSecPlus.bind(this,'B') } style={ styles.forward } name="fast-forward" size={30} color="#fff" />
        </View>
        <View style={ styles.sliderContainer }>
          {/*<Slider
            onSlidingStart={ this.onSlidingStart.bind(this) }
            onSlidingComplete={ this.onSlidingComplete.bind(this) }
            onValueChange={ this.onSlidingChange.bind(this) }
            minimumTrackTintColor='#851c44'
            style={ styles.slider }
            trackStyle={ styles.sliderTrack }
            thumbStyle={ styles.sliderThumb }
            value={ songPercentage }/>*/}
          <Slider
            onValueChange={ this.onSlidingChangeB.bind(this) }
            onSlidingStart={ this.onSlidingStartB.bind(this) }
            onSlidingComplete={ this.onSlidingCompleteB.bind(this) }
            minimumTrackTintColor={en.appColours.button}
            //maximumTrackTintColor='#851c44'
            maximumValue={this.state.songDuration}
            //thumbImage= '../assets/imp.jpg'
            //style={ styles.slider }
            trackStyle={ styles.sliderTrack }
            thumbStyle={ styles.sliderThumb }
            value={ timeB }
          />
        </View>
        
        </View>
      </View>
    );
  }
}
const { height } = Dimensions.get("window");
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    //backgroundColor: '#000',
  },
  topPart: {
    flex: 2,
    //flexWrap: 'wrap',
    alignItems: 'center',
    marginTop: window.width/19,
    //backgroundColor: '#000',
  },
  bottomPart: {
    flex: 3,
    flexWrap: 'wrap',
    alignItems: 'center',
    marginTop: window.width/12,
    //backgroundColor: '#000',
    justifyContent: 'space-evenly',
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
  loader: {
    flex: 1, 
    justifyContent: "center",
    alignItems: "center"
  },
  header: {
    marginTop: window.width/12,
    marginBottom: 10,
    width: window.width,
  },
  bar: {
    marginTop: window.width/12,
    alignItems: 'center',
  },
  headerClose: {
    position: 'absolute',
    top: 10,
    left: 0,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 20,
    paddingRight: 20,
  },
  headerText: {
    color: "#FFF",
    fontSize: 15,
    textAlign: 'center',
  },
  songImage: {
    marginBottom: 20,
  },
  songTitle: {
    color: "white",
    fontFamily: "Helvetica Neue",
    marginBottom: 7,
    marginTop: 13,
    fontSize: 19
  },
  albumTitle: {
    color: "#BBB",
    fontFamily: "Helvetica Neue",
    fontSize: 14,
    marginBottom: 7,
  },
  controls: {
    flexDirection: 'row',
    marginTop: 3,
    //alignItems: 'center',
    //justifyContent: 'center',
    //justifyContent: 'space-evenly',
  },
  back: {
    marginTop: 22,
    marginLeft: 45,
  },
  play: {
    marginLeft: 50,
    marginRight: 50,
  },
  forward: {
    marginTop: 22,
    marginRight: 45,
  },
  shuffle: {
    marginTop: 26,
  },
  volume: {
    marginTop: 26,
  },
  sliderContainer: {
    width: window.width - 40,
  },
  timeInfo: {
    flexDirection: 'row',
    marginTop: 3,
  },
  time: {
    color: '#FFF',
    flex: 1,
    fontSize: 13,
  },
  speed: {
    color: '#FFF',
    flex: 1,
    textAlign: 'center',
    fontSize: 13,
  },
  timeRight: {
    color: '#FFF',
    textAlign: 'right',
    flex: 1,
    fontSize: 13,
  },
  slider: {
    height: 2,
  },
  sliderTrack: {
    height: 2,
    backgroundColor: '#333',
  },
  sliderThumb: {
    width: 20,
    height: 20,
    backgroundColor: en.appColours.button,
    borderRadius: 20 / 2,
    //text: 'A'
    //shadowColor: 'red',
    //shadowOffset: {width: 0, height: 0},
    //shadowRadius: 2,
    //shadowOpacity: 1,
  },
  menuBox:{
    backgroundColor: en.appColours.button,
    flexDirection: 'column',
    width:60,
    height:60,
    alignItems: 'center',
    justifyContent: 'center',
    margin:2,
    marginLeft: 50,
    marginRight: 50,
  },
});

//TODO: Move this to a Utils file
function withLeadingZero(amount){
  if (amount < 10 ){
    return `0${ amount }`;
  } else {
    return `${ amount }`;
  }
}

function formattedTime( timeInSeconds ){
  let minutes = Math.floor(timeInSeconds / 60);
  let seconds = timeInSeconds - minutes * 60;

  if( isNaN(minutes) || isNaN(seconds) ){
    return "";
  } else {
    return(`${ withLeadingZero( minutes ) }:${ withLeadingZero( seconds.toFixed(0) ) }`);
  }
}


export default TrackPlayer;