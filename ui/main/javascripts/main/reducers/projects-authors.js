import { REQUEST_AUTHORS_PROJECTS, RECEIVE_AUTHORS_PROJECTS, AUTHORS_PROJECT_NORMALIZED } from "../constants/actionTypes"

const initialState = {
  currentProject: 0,
  data: [],
  visualData: [],
  isFetching: false,
  error: null,
  lastUpdated: Date.now()
}

export default function projectsAuthors(state = initialState, action) {
  switch (action.type) {
  case REQUEST_AUTHORS_PROJECTS:
    return Object.assign({}, state, {
      isFetching: true,
      didInvalidate: false,
      error: null,
    })

  case RECEIVE_AUTHORS_PROJECTS:
    return Object.assign({}, state, {
      isFetching: false,
      error: null,
      data: action.data,
      lastUpdated: action.receivedAt
    })

  case AUTHORS_PROJECT_NORMALIZED:
    return Object.assign({}, state, {
      visualData: action.data,
    })
  }

  return state
}
