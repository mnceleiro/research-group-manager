import {SHOW_ALL_RESEARCHERS, FETCH_RESEARCHERS } from "../constants/actionTypes"

const initialState = [
  {
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

      }
    ]
  }
  return state
}
