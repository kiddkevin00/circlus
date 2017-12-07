import MyDeals from './MyDeals';
import actionCreator from '../actioncreators/checkout';
import constants from '../constants/';
import stripe from 'tipsi-stripe';
import { StripeAddCard } from 'react-native-checkout';
import {
  Container,
  Header,
  Content,
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
} from 'react-native';
import { connect } from 'react-redux';
import React, { Component } from 'react';
import PropTypes from 'prop-types';


class Checkout extends Component {

  static propTypes = {
    discount: PropTypes.number.isRequired,
    billAmount: PropTypes.number.isRequired,
    tipPercentage: PropTypes.number,
    totalAmount: PropTypes.number.isRequired,


    dispatchHandleToken: PropTypes.func.isRequired,

    auth: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types

    navigator: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  };

  static defaultProps = {
    tipPercentage: undefined,
  };

  _onToken = async (tokenId) => {
    if (!this.props.auth.email) {
      Alert.alert('Action Required', 'Please sign in first to save your payment records.');
      return;
    }

    try {
      await this.props.dispatchHandleToken(tokenId, this.props.totalAmount, this.props.auth.email)

      this.props.navigator.push({
        component: MyDeals,
      });
    } catch (err) {
      Alert.alert('Try it again', err.message);
    }
  }

  _handleApplePay = async () => {
    if (!this.props.auth.email) {
      Alert.alert('Action Required', 'Please sign in first to save your payment records.');
      return;
    }

    try {
      const isSupported = await stripe.deviceSupportsApplePay();

      if (isSupported) {
        const canMakePayment = await stripe.canMakeApplePayPayments();

        if (canMakePayment) {
          const payingItems = [
            { label: 'total spent', amount: this.props.billAmount.toFixed(2) },
            { label: `${this.props.discount}% off`, amount: `-${((this.props.discount / 100) * this.props.billAmount).toFixed(2)}` },
            { label: 'tip', amount: this.props.tipPercentage ? (this.props.tipPercentage * this.props.billAmount).toFixed(2) : '0' },
            { label: 'circlus inc', amount: this.props.totalAmount.toFixed(2) },
          ];
          const { tokenId } = await stripe.paymentRequestWithApplePay(payingItems,
            { currencyCode: 'USD' });

          await this.props.dispatchHandleToken(tokenId, this.props.totalAmount, this.props.auth.email);

          await stripe.completeApplePayRequest();
        } else {
          await stripe.openApplePaySetup();
        }
      }
    } catch (err) {
      await stripe.cancelApplePayRequest();

      if (!err.message.includes('User canceled Apple Pay')) {
        Alert.alert('Try it again', `Something went wrong while making Apple Pay.\n${err.message}`);
      }
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
            addCardTokenHandler={ this._onToken }
            publicStripeKey={ constants.CREDENTIAL.STRIPE.PUBLIC_KEY }
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

function mapStateToProps(state) {
  return {
    discount: state.billingSummary.discount,
    billAmount: Number(state.billingSummary.billAmountString),
    tipPercentage: state.billingSummary.tipPercentage,
    totalAmount: state.billingSummary.totalAmount,
    auth: state.firebase.auth,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    dispatchHandleToken(tokenId, totalAmount, email) {
      return dispatch(actionCreator.handleToken(tokenId, totalAmount, email));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Checkout);
