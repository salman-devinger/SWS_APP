import React from 'react';
import { View, Text, ActivityIndicator, PermissionsAndroid} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as en from '../locales/en.json';
import SoundPlayer from 'react-native-sound-player';
import Video from 'react-native-video';
var RNFS = require('react-native-fs');
// https://www.npmjs.com/package/react-native-exit-app
class SplashScreen extends React.Component {
  async componentDidMount() {
    if (Platform.OS === 'android') {
      PermissionsAndroid.requestMultiple(
        [PermissionsAndroid.PERMISSIONS.CAMERA, 
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO, 
        PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE]
        ).then((result) => {
          if (result['android.permission.ACCESS_COARSE_LOCATION']
          && result['android.permission.CAMERA']
          && result['android.permission.RECORD_AUDIO']
          && result['android.permission.ACCESS_FINE_LOCATION']
          && result['android.permission.READ_EXTERNAL_STORAGE']
          && result['android.permission.WRITE_EXTERNAL_STORAGE'] === 'granted') {
            console.log("PERM GRTD");
            this.setState({
              permissionsGranted: true
            });
          } else if (result['android.permission.ACCESS_COARSE_LOCATION']
          || result['android.permission.CAMERA']
          || result['android.permission.RECORD_AUDIO']
          || result['android.permission.ACCESS_FINE_LOCATION']
          || result['android.permission.READ_EXTERNAL_STORAGE']
          || result['android.permission.WRITE_EXTERNAL_STORAGE'] === 'never_ask_again') {
            this.refs.toast.show('Please Go into Settings -> Applications -> APP_NAME -> Permissions and Allow permissions to continue');
          }
        });
    }

    const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
    //whoosh = new Sound(require('../assets/test_sal.mp3'), (error) => {
    try {
      // or play from url
      //SoundPlayer.playUrl(RNFS.ExternalStorageDirectoryPath + '/Download/test_sal.mp3');
      //SoundPlayer.playUrl('/storage/emulated/0/Download/test_sal.mp3');
      //SoundPlayer.playSoundFile('test','mp3');
      //SoundPlayer.playUrl('https://geekanddummy.com/wp-content/uploads/2014/01/2-Kids-Laughing.mp3')
      //SoundPlayer.seek(73);
    } catch (e) {
        console.log(`cannot play the sound file`, e)
    }
    await sleep(4000);
    this.props.navigation.navigate('App');
  }
  async getInfo() { // You need the keyword `async`
    try {
      const info = await SoundPlayer.getInfo() // Also, you need to await this because it is async
      console.log('getInfo', info) // {duration: 12.416, currentTime: 7.691}
    } catch (e) {
      console.log('There is no song playing', e)
    }
  }
  componentWillUnmount() {
    //SoundPlayer.stop();
  }
  render() {
    return (
      <View style={styles.container}>
        <Video source={require("./../assets/sws_intro.mp3")}
            ref="audio"
            volume={ 1.0}
            resizeMode="cover"
            repeat={true} />
        <View style={styles.appDescContainer}>
          <Icon name="music-circle" style={styles.iconDesc} />
          <Text style={styles.appTitle}>
            SWS STUDIO
          </Text>
          <Text style={styles.appDesc}>
            Music Accademy
          </Text>
        </View>
        <View style={styles.loadingContainer}>
          <Text style={styles.loading}>
            Loading...
          </Text>
          <ActivityIndicator size='large' color='white' />
        </View>
      </View>
    );
  } 
}
const styles = {
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    //backgroundColor: '#E91E63'
    backgroundColor: en.appColours.splash
  },
  appDescContainer: {
    height: 50,
    marginTop: 'auto',
    paddingTop: 20,
    alignSelf: 'center',
    width: '95%'
  },
  iconDesc: {
    color: 'white',
    marginBottom: 10,
    fontSize: 90,
    textAlign: 'center',
    margin: 10
  },
  appTitle: {
    color: 'white',
    //marginBottom: 50,
    fontSize: 40,
    textAlign: 'center',
    margin: 10
  },
  appDesc: {
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
    margin: 10
  },
  loadingContainer: {
    marginTop: 'auto',
    width: '95%',
    marginBottom: 50
  },
  loading: {
    color: 'white',
    marginTop: 30,
    fontSize: 20,
    textAlign: 'center',
    margin: 10
  }
}

export default SplashScreen;