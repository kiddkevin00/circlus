import actionTypes from '../actiontypes/';


const defaultErrorMsg = 'Something went wrong in Login page';
const initialState = {
  isLoading: false,
  error: {
    isVisiable: false,
    message: defaultErrorMsg,
  },
};

function loginReducer(state = initialState, action) {
  const actionType = action.type;
  const actionPayload = action.payload;

  switch (actionType) {
    case actionTypes.LOGIN.LOGIN_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case actionTypes.LOGIN.LOGIN_SUCCESS:
    case actionTypes.LOGIN.LOGIN_CANCEL:
      return initialState;
    case actionTypes.PROFILE.LOGIN_FAILURE:
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

export { loginReducer as default };
