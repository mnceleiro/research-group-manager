import * as types from "../constants/actionTypes"

export const showAllResearchers = (researcherList) => ({
  type: types.SHOW_ALL_RESEARCHERS,
  data: researcherList
})

export const addResearcher = (res) => ({
  type: types.ADD_RESEARCHER, res
})

export const fetchResearchers = (dispatch) => {
  fetch("researchers/all")
    .then(resp => { return resp.json() })
    .then(researcherList => {
      dispatch(showAllResearchers(researcherList))
    })
}
