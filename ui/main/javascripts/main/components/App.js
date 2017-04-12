import React, { PropTypes, Component } from "react"
import { Router } from "react-router"
import { connect } from "react-redux"

import createRoutes from "../createRoutes"

import LoginForm from "./LoginForm"

class App extends Component {
  render() {
    let {store, history, isAuthenticated, errorMessage} = this.props

    return (
      <div className="prueba">
        { isAuthenticated && <Router history={history} routes={createRoutes(store)}></Router> }
        { !isAuthenticated && <LoginForm auth={isAuthenticated} errorMessage={errorMessage} /> }
      </div>
    )
  }
}

App.propTypes = {
  store: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  errorMessage: PropTypes.string
}

let mapStateToProps = store => {
  return {
    isAuthenticated: store.sessionState.isAuthenticated,
    errorMessage: store.sessionState.error
  }
}

export default connect(mapStateToProps, null)(App)
