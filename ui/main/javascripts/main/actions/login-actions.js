import {
  REQUEST_LOGIN, LOGIN_SUCCESS, LOGIN_ERROR,
  LOGOUT_SUCCESS, SET_SESSION_DATA
} from "../constants/actionTypes"

import { BASE_URL } from "../constants/config"
import { sessionUtils } from "../utils/SessionUtils"

export function doLogin(credentials) {
  let config = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials)
  }

  return dispatch => {
    dispatch(requestLogin(credentials))

    return fetch(`${BASE_URL}users/login`, config)
      .then(response =>
        response.json().then(user => ({ user, response }))
      ).then(({ user, response }) =>  {
        if (!response.ok || user.res) {
          if (!response.ok) {
            dispatch(loginError(user.message))
            return Promise.reject(user)

          } else if (user.res) dispatch(loginError(user.description))

        } else {
          sessionUtils.setData(JSON.stringify(user))
          dispatch(receiveLogin(user))
        }
      })
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
