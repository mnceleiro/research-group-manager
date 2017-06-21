import React, { Component } from "react"
import PropTypes from "prop-types"
import { browserHistory } from "react-router"
import { connect } from "react-redux"
import { Field, reduxForm } from "redux-form"

import { LoadingModal } from "../html_extended/modals/Modal"

import { fetchResearcherById, addResearcher, updateResearcher, deleteResearcher } from "../../actions/researcher-actions"
import { InputRow } from "../html_extended/InputRow"
import { validate } from "./ResearcherValidation"

class ResearcherDetail extends Component {

  handleInitialize(researcher) {
    if (this.props.params.key && parseInt(this.props.params.key) > 0 && researcher.id) {
      const initData = {
        "email": researcher.email,
        "firstName": researcher.firstName,
        "lastName": researcher.lastName,
        "phone": researcher.phone,
        "address": researcher.address,
        "access": researcher.access,
        "admin": researcher.admin
      }

      this.props.initialize(initData)
    }
  }

  isUpdate() {
    if (this.props.params.key) return true
    else return false
  }

  constructor(props) {
    super(props)

    this.onSubmit = this.onSubmit.bind(this)
    this.handleRemove = this.handleRemove.bind(this)
    this.handleInitialize = this.handleInitialize.bind(this)
    this.initialized = false
  }

  componentWillMount() {
    if (this.isUpdate()) {
      this.props.fetchResearcherById(this.props.params.key)
    } else {
      this.initialized = true
    }
  }

  componentWillUpdate(nextProps) {
    if (nextProps.deletedResearcher) {
      browserHistory.push("/researchers")
    }

    if (nextProps.success) {
      browserHistory.push(`/researchers?success=${nextProps.success}`)
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errorHappened) alert(nextProps.errorHappened)

    if (!this.initialized && nextProps.activeResearcher > 0) {
      this.handleInitialize(nextProps.researcher)
      this.initialized = true
    }

    if (nextProps.success) {
      browserHistory.push(`/researchers?success=${nextProps.success}`)
    }
  }

  renderRemoveButton() {
    if (this.isUpdate()) {
      return (
        <div className="col-md-2">
          <input type="button" id="btnRemoveResearcher" className="btn rgm-btn-default rgm-btn-lg" value="Eliminar investigador" onClick={this.handleRemove} />
        </div>
      )
    } else return ""
  }

  render() {
    const editable = this.props.editable

    if ((this.isUpdate() && !this.props.researcher.id) || (!this.isUpdate() && this.props.isFetching)) {
      return <LoadingModal isOpen={this.props.isFetching} />
    }

    const { handleSubmit } = this.props

    var saveCancel = <div className="col-md-offset-2 col-md-7">
                       { editable && <input type="submit" className="btn rgm-btn-primary rgm-btn-lg" value="Guardar" /> }
                       <input type="button" className="btn rgm-btn-default rgm-btn-lg" value="Volver" onClick={this.handleCancel} />
                     </div>

    return (
      <div className="researcher-form">
        <legend>
          Datos personales
        </legend>
        <div className="row">
          <form className="form-horizontal" onSubmit={handleSubmit(this.onSubmit)}>
            <Field component={InputRow} disabled={!editable} type="email" label="Email" name="email" />
            <Field component={InputRow} disabled={!editable} type="password" label="Contraseña" name="password" />
            <Field component={InputRow} disabled={!editable} type="password" label="Confirmar contraseña" name="confirmPassword" />
            <Field component={InputRow} disabled={!editable} type="text" label="Nombre" name="firstName" />
            <Field component={InputRow} disabled={!editable} type="text" label="Apellidos" name="lastName" />
            <Field component={InputRow} disabled={!editable} type="text" label="Direccion" name="address" />
            <Field component={InputRow} disabled={!editable} type="number" label="Telefono" name="phone" />

          {this.props.canEditPermissions &&
            <div className="form-group">
              <div className="checkbox col-md-offset-2 col-md-2">
                <label className="control-label">
                  <Field type="checkbox" id="access" name="access" component="input" disabled={!editable} />Acceso usuario
                </label>
              </div>
              <div className="checkbox col-md-2">
                <label className="control-label">
                  <Field type="checkbox" id="admin" name="admin" disabled={!editable} component="input" />Administrador
                </label>
              </div>
            </div>
            }


            <div className="form-group">
              {saveCancel}
              { this.props.canEditPermissions && this.renderRemoveButton()}
            </div>

          </form>
        </div>
      </div>
    )
  }

  handleCancel() {
    browserHistory.push("/researchers")
  }

  onSubmit(res) {
    let id = 0
    let resId = 0
    let usId = 0
    if (this.props.params.key) {
      id = parseInt(this.props.params.key)
      resId = id
      usId = id
    }
    if (res.admin === "") res.admin = false
    if (res.access === "") res.access = false
    var password = !res.password ? null : res.password

    var toSend = Object.assign({}, res, {id, usId, resId, password})
    if (toSend.id === 1 && (!toSend.admin || !toSend.access)) {
      alert("No está permitido modificar los permisos del investigador inicial.")
      return
    }

    if (id > 0) {
      this.props.updateResearcher(toSend)

    } else {
      this.props.addResearcher(toSend)
    }
  }

  handleRemove() {
    if (this.props.params.key == 1){
      alert("No está permitido eliminar al investigador base ni cambiarle los permisos.")
      return
    }
    this.props.deleteResearcher(this.props.researcher)
  }
}

ResearcherDetail.propTypes = {
  researcher: PropTypes.object,
  params: PropTypes.object,

  isFetching: PropTypes.bool,
  editable: PropTypes.bool,
  canEditPermissions: PropTypes.bool,

  fetchResearcherById: PropTypes.func,
  addResearcher: PropTypes.func,
  updateResearcher: PropTypes.func,
  deleteResearcher: PropTypes.func,
  deletedResearcher: PropTypes.object,
  handleSubmit: PropTypes.func,
  activeResearcher: PropTypes.number,
  dispatch: PropTypes.func,
  initialize: PropTypes.func,
  success: PropTypes.string,
  errorHappened: PropTypes.string
}

let mapStateToProps = store => {
  return {
    // Variables de control
    editable: store.sessionState.user.admin || store.researcherState.activeResearcher === store.sessionState.user.userId,
    isFetching: store.researcherState.isFetching,
    success: store.researcherState.success,
    errorHappened: store.researcherState.error,
    canEditPermissions: store.sessionState.user.admin,

    // Data
    activeResearcher: store.researcherState.activeResearcher,
    researcher: store.researcherState.activeResearcher === 0 ? {} : store.researcherState.researchers.find(r => {
      return r.id === store.researcherState.activeResearcher
    }),
    deletedResearcher: store.researcherState.deletedResearcher
  }
}

let mapDispatchToProps = (dispatch) => {
  return {
    fetchResearcherById: (id) => {
      dispatch(fetchResearcherById(id))
    },
    addResearcher: (res) => {
      dispatch(addResearcher(res))
    },
    updateResearcher: (res) => {
      dispatch(updateResearcher(res))
    },
    deleteResearcher: (res) => {
      dispatch(deleteResearcher(res))
    }
  }
}

// Decorate the form component
var form = reduxForm({
  form: "researcher",
  validate
})

export default connect(mapStateToProps, mapDispatchToProps)(form(ResearcherDetail))
