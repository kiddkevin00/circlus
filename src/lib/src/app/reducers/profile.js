import actionTypes from '../actiontypes/';


const defaultErrorMsg = 'Something went wrong in Profile page.';
const initialState = {
  isLoading: false,
  error: {
    isVisiable: false,
    message: defaultErrorMsg,
  },
};

function profileReducer(state = initialState, action) {
  const actionType = action.type;
  const actionPayload = action.payload;

  switch (actionType) {
    case actionTypes.PROFILE.LOGIN_REQUEST:
    case actionTypes.PROFILE.LOGOUT_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case actionTypes.PROFILE.LOGIN_SUCCESS:
    case actionTypes.PROFILE.LOGIN_CANCEL:
    case actionTypes.PROFILE.LOGOUT_SUCCESS:
      return initialState;
    case actionTypes.PROFILE.LOGIN_FAILURE:
    case actionTypes.PROFILE.LOGOUT_FAILURE:
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

export { profileReducer as default };
