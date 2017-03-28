import * as types from "../constants/actionTypes"
//import apiGet from "../api/api"

export const showAllResearchers = (researcherList) => ({
  type: types.SHOW_ALL_RESEARCHERS,
  data: researcherList
})

// export const createResearcher = () => ({
//   type: types.CREATE_RESEARCHER
// })

export const editResearcher = (id) => ({
  type: types.EDIT_RESEARCHER,
  researcherId: id
})

export function fetchResearchers() {
  return function (dispatch) {
    dispatch(requestResearchers())
    // debugger
    // return apiGet("researchers/all", receiveResearchers => { dispatch(receiveResearchers) })
    return fetch("researchers/all")
      .then(resp => { return resp.json() })
      .then(researchersJson => {
        dispatch(receiveResearchers(researchersJson))
      })
  }
}

export function fetchResearcherById(id) {
  return function (dispatch) {
    dispatch(requestResearcherById())

    return fetch(`../../researchers/id/${id}`)
      .then(resp => { return resp.json() })
      .then(researcherJson => {
        dispatch(receiveResearcher(researcherJson))
      })
  }
}

export function addResearcher(r) {
  return function (dispatch) {
    dispatch(requestAddResearcher())

    var request = new Request("../../researchers/add", {
      headers: new Headers({
        "Content-Type": "application/json"
      })
    })

    return fetch(request, {
      method: "POST",
      body: JSON.stringify(r)

    }).then(resp => {return resp.json() })
      .then(researcherJson => {
        if (researcherJson.res === "error") {
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

    var request = new Request(`../../researchers/update/${r.id}`, {
      headers: new Headers({
        "Content-Type": "application/json"
      })
    })

    return fetch(request, {
      method: "POST",
      body: JSON.stringify(r)

    }).then(resp => {return resp.json() })
      .then(researcherJson => {
        debugger
        if (researcherJson.res === "error") {
          dispatch(updateResearcherError(researcherJson.res))
        } else {
          dispatch(updateResearcherSuccess(researcherJson))
        }

      }).catch(error => {
        debugger
        dispatch(updateResearcherError(error))
      })
  }
}

export function deleteResearcher(r) {
  return function(dispatch) {
    dispatch(requestDeleteResearcher())

    var request = new Request("../delete/" + r.id, {
      headers: new Headers({
        "Content-Type": "application/json"
      })
    })

    fetch(request, {
      method: "DELETE",
      body: JSON.stringify(r)

    }).then(response => {
      dispatch(deleteResearcherSuccess(response, r))
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

function receiveResearchers(json) {
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
