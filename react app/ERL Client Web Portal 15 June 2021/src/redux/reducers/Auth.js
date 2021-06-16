import {
  SEND_FORGET_PASSWORD_EMAIL,
  SET_TOKEN,
  UPDATE_AUTH_USER,
  UPDATE_LOAD_USER
} from '../../constants/ActionTypes';

const INIT_STATE = {
  authUser: null,
  userToken: null,
  loadUser: false,
  send_forget_password_email: false
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case UPDATE_AUTH_USER: {
      return {
        ...state,
        authUser: action.payload,
        loadUser: true
      };
    }
    case UPDATE_LOAD_USER: {
      return {
        ...state,
        loadUser: action.payload
      };
    }

    // case SAVE_PERMISSION: {
    //   return {
    //     ...state,
    //     userPermission: action.payload
    //   };
    // }
    case SET_TOKEN: {
      return {
        ...state,
        userToken: action.payload
      };
    }
    case SEND_FORGET_PASSWORD_EMAIL: {
      return {
        ...state,
        send_forget_password_email: action.payload
      };
    }
    default:
      return state;
  }
};
