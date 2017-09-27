import Signup from './Signup';
import Login from './Login';
import { firebaseAuth } from '../proxies/FirebaseProxy';
import { firebaseConnect } from 'react-redux-firebase';
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
import { connect } from 'react-redux';
import { compose } from 'redux';
import React, { Component } from 'react';
import PropTypes from 'prop-types';


class Deals extends Component {

  static propTypes = {
    //deals: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
    auth: PropTypes.object, // eslint-disable-line react/forbid-prop-types

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
        title: 'Log In',
        component: Login,
      });

      this.setState({
        isLoading: false,
      });
    } catch (error) {
      const errorMessage = error.message || 'Something went wrong.';

      global.alert(errorMessage);

      this.setState({
        isLoading: false,
      });
    }
  }

  _gotoSignup = () => {
    this.props.navigator.push({
      component: Signup,
    });
  }

  render() {
    return (
      <Container>
        <Header style={ { backgroundColor: '#f96332' } }>
          <Left />
          <Body style={ { flexGrow: 3 } }>
            <Title style={ { color: 'white', fontFamily: 'Lily Script One', fontSize: 27 } }>Circlus</Title>
          </Body>
          <Right>
            <Button transparent onPress={ this._gotoSignup }>
              <Icon style={ { color: 'white' } } name="log-in" />
            </Button>
          </Right>
        </Header>
        <Content>

        </Content>
      </Container>
    );
  }

}

export default compose(
  firebaseConnect([
    //{ path: '/' },
  ]),
  connect(
    function mapStateToProps(state) {
      return {
        //events: (state.firebase.ordered && state.firebase.ordered.nyc &&
        //  Array.isArray(state.firebase.ordered.nyc.events)) ?
        //  state.firebase.ordered.nyc.events.map((event) => event.value) : [],
        auth: state.firebase.auth,
      };
    }
  )
)(Deals);
