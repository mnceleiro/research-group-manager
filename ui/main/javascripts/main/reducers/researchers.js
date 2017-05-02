import { REQUEST_RESEARCHERS, FETCH_RESEARCHERS, RECEIVE_RESEARCHERS,
  REQUEST_RESEARCHER, RECEIVE_RESEARCHER, EDIT_RESEARCHER,
  REQUEST_ADD_RESEARCHER, ADD_RESEARCHER_SUCCESS, ADD_RESEARCHER_ERROR,
  REQUEST_UPDATE_RESEARCHER, UPDATE_RESEARCHER_SUCCESS, UPDATE_RESEARCHER_ERROR,
  REQUEST_DELETE_RESEARCHER, DELETE_RESEARCHER_SUCCESS, DELETE_RESEARCHER_ERROR} from "../constants/actionTypes"

const initialState = {
  researchers: [],
  activeResearcher: 0,
  deletedResearcher: null,
  isFetching: false,
  error: null,
  success: null,
  lastUpdated: 1439478405547
}


export default function researchers(state = initialState, action) {
  switch (action.type) {
  case EDIT_RESEARCHER:
    return Object.assign({}, state, {

    })

  case FETCH_RESEARCHERS:
    return [
      {

      }
    ]

  case REQUEST_RESEARCHERS:
    return Object.assign({}, state, {
      isFetching: true,
      didInvalidate: false,
      error: null,
    })

  case REQUEST_RESEARCHER:
    return Object.assign({}, state, {
      isFetching: true,
      error: null,
    })

  case RECEIVE_RESEARCHERS:
    return Object.assign({}, state, {
      isFetching: false,
      activeResearcher: 0,
      deletedResearcher: null,
      error: null,
      success: null,
      researchers: action.researchers,
      lastUpdated: action.receivedAt
    })

  case RECEIVE_RESEARCHER:
    // Si el investigador ya existe actualizo sus datos con los del servidor
    var newResearchers = state.researchers.map(r => {
      if (r.id === action.researcher.id) return action.researcher
      else return r
    })

    // Variable que indica si el investigador ya existe en nuestro estado
    var foundRes = newResearchers.find(r => {
      return r.id === action.researcher.id
    })

    // Si no lo tenemos lo añadimos
    if (!foundRes) newResearchers.push(action.researcher)

    return Object.assign({}, state, {
      researchers: newResearchers,
      activeResearcher: action.researcher.id
    })


    /* Insertar investigador */
  case REQUEST_ADD_RESEARCHER:
    return Object.assign({}, state, {
      isFetching: true,
      error: null,
    })

  case ADD_RESEARCHER_SUCCESS:
    return Object.assign({}, state, {
      isFetching: false,
      error: null,
      success: "El investigador ha sido creado correctamente."
    })

  case ADD_RESEARCHER_ERROR:
    return Object.assign({}, state, {
      isFetching: false,
      error: action.message
    })

    /* Actualizar investigador */
  case REQUEST_UPDATE_RESEARCHER:
    return Object.assign({}, state, {
      isFetching: true,
      error: null,
    })

  case UPDATE_RESEARCHER_SUCCESS:
    return Object.assign({}, state, {
      isFetching: false,
      success: "El investigador ha sido actualizado correctamente.",
      error: null
    })

  case UPDATE_RESEARCHER_ERROR:
    return Object.assign({}, state, {
      isFetching: false,
      error: action.message
    })

    /* ELiminar investigador */
  case REQUEST_DELETE_RESEARCHER:
    return Object.assign({}, state, {
      isFetching: true,
      error: null,
    })

  case DELETE_RESEARCHER_SUCCESS:
    return Object.assign({}, state, {
      isFetching: false,
      error: null,
      success: "El investigador ha sido eliminado correctamente.",
      deletedResearcher: action.researcher
    })

  case DELETE_RESEARCHER_ERROR:
    return Object.assign({}, state, {
      isFetching: false,
      error: action.message
    })
  }

  return state
}
