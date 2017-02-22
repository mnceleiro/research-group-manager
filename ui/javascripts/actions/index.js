import * as types from "../constants/actionTypes"

export const getAllResearchers = () => ({
  type: types.SHOW_ALL_RESEARCHERS
})

export const addResearcher = (res) => ({
  type: types.ADD_RESEARCHER, res
})
