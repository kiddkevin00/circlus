import HttpProxy from '../proxies/HttpProxy'
import stripe from 'tipsi-stripe';
import { StripeAddCard } from 'react-native-checkout';
import {
  Container,
  Header,
  Content,
  List,
  ListItem,
  Card,
  CardItem,
  Left,
  Body,
  Right,
  Title,
  Button,
  Text,
  Icon,
} from 'native-base';
import {
  Alert,
  AsyncStorage,
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

  _handleStripeToken = async (token) => {
    const httpClient = HttpProxy.createInstance();

    try {
      const { customerId } = await httpClient.post('/payment/proceed', { token });

      await AsyncStorage.setItem('@LocalDatabase:customerId', customerId);
    } catch (err) {
      console.log(err); // [TODO] Should handle error case.
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

  render() {
    const customStripeAddCardStyle = {
      errorTextContainer: { height: 0 },
      addButton: { marginTop: 10, marginBottom: -10, backgroundColor: '#5F79FB', borderColor: '#3F5EFB' },
      addButtonText: { color: 'white' },
    };

    return (
      <Container>
        <Header style={ { backgroundColor: '#3F5EFB' } }>
          <Left>
            <Button transparent onPress={ () => this.props.navigator.pop() }>
              <Icon style={ { color: 'white', fontSize: 32 } } name="arrow-back" />
            </Button>
          </Left>
          <Body style={ { flexGrow: 3 } }>
            <Title style={ { color: 'white', fontFamily: 'Comfortaa-Regular', letterSpacing: 1.36, fontSize: 27 } }>circlus</Title>
          </Body>
          <Right />
        </Header>
        <Content>
          <StripeAddCard
            styles={ customStripeAddCardStyle } // Overrides default styles here. #https://github.com/z-dev/react-native-checkout/blob/master/src/components/addCard/defaultStyles.js
            addCardTokenHandler={ this._handleStripeToken }
            publicStripeKey="pk_test_CbjF57VBeGxsFybB4pMSpK2Z"
            onCardNumberFocus={ () => {} }
            onCardNumberBlur={ () => {} }
            onCvcFocus={ () => {} }
            onCvcBlur={ () => {} }
            onExpiryFocus={ () => {} }
            onExpiryBlur={ () => {} }
            onScanCardOpen={ () => {} }
            onScanCardClose={ () => {} }
            activityIndicatorColor="pink"
            scanCardVisible={ false }
            scanCardButtonText="Scan Card"
            scanCardAfterScanButtonText="Scan Card Again"
            addCardButtonText={ `Pay $${(this.props.totalAmount).toFixed(2)} Now` }
            placeholderTextColor="grey"
            cardNumberPlaceholderText="4242 4242 4242 4242"
            expiryPlaceholderText="MM/YY"
            cvcPlaceholderText="CVC"
            cardNumberErrorMessage=""
            expiryErrorMessage=""
            cvcErrorMessage=""
          />
          <Button style={ { borderColor: '#3F5EFB' } } transparent full onPress={ this._handleApplePay }>
            <Text style={ { color: '#3F5EFB' } }>or pay with Apple Pay</Text>
          </Button>
        </Content>
      </Container>
    );
  }
}

export { AddCard as default };
