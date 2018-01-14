import auth from './auth';
import profile from './profile';
import login from './login';
import checkout from './checkout';
import billingSummary from './billingSummary';
import asyncStorage from './asyncStorage';
import { firebaseStateReducer } from 'react-redux-firebase';
import { combineReducers } from 'redux';


const rootReducer = combineReducers({
  firebase: firebaseStateReducer,
  auth,
  profile,
  login,
  checkout,
  billingSummary,
  asyncStorage,
});

export { rootReducer as default };
