import asyncStorageActionCreator from './asyncStorage';
import actionTypes from '../actiontypes/';
import HttpProxy from '../proxies/HttpProxy';
import StandardResponseWrapper from '../utils/StandardResponseWrapper';


const checkoutActionCreator = {
  handleToken(tokenId, totalAmount, email, dealId, dealName, influencerStripeUserId, merchantStripeUserId) {
    return async (dispatch/*, getState*/) => {
      dispatch({
        type: actionTypes.CHECKOUT.CHECKOUT_REQUEST,
      });

      const httpClient = HttpProxy.createInstance();

      try {
        const requesyBody = { tokenId, email, dealId, dealName, influencerStripeUserId, merchantStripeUserId, chargeAmount: totalAmount };
        const { data } = await httpClient.post('/payment/proceed', requesyBody);

        if (StandardResponseWrapper.verifyFormat(data) && StandardResponseWrapper.deserialize(data).getNthData(0).success) {
          const customerId = StandardResponseWrapper.deserialize(data).getNthData(0).detail.customerId;

          await asyncStorageActionCreator.setItem('@LocalDatabase:customerId', customerId);

          dispatch({
            type: actionTypes.CHECKOUT.CHECKOUT_SUCCESS,
          });
        } else {
          const errorMsg = `Invalid response received from server.\n${JSON.stringify(data, null, 2)}`;

          dispatch({
            type: actionTypes.CHECKOUT.CHECKOUT_FAILURE,
            payload: { errorMsg },
          });

          throw new Error(errorMsg);
        }
      } catch (err) {
        const errorMsg = `Payment processing fails.\n${err.message}`;

        dispatch({
          type: actionTypes.CHECKOUT.CHECKOUT_FAILURE,
          payload: { errorMsg },
        });

        throw new Error(errorMsg);
      }
    };
  },
};

export { checkoutActionCreator as default };
