import actionTypes from '../actiontypes/';


const defaultErrorMsg = 'Something went wrong in My Deals page';
const initialState = {
  isLoading: false,
  error: {
    isVisiable: false,
    message: defaultErrorMsg,
  },
  myDeals: [],
};

function myDealsReducer(state = initialState, action) {
  const actionType = action.type;
  const actionPayload = action.payload;

  switch (actionType) {
    case actionTypes.MY_DEALS.FETCH_MY_DEALS_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case actionTypes.MY_DEALS.FETCH_MY_DEALS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        myDeals: actionPayload.myDeals,
      };
    case actionTypes.MY_DEALS.FETCH_MY_DEALS_FAILURE:
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

export { myDealsReducer as default };
