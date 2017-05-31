import * as types from "../constants/actionTypes"
import { sessionUtils } from "../utils/SessionUtils"
import { BASE_URL } from "../constants/config"

import { logoutUser } from "./login-actions"

export function fetchCongresses() {
  return function (dispatch) {
    dispatch(requestCongresses())
    var request = new Request(BASE_URL + "congresses/all", {
      headers: new Headers({
        Authorization: sessionUtils.getAuthString()
      })
    })
    return fetch(request)
      .then(resp => {
        if (resp.status === 401) sessionUtils.logout()
        else return resp.json()
      })
      .then(congressesJson => {
        dispatch(receiveCongresses(congressesJson))
      })
  }
}

export function fetchCongressById(id) {
  return function (dispatch) {
    dispatch(requestCongressById())

    var request = new Request(`${BASE_URL}congresses/with-authors/id/${id}`, {
      headers: new Headers({
        Authorization: sessionUtils.getAuthString()
      })
    })
    return fetch(request)
      .then(resp => { return resp.json() })
      .then(congressJson => {
        dispatch(receiveCongress(congressJson))
      })
  }
}

export function addCongress(r) {
  return function (dispatch) {
    dispatch(requestAddCongress())

    var request = new Request(BASE_URL + "congresses/add", {
      headers: new Headers({
        "Content-Type": "application/json",
        Authorization: sessionUtils.getAuthString()
      })
    })

    return fetch(request, {
      method: "POST",
      body: JSON.stringify(r)

    }).then(resp => { if (resp.status === 401) dispatch(logoutUser()); return resp.json() })
      .then(congressJson => {
        if (congressJson.res === "error") {
          alert(JSON.stringify(congressJson))
          dispatch(addCongressError(congressJson.res))
        } else {
          dispatch(addCongressSuccess(congressJson))
        }

      }).catch(error => {
        dispatch(addCongressError(error))
      })
  }
}

export function updateCongress(r) {
  return function (dispatch) {
    dispatch(requestUpdateCongress())

    var request = new Request(`${BASE_URL}congresses/update/${r.id}`, {
      headers: new Headers({
        "Content-Type": "application/json",
        "Authorization": sessionUtils.getAuthString()
      })
    })

    return fetch(request, {
      method: "POST",
      body: JSON.stringify(r)

    }).then(resp => {if (resp.status === 401) dispatch(logoutUser()); return resp.json() })
      .then(congressJson => {
        if (congressJson.res === "error") {
          dispatch(updateCongressError(congressJson))
        } else {
          dispatch(updateCongressSuccess(congressJson))
        }

      }).catch(error => {
        dispatch(updateCongressError(error))
      })
  }
}

export function deleteCongress(r) {
  return function(dispatch) {
    dispatch(requestDeleteCongress())
    var request = new Request(BASE_URL + "congresses/delete/" + r.id, {
      headers: new Headers({
        "Content-Type": "application/json",
        "Authorization": sessionUtils.getAuthString()
      })
    })

    fetch(request, {
      method: "DELETE",
      body: JSON.stringify(r)

    }).then(response => {
      if (response.status === 401) dispatch(logoutUser())
      dispatch(deleteCongressSuccess(response, r))

    }).catch(error => {
      dispatch(deleteCongressError(error))
    })
  }
}


function requestCongresses() {
  return {
    type: types.REQUEST_CONGRESSES,
  }
}

function requestCongressById(id) {
  return {
    type: types.REQUEST_CONGRESS,
    id: id
  }
}

function receiveCongress(json) {
  return {
    type: types.RECEIVE_CONGRESS,
    congress: json,
    receivedAt: Date.now()
  }
}

export function receiveCongresses(json) {
  return {
    type: types.RECEIVE_CONGRESSES,
    congresses: json,
    receivedAt: Date.now()
  }
}


function requestAddCongress() {
  return {
    type: types.REQUEST_ADD_CONGRESS
  }
}

function addCongressSuccess(res) {
  return {
    type: types.ADD_CONGRESS_SUCCESS,
    message: res
  }
}

function addCongressError(err) {
  return {
    type: types.ADD_CONGRESS_ERROR,
    message: err.msg || "Ha ocurrido un error inesperado."
  }
}


function requestUpdateCongress() {
  return {
    type: types.REQUEST_ADD_CONGRESS
  }
}

function updateCongressSuccess(res) {
  return {
    type: types.ADD_CONGRESS_SUCCESS,
    message: res
  }
}

function updateCongressError(err) {
  return {
    type: types.UPDATE_CONGRESS_ERROR,
    message: err.description || "Ha ocurrido un error inesperado."
  }
}


function requestDeleteCongress() {
  return {
    type: types.REQUEST_DELETE_CONGRESS
  }
}

function deleteCongressSuccess(response, congress) {
  return {
    type: types.DELETE_CONGRESS_SUCCESS,
    message: response,
    congress
  }
}

function deleteCongressError(err) {
  return {
    type: types.DELETE_CONGRESS_ERROR,
    message: err.msg || "Ha ocurrido un error inesperado."
  }
}
