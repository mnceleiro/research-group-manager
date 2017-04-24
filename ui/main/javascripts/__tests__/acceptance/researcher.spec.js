import React from "react"
// import ReactDOM, { findDomNode } from "react-dom"
import {  mount } from "enzyme"
// import ReactTestUtils from "react-addons-test-utils"

import { Provider } from "react-redux"
// import { browserHistory } from "react-router"
import { createMemoryHistory } from "react-router"
import { syncHistoryWithStore } from "react-router-redux"

import configureStore from "../../main/store/configureStore"
import App from "../../main/components/App"

beforeEach(() => {

})

it("renders login page without crashing", () => {
  const browserHistory = createMemoryHistory("/researchers")
  const store = configureStore()
  const history = syncHistoryWithStore(browserHistory, store)

  const wrapper = mount(
    <Provider store={store}>
      <App store={store} history={history} />
    </Provider>,
    document.createElement("div", { id: "rgmApp", name: "rgmApp" })
  )

  // browserHistory.push("/researchers")
  console.log("HOLA " + wrapper.find(".btn").text()) // eslint-disable-line
})
