import {
  SAVE_PERMISSION,
  SEND_FORGET_PASSWORD_EMAIL,
  UPDATE_AUTH_USER,
  UPDATE_LOAD_USER
} from '../../constants/ActionTypes';

export const setAuthUser = user => {
  return dispatch => {
    dispatch({
      type: UPDATE_AUTH_USER,
      payload: user
    });
  };
};

// export const setToken = ctoken => {
//   return dispatch => {
//     dispatch({
//       type: SET_TOKEN,
//       payload: ctoken
//     });
//   };
// };

export const updateLoadUser = loading => {
  return dispatch => {
    dispatch({
      type: UPDATE_LOAD_USER,
      payload: loading
    });
  };
};

export const setForgetPassMailSent = status => {
  return dispatch => {
    dispatch({
      type: SEND_FORGET_PASSWORD_EMAIL,
      payload: status
    });
  };
};

export const saveUserPermission = permission => {
  return dispatch => {
    dispatch({
      type: SAVE_PERMISSION,
      payload: permission
    });
  };
};
