import React, { Component } from 'react';
import { StyleSheet, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';


class WebsitePage extends Component {
    ActivityIndicatorLoadingView() {
        //making a view to show to while loading the webpage
        return (
            <ActivityIndicator size="large" color="purple" style = { styles.loader }/>
        );
    }
    render() {

      const { navigation } = this.props;
      let PAGE_URL = navigation.getParam('URL', 'http://swsstudio.in/portal/');
        return (
          <WebView 
            source={{ uri: PAGE_URL }} 
            javaScriptEnabled={true}
            //View to show while loading the webpage
            renderLoading={this.ActivityIndicatorLoadingView}
            //Want to show the view or not
            startInLoadingState={true}
          />
        );
    }
}

const styles = StyleSheet.create({
    loader: {
        flex: 1, 
        justifyContent: "center",
        alignItems: "center"
    }
});
export default WebsitePage;