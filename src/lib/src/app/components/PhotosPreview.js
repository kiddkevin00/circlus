import constants from '../constants/';
import Swiper from 'react-native-swiper';
import PhotoView from 'react-native-photo-view';
import { firebaseConnect } from 'react-redux-firebase';
import {
  Container,
  Text,
} from 'native-base';
import {
  View,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { connect } from 'react-redux';
import { compose } from 'redux';
import React, { Component } from 'react';
import PropTypes from 'prop-types';


const styles = StyleSheet.create({
  container: {
    //justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 25,
    left: 0,
    right: 0,
  },
  wrapper: {
    borderRadius: 7,
    paddingVertical: 3,
    paddingHorizontal: 7,
    backgroundColor: 'rgba(255,255,255,.15)',
  },
});

function Viewer(props) {
  const photoViewInlineStyle = {
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
  };

  return (
    <Swiper
      index={ props.imageIndex }
      renderPagination={ Viewer._renderPagination }
    >
      {
        props.imgList.map((item) => (
          <PhotoView
            style={ [photoViewInlineStyle] }
            key={ item }
            resizeMode="contain"
            minimumZoomScale={ 1 }
            maximumZoomScale={ 3 }
            source={ { uri: item } }
            onViewTap={ props.onImageOutsideTap }
            onTap={ props.onImageTap }
          />
        ))
      }
    </Swiper>
  );
}
Viewer.propTypes = {
  imgList: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
  imageIndex: PropTypes.number.isRequired,
  onImageOutsideTap: PropTypes.func.isRequired,
  onImageTap: PropTypes.func.isRequired,
};
Viewer._renderPagination = (index, total/*, context*/) => (
  <View style={ styles.container }>
    <View style={ styles.wrapper }>
      <Text style={ { fontSize: 14, color: '#fff' } }>
        { index + 1 } / { total }
      </Text>
    </View>
  </View>
);


class DealDetail extends Component {

  static propTypes = {
    indexShown: PropTypes.number.isRequired,
    dealId: PropTypes.string.isRequired,

    deals: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types

    navigator: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  };

  _backToDealDetailView = () => {
    this.props.navigator.pop();
  }

  render() {
    const deal = this.props.deals.find((d) => d._id === this.props.dealId) ||
      constants.APP.SAMPLE_DEAL;

    return (
      <Container>
        <Viewer
          onImageOutsideTap={ this._backToDealDetailView }
          onImageTap={ this._backToDealDetailView }
          imgList={ deal.photos }
          imageIndex={ this.props.indexShown }
        />
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
