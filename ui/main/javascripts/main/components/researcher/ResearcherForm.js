import React from "react"
import { browserHistory } from "react-router"
import { connect } from "react-redux"
import { Field, reduxForm } from "redux-form"

import { fetchResearcherById, addResearcher, updateResearcher, deleteResearcher } from "../../actions/researcher-actions"
import { InputRow } from "../InputRow"
import { validate } from "./ResearcherValidation"

class ResearcherForm extends React.Component {

  handleInitialize(researcher) {
    if (this.props.params.key && parseInt(this.props.params.key) > 0 && researcher.id) {
      const initData = {
        "email": researcher.email,
        "firstName": researcher.firstName,
        "lastName": researcher.lastName,
        "signatureName": researcher.signatureName,
        "phone": researcher.phone,
        "address": researcher.address
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

    // this.handleChange = this.handleChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    // this.handleCancel = this.handleCancel.bind(this)
    this.handleRemove = this.handleRemove.bind(this)
    this.handleInitialize = this.handleInitialize.bind(this)
  }

  componentWillMount() {
    if (this.isUpdate()) {
      this.props.fetchResearcherById(this.props.params.key)
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
    if (this.props.activeResearcher === 0 && nextProps.activeResearcher > 0) {
      this.handleInitialize(nextProps.researcher)
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
    if (this.isUpdate() && !this.props.researcher.id) {
      return <div>Loading...</div>
    }

    const { handleSubmit } = this.props

    var saveCancel = <div className="col-xs-offset-3 col-xs-9 col-md-offset-2 col-md-7">
                       <input type="submit" className="btn rgm-btn-primary rgm-btn-lg" value="Guardar" />
                       <input type="button" className="btn rgm-btn-default rgm-btn-lg" value="Cancelar" onClick={this.handleCancel} />
                     </div>

    return (
      <div className="researcher-form">
        <legend>
          Datos personales
        </legend>
        <div className="row">
          <form className="form-horizontal" onSubmit={handleSubmit(this.onSubmit)}>
            <Field component={InputRow} type="email" label="Email" name="email" />
            <Field component={InputRow} type="password" label="Contraseña" name="password" />
            <Field component={InputRow} type="password" label="Confirmar contraseña" name="confirmPassword" />
            <Field component={InputRow} type="text" label="Nombre" name="firstName" />
            <Field component={InputRow} type="text" label="Apellidos" name="lastName" />
            <Field component={InputRow} type="text" label="Firma" name="signatureName" />
            <Field component={InputRow} type="text" label="Telefono" name="phone" />
            <Field component={InputRow} type="text" label="Direccion" name="address" />

            <div className="form-group">
              {saveCancel}
              {this.renderRemoveButton()}
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
    var id = !this.props.params.key ? 0 : this.props.params.key
    var password = !res.password ? null : res.password

    var toSend = Object.assign({}, res, {id, password})

    if (id > 0) {
      this.props.updateResearcher(toSend)
      
    } else {
      this.props.addResearcher(toSend)
    }
    // // Request
    // var url = null
    // if (this.props.params.key) url = "../../researchers/edit/" + this.props.params.key
    // else url = "../../researchers/add"
    //
    // var request = new Request(url, {
    //   headers: new Headers({
    //     "Content-Type": "application/json"
    //   })
    // })
    //
    // fetch(request, {
    //   method: "POST",
    //   body: JSON.stringify(this.state)
    //
    // }).then(response => {
    //   return response.text()
    // }).then(() => {
    //   browserHistory.push("/researchers")
    // })
  }

  handleRemove() {
    this.props.deleteResearcher(this.props.researcher)
  }
}

ResearcherForm.propTypes = {
  researcher: React.PropTypes.object,
  params: React.PropTypes.object,
  fetchResearcherById: React.PropTypes.func,
  addResearcher: React.PropTypes.func,
  updateResearcher: React.PropTypes.func,
  deleteResearcher: React.PropTypes.func,
  deletedResearcher: React.PropTypes.object,
  handleSubmit: React.PropTypes.func,
  activeResearcher: React.PropTypes.number,
  dispatch: React.PropTypes.func,
  initialize: React.PropTypes.func,
  success: React.PropTypes.string,
}

let mapStateToProps = store => {
  return {
    activeResearcher: store.researcherState.activeResearcher,
    researcher: store.researcherState.activeResearcher === 0 ? {} : store.researcherState.researchers.find(r => {
      return r.id === store.researcherState.activeResearcher
    }),
    success: store.researcherState.success,
    error: store.researcherState.error,
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

export default connect(mapStateToProps, mapDispatchToProps)(form(ResearcherForm))
