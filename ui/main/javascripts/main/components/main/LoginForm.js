import React, { Component } from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import { Field, reduxForm } from "redux-form"

import { doLogin } from "../../actions/login-actions"

import { LoadingModal } from "../html_extended/modals/Modal"

class LoginForm extends Component {

  constructor(props) {
    super(props)
    this.onSubmit = this.onSubmit.bind(this)
  }

  render() {
    let { handleSubmit, errorMessage, isFetching } = this.props

    if (isFetching) {
      return (<LoadingModal isOpen={isFetching} />)
    } else {
      return (
        <div className="login-container">
          <div className="login-page">asdasdsd
            <div className="form">
              <div>
                <h2>Accede a tu cuenta</h2>
              </div>
              <form className="login-form" onSubmit={handleSubmit(this.onSubmit)}>
                <Field name="email" id="email" component="input" type="text" placeholder="email"/>
                <Field name="password" component="input" type="password" placeholder="password"/>
                <button className="login-btn">login</button>
                {errorMessage && <div className="form-alert alert-danger">{errorMessage}</div> }
              </form>
            </div>
          </div>
        </div>
      )
    }
  }

  onSubmit(values) {
    this.props.login(values)
  }
}

LoginForm.propTypes = {
  login: PropTypes.func,
  handleSubmit: PropTypes.func,
  errorMessage: PropTypes.string,
  isFetching: PropTypes.bool
}

let mapStateToProps = store => {
  return {
    isFetching: store.sessionState.isFetching
  }
}

let mapDispatchToProps = dispatch => {
  return {
    login: (user) => {
      dispatch(doLogin(user))
    }
  }
}

let form = reduxForm({
  form: "login",
  fields: [ "email", "password" ]
})

export default connect(mapStateToProps, mapDispatchToProps)(form(LoginForm))
