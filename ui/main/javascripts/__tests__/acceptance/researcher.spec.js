import React from "react"
// import ReactDOM, { findDomNode } from "react-dom"
import {  mount } from "enzyme"
// import ReactTestUtils from "react-addons-test-utils"

import { Provider } from "react-redux"
import { browserHistory } from "react-router"
import { syncHistoryWithStore } from "react-router-redux"
import configureStore from "../../main/store/configureStore"

import App from "../../main/components/App"

it("renders login page without crashing", () => {
  const store = configureStore()
  const history = syncHistoryWithStore(browserHistory, store)

  const wrapper = mount(
    <Provider store={store}>
      <App store={store} history={history} />
    </Provider>,
    document.createElement("div", { id: "rgmApp", name: "rgmApp" })
  )

  wrapper.find(1)
  // console.log("HOLA " + wrapper.find(".login").text())

})
