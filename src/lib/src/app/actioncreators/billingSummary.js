import actionTypes from '../actiontypes/';


const billingSummaryActionCreator = {
  init(discount, dealId, influencerStripeUserId, merchantStripeUserId) {
    return {
      type: actionTypes.BILLING_SUMMARY.INIT,
      payload: { discount, dealId, influencerStripeUserId, merchantStripeUserId },
    };
  },

  setBillAmountString(billAmountString) {
    return {
      type: actionTypes.BILLING_SUMMARY.SET_BILL_AMOUNT,
      payload: { billAmountString },
    };
  },

  setTipPercentage(tipPercentage) {
    return {
      type: actionTypes.BILLING_SUMMARY.SET_TIP_PERCENTAGE,
      payload: { tipPercentage },
    };
  },
};

export { billingSummaryActionCreator as default };
