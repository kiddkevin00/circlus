import asyncStorageActionCreator from './asyncStorage';
import actionTypes from '../actiontypes/';
import {
  Share,
} from 'react-native';


const shareActionCreator = {
  shareDeal(deal) {
    return async (dispatch/*, getState*/) => {
      dispatch({
        type: actionTypes.SHARE.SHARE_REQUEST,
      });

      try {
        const stripeUserId = await asyncStorageActionCreator
          .getItem('@LocalDatabase:stripeUserId')(() => {});

        if (!stripeUserId) {
          throw new Error('Missing your bank account information.');
        }

        await Share.share({
          title: `Check out this deal - ${deal.name}`,
          message: `Check out this deal - ${deal.name}`,
          url: `https://circlus.herokuapp.com/?deal=${global.encodeURIComponent(deal._id)}&` +
            `influencer=${global.encodeURIComponent(stripeUserId)}&` +
            `merchant=${global.encodeURIComponent(deal.merchantStripeUserId)}`,
        });

        dispatch({
          type: actionTypes.SHARE.SHARE_SUCCESS,
        });
      } catch (error) {
        const errorMsg = `Sharing deal failed.\n${error.message}`;

        dispatch({
          type: actionTypes.SHARE.SHARE_FAILURE,
          payload: { errorMsg },
        });

        throw new Error(errorMsg);
      }
    };
  },
};

export { shareActionCreator as default };
