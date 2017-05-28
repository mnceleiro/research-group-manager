import { REQUEST_BOOKS, RECEIVE_BOOKS, REQUEST_BOOK, RECEIVE_BOOK,
  ADD_BOOK_SUCCESS, ADD_BOOK_ERROR, UPDATE_BOOK_SUCCESS, UPDATE_BOOK_ERROR,
  DELETE_BOOK_SUCCESS, DELETE_BOOK_ERROR
 } from "../constants/actionTypes"

const initialState = {
  objects: [],
  active: {},
  deleted: null,
  isFetching: false,
  error: null,
  success: null,
  lastUpdated: 1439478405547,
  table: {
    headers: ["Código", "Título", "Libro", "Volumen", "Editorial", "Lugar"],
    fields: ["code", "title", "book", "volume", "editorial", "place"],
    editable: true
  }
}

export default function objects(state = initialState, action) {
  switch (action.type) {
  case REQUEST_BOOKS:
    return Object.assign({}, state, {
      isFetching: true,
      didInvalidate: false,
      error: null,
    })

  case RECEIVE_BOOKS:
    return Object.assign({}, state, {
      isFetching: false,
      active: {},
      deleted: null,
      error: null,
      success: null,
      objects: action.objects,
      lastUpdated: action.receivedAt
    })

  case REQUEST_BOOK:
    return Object.assign({}, state, {
      isFetching: true,
      error: null,
    })

  case RECEIVE_BOOK:
    var objects = state.objects.map(p => {
      if (p.id === action.object.id) return action.object
      else return p
    })

    var found = objects.find(p => {
      return p.id === action.object.id
    })

    if (!found) objects.push(action.object)

    return Object.assign({}, state, {
      objects: objects,
      isFetching: false,
      active: Object.assign({}, action.object, {})
    })

  case ADD_BOOK_SUCCESS:
    return Object.assign({}, state, {
      isFetching: false,
      error: null,
      success: "El libro ha sido creado correctamente."
    })

  case ADD_BOOK_ERROR:
    return Object.assign({}, state, {
      isFetching: false,
      error: action.message
    })

  case UPDATE_BOOK_SUCCESS:
    return Object.assign({}, state, {
      isFetching: false,
      error: null,
      success: "El libro ha sido actualizado correctamente."
    })

  case UPDATE_BOOK_ERROR:
    return Object.assign({}, state, {
      isFetching: false,
      error: JSON.stringify(action.message)
    })

  case DELETE_BOOK_SUCCESS:
    return Object.assign({}, state, {
      isFetching: false,
      error: null,
      success: "El libro ha sido eliminado correctamente."
    })

  case DELETE_BOOK_ERROR:
    return Object.assign({}, state, {
      isFetching: false,
      error: action.message
    })

  }

  return state
}
