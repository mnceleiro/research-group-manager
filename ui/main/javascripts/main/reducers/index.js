import { combineReducers } from "redux"
import { reducer as formReducer } from "redux-form"
import { routerReducer as routing } from "react-router-redux"

import researchers from "./researchers"
import session from "./sessions"
import messageReducer from "../reducers/reducer_message"

const rootReducer = combineReducers({
  routing,
  researcherState: researchers,
  sessionState: session,
  flashState: messageReducer,
  form: formReducer
})

export default rootReducer
