import React, { Component } from 'react';

import { Platform, StyleSheet, View, FlatList, ActivityIndicator, Image, Modal, TouchableOpacity } from 'react-native';
// Src : https://reactnativecode.com/creating-image-gallery/
class GalleryScreen extends Component {

    constructor()
    {
      super();
    
      this.state = { 

      isLoading: true,

      ModalVisibleStatus: false,

      TempImageURL : ''
        
     }
    }
    
    componentDidMount() {
        
           return fetch('http://swsstudio.in/portal/app/getExerciseList.php')
             .then((response) => response.json())
             .then((responseJson) => {
               this.setState({
                 isLoading: false,
                 dataSource: responseJson
               }, function() {
                 // In this block you can do something with new state.
               });
             })
             .catch((error) => {
               console.error(error);
             });
         }

    ShowModalFunction(visible, imageURL) 
    {
 
      this.setState({

        ModalVisibleStatus: visible,

        TempImageURL : imageURL});
        
    }
    
    render() {

        if (this.state.isLoading) {

            return (

              <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>

                <ActivityIndicator size="large" />

              </View>
            
          );
          
        }

      return (
    
   <View style={styles.MainContainer}>
    
         <FlatList
         
            data={ this.state.dataSource }
    
            renderItem={({item}) => 
            
              <View style={{flex:1, flexDirection: 'column', margin:1 }}> 

                <TouchableOpacity onPress={this.ShowModalFunction.bind(this, true, 'https://swsstudio.in/img/front3.jpg')} >
                
                  <Image style={styles.imageThumbnail} source = {{ uri: 'https://swsstudio.in/img/front3.jpg' }} />

                </TouchableOpacity>

              </View> 
            
            }

            numColumns = { 2 }

            keyExtractor={(item, index) => index}
    
           />

           {
             this.state.ModalVisibleStatus 
             
             ?

              (
                <Modal
              transparent={false}

              animationType={"fade"}

              visible={this.state.ModalVisibleStatus}

              onRequestClose={ () => { this.ShowModalFunction(!this.state.ModalVisibleStatus)} } >

                <View style={styles.modalView}>

                    <Image style={styles.mainImage} source = {{ uri: this.state.TempImageURL }} />

                      <TouchableOpacity 
                        activeOpacity = { 0.5 }
                        style={styles.TouchableOpacity_Style}
                        onPress={() => { this.ShowModalFunction(!this.state.ModalVisibleStatus)} } >
  
                          <Image source={{uri: 'https://reactnativecode.com/wp-content/uploads/2018/01/close_button.png'}}
                          style={{width:25, height: 25}} />
  
                      </TouchableOpacity>

                  </View>

              </Modal>
              ) 

              :

              null

           }

      
   </View>
              
      );
    }
}

const styles = StyleSheet.create({

MainContainer :{

justifyContent: 'center',
flex:1,
paddingTop: (Platform.OS) === 'ios' ? 20 : 0

},

imageThumbnail: {

    justifyContent: 'center',
    alignItems: 'center',
    height: 100

},

mainImage:{

justifyContent: 'center',
alignItems: 'center',
height: '100%',
width:'98%',
resizeMode : 'contain'

},

modalView:{

flex:1, 
justifyContent: 'center', 
alignItems: 'center', 
backgroundColor: 'rgba(0,0,0,0.4)'

},

TouchableOpacity_Style:{

width:25, 
height: 25, 
top:9, 
right:9, 
position: 'absolute'

}


});
export default GalleryScreen;