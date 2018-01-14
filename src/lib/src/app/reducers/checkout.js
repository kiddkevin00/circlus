import actionTypes from '../actiontypes/';


const defaultErrorMsg = 'Something went wrong in Checkout page.';
const initialState = {
  isLoading: false,
  error: {
    isVisiable: false,
    message: defaultErrorMsg,
  },
};

function checkoutReducer(state = initialState, action) {
  const actionType = action.type;
  const actionPayload = action.payload;

  switch (actionType) {
    case actionTypes.CHECKOUT.CHECKOUT_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case actionTypes.CHECKOUT.CHECKOUT_SUCCESS:
      return {
        ...state,
        isLoading: false,
      };
    case actionTypes.CHECKOUT.CHECKOUT_FAILURE:
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

export { checkoutReducer as default };
