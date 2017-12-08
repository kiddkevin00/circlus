import Checkout from './Checkout';
import actionCreator from '../actioncreators/billingSummary';
import { KeyboardAccessoryView } from 'react-native-keyboard-accessory';
import {
  Container,
  Header,
  Content,
  Footer,
  Form,
  Item,
  Label,
  Input,
  Picker,
  Left,
  Body,
  Right,
  Title,
  Button,
  Text,
  Icon,
} from 'native-base';
import { connect } from 'react-redux';
import React, { Component } from 'react';
import PropTypes from 'prop-types';


class BillingSummary extends Component {

  static propTypes = {
    dealId: PropTypes.string.isRequired,
    influencerStripeUserId: PropTypes.string.isRequired,
    merchantStripeUserId: PropTypes.string.isRequired,
    discount: PropTypes.number.isRequired,

    dispatchInit: PropTypes.func.isRequired,
    dispatchSetBillAmountString: PropTypes.func.isRequired,
    dispatchSetTipPercentage: PropTypes.func.isRequired,
    billAmountString: PropTypes.string.isRequired,
    billAmount: PropTypes.number.isRequired,
    tipPercentage: PropTypes.number,
    totalAmount: PropTypes.number.isRequired,
    startValidatingForm: PropTypes.bool.isRequired,

    navigator: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  };

  static defaultProps = {
    tipPercentage: undefined,
  };

  componentDidMount() {
    const { dealId, influencerStripeUserId, merchantStripeUserId, discount } = this.props;

    this.props.dispatchInit(discount, dealId, influencerStripeUserId, merchantStripeUserId);
  }

  _handleCheckout = () => {
    this.props.navigator.push({
      component: Checkout,
    });
  }

  _onChange = (event) => {
    this.props.dispatchSetBillAmountString(event.nativeEvent.text);
  }

  _onPick = (value) => {
    this.props.dispatchSetTipPercentage(value);
  }

  render() {
    const inputSpaces = '                         ';
    const pickerSpaces = '                                               ';

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
        <Content padder>
          <Form>
            <Item stackedLabel error={ this.props.startValidatingForm && !this.props.billAmount }>
              <Label>Enter Bill Amount</Label>
              <Input autoFocus keyboardType="numeric" value={ this.props.billAmountString } onChange={ this._onChange } />
            </Item>
            <Item style={ { borderBottomWidth: 0 } } fixedLabel>
              <Label>{ this.props.discount }% Off</Label>
              <Input disabled value={ `${inputSpaces}${(this.props.billAmount * (this.props.discount / 100)) ? (this.props.billAmount * (this.props.discount / 100)).toFixed(2) : '    -'}` } />
            </Item>
            <Item style={ { borderBottomWidth: 0, marginBottom: 20 } } fixedLabel>
              <Label style={ { fontWeight: 'bold' } }>Subtotal</Label>
              <Input disabled value={ `${inputSpaces}${(this.props.billAmount * (1 - this.props.discount / 100)) ? (this.props.billAmount * (1 - this.props.discount / 100)).toFixed(2) : '    -'}` } />
            </Item>
            <Picker
              style={ { borderWidth: 1, borderColor: '#D9D5DC', width: '100%' } }
              mode="dropdown"
              placeholder="Select Tip Amount                        --"
              selectedValue={ this.props.tipPercentage }
              onValueChange={ this._onPick }
              iosHeader="Select Tip"
            >
              <Picker.Item label={ `Tip${pickerSpaces} 0%` } value={ 0.00 } />
              <Picker.Item label={ `Tip${pickerSpaces} 8%` } value={ 0.08 } />
              <Picker.Item label={ `Tip${pickerSpaces}10%` } value={ 0.10 } />
              <Picker.Item label={ `Tip${pickerSpaces}15%` } value={ 0.15 } />
              <Picker.Item label={ `Tip${pickerSpaces}20%` } value={ 0.20 } />
              <Picker.Item label={ `Tip${pickerSpaces}25%` } value={ 0.25 } />
              <Picker.Item label={ `Tip${pickerSpaces}30%` } value={ 0.30 } />
            </Picker>
            <Item style={ { borderBottomWidth: 0, marginTop: 30 } } fixedLabel>
              <Label style={ { fontWeight: 'bold', fontSize: 20 } }>Total</Label>
              <Input disabled value={ `${inputSpaces}${this.props.totalAmount || '-'}` } />
            </Item>
          </Form>
        </Content>
        <Footer>
          <Container style={ { height: 'auto' } }>
            <KeyboardAccessoryView alwaysVisible={ true }>
              <Button style={ { backgroundColor: '#6699ff', height: 55 } } full onPress={ this._handleCheckout } disabled={ !this.props.billAmount }>
                <Text style={ { fontSize: 17, color: 'white', fontWeight: 'bold' } }>Pay</Text>
              </Button>
            </KeyboardAccessoryView>
          </Container>
        </Footer>
      </Container>
    );
  }

}

function mapStateToProps(state) {
  return {
    billAmountString: state.billingSummary.billAmountString,
    billAmount: Number(state.billingSummary.billAmountString),
    totalAmount: state.billingSummary.totalAmount,
    tipPercentage: state.billingSummary.tipPercentage,
    startValidatingForm: state.billingSummary.startValidatingForm,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    dispatchInit(discount, dealId, influencerStripeUserId, merchantStripeUserId) {
      dispatch(actionCreator.init(discount, dealId, influencerStripeUserId, merchantStripeUserId));
    },

    dispatchSetBillAmountString(billAmountString) {
      dispatch(actionCreator.setBillAmountString(billAmountString));
    },

    dispatchSetTipPercentage(tipPercentage) {
      dispatch(actionCreator.setTipPercentage(tipPercentage));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(BillingSummary);
