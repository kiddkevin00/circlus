import * as firebaseProxy from 'firebase';


const config = {
  apiKey: 'AIzaSyDCi8u5pILtpGdR8KBjzFKWDrD7zA1zuyo',
  authDomain: 'circlus-76a2a.firebaseapp.com',
  databaseURL: 'https://circlus-76a2a.firebaseio.com',
  projectId: 'circlus-76a2a',
  storageBucket: 'circlus-76a2a.appspot.com',
  messagingSenderId: '975180261499',
};

firebaseProxy.initializeApp(config);

export const firebaseDb = firebaseProxy.database();
export const firebaseAuth = firebaseProxy.auth();
export const firebaseAuthProviders = firebaseProxy.auth;
export default firebaseProxy;
