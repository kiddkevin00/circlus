import MyDeals from './MyDeals';
import Deals from './Deals';
import Login from './Login';
import SelectPayment from './SelectPayment';
import { firebaseAuth } from '../proxies/FirebaseProxy';
import {
  Container,
  Header,
  Content,
  Footer,
  FooterTab,
  List,
  ListItem,
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
import React, { Component } from 'react';
import PropTypes from 'prop-types';


class Profile extends Component {

  static propTypes = {
    navigator: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  };

  // TODO
  _handleLogout = async () => {
    this.setState({
      isLoading: true,
    });

    try {
      await firebaseAuth.signOut();

      this.props.navigator.replace({
        component: Login,
      });

      this.setState({
        isLoading: false,
      });
    } catch (error) {
      const errorMessage = error.message || 'Something went wrong.';

      Alert.alert('Error', errorMessage);

      this.setState({
        isLoading: false,
      });
    }
  }

  render() {
    return (
      <Container>
        <Header style={ { backgroundColor: '#3F5EFB' } }>
          <Left />
          <Body style={ { flexGrow: 3 } }>
            <Title style={ { color: 'white', fontFamily: 'Comfortaa-Regular', letterSpacing: 1.36, fontSize: 27 } }>circlus</Title>
          </Body>
          <Right />
        </Header>
        <Content>
          <List>
            <ListItem itemDivider>
              <Text>Account</Text>
            </ListItem>
            <ListItem icon button onPress={ () => this.props.navigator.replace({ component: Login }) }>
              <Left>
                <Icon active name="logo-facebook" />
              </Left>
              <Body>
                <Text>Sign in with Facebook</Text>
              </Body>
              <Right>
                <Icon name="arrow-forward" />
              </Right>
            </ListItem>
            <ListItem last icon >
              <Left>
                <Icon active name="contacts" />
              </Left>
              <Body>
                <Text>Following Influencers</Text>
              </Body>
              <Right>
                <Icon name="arrow-forward" />
              </Right>
            </ListItem>
            <ListItem itemDivider>
              <Text>Billing</Text>
            </ListItem>
            <ListItem last icon button onPress={ () => this.props.navigator.push({ component: SelectPayment }) }>
              <Left>
                <Icon active name="cash" />
              </Left>
              <Body>
                <Text>Manage Billing Information</Text>
              </Body>
              <Right>
                <Icon name="arrow-forward" />
              </Right>
            </ListItem>
            <ListItem itemDivider>
              <Text>Support</Text>
            </ListItem>
            <ListItem icon>
              <Left>
                <Icon active name="settings" />
              </Left>
              <Body>
                <Text>Privacy Settings</Text>
              </Body>
              <Right>
                <Icon name="arrow-forward" />
              </Right>
            </ListItem>
            <ListItem icon>
              <Left>
                <Icon active name="call" />
              </Left>
              <Body>
                <Text>Help Center</Text>
              </Body>
              <Right>
                <Icon name="arrow-forward" />
              </Right>
            </ListItem>
            <ListItem last icon>
              <Left>
                <Icon active name="information-circle" />
              </Left>
              <Body>
                <Text>About Us</Text>
              </Body>
              <Right>
                <Icon name="arrow-forward" />
              </Right>
            </ListItem>
          </List>
        </Content>
        <Footer>
          <FooterTab>
            <Button vertical onPress={ () => this.props.navigator.replace({ component: MyDeals }) }>
              <Icon name="pricetags" />
              <Text>Deals</Text>
            </Button>
            <Button vertical onPress={ () => this.props.navigator.replace({ component: Deals }) }>
              <Icon name="share" />
              <Text>Share</Text>
            </Button>
            <Button vertical onPress={ () => {} }>
              <Icon name="cash" />
              <Text>Billing</Text>
            </Button>
            <Button active vertical onPress={ () => {} }>
              <Icon active name="contact" />
              <Text>Profile</Text>
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    );
  }

}

export { Profile as default };
