import qs from 'querystring';
import React from 'react';
import { NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import { fetchError, fetchStart, fetchSuccess } from '../../../redux/actions';
import { setAuthUser, setToken, updateLoadUser } from '../../../redux/actions/Auth';
import axios, { urls } from './config';
const JWTAuth = {
  onRegister: ({ name, email, password }) => {
    return dispatch => {
      dispatch(fetchStart());
      axios
        .post('auth/register', {
          email: email,
          password: password,
          name: name
        })
        .then(({ data }) => {
          if (data.result) {
            axios.interceptors.request.use(config => {
              config.headers.authorization = `bearer ${data.token.access_token}`;
              return config;
            });
            // axios.defaults.headers.common['Authorization'] = 'Bearer ' + data.token.access_token;
            dispatch(fetchSuccess());
            dispatch(JWTAuth.getAuthUser(true));
          } else {
            dispatch(fetchError(data.error));
          }
        })
        .catch(function(error) {
          dispatch(fetchError(error.message));
        });
    };
  },

  onLogin: ({ userName, password }) => {
    return dispatch => {
      const body = {
        userName: userName,
        password: password
      };
      try {
        dispatch(fetchStart());
        axios
          .post('/api/identity/token', body)
          .then(({ data }) => {
            if (data) {
              axios.defaults.headers.common['Authorization'] = 'Bearer ' + data.data.jwToken;
              console.log(data.data.jwToken);
              dispatch(fetchSuccess());
              dispatch(setToken(data.data.jwToken));
              dispatch(JWTAuth.getAuthUser(true));
            } else {
              dispatch(fetchError(data.error));
            }
          })
          .catch(({ response }) => {
            // alerts('error', `${response.data.Message}`);

            dispatch(fetchError('User and Password not match. Please try agian'));
            // dispatch(updateLoadUser(true));
          });
      } catch (error) {
        dispatch(fetchError(error.message));
      }
    };
  },

  // getAuthUser: (loaded = false, access_token) => {
  //   return dispatch => {
  //     if (!access_token) {
  //       const ctoken = localStorage.getItem('ctoken');
  //       axios.defaults.headers.common['Authorization'] = 'Bearer ' + ctoken;
  //       // if (token) {
  //       //   var getToken = decodeme(token);
  //       //   dispatch(saveUserPermission(getToken.permission));
  //       //   dispatch(setAuthUser(getToken));
  //       // }
  //     }
  //     dispatch(fetchStart());
  //     dispatch(updateLoadUser(loaded));

  //     const ctoken = localStorage.getItem('ctoken');
  //     if (ctoken) {
  //       axios
  //         .get(`${urls.account.users.get_me}`)
  //         .then(({ data }) => {
  //           if (data.succeeded) {
  //             dispatch(fetchSuccess());
  //             dispatch(setAuthUser(data.data));
  //           } else {
  //             dispatch(setAuthUser(null));
  //             dispatch(updateLoadUser(true));
  //           }
  //         })
  //         .catch(({ response }) => {
  //           if (response === undefined || response || response.status === 401) {
  //             localStorage.removeItem('ctoken');
  //             delete axios.defaults.headers.common['Authorization'];
  //             dispatch(setAuthUser(null));
  //             dispatch(updateLoadUser(true));
  //           }
  //         });
  //     } else {
  //       dispatch(setAuthUser(null));
  //       dispatch(updateLoadUser(true));
  //     }
  //   };
  // },
  getAuthUser: (loaded = false) => {
    return dispatch => {
      dispatch(fetchStart());
      dispatch(updateLoadUser(loaded));

      axios
        .get(`${urls.account.users.get_me}`)
        .then(({ data }) => {
          if (data.succeeded) {
            dispatch(fetchSuccess());
            dispatch(setAuthUser(data.data));
          } else {
            // dispatch(setAuthUser(null));
            dispatch(updateLoadUser(true));
          }
        })
        .catch(({ response }) => {
          console.log(response);
          if (response === undefined || response || response.status === 401) {
            delete axios.defaults.headers.common['Authorization'];
            //  dispatch(setAuthUser(null));
            dispatch(updateLoadUser(true));
          }
        });
    };
  },

  onLogout: logOut => {
    return dispatch => {
      dispatch(fetchStart());
      if (!logOut) {
        dispatch(fetchSuccess());
        localStorage.removeItem('ctoken');
        delete axios.defaults.headers.common['Authorization'];
        dispatch(setAuthUser(null));
      } else {
        dispatch(fetchError('Error'));
      }
    };
  },

  onForgotPassword: email => {
    return dispatch => {
      dispatch(fetchStart());
      if (email) {
        axios
          .post(`${urls.account.users.forgot_password}?${qs.stringify(email)}`)
          .then(res => {
            if (res.status === 200) {
              NotificationManager.success('Email sent successfully');
              dispatch(fetchSuccess());
            }
          })
          .catch(function(error) {
            dispatch(updateLoadUser(true));
          });
      } else {
        dispatch(updateLoadUser(true));
      }
    };
  },
  onResetPassword: resetPass => {
    return dispatch => {
      dispatch(fetchStart());
      if (resetPass) {
        axios
          .post(`${urls.account.users.reset_password}?${qs.stringify(resetPass.resetPass)}`)
          .then(({ data }) => {
            dispatch(fetchSuccess());
            NotificationManager.success(data.message);
          })
          .catch(({ response }) => {
            dispatch(updateLoadUser(true));
            NotificationManager.warning(response.data.Message);
          });
      } else {
        dispatch(updateLoadUser(true));
      }
    };
  },

  getSocialMediaIcons: () => {
    return <React.Fragment></React.Fragment>;
  }
};

export default JWTAuth;
