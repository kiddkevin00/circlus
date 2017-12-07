import actionTypes from '../actiontypes/';
import { firebaseAuth, firebaseAuthProviders } from '../proxies/FirebaseProxy';
import { AccessToken, LoginManager } from 'react-native-fbsdk';


const loginActionCreator = {
  facebookLogin() {
    return async (dispatch/*, getState*/) => {
      dispatch({
        type: actionTypes.LOGIN.LOGIN_REQUEST,
      });

      try {
        const result = await LoginManager.logInWithReadPermissions(['public_profile', 'email',
          'user_friends']);

        if (result.isCancelled) {
          dispatch({
            type: actionTypes.LOGIN.LOGIN_CANCEL,
          });
        } else {
          await this._facebookPostLogin(dispatch);
        }
      } catch (error) {
        const errorMsg = `Facebook login failed.\n${error.message}`;

        dispatch({
          type: actionTypes.LOGIN.LOGIN_FAILURE,
          payload: { errorMsg },
        });

        throw new Error(errorMsg);
      }
    };
  },

  _facebookPostLogin: async (dispatch) => {
    try {
      const { accessToken } = await AccessToken.getCurrentAccessToken();
      const credential = firebaseAuthProviders.FacebookAuthProvider.credential(accessToken);
      const userInfo = await firebaseAuth.signInWithCredential(credential);

      dispatch({
        type: actionTypes.AUTH.FACEBOOK_LOGIN_SUCCESS,
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
        type: actionTypes.LOGIN.LOGIN_SUCCESS,
      });
    } catch (err) {
      const errorMsg = `Facebook login with Firebase failed.\n${err.message}`;

      dispatch({
        type: actionTypes.LOGIN.LOGIN_FAILURE,
        payload: { errorMsg },
      });

      throw new Error(errorMsg);
    }
  },
};

export { loginActionCreator as default };
