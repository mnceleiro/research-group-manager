import { REQUEST_CONGRESSES, RECEIVE_CONGRESSES, REQUEST_CONGRESS, RECEIVE_CONGRESS,
  ADD_CONGRESS_SUCCESS, ADD_CONGRESS_ERROR, UPDATE_CONGRESS_SUCCESS, UPDATE_CONGRESS_ERROR,
  DELETE_CONGRESS_SUCCESS, DELETE_CONGRESS_ERROR
 } from "../constants/actionTypes"

const initialState = {
  congresses: [],
  activeCongress: {},
  deletedCongress: null,
  isFetching: false,
  error: null,
  success: null,
  lastUpdated: 1439478405547,
  table: {
    headers: ["Congreso", "Título", "Lugar", "País", "Inicio", "Fin"],
    fields: ["title", "name", "place", "country", "start", "end"],
    editable: true
  }
}

export default function congresses(state = initialState, action) {
  switch (action.type) {
  case REQUEST_CONGRESSES:
    return Object.assign({}, state, {
      isFetching: true,
      didInvalidate: false,
      error: null,
    })

  case RECEIVE_CONGRESSES:
    return Object.assign({}, state, {
      isFetching: false,
      activeCongress: {},
      deletedCongress: null,
      error: null,
      success: null,
      congresses: action.congresses,
      lastUpdated: action.receivedAt
    })

  case REQUEST_CONGRESS:
    return Object.assign({}, state, {
      isFetching: true,
      error: null,
    })

  case RECEIVE_CONGRESS:
    var congresses = state.congresses.map(p => {
      if (p.id === action.congress.id) return action.congress
      else return p
    })

    var found = congresses.find(p => {
      return p.id === action.congress.id
    })

    if (!found) congresses.push(action.congress)

    return Object.assign({}, state, {
      congresses: congresses,
      isFetching: false,
      activeCongress: Object.assign({}, action.congress, {})
    })

  case ADD_CONGRESS_SUCCESS:
    return Object.assign({}, state, {
      isFetching: false,
      error: null,
      success: "El congreso ha sido creado correctamente."
    })

  case ADD_CONGRESS_ERROR:
    return Object.assign({}, state, {
      isFetching: false,
      error: action.message
    })

  case UPDATE_CONGRESS_SUCCESS:
    return Object.assign({}, state, {
      isFetching: false,
      error: null,
      success: "El congreso ha sido actualizado correctamente."
    })

  case UPDATE_CONGRESS_ERROR:
    return Object.assign({}, state, {
      isFetching: false,
      error: JSON.stringify(action.message)
    })

  case DELETE_CONGRESS_SUCCESS:
    return Object.assign({}, state, {
      isFetching: false,
      error: null,
      success: "El congreso ha sido eliminado correctamente."
    })

  case DELETE_CONGRESS_ERROR:
    return Object.assign({}, state, {
      isFetching: false,
      error: action.message
    })
  }

  return state
}
