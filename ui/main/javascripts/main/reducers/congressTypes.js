import { REQUEST_CONGRESS_TYPES, RECEIVE_CONGRESS_TYPES } from "../constants/actionTypes"

const initialState = {
  congressTypes: [],
  isFetching: false,
  error: null,
  lastUpdated: Date.now()
}

export default function congressTypes(state = initialState, action) {
  switch (action.type) {
  case REQUEST_CONGRESS_TYPES:
    return Object.assign({}, state, {
      isFetching: true,
      didInvalidate: false,
      error: null,
    })

  case RECEIVE_CONGRESS_TYPES:
    return Object.assign({}, state, {
      isFetching: false,
      error: null,
      congressTypes: action.congressTypes,
      lastUpdated: action.receivedAt
    })
  }

  return state
}
