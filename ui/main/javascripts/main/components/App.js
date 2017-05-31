import React, {Component } from "react"
import PropTypes from "prop-types"
import { Router } from "react-router"
import { connect } from "react-redux"
import { browserHistory } from "react-router"

import createRoutes from "../createRoutes"

import LoginForm from "./main/LoginForm"

import { SidebarMenu } from "./main/SidebarMenu"
import { UpperMenu } from "./main/UpperMenu"
import { setSessionData, logoutUser } from "../actions/login-actions"

import { LoadingModal } from "./html_extended/modals/Modal"

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      activeEntity: "calendar"
    }
  }
  componentWillMount() {
    this.props.setSessionData()
  }

  logout() {
    this.props.logoutUser()
  }

  setEntity(entity) {
    this.setState({
      ...this.state,
      activeEntity: entity
    })
    browserHistory.push(`/${entity}`)
  }

  onClickProfile() {
    browserHistory.push(`/researchers/edit/${this.props.currentUser.userId}`)
  }

  onClickResearchers() {
    if (this.state.activeEntity !== "researchers") this.setEntity("researchers")
  }
  onClickAuthors() {
    if (this.state.activeEntity !== "authors") this.setEntity("authors")
  }
  onClickCalendar() {
    if (this.state.activeEntity !== "calendar") this.setEntity("calendar")  // Evitamos que salgan notificaciones masivas
  }
  onClickProjects() {
    if (this.state.activeEntity !== "projects") this.setEntity("projects")
  }
  onClickBooks() {
    if (this.state.activeEntity !== "books") this.setEntity("books")
  }
  onClickCongresses() {
    if (this.state.activeEntity !== "congresses") this.setEntity("congresses")
  }

  render() {
    let {store, history, isAuthenticated, errorMessage } = this.props

    if (!isAuthenticated) {
      return (
        <LoginForm auth={isAuthenticated} errorMessage={errorMessage} />
      )

    } else {
      if (!this.props.currentUser.userId) {
        return (<LoadingModal isOpen={true} />)
      }
      return (
        <div>
          <SidebarMenu user={this.props.currentUser}
            active={this.state.activeEntity}
            onClickCalendar={this.onClickCalendar.bind(this)}
            onClickResearchers={this.onClickResearchers.bind(this)}
            onClickAuthors={this.onClickAuthors.bind(this)}
            onClickProjects={this.onClickProjects.bind(this)}
            onClickBooks={this.onClickBooks.bind(this)}
            onClickCongresses={this.onClickCongresses.bind(this)}
          />
          <div className="content-column">
            <UpperMenu user={this.props.currentUser} logout={this.logout.bind(this)} onClickProfile={this.onClickProfile.bind(this)} />
            <div id="rgmApp" className="content">
              <Router history={history} routes={createRoutes(store)}>

              </Router>
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
