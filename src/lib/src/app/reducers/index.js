import auth from './auth';
import profile from './profile';
import login from './login';
import myDeals from './myDeals';
import checkout from './checkout';
import billingSummary from './billingSummary';
import { firebaseStateReducer } from 'react-redux-firebase';
import { combineReducers } from 'redux';


const rootReducer = combineReducers({
  firebase: firebaseStateReducer,
  auth,
  profile,
  login,
  myDeals,
  checkout,
  billingSummary,
});

export { rootReducer as default };
