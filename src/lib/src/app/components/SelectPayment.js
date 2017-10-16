import AddCard from './AddCard';
import { SelectPayment as SelectPaymentBlock } from 'react-native-checkout';
import {
  View,
} from 'react-native';
import React, { Component } from 'react';
import PropTypes from 'prop-types';


class SelectPayment extends Component {

  static propTypes = {
    newCard: PropTypes.object, // eslint-disable-line react/forbid-prop-types

    navigator: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  };

  static defaultProps = {
    newCard: undefined,
  };

  state = {
    paymentSources: [
      { last4: '1234', brand: 'American Express', token: 'token1' },
      { last4: '2345', brand: 'Visa', token: 'token2' },
      { last4: '2345', brand: 'Master Card', token: 'token3' },
    ],
  };

  render() {
    if (this.props.newCard) {
      this.state.paymentSources.push({ last4: this.props.newCard.last4, brand: this.props.newCard.brand || 'Visa', token: this.props.newCard.token });
    }

    return (
      <View style={ { flex: 1, marginTop: 20 } }>
        <SelectPaymentBlock
          styles={ {} } // Overrides default styles here.
          enableApplePay={ true } // optional, default: false
          applePayHandler={ () => {} } // optional
          paymentSources={ this.state.paymentSources } // mandatory, see: [Customer Object](https://stripe.com/docs/api/node#customer_object) -> sources -> data for Stripe format.
          addCardHandler={ () => this.props.navigator.push({ component: AddCard }) }
          selectPaymentHandler={ (paymentSource) => console.log(paymentSource) }
        />
      </View>
    );
  }

}

export { SelectPayment as default };
