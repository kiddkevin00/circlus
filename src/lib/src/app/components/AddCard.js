import { PaymentCardTextField } from 'tipsi-stripe';
import {
  Container,
  Header,
  Content,
  Footer,
  FooterTab,
  Left,
  Body,
  Right,
  Title,
  Button,
  Text,
  Icon,
} from 'native-base';
import {
  StyleSheet,
} from 'react-native';
import React, { Component } from 'react';
import PropTypes from 'prop-types';


const styles = StyleSheet.create({
  paymentCardTextField: {
    width: '100%',
    color: '#449aeb',
    borderColor: 'grey',
    borderWidth: 1,
    borderRadius: 0,
  }
});

class AddCard extends Component {

  static propTypes = {
    totalAmount: PropTypes.number.isRequired,

    navigator: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  };

  _handleFieldParamsChange(valid, params) {
    console.log(`
      Valid: ${valid}
      Number: ${params.number || '-'}
      Month: ${params.expMonth || '-'}
      Year: ${params.expYear || '-'}
      CVC: ${params.cvc || '-'}
    `);
  }

  render() {
    return (
      <Container>
        <Header style={ { backgroundColor: '#3F5EFB' } }>
          <Left />
          <Body style={ { flexGrow: 3 } }>
            <Title style={ { color: 'white', fontFamily: 'Comfortaa-Regular', letterSpacing: 1.36, fontSize: 27 } }>circlus</Title>
          </Body>
          <Right>
            <Button transparent onPress={ this._gotoLogin }>
              <Icon style={ { color: 'white' } } name="log-in" />
            </Button>
          </Right>
        </Header>
        <Content>
          <PaymentCardTextField
            style={ styles.paymentCardTextField }
            //cursorColor={...}
            //textErrorColor={...}
            //placeholderColor={...}
            //numberPlaceholder={...}
            //expirationPlaceholder={...}
            //cvcPlaceholder={...}
            disabled={ false }
            onParamsChange={ this._handleFieldParamsChange }
          />
        </Content>
        <Footer>
          <FooterTab>
            <Button style={ { backgroundColor: '#6699ff' } } full onPress={ () => {} }>
              <Text style={ { fontSize: 17, color: 'white', fontWeight: 'bold' } }>Pay $77.77 Now</Text>
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    );
  }
}

export { AddCard as default };
