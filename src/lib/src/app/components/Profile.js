import MyDeals from './MyDeals';
import Deals from './Deals';
import SelectPayment from './SelectPayment';
import actionCreator from '../actioncreators/profile';
import { firebaseConnect } from 'react-redux-firebase';
import {
  Spinner,
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
  Linking,
} from 'react-native';
import { connect } from 'react-redux';
import { compose } from 'redux';
import React, { Component } from 'react';
import PropTypes from 'prop-types';


class Profile extends Component {

  static propTypes = {
    dispatchFacebookLogin: PropTypes.func.isRequired,
    dispatchLogout: PropTypes.func.isRequired,
    isLoading: PropTypes.bool.isRequired,
    isErrorVisible: PropTypes.bool.isRequired,
    errorMessage: PropTypes.string.isRequired,

    auth: PropTypes.object, // eslint-disable-line react/forbid-prop-types

    navigator: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  };

  _handleAuthentication = async () => {
    if (this.props.auth.isEmpty) {
      await this.props.dispatchFacebookLogin();
    } else {
      await this.props.dispatchLogout();
    }
  }

  _connectWithStripe = async () => {
    const url = 'https://connect.stripe.com/express/oauth/authorize?redirect_uri=https://circlus.herokuapp.com&client_id=ca_BmEBTIzK9B8OFWHEwSViSTBf5r4KoN8U';

    await Linking.openURL(url)
     .catch((err) => Alert.alert('An error occurred', err));
  }

  render() {
    if (!this.props.auth.isLoaded) {
      return null;
    }

    if (this.props.isErrorVisible) {
      Alert.alert('Error', `Please try it again.\n${this.props.errorMessage}`);
    }

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
            <ListItem icon button onPress={ this._handleAuthentication }>
              <Left>
                <Icon active name="logo-facebook" />
              </Left>
              <Body>
                <Text>{ this.props.auth.isEmpty ? 'Sign in with Facebook' : 'Sign out' }</Text>
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
            <ListItem itemDivider>
              <Text>Work With Us</Text>
            </ListItem>
            <ListItem last icon button onPress={ this._connectWithStripe }>
              <Left>
                <Icon active name="cash" />
              </Left>
              <Body>
                <Text>Setup Bank Account</Text>
              </Body>
              <Right>
                <Icon name="arrow-forward" />
              </Right>
            </ListItem>
          </List>
          { this.props.isLoading && <Spinner color="blue" /> }
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

function mapStateToProps(state) {
  return {
    isLoading: state.profile.isLoading,
    isErrorVisible: state.profile.error.isVisiable,
    errorMessage: state.profile.error.message,
    auth: state.firebase.auth,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    dispatchFacebookLogin() {
      dispatch(actionCreator.facebookLogin());
    },

    dispatchLogout() {
      dispatch(actionCreator.logout());
    },
  };
}

export default compose(
  firebaseConnect([]),
  connect(mapStateToProps, mapDispatchToProps),
)(Profile);
