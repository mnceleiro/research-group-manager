import React, { Component, PropTypes } from "react"
import { connect } from "react-redux"
// import ReactModal from "react-modal"
import { Field, reduxForm } from "redux-form"

import { doLogin } from "../actions/login-actions"

class LoginForm extends Component {

  constructor(props) {
    super(props)
    this.onSubmit = this.onSubmit.bind(this)
  }

  render() {
    let { handleSubmit, errorMessage } = this.props

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
    // return (
    //   <div id="modal">
    //     <ReactModal
    //       ref="mymodal"
    //       id="loginModal"
    //       closeTimeoutMS={150}
    //       contentLabel="Prueba"
    //       className="Modal"
    //       overlayClassName="Overlay"
    //       isOpen={true}>
    //       <div className="login-page">asdasdsd
    //         <div className="form">
    //           <div>
    //             <h2>Accede a tu cuenta</h2>
    //           </div>
    //           <form className="login-form" onSubmit={handleSubmit(this.onSubmit)}>
    //             <Field name="email" id="email" component="input" type="text" placeholder="email"/>
    //             <Field name="password" component="input" type="password" placeholder="password"/>
    //             <button className="login-btn">login</button>
    //             {errorMessage && <div className="form-alert alert-danger">{errorMessage}</div> }
    //           </form>
    //         </div>
    //       </div>
    //   </ReactModal>
    // </div>
    // )
  }

  onSubmit(values) {
    this.props.login(values)
  }
}

LoginForm.propTypes = {
  login: PropTypes.func,
  handleSubmit: PropTypes.func,
  errorMessage: PropTypes.string
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

export default connect(null, mapDispatchToProps)(form(LoginForm))
