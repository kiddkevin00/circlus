import {
  WebView,
  View,
  Dimensions,
} from 'react-native';
import {
  Container,
  Header,
  Content,
  Left,
  Body,
  Right,
  Title,
  Button,
  Icon,
} from 'native-base';
import React, { Component } from 'react';
import PropTypes from 'prop-types';


class WebViewWrapper extends Component {

  static propTypes = {
    url: PropTypes.string.isRequired,
    navigator: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  };

  _backToComponent = () => {
    this.props.navigator.pop();
  }

  render() {
    const { height, width } = Dimensions.get('window');

    return (
      <Container>
        <Header style={ { backgroundColor: '#3F5EFB' } }>
          <Left>
            <Button transparent onPress={ this._backToComponent }>
              <Icon style={ { color: 'white', fontSize: 32 } } name="arrow-back" />
            </Button>
          </Left>
          <Body style={ { flexGrow: 3 } }>
            <Title style={ { color: 'white', fontFamily: 'Comfortaa-Regular', letterSpacing: 1.36, fontSize: 27 } }>circlus</Title>
          </Body>
          <Right />
        </Header>
        <Content>
          <View style={ { height, width } }>
            <WebView source={ { uri: this.props.url } } />
          </View>
        </Content>
      </Container>
    );
  }
}

export { WebViewWrapper as default };
