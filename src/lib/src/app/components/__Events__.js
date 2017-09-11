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
import {
  Alert,
  Share,
  AsyncStorage,
  Image,
  Dimensions,
} from 'react-native';
import { connect } from 'react-redux';
import { compose } from 'redux';
import React, { Component } from 'react';
import PropTypes from 'prop-types';


class Events extends Component {

  static propTypes = {
    events: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
    auth: PropTypes.object, // eslint-disable-line react/forbid-prop-types

    navigator: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  };

  render() {
    return (
      <Container>
        <Header style={ { backgroundColor: '#f96332' } }>
          <Left />
          <Body style={ { flexGrow: 3 } }>
            <Title style={ { color: 'white', fontFamily: 'Lily Script One', fontSize: 27 } }>Local Detour</Title>
          </Body>
          <Right>
            <Button transparent onPress={ this._gotoMapView }>
              <Icon style={ { color: 'white' } } name="map" />
            </Button>
          </Right>
        </Header>
        <Content>

        </Content>
      </Container>
    );
  }

}

export default Events;
