import DealDetail from './DealDetail';
import MyDeals from './MyDeals';
import Profile from './Profile';
import Login from './Login';
import actionCreator from '../actioncreators/landing';
import asyncStorageActionCreator from '../actioncreators/asyncStorage';
import { Toast } from 'native-base';
import {
  Linking,
  Alert,
} from 'react-native';
import { connect } from 'react-redux';
import { Component } from 'react';
import PropTypes from 'prop-types';
import qs from 'qs';


class Landing extends Component {

  static propTypes = {
    dispatchGetItemFromAsyncStorage: PropTypes.func.isRequired,
    dispatchSetItemFromAsyncStorage: PropTypes.func.isRequired,
    dispatchHandleBankAccountSetup: PropTypes.func.isRequired,

    navigator: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  };

  componentDidMount() {
    Linking.getInitialURL()
      .then((url) => {
        if (url) {
          return this._handleOpenFromURL({ url });
        }
        return this.props.navigator.replace({
          component: Login,
        });
      })
      .catch((err) => setTimeout(() => {
        Alert.alert('Try it again', `URL deep linking failed.\n${err.message}`);
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

    if (path && params) {
      if (params.deal) {
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
        return;
      } else if (params.code || params.error) {
        await this._handleBankAccountSetup(params.error, params.code, params);

        this.props.navigator.replace({
          component: Profile,
        });
        return;
      }
    }
    this.props.navigator.replace({
      component: MyDeals,
    });
  }

  _handleNewDeal = async (dealId, influencerStripeUserId, merchantStripeUserId) => {
    const myDeals = await this.props.dispatchGetItemFromAsyncStorage('@LocalDatabase:myDeals', true, []);

    if (!myDeals.find((myDeal) => myDeal.dealId === dealId)) {
      myDeals.unshift({
        dealId,
        influencerStripeUserId,
        merchantStripeUserId,
        dateAdded: new Date().valueOf(),
      });
      await this.props.dispatchSetItemFromAsyncStorage('@LocalDatabase:myDeals', myDeals);
    }
  }

  _handleBankAccountSetup = async (error, authorizationCode, params) => {
    if (error) {
      setTimeout(() => Alert.alert('Try it again', `Something went wrong.\n${global.decodeURIComponent(params.error_description || error)}`), 500);
      return;
    }

    try {
      const stripeUserId = await this.props.dispatchHandleBankAccountSetup(authorizationCode);

      await this.props.dispatchSetItemFromAsyncStorage('@LocalDatabase:stripeUserId', stripeUserId);
    } catch (err) {
      setTimeout(() => {
        Alert.alert('Try it again', err.message);
      }, 500);
    }
  }

  render() {
    // [TODO] Should be a loading page.
    return null;
  }

}

function mapStateToProps(state) {
  return {};
}
function mapDispatchToProps(dispatch) {
  return {
    dispatchGetItemFromAsyncStorage(...params) {
      return dispatch(asyncStorageActionCreator.getItem(...params));
    },

    dispatchSetItemFromAsyncStorage(key, item) {
      return dispatch(asyncStorageActionCreator.setItem(key, item));
    },

    dispatchHandleBankAccountSetup(authorizationCode) {
      return dispatch(actionCreator.handleBankAccountSetup(authorizationCode));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Landing);
