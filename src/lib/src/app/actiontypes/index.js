import authActionTypes from '../actiontypes/auth';
import loginActionTypes from '../actiontypes/login';
import profileActionTypes from '../actiontypes/profile';
import myDealsActionTypes from '../actiontypes/myDeals';


const allActionTypesPerSection = {
  AUTH: authActionTypes,
  PROFILE: profileActionTypes,
  LOGIN: loginActionTypes,
  MY_DEALS: myDealsActionTypes,
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
