import Deals from '../components/Deals';
import actionTypes from '../actiontypes/';
import { firebaseAuth, firebaseAuthProviders } from '../proxies/FirebaseProxy';
//import {
//  AccessToken,
//} from 'react-native-fbsdk';


const loginActionCreator = {
  facebookPostLogin(navigator) {
    return async (dispatch/*, getState*/) => {
      dispatch({
        type: actionTypes.LOGIN.LOGGING_IN,
      });

      try {
        const { accessToken } = { accessToken: {} }//await AccessToken.getCurrentAccessToken();
        const credential = firebaseAuthProviders.FacebookAuthProvider.credential(accessToken);
        const userInfo = await firebaseAuth.signInWithCredential(credential);

        dispatch({
          type: actionTypes.AUTH.FACEBOOK_LOGIN_SUCCEED,
          payload: {
            userInfo: {
              uid: userInfo.uid,
              displayName: userInfo.displayName,
              email: userInfo.email,
              photoURL: userInfo.photoURL,
              isAnonymous: userInfo.isAnonymous,
            },
          },
        });

        dispatch({
          type: actionTypes.LOGIN.FACEBOOK_LOGIN_SUCCEED,
        });

        navigator.push({
          component: Deals,
        });
      } catch (err) {
        global.alert(`Facebook login with Firebase failed: ${err}`);
      }
    };
  },
};

export { loginActionCreator as default };
