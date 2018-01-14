import actionTypes from '../actiontypes/';


const defaultErrorMsg = 'Something went wrong with Async Storage.';
const initialState = {
  isLoading: false,
  error: {
    isVisiable: false,
    message: defaultErrorMsg,
  },
  '@LocalDatabase:myDeals': [],
  '@LocalDatabase:customerId': undefined,
  '@LocalDatabase:stripeUserId': undefined,
};

function asyncStorageReducer(state = initialState, action) {
  const actionType = action.type;
  const actionPayload = action.payload;

  switch (actionType) {
    case actionTypes.ASYNC_STORAGE.GET_ITEM_REQUEST:
    case actionTypes.ASYNC_STORAGE.SET_ITEM_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case actionTypes.ASYNC_STORAGE.GET_ITEM_SUCCESS:
      return {
        ...state,
        isLoading: false,
        [actionPayload.key]: actionPayload.item,
      };
    case actionTypes.ASYNC_STORAGE.SET_ITEM_SUCCESS:
      return {
        ...state,
        isLoading: false,
      };
    case actionTypes.ASYNC_STORAGE.GET_ITEM_FAILURE:
    case actionTypes.ASYNC_STORAGE.SET_ITEM_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: {
          isVisiable: true,
          message: actionPayload.errorMsg,
        },
      };
    default:
      return state;
  }
}

export { asyncStorageReducer as default };
