import actionTypes from '../actiontypes/';
import {
  AsyncStorage,
} from 'react-native';


const asyncStorageActionCreator = {
  getItem(key, shouldParse, defaultValue) {
    return async (dispatch/*, getState*/) => {
      dispatch({
        type: actionTypes.ASYNC_STORAGE.GET_ITEM_REQUEST,
      });

      try {
        const itemString = await AsyncStorage.getItem(key);
        const item = (itemString && (shouldParse ? JSON.parse(itemString) : itemString)) ||
          defaultValue;

        dispatch({
          type: actionTypes.ASYNC_STORAGE.GET_ITEM_SUCCESS,
          payload: { item, key },
        });

        return item;
      } catch (err) {
        const errorMsg = `Retrieving data from Async Storage fails.\n${err.message}`;

        dispatch({
          type: actionTypes.ASYNC_STORAGE.GET_ITEM_FAILURE,
          payload: { errorMsg },
        });

        throw new Error(errorMsg);
      }
    };
  },

  setItem(key, item) {
    return async (dispatch/*, getState*/) => {
      dispatch({
        type: actionTypes.ASYNC_STORAGE.SET_ITEM_REQUEST,
      });

      try {
        await AsyncStorage.setItem(key, typeof item !== 'string' ? JSON.stringify(item) : item);

        dispatch({
          type: actionTypes.ASYNC_STORAGE.SET_ITEM_SUCCESS,
        });
      } catch (err) {
        const errorMsg = `Setting data in Async Storage fails.\n${err.message}`;

        dispatch({
          type: actionTypes.ASYNC_STORAGE.SET_ITEM_FAILURE,
          payload: { errorMsg },
        });

        throw new Error(errorMsg);
      }
    };
  },
};

export { asyncStorageActionCreator as default };
