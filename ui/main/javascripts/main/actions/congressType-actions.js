import { REQUEST_CONGRESS_TYPES, RECEIVE_CONGRESS_TYPES } from "../constants/actionTypes"
import { sessionUtils } from "../utils/SessionUtils"

export function fetchCongressTypes() {
  return function (dispatch) {
    dispatch(requestCongressTypes())
    var request = new Request("../../congress-types/all", {
      headers: new Headers({
        Authorization: sessionUtils.getAuthString()
      })
    })
    return fetch(request)
      .then(resp => { return resp.json() })
      .then(congressTypesJson => {
        dispatch(receiveCongressTypes(congressTypesJson))
      })
  }
}

function requestCongressTypes() {
  return {
    type: REQUEST_CONGRESS_TYPES,
  }
}

export function receiveCongressTypes(json) {
  return {
    type: RECEIVE_CONGRESS_TYPES,
    congressTypes: json,
    receivedAt: Date.now()
  }
}
