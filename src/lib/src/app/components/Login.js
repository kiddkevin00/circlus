import MyDeals from './MyDeals';
import Deals from './Deals';
import Profile from './Profile';
import actionCreator from '../actioncreators/login';
import Swiper from 'react-native-swiper';
import { firebaseConnect } from 'react-redux-firebase';
import {
  Container,
  Content,
  Footer,
  FooterTab,
  Button,
  Text,
  Icon,
} from 'native-base';
import {
  Alert,
  Image,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { connect } from 'react-redux';
import { compose } from 'redux';
import React, { Component } from 'react';
import PropTypes from 'prop-types';


const styles = StyleSheet.create({
  backgroundImage: {
    //flexGrow: 1,
    justifyContent: 'flex-end',
    //alignItems: 'center',
    //resizeMode: 'stretch',
  },
});

class Login extends Component {

  static propTypes = {
    dispatchFacebookLogin: PropTypes.func.isRequired,
    isErrorVisible: PropTypes.bool.isRequired,
    errorMessage: PropTypes.string.isRequired,

    auth: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types

    navigator: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  };

  componentWillReceiveProps(nextProps) {
    if (!this.props.auth.isEmpty || !nextProps.auth.isEmpty) {
      this.props.navigator.replace({
        component: MyDeals,
      });
    }
  }

  _handleFacebookLogin = async () => {
    await this.props.dispatchFacebookLogin();
  }

  render() {
    if (!this.props.auth.isLoaded) {
      return null;
    }

    if (this.props.isErrorVisible) {
      Alert.alert('Error', `Please try it again.\n${this.props.errorMessage}`);
    }

    const backgroundImageInlineStyle = {
      height: Dimensions.get('window').height,
      width: Dimensions.get('window').width,
    };

    return (
      <Container>
        <Content>
          <Swiper showsButtons={ false }>
            <Image
              style={ [styles.backgroundImage, backgroundImageInlineStyle] }
              source={ require('../../../static/assets/images/login-background.png') }
              resizeMode="stretch"
            >
              <Button
                style={ {
                  marginBottom: 145,
                  marginHorizontal: 20,
                  paddingTop: 25,
                  paddingBottom: 25,
                  backgroundColor: '#4267b2',
                } }
                block
                iconLeft
                onPress={ this._handleFacebookLogin }
              >
                <Icon style={ { fontSize: 40 } } name="logo-facebook" />
                <Text style={ { fontSize: 20, color: 'white', fontWeight: '600' } }>Continue with Facebook</Text>
              </Button>
              {/*
              <FacebookSignInButton
                style={ {
                  marginBottom: 210,
                  marginHorizontal: 85,
                  paddingTop: 22,
                  paddingBottom: 22,
                  borderColor: '#4267b2',
                  borderWidth: 0,
                }  }
                readPermissions={ ['public_profile', 'email', 'user_friends'] }
                onLoginFinished={ this._handleFbPostLogin }
                onLogoutFinished={ () => Alert.alert('Info', 'Logout succeeded.') }
              />
              */}
            </Image>
          </Swiper>
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
            <Button vertical onPress={ () => this.props.navigator.replace({ component: Profile }) }>
              <Icon name="contact" />
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
    isErrorVisible: state.login.error.isVisiable,
    errorMessage: state.login.error.message,
    auth: state.firebase.auth,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    dispatchFacebookLogin() {
      dispatch(actionCreator.facebookLogin());
    },
  };
}

export default compose(
  firebaseConnect([]),
  connect(mapStateToProps, mapDispatchToProps)
)(Login);
