import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  Dimensions
} from 'react-native';
import Video from 'react-native-video';
import * as en from '../locales/en.json';
import Spinner from 'react-native-loading-spinner-overlay';
const window = Dimensions.get('window');
import AsyncStorage from '@react-native-community/async-storage';
// https://www.instamobile.io/react-native-tutorials/asyncstorage-example-react-native/
// https://reactnativecode.com/react-native-user-login-using-php-mysql/
class login extends Component {

  constructor(props) {
    super(props);
    this.state = {
      email   : '',
      password: '',
      loading: false
    }
    console.log("Login dt: ", global.isLogedIN);
  }

  onClickListener = (viewId) => {
    Alert.alert("Alert", "Button pressed2 "+viewId);
  }
  async storeToken(user) {
    try {
       await AsyncStorage.setItem("userData", JSON.stringify(user));
    } catch (error) {
      console.log("Something went wrong", error);
    }
  }
  UserLoginFunction = () =>{
    this.setState({loading: true});
    const id  = this.state.email ;
    const pass  = this.state.password ;
    
    
    fetch('http://swsstudio.in/portal/app/userLogin.php', {
     method: 'POST',
     headers: {
       'Accept': 'application/json',
       'Content-Type': 'application/json',
     },
     body: JSON.stringify({
    
       id: id,
    
       pass: pass
    
     })
    
  }).then((response) => response.json())
    .then((responseJson) => {

      let loginData = responseJson[0];
      this.setState({loading: false});
      // If server response message same as Data Matched
      if(loginData.IS_LOGGED_IN)
      {
        //Then open Profile activity and send user email to profile activity.
        this.props.navigation.navigate('Tools', { Email: 'UserEmail' });
        if(loginData.ROLE == 'ADMIN'){
          let dt = JSON.stringify(loginData);
          this.storeToken(dt);
          Alert.alert(loginData.FIRST_NAME);
        }
        else{
          Alert.alert(loginData.FIRST_NAME);
        }

      }
      else{
        Alert.alert(loginData.ROLE);
      }

    }).catch((error) => {
      console.error(error);
      Alert.alert(error);
      this.setState({loading: false});
    });
    
  }
  render() {
    return (
      <View style={styles.container}>
        <Spinner
          //visibility of Overlay Loading Spinner
          visible={this.state.loading}
          //Text with the Spinner 
          textContent={'Loging...'}
          //Text style of the Spinner Text
          textStyle={styles.spinnerTextStyle}
        />
        
        <Text style={styles.loginHeader}>Login</Text>
        <View style={styles.inputContainer}>
          <Image style={styles.inputIcon} source={{uri: 'https://img.icons8.com/plasticine/50/000000/user.png' }}/>
          <TextInput style={styles.inputs}
              placeholder="Enter ID No."
              keyboardType="email-address"
              underlineColorAndroid='transparent'
              onChangeText={(email) => this.setState({email})}/>
        </View>
        
        <View style={styles.inputContainer}>
          <Image style={styles.inputIcon} source={{uri: 'https://png.icons8.com/key-2/ultraviolet/50/3498db'}}/>
          <TextInput style={styles.inputs}
              placeholder="Password"
              secureTextEntry={true}
              keyboardType="email-address"
              underlineColorAndroid='transparent'
              onChangeText={(password) => this.setState({password})}/>
        </View>

        <TouchableOpacity style={[styles.buttonContainer, styles.loginButton]} onPress={() => this.UserLoginFunction()}>
          <Text style={styles.loginText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonContainer} onPress={() => this.onClickListener('restore_password')}>
            <Text>Forgot your password?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonContainer} onPress={() => this.onClickListener('register')}>
            <Text>Register</Text>
        </TouchableOpacity>
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
  inputContainer: {
      borderBottomColor: '#F5FCFF',
      backgroundColor: '#FFFFFF',
      borderRadius:30,
      borderBottomWidth: 1,
      width:250,
      height:45,
      marginBottom:20,
      flexDirection: 'row',
      alignItems:'center'
  },
  inputs:{
      height:45,
      marginLeft:16,
      borderBottomColor: '#FFFFFF',
      flex:1,
  },
  inputIcon:{
    width:30,
    height:30,
    marginLeft:15,
    justifyContent: 'center'
  },
  buttonContainer: {
    height:45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom:20,
    width:250,
    borderRadius:30,
  },
  loginButton: {
    backgroundColor: "#00b5ec",
  },
  loginText: {
    color: 'white',
  },
  loginHeader: {
    fontSize: 28,
    //color: 'white',
    fontWeight: "300",
    marginBottom: 40
  },
  backgroundVideo: {
    height: window.height,
    position: "absolute",
    top: 0,
    left: 0,
    alignItems: "stretch",
    bottom: 0,
    right: 0
  }
});

/*
switch render

{inputType === "password" ? (
          <TouchableOpacity
            style={styles.showButton}
            onPress={this.toggleShowPassword}
          >
            <Text style={styles.showButtonText}>
              {secureInput ? "Show" : "Hide"}
            </Text>
          </TouchableOpacity>
        ) : null}


<Video
          source={require("../assets/recBG.mp4")}
          //source={{uri:"http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"}}
          onLoad={ (params)=> {}}
          //poster={"https://www.fillmurray.com/360/640"}
          style={styles.backgroundVideo}
          //paused={!this.state.playing}
          muted={true}
          repeat={true}
          hideShutterView={true}
          resizeMode={"cover"}
          rate={0.4}
          ignoreSilentSwitch={"obey"}
        />
        

*/
export default login;