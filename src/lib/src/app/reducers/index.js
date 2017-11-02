import auth from './auth';
import login from './login';
import myDeals from './myDeals';
import { firebaseStateReducer } from 'react-redux-firebase';
import { combineReducers } from 'redux';


const rootReducer = combineReducers({
  firebase: firebaseStateReducer,
  auth,
  login,
  myDeals,
});

export { rootReducer as default };
