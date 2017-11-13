import PhotosPreview from './PhotosPreview';
import WebViewWrapper from './common/WebViewWrapper';
import constants from '../constants/';
import { firebaseConnect } from 'react-redux-firebase';
import {
  Container,
  Header,
  Content,
  Footer,
  FooterTab,
  Card,
  CardItem,
  Left,
  Body,
  Right,
  Title,
  Grid,
  Row,
  Col,
  Thumbnail,
  Button,
  Text,
  Icon,
} from 'native-base';
import {
  Alert,
  Share,
  Linking,
  TouchableHighlight,
  Image,
  Dimensions,
} from 'react-native';
import { connect } from 'react-redux';
import { compose } from 'redux';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';


class DealDetail extends Component {

  static propTypes = {
    dealId: PropTypes.string.isRequired,
    footer: PropTypes.shape({
      isVisiable: PropTypes.bool.isRequired,
      text: PropTypes.string,
      onPress: PropTypes.func,
    }).isRequired,

    deals: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types

    navigator: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  };

  state = {
    isViewerShown: false,
    indexShown: 0,
  };

  _onPhotoSelect(indexShown) {
    this.props.navigator.push({
      component: PhotosPreview,
      passProps: {
        indexShown,
        dealId: this.props.dealId,
      },
    });
  }

  _openWebPage(url) {
    this.props.navigator.push({
      component: WebViewWrapper,
      passProps: { url },
    });
  }

  _showDirectionInMapApp = async (coordinate) => {
    const url = `http://maps.apple.com/?daddr=${coordinate.latitude},${coordinate.longitude}`;

    try {
      const isSupported = await Linking.canOpenURL(url);

      if (isSupported) {
        await Linking.openURL(url);
      }
    } catch (err) {
      Alert.alert('Error', `Showing direction failed: ${err.message}`);
    }
  }

  _reducePhotosView = (rowViews, photo, index, photos) => {
    if (index === photos.length - 1) {
      if (index % 2 === 0) {
        if (index > 0) {
          rowViews.push((
            <Row key={ photos[index - 2] }>
              <Col style={ { borderWidth: 1, borderColor: 'white' } }>
                <TouchableHighlight onPress={ this._onPhotoSelect.bind(this, index - 2) }>
                  <Thumbnail
                    style={ { height: (Dimensions.get('window').width - 59) / 2, width: '100%' } }
                    square
                    source={ { uri: photos[index - 2] } }
                  />
                </TouchableHighlight>
              </Col>
              <Col style={ { borderWidth: 1, borderColor: 'white' } }>
                <TouchableHighlight onPress={ this._onPhotoSelect.bind(this, index - 1) }>
                  <Thumbnail
                    style={ { height: (Dimensions.get('window').width - 59) / 2, width: '100%' } }
                    square
                    source={ { uri: photos[index - 1] } }
                  />
                </TouchableHighlight>
              </Col>
            </Row>
          ));
        }
        rowViews.push((
          <Row key={ photos[index] }>
            <Col style={ { borderWidth: 1, borderColor: 'white' } }>
              <TouchableHighlight onPress={ this._onPhotoSelect.bind(this, index) }>
                <Thumbnail
                  style={ { height: (Dimensions.get('window').width - 57), width: '100%' } }
                  square
                  source={ { uri: photos[index] } }
                />
              </TouchableHighlight>
            </Col>
          </Row>
        ));
      } else {
        rowViews.push((
          <Row key={ photos[index - 1] }>
            <Col style={ { borderWidth: 1, borderColor: 'white' } }>
              <TouchableHighlight onPress={ this._onPhotoSelect.bind(this, index - 1) }>
                <Thumbnail
                  style={ { height: (Dimensions.get('window').width - 59) / 2, width: '100%' } }
                  square
                  source={ { uri: photos[index - 1] } }
                />
              </TouchableHighlight>
            </Col>
            <Col style={ { borderWidth: 1, borderColor: 'white' } }>
              <TouchableHighlight onPress={ this._onPhotoSelect.bind(this, index) }>
                <Thumbnail
                  style={ { height: (Dimensions.get('window').width - 59) / 2, width: '100%' } }
                  square
                  source={ { uri: photos[index] } }
                />
              </TouchableHighlight>
            </Col>
          </Row>
        ));
      }
    } else if (index > 0 && index % 2 === 0) {
      rowViews.push((
        <Row key={ photos[index - 2] }>
          <Col style={ { borderWidth: 1, borderColor: 'white' } }>
            <TouchableHighlight onPress={ this._onPhotoSelect.bind(this, index - 2) }>
              <Thumbnail
                style={ { height: (Dimensions.get('window').width - 59) / 2, width: '100%' } }
                square
                source={ { uri: photos[index - 2] } }
              />
            </TouchableHighlight>
          </Col>
          <Col style={ { borderWidth: 1, borderColor: 'white' } }>
            <TouchableHighlight onPress={ this._onPhotoSelect.bind(this, index - 1) }>
              <Thumbnail
                style={ { height: (Dimensions.get('window').width - 59) / 2, width: '100%' } }
                square
                source={ { uri: photos[index - 1] } }
              />
            </TouchableHighlight>
          </Col>
        </Row>
      ));
    }
    return rowViews;
  }

  render() {
    const deal = this.props.deals.find((d) => d._id === this.props.dealId) ||
      constants.APP.SAMPLE_DEAL;
    const photosView = (
      Array.isArray(deal.photos) ? (
        deal.photos.reduce(this._reducePhotosView, [])
      ) : (
        <Row>
          <Text note>coming soon...</Text>
        </Row>
      )
    );
    const startDate = moment(deal.when.startTimestamp);
    const today = moment();
    const displayMonth = today.isAfter(startDate) ? today.format('MMM').toUpperCase() : startDate.format('MMM').toUpperCase();
    const displayDate = today.isAfter(startDate) ? today.format('DD') : startDate.format('DD');
    const diaplyDateInterval = startDate.format('MMM DD') !== moment(deal.when.endTimestamp).format('MMM DD') ?
      `${startDate.format('MMM DD')} - ${moment(deal.when.endTimestamp).format('MMM DD')}` :
      startDate.format('MMM DD');
    const displayTimeInterval = deal.when.display || `${startDate.format('hh:mm A')} - ${moment(deal.when.endTimestamp).format('hh:mm A')}`;

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
          <Right>
            <Button
              transparent
              onPress={ () => Share.share({
                title: deal.name,
                message: `Check out this deal - ${deal.name}:\n` +
                  `CirclusNYC2017://?deal=${global.encodeURIComponent(deal._id)}\n\n` +
                  'Click the link below to download Circlus:\n' +
                  'https://itunes.apple.com/us/app/circlus/',
                //url: 'https://app.clickfunnels.com/for_domain/esall1.clickfunnels.com/optin15874949',
              }) }
            >
              <Icon style={ { color: 'white' } } name="share" />
            </Button>
          </Right>
        </Header>
        <Content padder>
          <Card>
            <CardItem cardBody>
              <Image
                style={ { height: Dimensions.get('window').width - 25, width: '100%' } }
                source={ deal.heroPhoto ? { uri: deal.heroPhoto } : require('../../../static/assets/images/loading-indicator.gif') }
              />
            </CardItem>
            <CardItem style={ { height: 70 } } bordered>
              <Body style={ { flexGrow: 2, justifyContent: 'center' } }>
                <Text style={ { fontSize: 11, color: 'red' } }>&nbsp;{ displayMonth }</Text>
                <Text style={ { fontSize: 25 } }>{ displayDate }</Text>
              </Body>
              <Text>&nbsp;</Text>
              <Body style={ { flexGrow: 13, justifyContent: 'center' } }>
                <Text style={ { fontSize: 20, fontWeight: '500' } }>{ deal.name }</Text>
                <Text style={ { fontSize: 14, fontWeight: '400', color: '#333' } } note>{ Array.isArray(deal.tags) && deal.tags.join(' ') }</Text>
              </Body>
            </CardItem>
            <CardItem bordered>
              <Left>
                <Icon style={ { fontSize: 25, color: 'red' } } name="time" />
                <Text>&nbsp;</Text>
                <Body>
                  <Text style={ { fontSize: 16, fontWeight: '500' } }>{ diaplyDateInterval }</Text>
                  <Text style={ { fontSize: 14, fontWeight: '400', color: '#333' } } note>{ displayTimeInterval }</Text>
                </Body>
              </Left>
            </CardItem>
            <CardItem bordered button onPress={ this._showDirectionInMapApp.bind(this, deal.where.coordinate) }>
              <Left>
                <Icon style={ { fontSize: 25, color: 'red' } } name="navigate" />
                <Text>&nbsp;</Text>
                <Body>
                  <Text style={ { fontSize: 16, fontWeight: '500' } }>{ deal.where.venue }</Text>
                  <Text style={ { fontSize: 14, fontWeight: '400', color: '#333' } } note>{ deal.where.address }</Text>
                </Body>
              </Left>
            </CardItem>
            <CardItem bordered>
              <Left>
                <Icon style={ { fontSize: 25, color: 'red' } } name="pricetag" />
                <Text>&nbsp;</Text>
                <Text style={ { fontSize: 16, fontWeight: '500' } }>{ deal.discount.display }</Text>
              </Left>
            </CardItem>
            <CardItem bordered button onPress={ this._openWebPage.bind(this, deal.externalLink) }>
              <Left>
                <Icon style={ { fontSize: 25, color: 'red' } } name="link" />
                <Text>&nbsp;</Text>
                <Body>
                  <Text style={ { fontSize: 16, fontWeight: '500' } }>About Us</Text>
                  <Text style={ { fontSize: 14, fontWeight: '400', color: '#333' } } note>
                    { deal.externalLink }
                  </Text>
                </Body>
              </Left>
            </CardItem>
            <CardItem bordered>
              <Body>
                <Text style={ { fontSize: 16, fontWeight: '500' } }>Details</Text>
                <Text style={ { fontSize: 14, fontWeight: '400', color: '#333' } } note>
                  { deal.detail }
                </Text>
              </Body>
            </CardItem>
            <CardItem>
              <Grid>
                <Row>
                  <Text style={ { fontSize: 16, fontWeight: '500' } }>Photos</Text>
                </Row>
                { photosView }
              </Grid>
            </CardItem>
            <CardItem style={ { paddingTop: 0.1, paddingBottom: 0.1 } } />
          </Card>
        </Content>
        { this.props.footer.isVisiable && (
          <Footer>
            <FooterTab>
              <Button style={ { backgroundColor: '#6699ff' } } full onPress={ this.props.footer.onPress }>
                <Text style={ { fontSize: 17, color: 'white', fontWeight: 'bold' } }>{ this.props.footer.text }</Text>
              </Button>
            </FooterTab>
          </Footer>
        ) }
      </Container>
    );
  }

}

export default compose(
  firebaseConnect([
    { path: '/nyc/deals' },
  ]),
  connect(
    function mapStateToProps(state) {
      return {
        deals: (state.firebase.ordered && state.firebase.ordered.nyc &&
          Array.isArray(state.firebase.ordered.nyc.deals)) ?
          state.firebase.ordered.nyc.deals.map((deal) => deal.value) : [],
      };
    }
  )
)(DealDetail);
