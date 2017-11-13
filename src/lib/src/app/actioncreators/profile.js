import actionTypes from '../actiontypes/';
import { firebaseAuth, firebaseAuthProviders } from '../proxies/FirebaseProxy';
import { LoginManager, AccessToken } from 'react-native-fbsdk';


const profileActionCreator = {
  facebookLogin() {
    return async (dispatch/*, getState*/) => {
      dispatch({
        type: actionTypes.PROFILE.LOGIN_REQUEST,
      });

      try {
        const result = await LoginManager.logInWithReadPermissions(['public_profile', 'email',
          'user_friends']);

        if (result.isCancelled) {
          dispatch({
            type: actionTypes.PROFILE.LOGIN_CANCEL,
          });
        } else {
          this._facebookPostLogin(dispatch);
        }
      } catch (error) {
        dispatch({
          type: actionTypes.PROFILE.LOGIN_FAILURE,
          payload: {
            errorMsg: `Facebook login failed: ${error}.`,
          },
        });
      }
    };
  },

  logout() {
    return async (dispatch/*, getState*/) => {
      dispatch({
        type: actionTypes.PROFILE.LOGOUT_REQUEST,
      });

      try {
        await firebaseAuth.signOut();

        dispatch({
          type: actionTypes.PROFILE.LOGOUT_SUCCESS,
        });
      } catch (error) {
        const errorMsg = error.message || 'Something went wrong.';

        dispatch({
          type: actionTypes.PROFILE.LOGOUT_FAILURE,
          payload: { errorMsg },
        });
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
            providerData: userInfo.providerData,
          },
        },
      });

      dispatch({
        type: actionTypes.PROFILE.LOGIN_SUCCESS,
      });
    } catch (err) {
      dispatch({
        type: actionTypes.PROFILE.LOGIN_FAILURE,
        payload: {
          errorMsg: `Facebook login with Firebase failed: ${err.message}`,
        },
      });
    }
  },
};

export { profileActionCreator as default };
