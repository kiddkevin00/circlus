import DealDetail from './DealDetail';
import MyDeals from './MyDeals';
import Profile from './Profile';
import Login from './Login';
import HttpProxy from '../proxies/HttpProxy';
import StandardResponseWrapper from '../utils/StandardResponseWrapper';
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
        Alert.alert('Error', `Getting launch URL failed.\n${err.message}`);
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
      } else if (params && params.code) {
        await this._handleStripeAddAccount(params.code);

        this.props.navigator.push({
          component: Profile,
        });
      } else if (params && params.error) {
        Alert.alert('Error', `Please try again.\n${global.decodeURIComponent(params.error_description)}`);
      } else {
        this.props.navigator.replace({
          component: MyDeals,
        });
      }
    }
  }

  // TODO
  _handleStripeAddAccount = async (stripeCode) => {
    const httpClient = HttpProxy.createInstance();

    try {
      const requesyBody = { stripeCode };
      const { data } = await httpClient.post('/bank-account/setup', requesyBody);

      if (StandardResponseWrapper.verifyFormat(data) && StandardResponseWrapper.deserialize(data).getNthData(0).success) {
        const stripeUserId = StandardResponseWrapper.deserialize(data).getNthData(0).detail.stripe_user_id;

        await AsyncStorage.setItem('@LocalDatabase:stripeUserId', stripeUserId);
      } else {
        Alert.alert('Error', `Please try it again.\n${JSON.stringify(data, null, 2)}`);
      }
    } catch (err) {
      Alert.alert('Error', `Please try it again.\n${err.message}`);
    }
  }

  render() {
    return null;
  }

}

export { Landing as default };
