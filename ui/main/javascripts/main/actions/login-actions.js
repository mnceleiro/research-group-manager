import {
  REQUEST_LOGIN, LOGIN_SUCCESS, LOGIN_ERROR,
  LOGOUT_SUCCESS, SET_SESSION_DATA
} from "../constants/actionTypes"

import { sessionUtils } from "../utils/SessionUtils"

export function doLogin(credentials) {
  let config = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials)
  }

  return dispatch => {
    dispatch(requestLogin(credentials))

    return fetch("users/login", config)
      .then(response =>
        response.json().then(user => ({ user, response }))
      ).then(({ user, response }) =>  {
        if (!response.ok || user.res) {
          // If there was a problem, we want to
          // dispatch the error condition
          if (!response.ok) {
            dispatch(loginError(user.message))
            return Promise.reject(user)

          } else if (user.res) dispatch(loginError(user.description))

        } else {
          // If login was successful, set the token in local storage
          sessionUtils.setData(JSON.stringify(user))
          //localStorage.setItem("current_user", JSON.stringify(user))

          // Dispatch the success action
          dispatch(receiveLogin(user))
        }
      })/*.catch(err => console.log("Error: ", err))*/
      // .catch (err => { debugger; dispatch(loginError(err.Message)) })
  }
}

export function logoutUser() {
  return dispatch => {
    dispatch(doLogout())
  }
}

function requestLogin(credentials) {
  return {
    type: REQUEST_LOGIN,
    isFetching: true,
    isAuthenticated: false,
    credentials
  }
}

function receiveLogin(user) {
  return {
    type: LOGIN_SUCCESS,
    isFetching: false,
    isAuthenticated: true,
    id_token: user.id_token
  }
}

function loginError(message) {
  return {
    type: LOGIN_ERROR,
    isFetching: false,
    isAuthenticated: false,
    message
  }
}

function doLogout() {
  return {
    type: LOGOUT_SUCCESS,
    isFetching: false,
    isAuthenticated: false
  }
}

export function setSessionData() {
  return {
    type: SET_SESSION_DATA
  }
}
