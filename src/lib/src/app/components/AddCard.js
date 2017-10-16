import SelectPayment from './SelectPayment';
import { StripeAddCard } from 'react-native-checkout';
import {
  View,
} from 'react-native';
import React, { Component } from 'react';
import PropTypes from 'prop-types';


class AddCard extends Component {

  static propTypes = {
    totalAmount: PropTypes.number,//.isRequired,

    navigator: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  };

  static defaultProps = {
    totalAmount: 77.77, // TODO
  };

  state = {
    cardNumber: undefined,
  };

  render() {
    return (
      <View style={ { flex: 1 } }>
        <StripeAddCard
          styles={ {} } // Overrides default styles here.
          addCardTokenHandler={ (token) => { this.props.navigator.push({ component: SelectPayment, passProps: { newCard: { token, last4: this.state.cardNumber.slice(0, 4) } } }); } }
          publicStripeKey="pk_test_CbjF57VBeGxsFybB4pMSpK2Z"
          onCardNumberFocus={ () => {} }
          onCardNumberBlur={ (cardNumber) => this.setState({ cardNumber }) }
          onCvcFocus={ () => {} }
          onCvcBlur={ () => {} }
          onExpiryFocus={ () => {} }
          onExpiryBlur={ () => {} }
          onScanCardOpen={ () => {} }
          onScanCardClose={ () => {} }
          activityIndicatorColor="pink"
          scanCardVisible={ true }
          scanCardButtonText="Scan Card"
          scanCardAfterScanButtonText="Scan Card Again"
          addCardButtonText={ `Pay $${(this.props.totalAmount).toFixed(2)} Now` }
          placeholderTextColor="grey"
          cardNumberPlaceholderText="4242 4242 4242 4242"
          expiryPlaceholderText="MM/YY"
          cvcPlaceholderText="CVC"
          cardNumberErrorMessage="Card Number is invalid"
          expiryErrorMessage="Expiry is invalid"
          cvcErrorMessage="CVC is incorrect"
        />
      </View>
    );
  }
}

export { AddCard as default };
