import SelectPayment from './SelectPayment';
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
  Icon,
} from 'native-base';
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
    const customStripeAddCardStyle = {
      errorTextContainer: { height: 0 },
      addButton: { marginTop: 0, marginBottom: 0, backgroundColor: '#5F79FB', borderColor: '#3F5EFB' },
      addButtonText: { color: 'white' },
    };

    return (
      <Container>
        <Header style={ { backgroundColor: '#3F5EFB' } }>
          <Left />
          <Body style={ { flexGrow: 3 } }>
            <Title style={ { color: 'white', fontFamily: 'Comfortaa-Regular', letterSpacing: 1.36, fontSize: 27 } }>circlus</Title>
          </Body>
          <Right>
            <Button transparent onPress={ this._gotoSignup }>
              <Icon style={ { color: 'white' } } name="log-in" />
            </Button>
          </Right>
        </Header>
        <Content>
          <StripeAddCard
            styles={ customStripeAddCardStyle } // Overrides default styles here. #https://github.com/z-dev/react-native-checkout/blob/master/src/components/addCard/defaultStyles.js
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
        </Content>
      </Container>
    );
  }
}

export { AddCard as default };
