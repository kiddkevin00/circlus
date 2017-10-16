import AddCard from './AddCard';
import {
  Container,
  Header,
  Content,
  Footer,
  FooterTab,
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
import React, { Component } from 'react';
import PropTypes from 'prop-types';


class BillingSummary extends Component {

  static propTypes = {
    discount: PropTypes.number,//.isRequired,

    navigator: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  };

  static defaultProps = {
    discount: 77, // TODO
  };

  state = {
    tipPercentage: undefined,
    billAmount: 0,
  };

  _checkout = () => {
    this.props.navigator.push({
      component: AddCard,
      passProps: { totalAmount: this.state.billAmount * (1 - this.props.discount / 100) },
    });
  }

  _onPick = (value) => {
    this.setState({
      tipPercentage: value,
    });
  }

  _backToDealDetail = () => {
    this.props.navigator.pop();
  }

  render() {
    let isValid = true; // TODO
    const inputSpaces = '                                  ';
    const pickerSpaces = '                                                            ';

    return (
      <Container>
        <Header style={ { backgroundColor: '#3F5EFB' } }>
          <Left>
            <Button transparent onPress={ this._backToDealDetail }>
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
            <Item floatingLabel error={ !isValid }>
              <Label>Enter Bill Amount</Label>
              <Input keyboardType="numeric" autoFocus onChange={ (event) => this.setState({ billAmount: Number(event.nativeEvent.text) })} />
            </Item>
            <Item style={ { borderBottomWidth: 0 } } fixedLabel>
              <Label>{ this.props.discount }% Off</Label>
              <Input disabled value={ `${inputSpaces}${(this.state.billAmount * (this.props.discount / 100)) ? (this.state.billAmount * (this.props.discount / 100)).toFixed(2) : '  -'}` } />
            </Item>
            <Item style={ { borderBottomWidth: 0 } } fixedLabel>
              <Label style={ { fontWeight: 'bold' } }>Subtotal</Label>
              <Input disabled value={ `${inputSpaces}${(this.state.billAmount * (1 - this.props.discount / 100)) ? (this.state.billAmount * (1 - this.props.discount / 100)).toFixed(2) : '  -'}` } />
            </Item>

            {/*
            <Item floatingLabel error={ !isValid } last>
              <Label>Enter Tip Amount</Label>
              <Input keyboardType="numeric" />
            </Item>
            */}
            <Picker
              mode="dropdown"
              placeholder="Select Tip Amount                                  -"
              selectedValue={ this.state.tipPercentage }
              onValueChange={ this._onPick }
              iosHeader="Select Tip Percentage"
            >
              <Picker.Item label={ `Tip${pickerSpaces} 8%` } value={ 0.08 } />
              <Picker.Item label={ `Tip${pickerSpaces}10%` } value={ 0.10 } />
              <Picker.Item label={ `Tip${pickerSpaces}15%` } value={ 0.15 } />
              <Picker.Item label={ `Tip${pickerSpaces}20%` } value={ 0.20 } />
              <Picker.Item label={ `Tip${pickerSpaces}25%` } value={ 0.25 } />
              <Picker.Item label={ `Tip${pickerSpaces}30%` } value={ 0.30 } />
            </Picker>

            <Item style={ { borderBottomWidth: 0 } } fixedLabel>
              <Label style={ { fontWeight: 'bold', fontSize: 20 } }>Total</Label>
              <Input disabled value={ `${inputSpaces}${(this.state.billAmount * (1 - this.props.discount / 100) * (1 + (this.state.tipPercentage || 0))) ? (this.state.billAmount * (1 - this.props.discount / 100) * (1 + (this.state.tipPercentage || 0))).toFixed(2) : '  -'}` } />
            </Item>
          </Form>
        </Content>
        <Footer>
          <FooterTab>
            <Button style={ { backgroundColor: '#6699ff' } } full onPress={ this._checkout }>
              <Text style={ { fontSize: 17, color: 'white', fontWeight: 'bold' } }>Pay</Text>
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    );
  }

}

export { BillingSummary as default };
