import Landing from './src/lib/src/app/components/Landing';
import configureStore from './src/lib/src/app/store/';
import { Root } from 'native-base';
import {
  NavigatorIOS,
  AppRegistry,
  StyleSheet,
} from 'react-native';
import { Provider } from 'react-redux';
import React, { Component } from 'react';


console.ignoredYellowBox = ['Using <Image> with children is deprecated and will be an error in the near future. Please reconsider the layout or use <ImageBackground> instead.'];

const store = configureStore();
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
});

class Circlus extends Component {

  render() {
    return (
      <Root>
        <Provider store={ store }>
          <NavigatorIOS
            style={ styles.container }
            navigationBarHidden={ true }
            initialRoute={ {
              title: 'Title',
              component: Landing,
            } }
          />
        </Provider>
      </Root>
    );
  }

}

AppRegistry.registerComponent('Circlus', () => Circlus);

export { Circlus as default };
