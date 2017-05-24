import { REQUEST_AUTHORS, RECEIVE_AUTHORS,
  // ADD_AUTHOR_SUCCESS, ADD_AUTHOR_ERROR
 } from "../constants/actionTypes"

const initialState = {
  authors: [],
  isFetching: false,
  error: null,
  success: null,
  lastUpdated: 1439478405547,
}

export default function projects(state = initialState, action) {
  switch (action.type) {
  case REQUEST_AUTHORS:
    return Object.assign({}, state, {
      isFetching: true,
      didInvalidate: false,
      error: null,
    })

  case RECEIVE_AUTHORS:
    return Object.assign({}, state, {
      isFetching: false,
      error: null,
      success: null,
      authors: action.authors,
      lastUpdated: action.receivedAt
    })

  // case ADD_AUTHOR_SUCCESS:
  //   return Object.assign({}, state, {
  //     isFetching: false,
  //     error: null,
  //     success: "El autor ha sido creado correctamente."
  //   })
  //
  // case ADD_AUTHOR_ERROR:
  //   return Object.assign({}, state, {
  //     isFetching: false,
  //     error: action.message
  //   })
  }
  return state
}
