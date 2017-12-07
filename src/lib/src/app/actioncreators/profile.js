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
          await this._facebookPostLogin(dispatch);
        }
      } catch (error) {
        const errorMsg = `Facebook login failed.\n${error.message}`;

        dispatch({
          type: actionTypes.PROFILE.LOGIN_FAILURE,
          payload: { errorMsg },
        });

        throw new Error(errorMsg);
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
        const errorMsg = error.message || 'Something went wrong while logging out.';

        dispatch({
          type: actionTypes.PROFILE.LOGOUT_FAILURE,
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
            providerData: userInfo.providerData,
          },
        },
      });

      dispatch({
        type: actionTypes.PROFILE.LOGIN_SUCCESS,
      });
    } catch (err) {
      const errorMsg = `Facebook login with Firebase failed.\n${err.message}`;

      dispatch({
        type: actionTypes.PROFILE.LOGIN_FAILURE,
        payload: { errorMsg },
      });

      throw new Error(errorMsg);
    }
  },
};

export { profileActionCreator as default };
