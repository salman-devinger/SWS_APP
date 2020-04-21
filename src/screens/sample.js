import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import Slideshow from 'react-native-image-slider-show';
class AboutScreen extends React.Component {
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
  
  componentDidMount() {
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
        <Text style={{textAlign: 'justify',color:'#1B3D6C', margin: 20}}>
          Lorem ipsum dolor sit amet, et usu congue vocibus, ei sea alienum repudiandae, intellegam quaerendum an nam. Vocibus apeirian no vis, eos cu conguemoo scaevola accusamus. Et sea placerat persecutii oinn
        </Text>
      </View>
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
    backgroundColor: '#fce4ec',
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
    //flexDirection: 'row',
    //alignItems: 'center',
    //justifyContent: 'space-evenly',
    
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

export default AboutScreen;