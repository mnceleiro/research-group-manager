import React from "react"
import ReactDOM from "react-dom"
import { Provider } from "react-redux"

import { browserHistory } from "react-router"

import { syncHistoryWithStore } from "react-router-redux"

import App from "./components/App"
import configureStore from "./store/configureStore"

const store = configureStore()
const history = syncHistoryWithStore(browserHistory, store)

ReactDOM.render(
  <Provider store={store}>
    <App store={store} history={history} />
  </Provider>,
  document.getElementById("main-container")
)
