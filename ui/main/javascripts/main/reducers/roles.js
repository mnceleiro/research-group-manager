import { REQUEST_ROLES, RECEIVE_ROLES } from "../constants/actionTypes"

const initialState = {
  roles: [],
  isFetching: false,
  error: null,
  lastUpdated: Date.now()
}

export default function roles(state = initialState, action) {
  switch (action.type) {
  case REQUEST_ROLES:
    return Object.assign({}, state, {
      isFetching: true,
      didInvalidate: false,
      error: null,
    })

  case RECEIVE_ROLES:
    return Object.assign({}, state, {
      isFetching: false,
      error: null,
      roles: action.roles,
      lastUpdated: action.receivedAt
    })
  }

  return state
}
