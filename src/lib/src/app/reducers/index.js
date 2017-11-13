import auth from './auth';
import profile from './profile';
import login from './login';
import myDeals from './myDeals';
import { firebaseStateReducer } from 'react-redux-firebase';
import { combineReducers } from 'redux';


const rootReducer = combineReducers({
  firebase: firebaseStateReducer,
  auth,
  profile,
  login,
  myDeals,
});

export { rootReducer as default };
