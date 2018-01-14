import actionTypes from '../actiontypes/';
import HttpProxy from '../proxies/HttpProxy';
import StandardResponseWrapper from '../utils/StandardResponseWrapper';


const landingActionCreator = {
  handleBankAccountSetup(authorizationCode) {
    return async (dispatch/*, getState*/) => {
      dispatch({
        type: actionTypes.LANDING.SETUP_BANK_ACCOUNT_REQUEST,
      });

      const httpClient = HttpProxy.createInstance();

      try {
        const requesyBody = { authorizationCode };
        const { data } = await httpClient.post('/bank-account/setup', requesyBody);

        if (StandardResponseWrapper.verifyFormat(data) && StandardResponseWrapper.deserialize(data).getNthData(0).success) {
          const stripeUserId = StandardResponseWrapper.deserialize(data).getNthData(0).detail.stripeUserId;

          dispatch({
            type: actionTypes.LANDING.SETUP_BANK_ACCOUNT_SUCCESS,
          });

          return stripeUserId;
        }
        const errorMsg = `Invalid response received from server.\n${JSON.stringify(data, null, 2)}`;

        dispatch({
          type: actionTypes.LANDING.SETUP_BANK_ACCOUNT_FAILURE,
          payload: { errorMsg },
        });

        throw new Error(errorMsg);
      } catch (err) {
        const errorMsg = `Setup bank account fails.\n${err.message}`;

        dispatch({
          type: actionTypes.LANDING.SETUP_BANK_ACCOUNT_FAILURE,
          payload: { errorMsg },
        });

        throw new Error(errorMsg);
      }
    };
  },
};

export { landingActionCreator as default };
