import * as types from "../constants/actionTypes"
import { sessionUtils } from "../utils/SessionUtils"
import { BASE_URL } from "../constants/config"

import { logoutUser } from "./login-actions"

export function fetchBooks() {
  return function (dispatch) {
    dispatch(requestBooks())

    var request = new Request(BASE_URL + "books/all", {
      headers: new Headers({
        Authorization: sessionUtils.getAuthString()
      })
    })
    return fetch(request)
      .then(resp => {
        if (resp.status === 401) dispatch(logoutUser())
        else return resp.json()
      })
      .then(json => {
        dispatch(receiveBooks(json))
      })
  }
}

export function fetchBookById(id) {
  return function (dispatch) {
    dispatch(requestBookById())

    var request = new Request(`${BASE_URL}books/with-authors/id/${id}`, {
      headers: new Headers({
        Authorization: sessionUtils.getAuthString()
      })
    })
    return fetch(request)
      .then(resp => { return resp.status === 401 ? dispatch(logoutUser()) : resp.json() })
      .then(json => {
        dispatch(receiveBook(json))
      })
  }
}

export function addBook(o) {
  return function (dispatch) {
    dispatch(requestAddBook())

    var request = new Request(BASE_URL + "books/add", {
      headers: new Headers({
        "Content-Type": "application/json",
        Authorization: sessionUtils.getAuthString()
      })
    })

    return fetch(request, {
      method: "POST",
      body: JSON.stringify(o)

    }).then(resp => { return resp.status === 401 ? dispatch(logoutUser()) : resp.json() })
      .then(json => {
        if (json.res === "error") {
          alert(JSON.stringify(json))
          dispatch(addBookError(json.res))
        } else {
          dispatch(addBookSuccess(json))
        }

      }).catch(error => {
        dispatch(addBookError(error))
      })
  }
}

export function updateBook(o) {
  return function (dispatch) {
    dispatch(requestUpdateBook())

    var request = new Request(`${BASE_URL}books/update/${o.id}`, {
      headers: new Headers({
        "Content-Type": "application/json",
        "Authorization": sessionUtils.getAuthString()
      })
    })

    return fetch(request, {
      method: "POST",
      body: JSON.stringify(o)

    }).then(resp => { return resp.status === 401 ? dispatch(logoutUser()) : resp.json() })
      .then(json => {
        if (json.res === "error") {
          dispatch(updateBookError(json))
        } else {
          dispatch(updateBookSuccess(json))
        }

      }).catch(error => {
        dispatch(updateBookError(error))
      })
  }
}

export function deleteBook(o) {
  return function(dispatch) {
    dispatch(requestDeleteBook())

    var request = new Request(BASE_URL + "books/delete/" + o.id, {
      headers: new Headers({
        "Content-Type": "application/json",
        "Authorization": sessionUtils.getAuthString()
      })
    })

    fetch(request, {
      method: "DELETE",
      body: JSON.stringify(o)

    }).then(response => {
      if (response.status === 401) dispatch(logoutUser())
      dispatch(deleteBookSuccess(response, o))

    }).catch(error => {
      dispatch(deleteBookError(error))
    })
  }
}

/* Obtener investigador/es */
function requestBooks() {
  return {
    type: types.REQUEST_BOOKS,
  }
}

function requestBookById(id) {
  return {
    type: types.REQUEST_BOOK,
    id: id
  }
}

export function receiveBooks(json) {
  return {
    type: types.RECEIVE_BOOKS,
    objects: json,
    receivedAt: Date.now()
  }
}

function receiveBook(json) {
  return {
    type: types.RECEIVE_BOOK,
    object: json,
    receivedAt: Date.now()
  }
}

/* Insertar investigador */
function requestAddBook() {
  return {
    type: types.REQUEST_ADD_BOOK
  }
}

function addBookSuccess(res) {
  return {
    type: types.ADD_BOOK_SUCCESS,
    message: res
  }
}

function addBookError(err) {
  return {
    type: types.ADD_BOOK_ERROR,
    message: err.msg || "Ha ocurrido un error inesperado."
  }
}

/* Actualizar investigador */
function requestUpdateBook() {
  return {
    type: types.REQUEST_ADD_BOOK
  }
}

function updateBookSuccess(res) {
  return {
    type: types.ADD_BOOK_SUCCESS,
    message: res
  }
}

function updateBookError(err) {
  return {
    type: types.UPDATE_BOOK_ERROR,
    message: err.description || "Ha ocurrido un error inesperado."
  }
}

/* Eliminar investigador */
function requestDeleteBook() {
  return {
    type: types.REQUEST_DELETE_BOOK
  }
}

function deleteBookSuccess(response, object) {
  return {
    type: types.DELETE_BOOK_SUCCESS,
    message: response,
    object
  }
}

function deleteBookError(err) {
  return {
    type: types.DELETE_BOOK_ERROR,
    message: err.msg || "Ha ocurrido un error inesperado."
  }
}
