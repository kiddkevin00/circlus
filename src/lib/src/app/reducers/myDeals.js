import actionTypes from '../actiontypes/';


const initialState = {
  myDeals: [],
};

function myDealsReducer(state = initialState, action) {
  const actionType = action.type;
  const actionPayload = action.payload;

  switch (actionType) {
    case actionTypes.MY_DEALS.FETCHING_MY_DEALS:
      return state;
    case actionTypes.MY_DEALS.FETCH_MY_DEALS_SUCCEED:
      return {
        ...state,
        myDeals: actionPayload.myDeals,
      };
    default:
      return state;
  }
}

export { myDealsReducer as default };
