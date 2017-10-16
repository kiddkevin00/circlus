import actionTypes from '../actiontypes/';


const initialState = {

};

function loginReducer(state = initialState, action) {
  const actionType = action.type;
  const actionPayload = action.payload;

  switch (actionType) {
    case actionTypes.LOGIN.LOGGING_IN:
      return state;
    case actionTypes.LOGIN.FACEBOOK_LOGIN_SUCCEED:
      return state;
    default:
      return state;
  }
}

export { loginReducer as default };
