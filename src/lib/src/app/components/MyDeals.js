import DealDetail from './DealDetail';
import BillingSummary from './BillingSummary';
import Deals from './Deals';
import Profile from './Profile';
import actionCreator from '../actioncreators/myDeals';
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
  Image,
  Dimensions,
} from 'react-native';
import { connect } from 'react-redux';
import { compose } from 'redux';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';


class MyDeals extends Component {

  static propTypes = {
    dispatchFetchMyDeals: PropTypes.func.isRequired,
    isLoading: PropTypes.bool.isRequired,
    myDeals: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types

    deals: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types

    navigator: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  };

  componentDidMount() {
    this.props.dispatchFetchMyDeals()
      .catch((err) => {
        Alert.alert('Try it again', err.message);
      });
  }

  _checkoutDealDetail(deal) {
    this.props.navigator.push({
      component: DealDetail,
      passProps: {
        dealId: deal._id,
        footer: {
          isVisiable: true,
          text: 'Checkout',
          onPress: () => this.props.navigator.push({
            component: BillingSummary,
            passProps: {
              dealId: deal._id,
              influencerStripeUserId: deal.influencerStripeUserId,
              merchantStripeUserId: deal.merchantStripeUserId,
              discount: deal.discount.value,
            },
          }),
        },
      },
    });
  }

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
                onPress={ () => this.props.navigator.push({
                  component: BillingSummary,
                  passProps: {
                    dealId: deal._id,
                    influencerStripeUserId: deal.influencerStripeUserId,
                    merchantStripeUserId: deal.merchantStripeUserId,
                    discount: deal.discount.value,
                  },
                }) }
              >
                <Icon style={ { fontSize: 22, color: '#6699ff' } } name="cart" />
                <Text style={ { fontSize: 15, fontWeight: '700', color: '#6699ff' } }>Checkout</Text>
              </Button>
              <Text>&nbsp;</Text>
              <Button iconLeft transparent onPress={ () => Alert.alert('Info', 'The deal has been removed.') }>
                <Icon style={ { fontSize: 22, color: '#FF7171' } } name="remove-circle" />
                <Text style={ { fontSize: 15, fontWeight: '700', color: '#FF7171' } }>Remove</Text>
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

  render() {
    const deals = this.props.myDeals
      .sort((deal1, deal2) => deal2.dateAdded - deal1.dateAdded)
      .map((myDeal) => ({
        ...myDeal,
        ...this.props.deals.find((deal) => deal._id === myDeal.dealId),
      }))
      .filter((deal) => deal && deal.when && deal.when.endTimestamp &&
        !moment().isAfter(deal.when.endTimestamp));

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
          { this.props.isLoading && <Spinner color="blue" /> }
          <List
            dataArray={ deals }
            renderRow={ this._renderDeal }
          />
        </Content>
        <Footer>
          <FooterTab>
            <Button active vertical onPress={ () => {} }>
              <Icon active name="pricetags" />
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
    isLoading: state.myDeals.isLoading,
    myDeals: state.myDeals.myDeals,
    deals: (state.firebase.ordered && state.firebase.ordered.nyc &&
      Array.isArray(state.firebase.ordered.nyc.deals)) ?
      state.firebase.ordered.nyc.deals.map((deal) => deal.value) : [],
  };
}
function mapDispatchToProps(dispatch) {
  return {
    dispatchFetchMyDeals() {
      return dispatch(actionCreator.fetchMyDeals());
    },
  };
}

export default compose(
  firebaseConnect([
    { path: '/nyc/deals' },
  ]),
  connect(mapStateToProps, mapDispatchToProps)
)(MyDeals);
