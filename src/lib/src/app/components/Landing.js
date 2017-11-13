import DealDetail from './DealDetail';
import MyDeals from './MyDeals';
import Login from './Login';
import { Toast } from 'native-base';
import {
  Linking,
  AsyncStorage,
  Alert,
} from 'react-native';
import { Component } from 'react';
import PropTypes from 'prop-types';
import qs from 'qs';


class Landing extends Component {

  static propTypes = {
    navigator: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  };

  componentDidMount() {
    Linking.getInitialURL()
      .then((url) => {
        if (url) {
          this._handleOpenFromURL({ url });
        } else {
          this.props.navigator.replace({
            component: Login,
          });
        }
      })
      .catch((err) => {
        Alert.alert('Error', `Getting launch URL failed: ${err.message}`);
      });

    Linking.addEventListener('url', this._handleOpenFromURL);
  }

  componentWillUnmount() {
    //Linking.removeEventListener('url', this._handleOpenFromURL);
  }

  _handleOpenFromURL = async (event) => {
    const url = event.url.split('?');
    const path = url[0];
    const params = url[1] ? qs.parse(url[1]) : null;

    if (path) {
      if (params && params.deal) {
        const dealId = params.deal;
        const myDealsString = await AsyncStorage.getItem('@LocalDatabase:myDeals');
        let myDeals;

        if (myDealsString) {
          myDeals = JSON.parse(myDealsString);
        } else {
          myDeals = [];
        }

        if (!myDeals.find((deal) => deal.id === dealId)) {
          myDeals.unshift({
            id: dealId,
            dateAdded: new Date().valueOf(),
          });
        }

        await AsyncStorage.setItem('@LocalDatabase:myDeals', JSON.stringify(myDeals));

        this.props.navigator.replace({
          component: MyDeals,
        });
        this.props.navigator.push({
          component: DealDetail,
          passProps: {
            dealId,
            footer: {
              isVisiable: false,
            },
          },
        });

        Toast.show({
          text: 'Saved to your deal list!',
          position: 'bottom',
          buttonText: 'Dismiss',
          duration: 3000,
        });
      } else {
        this.props.navigator.replace({
          component: MyDeals,
        });
      }
    }
  }

  render() {
    return null;
  }

}

export { Landing as default };
