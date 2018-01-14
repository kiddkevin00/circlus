import authActionTypes from '../actiontypes/auth';
import loginActionTypes from '../actiontypes/login';
import profileActionTypes from '../actiontypes/profile';
import checkoutActionTypes from '../actiontypes/checkout';
import billingSummaryActionTypes from '../actiontypes/billingSummary';
import landingActionTypes from '../actiontypes/landing';
import shareActionTypes from '../actiontypes/share';
import asyncStorageActionTypes from '../actiontypes/asyncStorage';


const allActionTypesPerSection = {
  AUTH: authActionTypes,
  PROFILE: profileActionTypes,
  LOGIN: loginActionTypes,
  CHECKOUT: checkoutActionTypes,
  BILLING_SUMMARY: billingSummaryActionTypes,
  LANDING: landingActionTypes,
  SHARE: shareActionTypes,
  ASYNC_STORAGE: asyncStorageActionTypes,
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
