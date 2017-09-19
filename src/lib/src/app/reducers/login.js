import actionTypes from '../actiontypes/';


const initialState = {

};

function loginReducer(state = initialState, action) {
  const actionType = action.type;
  const actionPayload = action.payload;

  switch (actionType) {

    default:
      return state;
  }
}

export { loginReducer as default };
