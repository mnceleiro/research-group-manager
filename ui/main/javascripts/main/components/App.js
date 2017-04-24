import React, { PropTypes, Component } from "react"
import { Router } from "react-router"
import { connect } from "react-redux"

// import config from "config"

import createRoutes from "../createRoutes"

import LoginForm from "./LoginForm"

import { SidebarMenu } from "./SidebarMenu"
import { UpperMenu } from "./UpperMenu"

class App extends Component {
  render() {
    let {store, history, isAuthenticated, errorMessage} = this.props

    // return (
    //   <div>
    //     <Router history={history} routes={createRoutes(store)}></Router>
    //     { !isAuthenticated && <LoginForm auth={isAuthenticated} errorMessage={errorMessage} /> }
    //   </div>
    // )
    if (!isAuthenticated) {
      return (
        <LoginForm auth={isAuthenticated} errorMessage={errorMessage} />
      )

    } else {
      return (
        <div>
          <SidebarMenu />
          <div className="content-column">
            <UpperMenu />
            <div id="rgmApp" className="content">
              <Router history={history} routes={createRoutes(store)}></Router>
            </div>
          </div>
        </div>
      )
    }
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
