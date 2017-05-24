import * as types from "../constants/actionTypes"
import { sessionUtils } from "../utils/SessionUtils"

export function fetchProjects() {
  return function (dispatch) {
    dispatch(requestProjects())
    // debugger
    // return apiGet("projects/all", receiveProjects => { dispatch(receiveProjects) })
    var request = new Request("projects/all", {
      headers: new Headers({
        Authorization: sessionUtils.getAuthString()
      })
    })
    return fetch(request)
      .then(resp => { return resp.json() })
      .then(projectsJson => {
        dispatch(receiveProjects(projectsJson))
      })
  }
}

export function fetchProjectById(id) {
  return function (dispatch) {
    dispatch(requestProjectById())

    var request = new Request(`../../projects/with-authors/id/${id}`, {
      headers: new Headers({
        Authorization: sessionUtils.getAuthString()
      })
    })
    return fetch(request)
      .then(resp => { return resp.json() })
      .then(projectJson => {
        dispatch(receiveProject(projectJson))
      })
  }
}

export function addProject(r) {
  return function (dispatch) {
    dispatch(requestAddProject())

    var request = new Request("../../projects/add", {
      headers: new Headers({
        "Content-Type": "application/json",
        Authorization: sessionUtils.getAuthString()
      })
    })

    return fetch(request, {
      method: "POST",
      body: JSON.stringify(r)

    }).then(resp => {return resp.json() })
      .then(projectJson => {
        if (projectJson.res === "error") {
          alert(JSON.stringify(projectJson))
          dispatch(addProjectError(projectJson.res))
        } else {
          dispatch(addProjectSuccess(projectJson))
        }

      }).catch(error => {
        dispatch(addProjectError(error))
      })
  }
}

export function updateProject(r) {
  return function (dispatch) {
    dispatch(requestUpdateProject())

    var request = new Request(`../../projects/update/${r.id}`, {
      headers: new Headers({
        "Content-Type": "application/json",
        "Authorization": sessionUtils.getAuthString()
      })
    })

    return fetch(request, {
      method: "POST",
      body: JSON.stringify(r)

    }).then(resp => {return resp.json() })
      .then(projectJson => {
        if (projectJson.res === "error") {
          dispatch(updateProjectError(projectJson.res))
        } else {
          dispatch(updateProjectSuccess(projectJson))
        }

      }).catch(error => {
        dispatch(updateProjectError(error))
      })
  }
}

export function deleteProject(r) {
  return function(dispatch) {
    dispatch(requestDeleteProject())

    var request = new Request("../delete/" + r.id, {
      headers: new Headers({
        "Content-Type": "application/json",
        "Authorization": sessionUtils.getAuthString()
      })
    })

    fetch(request, {
      method: "DELETE",
      body: JSON.stringify(r)

    }).then(response => {
      dispatch(deleteProjectSuccess(response, r))
    })
  }
}

export function addAuthorToCurrentProject(o) {
  return {
    type: types.ADD_AUTHOR_TO_CURRENT_PROJECT,
    object: o
  }
}

export function editAuthorFromProject(o) {
  return {
    type: types.EDIT_AUTHOR_FROM_CURRENT_PROJECT,
    object: o
  }
}

export function deleteAuthorFromProject(i) {
  return {
    type: types.DELETE_AUTHOR_FROM_CURRENT_PROJECT,
    index: i,
  }
}

/* Obtener investigador/es */
function requestProjects() {
  return {
    type: types.REQUEST_PROJECTS,
  }
}

function requestProjectById(id) {
  return {
    type: types.REQUEST_PROJECT,
    id: id
  }
}

export function receiveProjects(json) {
  return {
    type: types.RECEIVE_PROJECTS,
    projects: json,
    receivedAt: Date.now()
  }
}

function receiveProject(json) {
  return {
    type: types.RECEIVE_PROJECT,
    project: json,
    receivedAt: Date.now()
  }
}

/* Insertar investigador */
function requestAddProject() {
  return {
    type: types.REQUEST_ADD_PROJECT
  }
}

function addProjectSuccess(res) {
  return {
    type: types.ADD_PROJECT_SUCCESS,
    message: res
  }
}

function addProjectError(err) {
  return {
    type: types.ADD_PROJECT_ERROR,
    message: err.msg || "Ha ocurrido un error inesperado."
  }
}

/* Actualizar investigador */
function requestUpdateProject() {
  return {
    type: types.REQUEST_ADD_PROJECT
  }
}

function updateProjectSuccess(res) {
  return {
    type: types.ADD_PROJECT_SUCCESS,
    message: res
  }
}

function updateProjectError(err) {
  return {
    type: types.ADD_PROJECT_ERROR,
    message: err.msg || "Ha ocurrido un error inesperado."
  }
}

/* Eliminar investigador */
function requestDeleteProject() {
  return {
    type: types.REQUEST_DELETE_PROJECT
  }
}

function deleteProjectSuccess(response, project) {
  return {
    type: types.DELETE_PROJECT_SUCCESS,
    message: response,
    project
  }
}
