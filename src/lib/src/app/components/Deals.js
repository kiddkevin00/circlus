import DealDetail from './DealDetail';
import MyDeals from './MyDeals';
import Profile from './Profile';
import { firebaseConnect } from 'react-redux-firebase';
import {
  Toast,
  Container,
  Header,
  Content,
  Footer,
  FooterTab,
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
  Share,
  Image,
  Dimensions,
} from 'react-native';
import { connect } from 'react-redux';
import { compose } from 'redux';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';


class Deals extends Component {

  static propTypes = {
    deals: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
    auth: PropTypes.object, // eslint-disable-line react/forbid-prop-types

    navigator: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  };

  _renderDeal = (deal) => {
    const startDate = moment(deal.when.startTimestamp);
    const today = moment();
    const displayMonth = today.isAfter(startDate) ? today.format('MMM').toUpperCase() : startDate.format('MMM').toUpperCase();
    const displayDate = today.isAfter(startDate) ? today.format('DD') : startDate.format('DD');

    return (
      <ListItem style={ { borderBottomWidth: 0 } }>
        <Card>
          <CardItem button onPress={ this._checkoutDealDetail.bind(this, deal) }>
            <Left>
              <Body style={ { flexGrow: 2, justifyContent: 'center', marginLeft: 0 } }>
                <Text style={ { fontSize: 10.5, color: 'red' } }>&nbsp;{ displayMonth }</Text>
                <Text style={ { fontSize: 22.5 } }>{ displayDate }</Text>
              </Body>
              <Body style={ { flexGrow: 15 } }>
                <Text style={ { fontSize: 18, fontWeight: '500' } }>{ deal.name }</Text>
                <Text style={ { fontSize: 13, color: '#333' } } note>{ deal.where.address }</Text>
              </Body>
            </Left>
          </CardItem>
          <CardItem cardBody button onPress={ this._checkoutDealDetail.bind(this, deal) }>
            <Image
              style={ { height: Dimensions.get('window').width - 35, width: '100%' } }
              source={ { uri: deal.heroPhoto } }
            />
          </CardItem>
          <CardItem button onPress={ this._checkoutDealDetail.bind(this, deal) }>
            <Left>
              <Button
                iconLeft
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
                <Icon style={ { fontSize: 22, color: '#6699ff' } } name="share" />
                <Text style={ { fontSize: 15, fontWeight: '700', color: '#6699ff' } }>Share</Text>
              </Button>
              <Text>&nbsp;</Text>
              <Button
                iconLeft
                transparent
                onPress={ () => {
                  Toast.show({
                    type: 'success',
                    text: `CirclusNYC2017://?deal=${global.encodeURIComponent(deal._id)}`,
                    position: 'bottom',
                    duration: 3000,
                  });
                } }
              >
                <Icon style={ { fontSize: 22, color: '#6699ff' } } name="link" />
                <Text style={ { fontSize: 15, fontWeight: '700', color: '#6699ff' } }>Link</Text>
              </Button>
            </Left>
            <Right>
              <Icon name="arrow-forward" />
            </Right>
          </CardItem>
          <CardItem style={ { paddingTop: 0.1, paddingBottom: 0.1 } } />
        </Card>
      </ListItem>
    );
  }

  _checkoutDealDetail(deal) {
    this.props.navigator.push({
      component: DealDetail,
      passProps: {
        dealId: deal._id,
        footer: {
          isVisiable: true,
          text: 'Share Link Now',
          onPress: () => Share.share({
            title: deal.name,
            message: `Check out this deal - ${deal._id}:\n` +
              `CirclusNYC2017://?deal=${global.encodeURIComponent(deal._id)}\n\n` +
              'Click the link below to download Circlus:\n' +
              'https://itunes.apple.com/us/app/circlus/',
            //url: 'https://app.clickfunnels.com/for_domain/esall1.clickfunnels.com/optin15874949',
          }),
        },
      },
    });
  }

  render() {
    const deals = this.props.deals
      .filter((deal) => !moment().isAfter(deal.when.endTimestamp))
      .sort((deal1, deal2) => deal2.when.startTimestamp - deal1.when.startTimestamp);

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
          <List
            dataArray={ deals }
            renderRow={ this._renderDeal }
          />
        </Content>
        <Footer>
          <FooterTab>
            <Button vertical onPress={ () => this.props.navigator.replace({ component: MyDeals }) }>
              <Icon name="pricetags" />
              <Text>Deals</Text>
            </Button>
            <Button active vertical onPress={ () => {} }>
              <Icon active name="share" />
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
        auth: state.firebase.auth,
      };
    }
  )
)(Deals);
