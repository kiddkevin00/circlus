import actionTypes from '../actiontypes/';
import {
  AsyncStorage,
  Alert,
} from 'react-native';


const myDealsActionCreator = {
  fetchMyDeals() {
    return async (dispatch/*, getState*/) => {
      dispatch({
        type: actionTypes.MY_DEALS.FETCH_MY_DEALS_REQUEST,
      });

      try {
        const myDealsString = await AsyncStorage.getItem('@LocalDatabase:myDeals');

        let myDeals;

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
        Alert.alert('Error', `Retrieving data fails: ${err.message}`);
      }
    };
  },
};

export { myDealsActionCreator as default };
