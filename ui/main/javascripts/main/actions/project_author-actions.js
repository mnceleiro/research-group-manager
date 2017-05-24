import { REQUEST_AUTHORS_PROJECTS, RECEIVE_AUTHORS_PROJECTS, AUTHORS_PROJECT_NORMALIZED } from "../constants/actionTypes"
import { sessionUtils } from "../utils/SessionUtils"

export function fetchAll() {
  return function (dispatch) {
    dispatch(requestAll())

    var request = new Request("../../projects-authors/all", {
      headers: new Headers({
        Authorization: sessionUtils.getAuthString()
      })
    })
    return fetch(request)
      .then(resp => { return resp.json() })
      .then(json => {
        dispatch(receiveAll(json))
      })
  }
}

function requestAll() {
  return {
    type: REQUEST_AUTHORS_PROJECTS,
  }
}

function receiveAll(json) {
  return {
    type: RECEIVE_AUTHORS_PROJECTS,
    data: json,
    receivedAt: Date.now()
  }
}

export function normalizeProjectAuthorsData(data) {
  return function (dispatch) {
    dispatch(authorsProjectsNormalized(data))
  }
}

export function authorsProjectsNormalized(data) {
  return {
    type: AUTHORS_PROJECT_NORMALIZED,
    data: data
  }
}
