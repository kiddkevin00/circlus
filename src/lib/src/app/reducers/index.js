import auth from './auth';
import login from './login';
import { firebaseStateReducer } from 'react-redux-firebase';
import { combineReducers } from 'redux';


const rootReducer = combineReducers({
  firebase: firebaseStateReducer,
  auth,
  login,
});

export { rootReducer as default };
