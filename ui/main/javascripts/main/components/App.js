import React, { PropTypes, Component } from "react"
import { Router } from "react-router"
import { connect } from "react-redux"

// import config from "config"

import createRoutes from "../createRoutes"

import LoginForm from "./main/LoginForm"

import { SidebarMenu } from "./main/SidebarMenu"
import { UpperMenu } from "./main/UpperMenu"
import { setSessionData, logoutUser } from "../actions/login-actions"

class App extends Component {
  componentWillMount() {
    this.props.setSessionData()
  }

  logout() {
    this.props.logoutUser()
  }

  render() {
    let {store, history, isAuthenticated, errorMessage, logoutUser } = this.props

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
          <SidebarMenu user={this.props.currentUser} />
          <div className="content-column">
            <UpperMenu user={this.props.currentUser} logout={this.logout.bind(this)} />
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
  errorMessage: PropTypes.string,
  currentUser: PropTypes.object,

  setSessionData: PropTypes.func,
  logoutUser: PropTypes.func
}

let mapStateToProps = store => {
  return {
    isAuthenticated: store.sessionState.isAuthenticated,
    errorMessage: store.sessionState.error,
    currentUser: store.sessionState.user
  }
}

let mapDispatchToProps = dispatch => {
  return {
    setSessionData: () => {
      dispatch(setSessionData())
    },
    logoutUser: () => {
      dispatch(logoutUser())
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
