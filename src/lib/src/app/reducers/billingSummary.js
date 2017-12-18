import actionTypes from '../actiontypes/';


const initialState = {
  discount: 0,
  tipPercentage: undefined,
  billAmountString: '',
  totalAmount: 0,
  startValidatingForm: false,
  dealId: undefined,
  dealName: undefined,
  influencerStripeUserId: undefined,
  merchantStripeUserId: undefined,
};

function billingSummaryReducer(state = initialState, action) {
  const actionType = action.type;
  const actionPayload = action.payload;

  switch (actionType) {
    case actionTypes.BILLING_SUMMARY.INIT:
      return {
        ...initialState,
        discount: actionPayload.discount,
        dealId: actionPayload.dealId,
        dealName: actionPayload.dealName,
        influencerStripeUserId: actionPayload.influencerStripeUserId,
        merchantStripeUserId: actionPayload.merchantStripeUserId,
      };
    case actionTypes.BILLING_SUMMARY.SET_BILL_AMOUNT:
      return {
        ...state,
        billAmountString: actionPayload.billAmountString,
        totalAmount: Number((Number(actionPayload.billAmountString) * (1 - state.discount / 100)
          * (1 + (state.tipPercentage || 0))).toFixed(2)),
        startValidatingForm: true,
      };
    case actionTypes.BILLING_SUMMARY.SET_TIP_PERCENTAGE:
      return {
        ...state,
        tipPercentage: actionPayload.tipPercentage,
        totalAmount: Number((Number(state.billAmountString) * (1 - state.discount / 100)
          * (1 + (actionPayload.tipPercentage || 0))).toFixed(2)),
        startValidatingForm: true,
      };
    default:
      return state;
  }
}

export { billingSummaryReducer as default };
