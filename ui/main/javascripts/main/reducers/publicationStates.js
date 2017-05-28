import { REQUEST_PUBLICATION_STATES, RECEIVE_PUBLICATION_STATES } from "../constants/actionTypes"

const initialState = {
  publicationStates: [],
  isFetching: false,
  error: null,
  lastUpdated: Date.now()
}

export default function publicationStates(state = initialState, action) {
  switch (action.type) {
  case REQUEST_PUBLICATION_STATES:
    return Object.assign({}, state, {
      isFetching: true,
      didInvalidate: false,
      error: null,
    })

  case RECEIVE_PUBLICATION_STATES:
    return Object.assign({}, state, {
      isFetching: false,
      error: null,
      publicationStates: action.publicationStates,
      lastUpdated: action.receivedAt
    })
  }

  return state
}
