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
      .catch((err) => setTimeout(() => {
        Alert.alert('Try it again', `Getting launch URL failed.\n${err.message}`);
      }, 500));

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
        await this._handleNewDeal(params.deal, params.influencer, params.merchant);

        this.props.navigator.replace({
          component: MyDeals,
        });
        this.props.navigator.push({
          component: DealDetail,
          passProps: {
            dealId: params.deal,
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
      } else if (params && (params.code || params.error)) {
        await this._handleBankAccountSetup(params.error, params.code, params);

        this.props.navigator.replace({
          component: Profile,
        });
      } else {
        this.props.navigator.replace({
          component: MyDeals,
        });
      }
    }
  }

  // [TODO] Use action creator instead.
  _handleNewDeal = async (dealId, influencerStripeUserId, merchantStripeUserId) => {
    const myDealsString = await AsyncStorage.getItem('@LocalDatabase:myDeals');
    let myDeals;

    if (myDealsString) {
      myDeals = JSON.parse(myDealsString);
    } else {
      myDeals = [];
    }

    if (!myDeals.find((deal) => deal.id === dealId)) {
      myDeals.unshift({
        dealId,
        influencerStripeUserId,
        merchantStripeUserId,
        dateAdded: new Date().valueOf(),
      });
    }

    await AsyncStorage.setItem('@LocalDatabase:myDeals', JSON.stringify(myDeals));
  }

  // [TODO] Use action creator instead.
  _handleBankAccountSetup = async (error, authorizationCode, params) => {
    if (error) {
      setTimeout(() => Alert.alert('Try it again', `Something went wrong.\n${global.decodeURIComponent(params.error_description || error)}`), 500);
      return;
    }

    const httpClient = HttpProxy.createInstance();

    try {
      const requesyBody = { authorizationCode };
      const { data } = await httpClient.post('/bank-account/setup', requesyBody);

      if (StandardResponseWrapper.verifyFormat(data) && StandardResponseWrapper.deserialize(data).getNthData(0).success) {
        const stripeUserId = StandardResponseWrapper.deserialize(data).getNthData(0).detail.stripeUserId;

        await AsyncStorage.setItem('@LocalDatabase:stripeUserId', stripeUserId);
      } else {
        setTimeout(() => Alert.alert('Try it again', `Invalid response received from server.\n${JSON.stringify(data, null, 2)}`, 500));
      }
    } catch (err) {
      setTimeout(() => Alert.alert('Try it again', `Processing payment fails.\n${err.message}`), 500);
    }
  }

  render() {
    return null;
  }

}

export { Landing as default };
