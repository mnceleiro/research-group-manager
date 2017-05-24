import { REQUEST_ROLES, RECEIVE_ROLES } from "../constants/actionTypes"
import { sessionUtils } from "../utils/SessionUtils"

export function fetchRoles() {
  // console.log(window.location.protocol + "//" + window.location.host)
  return function (dispatch) {
    dispatch(requestRoles())
    var request = new Request("../../roles/all", {
      headers: new Headers({
        Authorization: sessionUtils.getAuthString()
      })
    })
    return fetch(request)
      .then(resp => { return resp.json() })
      .then(rolesJson => {
        dispatch(receiveRoles(rolesJson))
      })
  }
}

function requestRoles() {
  return {
    type: REQUEST_ROLES,
  }
}

export function receiveRoles(json) {
  return {
    type: RECEIVE_ROLES,
    roles: json,
    receivedAt: Date.now()
  }
}
