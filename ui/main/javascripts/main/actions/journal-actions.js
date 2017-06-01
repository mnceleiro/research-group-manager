import * as types from "../constants/actionTypes"
import { sessionUtils } from "../utils/SessionUtils"
import { BASE_URL } from "../constants/config"

import { logoutUser } from "./login-actions"

export function fetchJournals() {
  return function (dispatch) {
    dispatch(requestJournals())

    var request = new Request(BASE_URL + "journals/all", {
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
        dispatch(receiveJournals(json))
      })
  }
}

export function fetchJournalById(id) {
  return function (dispatch) {
    dispatch(requestJournalById())

    var request = new Request(`${BASE_URL}journals/with-authors/id/${id}`, {
      headers: new Headers({
        Authorization: sessionUtils.getAuthString()
      })
    })
    return fetch(request)
      .then(resp => { return resp.status === 401 ? dispatch(logoutUser()) : resp.json() })
      .then(json => {
        dispatch(receiveJournal(json))
      })
  }
}

export function addJournal(o) {
  return function (dispatch) {
    dispatch(requestAddJournal())

    var request = new Request(BASE_URL + "journals/add", {
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
          dispatch(addJournalError(json.res))
        } else {
          dispatch(addJournalSuccess(json))
        }

      }).catch(error => {
        dispatch(addJournalError(error))
      })
  }
}

export function updateJournal(o) {
  return function (dispatch) {
    dispatch(requestUpdateJournal())

    var request = new Request(`${BASE_URL}journals/update/${o.id}`, {
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
          dispatch(updateJournalError(json))
        } else {
          dispatch(updateJournalSuccess(json))
        }

      }).catch(error => {
        dispatch(updateJournalError(error))
      })
  }
}

export function deleteJournal(o) {
  return function(dispatch) {
    dispatch(requestDeleteJournal())

    var request = new Request(BASE_URL + "journals/delete/" + o.id, {
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
      dispatch(deleteJournalSuccess(response, o))

    }).catch(error => {
      dispatch(deleteJournalError(error))
    })
  }
}

function requestJournals() {
  return {
    type: types.REQUEST_JOURNALS,
  }
}

function requestJournalById(id) {
  return {
    type: types.REQUEST_BOOK,
    id: id
  }
}

export function receiveJournals(json) {
  return {
    type: types.RECEIVE_JOURNALS,
    objects: json,
    receivedAt: Date.now()
  }
}

function receiveJournal(json) {
  return {
    type: types.RECEIVE_BOOK,
    object: json,
    receivedAt: Date.now()
  }
}

function requestAddJournal() {
  return {
    type: types.REQUEST_ADD_BOOK
  }
}

function addJournalSuccess(res) {
  return {
    type: types.ADD_BOOK_SUCCESS,
    message: res
  }
}

function addJournalError(err) {
  return {
    type: types.ADD_BOOK_ERROR,
    message: err.msg || "Ha ocurrido un error inesperado."
  }
}

function requestUpdateJournal() {
  return {
    type: types.REQUEST_ADD_BOOK
  }
}

function updateJournalSuccess(res) {
  return {
    type: types.ADD_BOOK_SUCCESS,
    message: res
  }
}

function updateJournalError(err) {
  return {
    type: types.UPDATE_BOOK_ERROR,
    message: err.description || "Ha ocurrido un error inesperado."
  }
}

function requestDeleteJournal() {
  return {
    type: types.REQUEST_DELETE_BOOK
  }
}

function deleteJournalSuccess(response, object) {
  return {
    type: types.DELETE_BOOK_SUCCESS,
    message: response,
    object
  }
}

function deleteJournalError(err) {
  return {
    type: types.DELETE_BOOK_ERROR,
    message: err.msg || "Ha ocurrido un error inesperado."
  }
}
