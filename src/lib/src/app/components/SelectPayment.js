import stripe from 'tipsi-stripe';
import { SelectPayment as SelectPaymentBlock } from 'react-native-checkout';

import {
  Container,
  Header,
  Left,
  Body,
  Right,
  Title,
  Button,
  Text,
  Icon,
  Content,
} from 'native-base';
import {
  Alert,
} from 'react-native';
import React, { Component } from 'react';
import PropTypes from 'prop-types';


stripe.init({
  publishableKey: 'pk_test_CbjF57VBeGxsFybB4pMSpK2Z',
  merchantId: 'merchant.com.circlus.consumer.main',
});

class SelectPayment extends Component {

  static propTypes = {
    navigator: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  };
  
  state = {
    paymentSources: [
      { last4: '1234', brand: 'American Express', token: 'tok_1' },
      { last4: '2345', brand: 'Visa', token: 'tok_2' },
      { last4: '2345', brand: 'Master Card', token: 'tok_3' },
    ],
  };

  _handleAddCard = async () => {
    const options = {
      smsAutofillDisabled: false,
      requiredBillingAddressFields: 'zip',
      prefilledInformation: {
        billingAddress: {
          country: 'US',
        },
      },
    };

    try {
      const response = await stripe.paymentRequestWithCardForm(options);

      this.setState({
        paymentSources: [
          ...this.state.paymentSources,
          { ...response.card, token: response.tokenId },
        ],
      });
    } catch (err) {
      Alert.alert('Error', `Payment process failed: ${err.message}`);
    }
  }

  _handleApplePay = async () => {
    try {
      const isSupported = await stripe.deviceSupportsApplePay();

      if (isSupported) {
        const canMakePayment = await stripe.canMakeApplePayPayments();

        if (canMakePayment) {
          const payingItems = [
            { label: 'total spent', amount: '77.77' },
            { label: '15% off', amount: '-10.00' },
            { label: 'tax', amount: '2.23' },
            { label: 'circlus inc', amount: '70.00' },
          ];
          const response = await stripe.paymentRequestWithApplePay(payingItems,
            { currencyCode: 'USD' });

          console.log('Token:', response);

          stripe.completeApplePayRequest();
        } else {
          stripe.openApplePaySetup();
        }
      }
    } catch (err) {
      stripe.cancelApplePayRequest();

      Alert.alert('Error', `Apple pay error: ${err.message}.`);
    }
  }

  _handleSelectPyment = (paymentSource) => {
    Alert.alert('Info', 'Selected Payment source:', paymentSource);
  }

  render() {
    return (
      <Container>
        <Header style={ { backgroundColor: '#3F5EFB' } }>
          <Left>
            <Button transparent onPress={ () => this.props.navigator.pop() }>
              <Icon style={ { color: 'white', fontSize: 20 } } name="arrow-back" />
            </Button>
          </Left>
          <Body style={ { flexGrow: 5 } }>
            <Title style={ { color: 'white', fontFamily: 'Comfortaa-Regular', letterSpacing: 1.36, fontSize: 15 } }>Select Default Payment</Title>
          </Body>
          <Right />
        </Header>
        <Content>
          <SelectPaymentBlock
            styles={ {} } // Overrides default styles here.
            enableApplePay={ true } // Optional. Default: false
            paymentSources={ this.state.paymentSources } // Mandatory. See: [Customer Object](https://stripe.com/docs/api/node#customer_object) -> sources -> data for Stripe format.
            applePayHandler={ this._handleApplePay }
            addCardHandler={ this._handleAddCard }
            selectPaymentHandler={ this._handleSelectPyment }
          />
        </Content>
      </Container>
    );
  }

}

export { SelectPayment as default };
