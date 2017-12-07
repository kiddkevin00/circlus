import authActionTypes from '../actiontypes/auth';
import loginActionTypes from '../actiontypes/login';
import profileActionTypes from '../actiontypes/profile';
import myDealsActionTypes from '../actiontypes/myDeals';
import checkoutActionTypes from '../actiontypes/checkout';
import billingSummaryActionTypes from '../actiontypes/billingSummary';
import shareActionTypes from '../actiontypes/share';


const allActionTypesPerSection = {
  AUTH: authActionTypes,
  PROFILE: profileActionTypes,
  LOGIN: loginActionTypes,
  MY_DEALS: myDealsActionTypes,
  CHECKOUT: checkoutActionTypes,
  BILLING_SUMMARY: billingSummaryActionTypes,
  SHARE: shareActionTypes,
};

namespaceActionTypesPerSection(allActionTypesPerSection);

function namespaceActionTypesPerSection(actionTypesPerSection) {
  for (const section in actionTypesPerSection) {
    if (actionTypesPerSection.hasOwnProperty(section)) {
      const actionTypes = actionTypesPerSection[section];

      for (const type in actionTypes) {
        if (actionTypes.hasOwnProperty(type)) {
          actionTypes[`_${type}`] = `${actionTypes[type]}`;
          actionTypes[type] = `${section}.${actionTypes[type]}`;
        }
      }
    }
  }
}

export { allActionTypesPerSection as default };
