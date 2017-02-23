import {SHOW_ALL_RESEARCHERS, FETCH_RESEARCHERS } from "../constants/actionTypes"

const initialState = [
  {
    researchers: [],
    isFetching: false
  }
]

export default function researchers(state = initialState, action) {
  switch (action.type) {
  case SHOW_ALL_RESEARCHERS:
    return [
      {

      }
    ]

  case FETCH_RESEARCHERS:
    return [
      {
        //fetchResearchers(state.dispatch)
        state
      }
    ]
  }
  
  return state
}
