/*This is an Example of Grid View in React Native*/
import React, { Component } from 'react';
//import rect in our project
import {
  StyleSheet,
  View,
  FlatList,
  ActivityIndicator,
  Image,
  Text,
  TouchableOpacity,
  Dimensions
} from 'react-native';
//import all the components we will need
import * as en from '../locales/en.json';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
var RNFS = require('react-native-fs');
const window = Dimensions.get('window');

class TrackList extends React.Component {
  constructor() {
    super();
    this.state = {
      dataSource: {},
    };
  }
  componentDidMount() {
    var self = this;
    RNFS.readDir(`${RNFS.DocumentDirectoryPath}/SWS_STUDIO/AUDIO`) // On Android, use "RNFS.DocumentDirectoryPath" (MainBundlePath is not defined)
    .then((result) => {
        let filerData = result.filter(function(item){
            //return item.name.toLowerCase().endsWith(".mp3");
            return item.name.split('.').pop().toLowerCase().includes("mp3") ||
                  item.name.split('.').pop().toLowerCase().includes("aac");
        })
        self.setState({
            dataSource: filerData,
        });
        return Promise.all([RNFS.stat(result[0].path), result[0].path]);
    })
    .then((statResult) => {
    
        if (statResult[0].isFile()) {
            // if we have a file, read it
            return RNFS.readFile(statResult[1], 'utf8');
        }
        return 'no file';
    })
    .then((contents) => {
        // log the file contents
        console.log(contents);
    })
    .catch((err) => {
        console.log(err.message, err.code);
    });

  }
  /*static navigationOptions = {
    //Setting the header of the screen
    title: 'Track Page',
  };*/
  render() {
    //FlatList : https://aboutreact.com/example-of-gridview-using-flatlist-in-react-native/
    //React-native-fs : https://www.npmjs.com/package/react-native-fs/v/1.2.0
    //circular-progress : https://www.npmjs.com/package/react-native-circular-progress
    const {navigate} = this.props.navigation;
    return (
        <View style={[styles.viewStyle]} >
            <FlatList
            data={this.state.dataSource}
            renderItem={({ item }) => (
                
                <TouchableOpacity
                    style={[styles.list]} 
                    onPress={() => navigate('TrackPlayer', {name: item })}
                >
                    <Image
                        source={require('../assets/play.png')}
                        style={{ width: 40, height: 40, margin: 6 }}
                    />
                
                <View style={{ flex: 1, alignSelf: 'stretch' }} >
                    <Text style={styles.headingText}>NAME:  {item.name }  </Text>
                    <Text style={styles.lightText}>PRACTISE (%): 100 </Text>
                    <Text style={styles.lightText}>LAST UPDATE:  2nd Feb 2020 09:00 PM  </Text>
                </View>
                </TouchableOpacity>
                
            )}
            //Setting the number of column
            //numColumns={parseInt(window.width/120)}
            keyExtractor={(item, index) => index.toString()}
            />
        </View>
        
    );
  }
}
 
const styles = StyleSheet.create({
  viewStyle: {
    flex: 1, 
    alignSelf: 'stretch', 
    margin: 10,
    marginTop: 15,
    backgroundColor: en.appColours.backGround,
  },
  list: {
    paddingVertical: 5,
    margin: 3,
    flexDirection: "row",
    backgroundColor: "#eff3c6",
    justifyContent: "flex-start",
    alignItems: "center",
    zIndex: -1
  },
  headingText: {
    color: "purple",
    paddingLeft: 15,
    fontSize: 15
   },
   lightText: {
    color: "purple",
    paddingLeft: 15,
    fontSize: 13
   },
});
export default TrackList;