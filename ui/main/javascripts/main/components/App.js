import React from "react"
import { Router } from "react-router"

import createRoutes from "../createRoutes"

const App = ({store, history}) => (
  <Router history={history} routes={createRoutes(store)}></Router>
)

App.propTypes = {
  store: React.PropTypes.object.isRequired,
  history: React.PropTypes.object.isRequired
}

export default App
