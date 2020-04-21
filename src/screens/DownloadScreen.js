import React from 'react';
import {
  Text,
  StyleSheet,
  View,
  FlatList,
  TextInput,
  ActivityIndicator,
  Image,
  Alert,Picker,
  Button, TouchableOpacity, Dimensions
} from 'react-native';
import * as en from '../locales/en.json';
var RNFS = require('react-native-fs');
import RNBackgroundDownloader from 'react-native-background-downloader';
import Toast from 'react-native-simple-toast';

// Source : https://hackernoon.com/how-to-highlight-and-multi-select-items-in-a-flatlist-component-react-native-1ca416dec4bc

class DownloadScreen extends React.Component {
  /*static navigationOptions = {
    title: 'About'
  };*/
  constructor(props) {
    super(props);
    //setting default state
    this.state = { isLoading: true, text: '', isVisible: false };
    this.arrayholder = [];
  }
  componentDidMount() {
    return fetch('http://swsstudio.in/portal/app/getExerciseList.php')
      .then(response => response.json())
      .then(responseJson => {
        let cat = [...new Set(responseJson.map(({CATEGORY_NAME})=>CATEGORY_NAME))];
        let subCat = [...new Set(responseJson.map(({SUB_CATEGORY_NAME})=>SUB_CATEGORY_NAME))];
        let selectedCat = cat[0];
        let selectedSubCat = subCat[0];
        let catItems = cat.map( (s, i) => {
          return <Picker.Item key={i} value={s} label={s} />;
        });
        let subCatItems = subCat.map( (s, i) => {
          return <Picker.Item key={i} value={s} label={s} />;
        });
        let filteredData = responseJson.filter(function(item) {
            //applying filter for the selected category and sub-category
            return (
                item.CATEGORY_NAME == selectedCat &&
                item.SUB_CATEGORY_NAME == 'ALL_SUB_CATEGORY'
            );
        });
        this.setState(
          {
            isLoading: false,
            dataSource: filteredData,
            category: cat,
            subCategory: subCat,
            catItems: catItems,
            subCatItems: subCatItems,
            selectedCat: selectedCat,
            selectedSubCat: selectedSubCat
          },
          function() {
            this.arrayholder = responseJson;
          }
        );
      })
      .catch(error => {
        console.error(error);
      });
  }
  SearchFilterFunction(text) {
    //passing the inserted text in textinput
    const self = this;
    const newData = self.arrayholder.filter(function(item) {
      //applying filter for the inserted text in search bar
      const itemData = item.EXERCISE_NAME ? item.EXERCISE_NAME.toUpperCase() : ''.toUpperCase();
      const textData = text.toUpperCase();
      
      return (
          ((textData.trim() == '') ? true : (itemData.indexOf(textData) > -1)) &&
          (item.CATEGORY_NAME == self.state.selectedCat ) &&
          (item.SUB_CATEGORY_NAME == self.state.selectedSubCat )
      )
    });
    
    this.setState({
      //setting the filtered newData on datasource
      //After setting the data it will automatically re-render the view
      dataSource: newData,
      text: text,
    });
  }
  DropDownFilterCat(cat) {
    const newData = cat =='ALL_CATEGORY' ? this.arrayholder :    
    this.arrayholder.filter(function(item) {
      //applying filter for the selected category and sub-category
      return (item.CATEGORY_NAME).indexOf(cat) > -1;
    });
    this.setState({
      //setting the filtered newData on datasource
      //After setting the data it will automatically re-render the view
      dataSource: newData,
      selectedCat: cat,
      selectedSubCat: 'ALL_SUB_CATEGORY'
    });
  }
  DropDownFilterSubCat(subCat) {
    const cat = this.state.selectedCat;
    const newData = this.arrayholder.filter(function(item) {
      //applying filter for the selected category and sub-category
      return (item.CATEGORY_NAME).indexOf(cat) > -1 &&
        (item.SUB_CATEGORY_NAME).indexOf(subCat) > -1;
    });
    this.setState({
      //setting the filtered newData on datasource
      //After setting the data it will automatically re-render the view
      dataSource: newData,
      selectedSubCat: subCat
    });
  }
  onOptionSelect(filePath, fileName){
    Toast.show('Starting Download...', Toast.LONG, ['UIAlertController',]);
    let task = RNBackgroundDownloader.download({
      id: 'file123',
      url: filePath,
      destination: `${RNFS.DocumentDirectoryPath}/SWS_STUDIO/AUDIO/${fileName}`
    }).begin((expectedBytes) => {
        
    }).progress((percent) => {
        
    }).done(() => {
        Toast.show('File Downloaded Successfully', Toast.LONG, ['UIAlertController',]);
    }).error((error) => {
        Toast.show('Something went wrong !!!', Toast.LONG, ['UIAlertController',]);
    });
    // Pause the task
    //task.pause();
    
    // Resume after pause
    //task.resume();
    
    // Cancel the task
    //task.stop();
  }
  ListViewItemSeparator = () => {
    //Item sparator view
    return (
        <View style={styles.line} />
    );
  };
  render() {
    const {navigate} = this.props.navigation;
    if (this.state.isLoading) {
      //Loading View while data is loading
      return (
        <View style={styles.loader}>
            <ActivityIndicator size="large" color="purple" />
        </View>
      );
    }
    return (
      //ListView to show with textinput used as search bar
      <View style={styles.viewStyle}>
        <View style={{flex: 1, justifyContent: 'space-between',alignSelf: 'center', borderColor: '#009688',borderBottomWidth:1}}>
        <View style={{ flex: 0.7, alignSelf: 'center', flexDirection: 'row', marginBottom:20 }}>
          <View style={{ flex: 1, alignSelf: 'stretch', borderColor: '#009688',borderBottomWidth:1, marginRight:10 }} >
            <Picker selectedValue = {this.state.selectedCat} 
              style={{borderColor: '#009688',borderBottomWidth:1}}
              onValueChange={(itemValue, itemIndex) => {
                this.DropDownFilterCat(itemValue);
              }
            }>
              {this.state.catItems}
            </Picker>
          </View>
          <View style={{ flex: 1, alignSelf: 'stretch', borderColor: '#009688',borderBottomWidth:1}} >
            <Picker selectedValue = {this.state.selectedSubCat} 
              style={{borderColor: '#009688',borderBottomWidth:1}}
              onValueChange={(itemValue, itemIndex) => {
                this.DropDownFilterSubCat(itemValue);
              }
            }>
              {this.state.subCatItems}
            </Picker>
          </View>
        </View>
        <View style={{ flex: 1, alignSelf: 'stretch'}} >
          <TextInput
          style={styles.textInputStyle}
          onChangeText={text => this.SearchFilterFunction(text)}
          value={this.state.text}
          underlineColorAndroid="transparent"
          placeholder="Search Exercise"
        />
        </View>
        </View>
        <View style={{flex: 3}}>
        <FlatList
          data={this.state.dataSource}
          initialNumToRender={50}
          renderItem={({ item }) => (
            
                <View
                    style={[styles.list]} 
                >
                    <TouchableOpacity onPress={() => {
                        Toast.show(`Playing ${item.FILE_NAME}`, Toast.LONG, ['UIAlertController',]);
                        let tmpItem = {};
                        tmpItem.name = item.FILE_NAME,
                        tmpItem.path = item.FILE_PATH;
                        navigate('TrackPlayer', {name: tmpItem });
                    }}>
                        <Image
                            source={require('../assets/play.png')}
                            style={{ width: 40, height: 40, margin: 6 }}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        this.onOptionSelect(item.FILE_PATH, item.FILE_NAME)
                    }}>
                        <Image
                            source={require('../assets/download.png')}
                            style={{ width: 40, height: 40, margin: 6 }}
                        />
                    </TouchableOpacity>
                    <View style={{ flex: 1, alignSelf: 'stretch' }} >
                        <Text style={styles.headingText}>NAME:  {item.EXERCISE_NAME }  </Text>
                        <Text style={styles.lightText}>CATEGORY: {item.CATEGORY_NAME }  </Text>
                        <Text style={styles.lightText}>SUB CATEGORY:  {item.SUB_CATEGORY_NAME }  </Text>
                    </View>
                </View>
            )}
          style={{ marginTop: 10 }}
          keyExtractor={(item, index) => index.toString()}
        />
        </View>
      </View>
    );
    

  }
}
const styles = StyleSheet.create({
  viewStyle: {
    justifyContent: 'center',
    alignSelf: 'center',
    flex: 1,
    flexWrap: 'wrap',
    padding: 16,
    backgroundColor: en.appColours.backGround,
  },
  line: {
    height: 0.5,
    width: "100%",
    backgroundColor:"blue"
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
    fontSize: 13
   },
   lightText: {
    color: "purple",
    paddingLeft: 15,
    fontSize: 11
   },
   loader: {
    flex: 1, 
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: en.appColours.backGround
  },
  textStyle: {
    padding: 10,
  },
  textInputStyle: {
    height: 40,
    borderWidth: 1,
    //paddingTop:10,
    paddingRight:10,
    paddingLeft: 10,
    paddingBottom: 10,
    //marginBottom:15,
    borderColor: '#009688',
    backgroundColor: '#FFFFFF',
  }
});

export default DownloadScreen;