
import React from "react"
// import ReactDOM, { findDomNode } from "react-dom"
import { shallow, mount } from "enzyme"
import ReactTestUtils from "react-addons-test-utils"

import { Provider } from "react-redux"
import { browserHistory } from "react-router"
import { syncHistoryWithStore } from "react-router-redux"
import configureStore from "../../main/store/configureStore"

import App from "../../main/components/App"

it("renders login page without crashing", () => {
  const store = configureStore()
  const history = syncHistoryWithStore(browserHistory, store)

  // var app = ReactTestUtils.renderIntoDocument(
  //   <Provider store={store}>
  //     <App store={store} history={history} />
  //   </Provider>,
  //   document.getElementById("rgmApp")
  // )
  //
  // var divs = ReactTestUtils.scryRenderedDOMComponentsWithTag(app, "div")
  // console.log(divs)
  // // expect(getDOMNode(input).textContent).toEqual("Login")
  // let inputs = ReactTestUtils.scryRenderedDOMComponentsWithTag(app, "input")
  // let length = inputs.length
  // console.log(inputs)

  const wrapper = mount(
    <Provider store={store}>
      <App store={store} history={history} />
    </Provider>,
    document.createElement("div", { id: "rgmApp", name: "rgmApp" })
  )

  console.log("HOLA " + wrapper.find(".login").text())

})
