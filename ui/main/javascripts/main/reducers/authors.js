import {  REQUEST_AUTHORS, RECEIVE_AUTHORS,
          REQUEST_AUTHOR, RECEIVE_AUTHOR,
          ADD_AUTHOR_SUCCESS, ADD_AUTHOR_ERROR,
          UPDATE_AUTHOR_SUCCESS, UPDATE_AUTHOR_ERROR,
          DELETE_AUTHOR_SUCCESS, DELETE_AUTHOR_ERROR
 } from "../constants/actionTypes"

const initialState = {
  entityString: "Autor",
  entityTableName: "authors",
  authors: [],
  isFetching: false,
  activeAuthor: {},
  error: null,
  success: null,
  lastUpdated: 1439478405547,
  table: {
    headers: ["Email", "Firma", "Investigador asociado"],
    fields: ["email", "signature", "researcherDesc"],
    editable: true
  }
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
      activeAuthor: {},
      lastUpdated: action.receivedAt
    })

  case REQUEST_AUTHOR:
    return Object.assign({}, state, {
      isFetching: true,
      error: null,
    })

  case RECEIVE_AUTHOR:
    var authors = state.authors.map(a => {
      if (a.id === action.author.id) return action.author
      else return a
    })

    var found = authors.find(a => {
      return a.id === action.author.id
    })

    if (!found) authors.push(action.author)

    return Object.assign({}, state, {
      authors,
      isFetching: false,
      activeAuthor: Object.assign({}, action.author, {})
    })

  case ADD_AUTHOR_SUCCESS:
    return Object.assign({}, state, {
      isFetching: false,
      error: null,
      success: "El autor ha sido creado correctamente."
    })

  case ADD_AUTHOR_ERROR:
    return Object.assign({}, state, {
      isFetching: false,
      error: action.message
    })

  case UPDATE_AUTHOR_SUCCESS:
    return Object.assign({}, state, {
      isFetching: false,
      error: null,
      success: "El autor ha sido actualizado correctamente."
    })

  case UPDATE_AUTHOR_ERROR:
    return Object.assign({}, state, {
      isFetching: false,
      error: JSON.stringify(action.message)
    })

  case DELETE_AUTHOR_SUCCESS:
    return Object.assign({}, state, {
      isFetching: false,
      error: null,
      success: "El autor ha sido eliminado correctamente."
    })

  case DELETE_AUTHOR_ERROR:
    return Object.assign({}, state, {
      isFetching: false,
      error: action.message
    })

  }

  return state
}
