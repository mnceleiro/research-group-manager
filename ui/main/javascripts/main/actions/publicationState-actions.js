import { REQUEST_PUBLICATION_STATES, RECEIVE_PUBLICATION_STATES } from "../constants/actionTypes"
import { sessionUtils } from "../utils/SessionUtils"

export function fetchPublicationStates() {
  return function (dispatch) {
    dispatch(requestPublicationStates())
    var request = new Request("../../publication-status/all", {
      headers: new Headers({
        Authorization: sessionUtils.getAuthString()
      })
    })
    return fetch(request)
      .then(resp => { return resp.json() })
      .then(publicationStatesJson => {
        dispatch(receivePublicationStates(publicationStatesJson))
      })
  }
}

function requestPublicationStates() {
  return {
    type: REQUEST_PUBLICATION_STATES,
  }
}

export function receivePublicationStates(json) {
  return {
    type: RECEIVE_PUBLICATION_STATES,
    publicationStates: json,
    receivedAt: Date.now()
  }
}
