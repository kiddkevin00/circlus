import Deals from './Deals';
import DealDetail from './DealDetail';
import Signup from './Signup';
import actionCreator from '../actioncreators/login';
import { firebaseAuth } from '../proxies/FirebaseProxy';
//import {
//  LoginButton as FacebookSignInButton,
//} from 'react-native-fbsdk';
import { firebaseConnect } from 'react-redux-firebase';
import {
  ActivityIndicator,
  TouchableHighlight,
  TextInput,
  Text,
  View,
  StyleSheet,
} from 'react-native';
import { connect } from 'react-redux';
import { compose } from 'redux';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import qs from 'qs';


const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f4f7f9',
  },
  main: {
    flexGrow: 70,
    //marginTop: 64,
    padding: 30,
    backgroundColor: '#23cfb9',
  },
  footer: {
    flexGrow: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    alignSelf: 'center',
    marginBottom: 20,
    fontSize: 25,
    color: '#F5F5F5',
  },
  formInput: {
    marginBottom: 10,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: 'white',
    padding: 4,
    height: 50,
    fontSize: 23,
    color: 'white',
  },
  loginButton: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 5,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: 'orange',
    height: 45,
    backgroundColor: 'orange',
  },
  signupButton: {
    justifyContent: 'center',
    alignItems: 'center',
    //marginTop: 10,
    marginBottom: 5,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: 'white',
    height: 45,
    backgroundColor: 'white',
  },
  footerText: {
    fontSize: 12,
    color: '#a3a7b2',
  },
  loginButtonText: {
    fontSize: 18,
    color: 'white',
  },
  signupButtonText: {
    fontSize: 18,
    color: '#111',
  },
});

class Login extends Component {

  static propTypes = {
    dispatchFacebookPostLogin: PropTypes.func.isRequired,
    auth: PropTypes.object, // eslint-disable-line react/forbid-prop-types

    navigator: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  };

  state = {
    formEmail: '',
    formPassword: '',
    isLoading: false,
    error: '',
  };

  componentDidUpdate() {
    //if (!this.props.auth.isEmpty) {
    //  this.props.navigator.replace({
    //    component: Deals,
    //  });
    //}
  }

  _handleOpenURL = (event) => {
    const url = event.url.split('?');
    const path = url[0];
    const params = url[1] ? qs.parse(url[1]) : null;

    if (path && params && params.deal) {
      this.props.navigator.replace({
        component: Deals,
      });

      this.props.navigator.push({
        component: DealDetail,
        passProps: {
          dealId: params.deal,
        },
      });
    }
  }

  _handleLogin = async () => {
    this.setState({
      isLoading: true,
    });

    try {
      const userInfo = await firebaseAuth
        .signInWithEmailAndPassword(this.state.formEmail, this.state.formPassword);

      this.props.navigator.replace({
        component: Deals,
        passProps: {
          userInfo: {
            uid: userInfo.uid,
            isAnonymous: userInfo.isAnonymous,
          },
        },
      });

      //this.setState({
      //  formEmail: '',
      //  formPassword: '',
      //  isLoading: false,
      //  error: '',
      //});
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;

      if (errorCode === 'auth/wrong-password') {
        global.alert('Wrong password.');
      } else {
        global.alert(errorMessage);
      }

      this.setState({
        isLoading: false,
        error: errorMessage,
      });
    }
  }

  _handleFbPostLogin = async (error, result) => {
    if (error) {
      global.alert(`Facebook login error: ${result.error}`);
    } else if (result.isCancelled) {
      global.alert('Facebook login cancelled.');
    } else {
      this.props.dispatchFacebookPostLogin(this.props.navigator);
    }
  }

  _gotoSignup = () => {
    this.props.navigator.replace({
      component: Signup,
    });
  }

  _handleChange = (field, event) => {
    this.setState({
      [`form${field}`]: event.nativeEvent.text,
    });
  }

  render() {
    if (!this.props.auth.isLoaded) {
      return null;
    }

    return (
      <View style={ styles.container }>
        <View style={ styles.main }>
          <Text style={ styles.title }>Circlus</Text>
          <TextInput
            style={ styles.formInput }
            value={ this.state.formEmail }
            onChange={ this._handleChange.bind(this, 'Email') }
            placeholder="Email"
            placeholderTextColor="#a3a7b2"
          />
          <TextInput
            style={ styles.formInput }
            value={ this.state.formPassword }
            onChange={ this._handleChange.bind(this, 'Password') }
            placeholder="Password"
            placeholderTextColor="#a3a7b2"
            secureTextEntry={ true }
          />
          <TouchableHighlight
            style={ styles.loginButton }
            onPress={ this._handleLogin }
            underlayColor="#ffcc00"
          >
            <Text style={ styles.loginButtonText }>LOG IN</Text>
          </TouchableHighlight>
          <TouchableHighlight
            style={ styles.signupButton }
            onPress={ this._gotoSignup }
            underlayColor="#f2f2f2"
          >
            <Text style={ styles.signupButtonText }>SIGN UP</Text>
          </TouchableHighlight>
          {/*
          <FacebookSignInButton
            readPermissions={ ['public_profile', 'email', 'user_friends'] }
            onLoginFinished={ this._handleFbPostLogin }
            onLogoutFinished={ () => global.alert('Logout succeeded!') }
          />
          */}
          <ActivityIndicator
            animating={ this.state.isLoading }
            color="#111"
            size="large"
          />
          <Text>{ this.state.error }</Text>
        </View>
        <View style={ styles.footer }>
          <Text style={ styles.footerText }>
            By signing in, you agree to our Terms & Privacy Policy
          </Text>
        </View>
      </View>
    );
  }

}

function mapStateToProps(state) {
  return {
    auth: state.firebase.auth,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    dispatchFacebookPostLogin(navigator) {
      dispatch(actionCreator.facebookPostLogin(navigator));
    },
  };
}

export default compose(
  firebaseConnect([]),
  connect(mapStateToProps, mapDispatchToProps)
)(Login);
