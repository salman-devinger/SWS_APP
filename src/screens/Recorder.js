// https://www.npmjs.com/package/react-native-sound-recorder

// audio recorder
import React from 'react';
import {
  Text,
  StyleSheet,
  View,
  FlatList,
  ActivityIndicator,
  Alert,
  Button,
  TextInput
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as en from '../locales/en.json';
import {AudioRecorder, AudioUtils} from 'react-native-audio';
import DialogInput from 'react-native-dialog-input';
var RNFS = require('react-native-fs');
import Video from 'react-native-video';

class Recorder extends React.Component {
  constructor(props) {
    super(props);
    //setting default state
    //this.state = { isLoading: true, text: '' };
    //this.arrayholder = [];
    this.state = {
        curTime: '00:00',
        audioFile: '',
        audioPath: '',
        recording: false,
        paused:false,
        loaded: false,
        isDialogVisible: false,
        stopIcon: styles.stopIconDisabled,
        delIcon: styles.delIconDisabled
    };

    RNFS.mkdir(`${RNFS.DocumentDirectoryPath}/SWS_STUDIO/AUDIO`)
    .then((result) => {
        console.log('result', result)
    })
    .catch((err) => {
        console.warn('err', err)
    })
  }
  formattedTime( timeInSeconds ){
    let minutes = Math.floor(timeInSeconds / 60);
    let seconds = timeInSeconds - minutes * 60;
  
    if( isNaN(minutes) || isNaN(seconds) ){
      return "";
    } else {
      return(`${ this.withLeadingZero( minutes ) }:${ this.withLeadingZero( seconds.toFixed(0) ) }`);
    }
    }
  //TODO: Move this to a Utils file
  withLeadingZero(amount){
    if (amount < 10 ){
      return `0${ amount }`;
    } else {
      return `${ amount }`;
    }
  }
  startRec(self){
    if((!self.state.recording) && (!self.state.paused)){
        self.setState({ recording: true, curTime: self.formattedTime(0), stopIcon: styles.stopIconEnabled, delIcon: styles.delIconDisabled });
        let sourcePath = `${RNFS.DocumentDirectoryPath}/SWS_STUDIO/AUDIO/SWS_RECORDING.aac`;
        this.state.audioPath = sourcePath;
        AudioRecorder.prepareRecordingAtPath(sourcePath, {
        SampleRate: 48000,
        Channels: 1,
        AudioQuality: "High",
        AudioEncoding: "aac"
        });
        AudioRecorder.startRecording();

        AudioRecorder.onProgress = (data) => {
            console.log("Data here22",self.formattedTime(data.currentTime));
            self.setState({ curTime: self.formattedTime(data.currentTime) });
        };
    }
    else if(self.state.paused){
        AudioRecorder.resumeRecording();
        self.setState({ recording: true, paused: false });
    }
  }
  stopRec(self){
    if(this.state.recording || this.state.paused){
        AudioRecorder.stopRecording();
        self.setState({ isDialogVisible: true, delIcon: styles.delIconEnabled, stopIcon: styles.stopIconDisabled, recording: false, paused: false });
    }
    //AudioRecorder.pauseRecording();
    //AudioRecorder.resumeRecording();
  }
  pauseRec(self){
    if(self.state.recording){
        AudioRecorder.pauseRecording();
        self.setState({ paused: true, recording: false });
    }
    console.log("Rec Paused..");
    //AudioRecorder.pauseRecording();
    //AudioRecorder.resumeRecording();
  }
  CloseDialog(self, text){
    let destPath =  `${RNFS.DocumentDirectoryPath}/SWS_STUDIO/AUDIO/${text}.aac`;
    let srcPath = decodeURIComponent(this.state.audioPath)
    self.setState({ isDialogVisible: false, audioFile: text, audioPath: destPath });
    
    RNFS.moveFile(srcPath, destPath)
    .then((success) => {
      console.log('file moved!');
    })
    .catch((err) => {
      console.log("Error: " + err.message);
    });
  }
  delRec(self){
    let delPath = self.state.audioPath;
    if(delPath != ''){
        RNFS.unlink(delPath)
        .then(() => {
            console.log('FILE DELETED');
        })
        // `unlink` will throw an error, if the item to unlink does not exist
        .catch((err) => {
            console.log(err.message);
        });
        self.setState({ audioFile: '', audioPath: '', curTime: '00:00', delIcon: styles.delIconDisabled });
    }
  }
  componentDidMount() {
    
  }
  componentWillUnmount() {
    if(this.state.recording){
        AudioRecorder.stopRecording();
    }
  }
  render() {
    let recButton;
    if( this.state.recording ){
      recButton = <Icon name="pause-circle" style={styles.iconRec} onPress={() => this.pauseRec(this)} />;
    } else {
        recButton = <Icon name="record-rec" style={styles.iconRec} onPress={() => this.startRec(this)} />;
    }
    return (
    <View style={styles.container}>
      <View style={styles.container}>
            <Icon name="record-player" type='font-awesome' style={styles.buttonR} />
        </View>
        <View style={styles.container}>
        <View style={styles.container}>
          <Text style={styles.appDesc}>
            {this.state.curTime }
          </Text>
        </View>
        <View style={styles.buttonContainer}>
        <Icon name="delete-circle" style={this.state.delIcon} onPress={() => this.delRec(this)} />
        { recButton }
        <Icon name="stop-circle" style={this.state.stopIcon} onPress={() => this.stopRec(this)} />
        </View>
        </View>
        <DialogInput isDialogVisible={this.state.isDialogVisible}
            title={"File Name"}
            message={"Recording Stopped!! Enter file name"}
            hintInput ={"Enter File Name"}
            submitInput={ (ipText) =>{ this.CloseDialog(this, ipText ) }}
            closeDialog={ () =>{ this.CloseDialog(this, 'UNNAMED_RECORDING_'+Math.floor(Math.random() * 100000) + 1 ) }}
        >
        </DialogInput>
      </View>
    );
  }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: en.appColours.backGround
    },
    buttonContainer: {
        flex: 2,
        justifyContent: 'space-evenly',
        alignItems: 'center',
        flexDirection: 'row'
    },
    buttonR: {
        color: en.appColours.button,
        marginBottom: 10,
        fontSize: 150,
        textAlign: 'center',
        margin: 10
    },
    stopIconEnabled: {
        color: en.appColours.button,
        marginBottom: 10,
        fontSize: 60,
        textAlign: 'center',
        margin: 10
    },
    stopIconDisabled: {
        color: en.appColours.buttonDisabled,
        marginBottom: 10,
        fontSize: 60,
        textAlign: 'center',
        margin: 10
    },
    delIconEnabled: {
        color: en.appColours.button,
        marginBottom: 10,
        fontSize: 60,
        textAlign: 'center',
        margin: 10
    },
    delIconDisabled: {
        color: en.appColours.buttonDisabled,
        marginBottom: 10,
        fontSize: 60,
        textAlign: 'center',
        margin: 10
    },
    iconRec: {
        color: en.appColours.button,
        marginBottom: 10,
        fontSize: 150,
        textAlign: 'center',
        margin: 10
    },
    appDesc: {
        color: en.appColours.button,
        marginBottom: 50,
        fontSize: 70,
        textAlign: 'center',
        margin: 10
    },
    loadingContainer: {
        marginTop: 'auto',
        width: '95%',
        marginBottom: 50
    },
    loading: {
        color: en.appColours.button,
        //marginTop: 30,
        fontSize: 20,
        textAlign: 'center',
        margin: 10
    },
    backgroundVideo: {
      //height: height,
      //position: "absolute",
      top: 0,
      left: 0,
      alignItems: "stretch",
      bottom: 0,
      right: 0
    },
});


export default Recorder;