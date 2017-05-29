import * as types from "../constants/actionTypes"

import { sessionUtils } from "../utils/SessionUtils"
import { BASE_URL } from "../constants/config"

export function fetchAuthors() {
  return function (dispatch) {
    dispatch(requestAuthors())

    var request = new Request(BASE_URL + "authors/all", {
      headers: new Headers({
        Authorization: sessionUtils.getAuthString()
      })
    })
    return fetch(request)
      .then(resp => { return resp.json() })
      .then(authorsJson => {
        dispatch(receiveAuthors(authorsJson))
      })
  }
}

function requestAuthors() {
  return {
    type: types.REQUEST_AUTHORS,
  }
}

export function receiveAuthors(json) {
  return {
    type: types.RECEIVE_AUTHORS,
    authors: json,
    receivedAt: Date.now()
  }
}

export function fetchAuthorById(id) {
  return function (dispatch) {
    dispatch(requestAuthorById())

    var request = new Request(`${BASE_URL}authors/with-entities/id/${id}`, {
      headers: new Headers({
        Authorization: sessionUtils.getAuthString()
      })
    })
    return fetch(request)
      .then(resp => { return resp.json() })
      .then(authorJson => {
        dispatch(receiveAuthor(authorJson))
      })
  }
}

function requestAuthorById(id) {
  return {
    type: types.REQUEST_AUTHOR,
    id: id
  }
}

function receiveAuthor(json) {
  return {
    type: types.RECEIVE_AUTHOR,
    author: json,
    receivedAt: Date.now()
  }
}

export function addAuthor(r) {
  return function (dispatch) {
    dispatch(requestAddAuthor())

    var request = new Request(BASE_URL + "authors/add", {
      headers: new Headers({
        "Content-Type": "application/json",
        Authorization: sessionUtils.getAuthString()
      })
    })

    return fetch(request, {
      method: "POST",
      body: JSON.stringify(r)

    }).then(resp => {return resp.json() })
      .then(authorJson => {
        if (authorJson.res === "error") {
          alert(JSON.stringify(authorJson))
          dispatch(addAuthorError(authorJson.res))
        } else {
          dispatch(addAuthorSuccess(authorJson))
        }

      }).catch(error => {
        dispatch(addAuthorError(error))
      })
  }
}

function requestAddAuthor() {
  return {
    type: types.REQUEST_ADD_AUTHOR
  }
}

function addAuthorSuccess(res) {
  return {
    type: types.ADD_AUTHOR_SUCCESS,
    message: res
  }
}

function addAuthorError(err) {
  return {
    type: types.ADD_AUTHOR_ERROR,
    message: err.msg || "Ha ocurrido un error inesperado."
  }
}

export function updateAuthor(r) {
  return function (dispatch) {
    dispatch(requestUpdateAuthor())

    var request = new Request(`${BASE_URL}/authors/update/${r.id}`, {
      headers: new Headers({
        "Content-Type": "application/json",
        "Authorization": sessionUtils.getAuthString()
      })
    })

    return fetch(request, {
      method: "POST",
      body: JSON.stringify(r)

    }).then(resp => {return resp.json() })
      .then(authorJson => {
        if (authorJson.res === "error") {
          dispatch(updateAuthorError(authorJson.res))
        } else {
          dispatch(updateAuthorSuccess(authorJson))
        }

      }).catch(error => {
        dispatch(updateAuthorError(error))
      })
  }
}

function requestUpdateAuthor() {
  return {
    type: types.REQUEST_ADD_AUTHOR
  }
}

function updateAuthorSuccess(res) {
  return {
    type: types.ADD_AUTHOR_SUCCESS,
    message: res
  }
}

function updateAuthorError(err) {
  return {
    type: types.ADD_AUTHOR_ERROR,
    message: err.msg || "Ha ocurrido un error inesperado."
  }
}

export function deleteAuthor(r) {
  return function(dispatch) {
    dispatch(requestDeleteAuthor())

    var request = new Request(BASE_URL + "authors/delete/" + r.id, {
      headers: new Headers({
        "Content-Type": "application/json",
        "Authorization": sessionUtils.getAuthString()
      })
    })

    fetch(request, {
      method: "DELETE",
      body: JSON.stringify(r)

    }).then(response => {
      dispatch(deleteAuthorSuccess(response, r))
    })
  }
}

function requestDeleteAuthor() {
  return {
    type: types.REQUEST_DELETE_AUTHOR
  }
}

function deleteAuthorSuccess(response, author) {
  return {
    type: types.DELETE_AUTHOR_SUCCESS,
    message: response,
    author
  }
}
