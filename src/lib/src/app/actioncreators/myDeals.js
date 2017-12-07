import actionTypes from '../actiontypes/';
import {
  AsyncStorage,
} from 'react-native';


const myDealsActionCreator = {
  fetchMyDeals() {
    return async (dispatch/*, getState*/) => {
      dispatch({
        type: actionTypes.MY_DEALS.FETCH_MY_DEALS_REQUEST,
      });

      try {
        let myDeals;
        const myDealsString = await AsyncStorage.getItem('@LocalDatabase:myDeals');

        if (myDealsString) {
          myDeals = JSON.parse(myDealsString);
        } else {
          myDeals = [];
        }
        dispatch({
          type: actionTypes.MY_DEALS.FETCH_MY_DEALS_SUCCESS,
          payload: { myDeals },
        });
      } catch (err) {
        const errorMsg = `Retrieving data fails.\n${err.message}`;

        dispatch({
          type: actionTypes.MY_DEALS.FETCH_MY_DEALS_FAILURE,
          payload: { errorMsg },
        });

        throw new Error(errorMsg);
      }
    };
  },
};

export { myDealsActionCreator as default };
