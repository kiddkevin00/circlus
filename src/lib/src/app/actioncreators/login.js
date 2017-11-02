import MyDeals from '../components/MyDeals';
import actionTypes from '../actiontypes/';
import { firebaseAuth, firebaseAuthProviders } from '../proxies/FirebaseProxy';
import {
  AccessToken,
} from 'react-native-fbsdk';
import {
  Alert,
} from 'react-native';


const loginActionCreator = {
  facebookPostLogin(navigator) {
    return async (dispatch/*, getState*/) => {
      dispatch({
        type: actionTypes.LOGIN.LOGGING_IN,
      });

      try {
        const { accessToken } = await AccessToken.getCurrentAccessToken();
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

        navigator.replace({
          component: MyDeals,
        });

        dispatch({
          type: actionTypes.LOGIN.FACEBOOK_LOGIN_SUCCEED,
        });
      } catch (err) {
        Alert.alert('Error', `Facebook login with Firebase failed: ${err.message}`);
      }
    };
  },
};

export { loginActionCreator as default };
