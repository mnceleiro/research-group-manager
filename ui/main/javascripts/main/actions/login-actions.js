import {
  REQUEST_LOGIN, LOGIN_SUCCESS, LOGIN_ERROR,
  REQUEST_LOGOUT, LOGOUT_SUCCESS, SET_SESSION_DATA
} from "../constants/actionTypes"

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
        if (!response.ok || user.error) {
          // If there was a problem, we want to
          // dispatch the error condition
          if (!response.ok) {
            dispatch(loginError(user.message))
            return Promise.reject(user)

          } else if (user.error) dispatch(loginError(user.error))


        } else {
          // If login was successful, set the token in local storage
          localStorage.setItem("current_user", JSON.stringify(user))

          // Dispatch the success action
          dispatch(receiveLogin(user))
        }
      })/*.catch(err => console.log("Error: ", err))*/
      // .catch (err => { debugger; dispatch(loginError(err.Message)) })
  }
}

export function logoutUser() {
  return dispatch => {
    dispatch(requestLogout())
    localStorage.removeItem("id_token")
    dispatch(receiveLogout())
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

function requestLogout() {
  return {
    type: REQUEST_LOGOUT,
    isFetching: true,
    isAuthenticated: true
  }
}

function receiveLogout() {
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
