import actionTypes from '../actiontypes/';


const initialUserInfoState = {
  uid: undefined,
  displayName: undefined,
  email: undefined,
  photoURL: undefined,
  isAnonymous: undefined,
  phoneNumber: undefined,
  emailVerified: undefined,
  providerData: undefined,
};
const initialState = {
  isLoggedIn: false,
  userInfo: initialUserInfoState,
};

function authReducer(state = initialState, action) {
  const actionType = action.type;
  const actionPayload = action.payload;

  switch (actionType) {
    case actionTypes.AUTH.FACEBOOK_LOGIN_SUCCEED:
      return {
        ...state,
        isLoggedIn: true,
        userInfo: { ...state.userInfo, ...actionPayload.userInfo },
      };
    default:
      return state;
  }
}

export { authReducer as default };
