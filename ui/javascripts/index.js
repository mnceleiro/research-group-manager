import ReactDOM from "react-dom"
import React from "react"
import { createStore } from "redux"
import { Provider } from "react-redux"
// import { createLogger } from "redux-logger"

import researchers from "./reducers/researchers"
import App from "./components/App"

// const logger = createLogger()
const store = createStore(
  researchers
)

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("rgmApp")
)

//$.get("researchers/all", function(respuestaSolicitud){
//  alert(respuestaSolicitud)
//})
