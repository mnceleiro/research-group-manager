import * as types from "../constants/actionTypes"

import { logoutUser } from "./login-actions"

import { sessionUtils } from "../utils/SessionUtils"
import { BASE_URL } from "../constants/config"

export const showAllResearchers = (researcherList) => ({
  type: types.SHOW_ALL_RESEARCHERS,
  data: researcherList
})

export const editResearcher = (id) => ({
  type: types.EDIT_RESEARCHER,
  researcherId: id
})

export function fetchResearchers() {
  return function (dispatch) {
    dispatch(requestResearchers())

    var request = new Request(BASE_URL + "researchers/all", {
      headers: new Headers({
        Authorization: sessionUtils.getAuthString()
      })
    })
    return fetch(request)
      .then(resp => {
        if (resp.status === 401) { dispatch(logoutUser()) }
        else return resp.json()
      })
      .then(researchersJson => {
        dispatch(receiveResearchers(researchersJson))
      })
  }
}

export function fetchResearcherById(id) {
  return function (dispatch) {
    dispatch(requestResearcherById())

    var request = new Request(`${BASE_URL}researchers/id/${id}`, {
      headers: new Headers({
        Authorization: sessionUtils.getAuthString()
      })
    })
    return fetch(request)
      .then(resp => {
        if (resp.status === 401) dispatch(logoutUser())
        return resp.json()
      })
      .then(researcherJson => {
        dispatch(receiveResearcher(researcherJson))
      })
  }
}

export function addResearcher(r) {
  return function (dispatch) {
    dispatch(requestAddResearcher())

    var request = new Request(BASE_URL + "researchers/add", {
      headers: new Headers({
        "Content-Type": "application/json",
        Authorization: sessionUtils.getAuthString()
      })
    })

    return fetch(request, {
      method: "POST",
      body: JSON.stringify(r)

    }).then(response => {
      if (response.status === 401) { dispatch(logoutUser()) }
      return response.json()
    }).then(researcherJson => {
      if (researcherJson.res === "error") {
        alert(JSON.stringify(researcherJson))
        dispatch(addResearcherError(researcherJson.res))
      } else {
        dispatch(addResearcherSuccess(researcherJson))
      }

    }).catch(error => {
      dispatch(addResearcherError(error))
    })
  }
}

export function updateResearcher(r) {
  return function (dispatch) {
    dispatch(requestUpdateResearcher())

    var request = new Request(`${BASE_URL}researchers/update/${r.id}`, {
      headers: new Headers({
        "Content-Type": "application/json",
        "Authorization": sessionUtils.getAuthString()
      })
    })

    return fetch(request, {
      method: "POST",
      body: JSON.stringify(r)

    }).then(resp => {
      if (resp.status === 401) { dispatch(logoutUser()) }
      return resp.json()

    }).then(researcherJson => {
      if (researcherJson.res === "error") {
        dispatch(updateResearcherError(researcherJson.res))
      } else {
        dispatch(updateResearcherSuccess(researcherJson))
      }

    }).catch(error => {
      dispatch(updateResearcherError(error))
    })
  }
}

export function deleteResearcher(r) {
  return function(dispatch) {
    dispatch(requestDeleteResearcher())

    var request = new Request(BASE_URL + "researchers/delete/" + r.id, {
      headers: new Headers({
        "Content-Type": "application/json",
        "Authorization": sessionUtils.getAuthString()
      })
    })

    fetch(request, {
      method: "DELETE",
      body: JSON.stringify(r)

    }).then(response => {
      if (response.status !== 200) {
        if (response.status === 401) { dispatch(logoutUser()) }
        dispatch(deleteResearcherError("No es posible eliminar el investigador."))
      }
      else dispatch(deleteResearcherSuccess(response, r))
    }).catch(error => {
      dispatch(deleteResearcherError("No es posible eliminar el investigador: " + error))
    })
  }
}

/* Obtener investigador/es */
function requestResearchers() {
  return {
    type: types.REQUEST_RESEARCHERS,
  }
}

function requestResearcherById(id) {
  return {
    type: types.REQUEST_RESEARCHER,
    id: id
  }
}

export function receiveResearchers(json) {
  return {
    type: types.RECEIVE_RESEARCHERS,
    researchers: json,
    receivedAt: Date.now()
  }
}

function receiveResearcher(json) {
  return {
    type: types.RECEIVE_RESEARCHER,
    researcher: json,
    receivedAt: Date.now()
  }
}

/* Insertar investigador */
function requestAddResearcher() {
  return {
    type: types.REQUEST_ADD_RESEARCHER
  }
}

function addResearcherSuccess(res) {
  return {
    type: types.ADD_RESEARCHER_SUCCESS,
    message: res
  }
}

function addResearcherError(err) {
  return {
    type: types.ADD_RESEARCHER_ERROR,
    message: err.msg || "Ha ocurrido un error inesperado."
  }
}

/* Actualizar investigador */
function requestUpdateResearcher() {
  return {
    type: types.REQUEST_ADD_RESEARCHER
  }
}

function updateResearcherSuccess(res) {
  return {
    type: types.ADD_RESEARCHER_SUCCESS,
    message: res
  }
}

function updateResearcherError(err) {
  return {
    type: types.ADD_RESEARCHER_ERROR,
    message: err.msg || "Ha ocurrido un error inesperado."
  }
}

/* Eliminar investigador */
function requestDeleteResearcher() {
  return {
    type: types.REQUEST_DELETE_RESEARCHER
  }
}

function deleteResearcherSuccess(response, researcher) {
  return {
    type: types.DELETE_RESEARCHER_SUCCESS,
    message: response,
    researcher
  }
}

function deleteResearcherError(msg) {
  return {
    type: types.DELETE_RESEARCHER_ERROR,
    message: msg
  }
}
