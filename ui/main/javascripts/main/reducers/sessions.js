import {
  REQUEST_LOGIN, LOGIN_SUCCESS, LOGIN_ERROR,
  LOGOUT_SUCCESS, SET_SESSION_DATA
} from "../constants/actionTypes"

import { sessionUtils } from "../utils/SessionUtils"

const initialState = {
  isFetching: false,
  isAuthenticated: sessionUtils.isAuthenticated(),
  user: {},
  error: ""
}

export default function authentication(state = initialState, action) {
  switch(action.type) {
  case REQUEST_LOGIN:
    return Object.assign({}, state, {
      isFetching: action.isFetching,
      isAuthenticated: action.isAuthenticated,
      user: action.credentials
    })

  case LOGIN_SUCCESS:
    return Object.assign({}, state, {
      isFetching: action.isFetching,
      isAuthenticated: action.isAuthenticated,
      user: sessionUtils.getUser(),
      error: ""
    })

  case LOGIN_ERROR:
    return Object.assign({}, state, {
      isFetching: action.isFetching,
      isAuthenticated: action.isAuthenticated,
      error: action.message
    })

  case LOGOUT_SUCCESS:
    sessionUtils.logout()
    return Object.assign({}, state, {
      isFetching: false,
      isAuthenticated: sessionUtils.isAuthenticated()
    })

  case SET_SESSION_DATA:
    if (!state.isAuthenticated) return state
    else return Object.assign({}, state, {
      user: sessionUtils.getUser()
    })
  }

  return state
}
