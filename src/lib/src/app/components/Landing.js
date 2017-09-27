import DealDetail from './DealDetail';
import Deals from './Deals';
import {
  Linking,
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
          this._handleOpenURL({ url });
        } else {
          this.props.navigator.replace({
            component: Deals,
          });
        }
      })
      .catch((err) => {
        console.log(`Something went wrong when getting launch URL - ${err}`);
      });

    Linking.addEventListener('url', this._handleOpenURL);
  }

  componentWillUnmount() {
    //Linking.removeEventListener('url', this._handleOpenURL);
  }

  _handleOpenURL = (event) => {
    const url = event.url.split('?');
    const path = url[0];
    const params = url[1] ? qs.parse(url[1]) : null;

    if (path && params && params.deal) {
      this.props.navigator.replace({
        component: Deals,
      });

      this.props.navigator.push({
        component: DealDetail,
        passProps: {
          dealId: params.deal,
        },
      });
    }
  }

  render() {
    return null;
  }

}

export { Landing as default };
