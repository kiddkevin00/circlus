import actionTypes from '../actiontypes/';


const initialState = {
  myDeals: [],
};

function myDealsReducer(state = initialState, action) {
  const actionType = action.type;
  const actionPayload = action.payload;

  switch (actionType) {
    case actionTypes.MY_DEALS.FETCH_MY_DEALS_REQUEST:
      return state;
    case actionTypes.MY_DEALS.FETCH_MY_DEALS_SUCCESS:
      return {
        ...state,
        myDeals: actionPayload.myDeals,
      };
    default:
      return state;
  }
}

export { myDealsReducer as default };
