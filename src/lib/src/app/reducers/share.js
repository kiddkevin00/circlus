import actionTypes from '../actiontypes/';


const initialState = {};

function shareReducer(state = initialState, action) {
  const actionType = action.type;
  const actionPayload = action.payload;

  switch (actionType) {
    case actionTypes.SHARE.SHARE_REQUEST:
    case actionTypes.SHARE.SHARE_SUCCESS:
    case actionTypes.SHARE.SHARE_FAILURE:
    default:
      return state;
  }
}

export { shareReducer as default };
