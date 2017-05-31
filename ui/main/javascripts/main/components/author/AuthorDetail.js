import React, { Component } from "react"
import PropTypes from "prop-types"
import { browserHistory } from "react-router"
import { connect } from "react-redux"
import { Field, reduxForm } from "redux-form"

import { fetchAuthors, fetchAuthorById, addAuthor, updateAuthor, deleteAuthor } from "../../actions/author-actions"
import { fetchResearchers } from "../../actions/researcher-actions"

import { InputRow } from "../html_extended/InputRow"
import { RGMDefaultSelect } from "../html_extended/Select"
import { validate } from "./AuthorValidation"

import { LoadingModal } from "../html_extended/modals/Modal"

class AuthorDetail extends Component {

  handleInitialize(author) {
    if (this.isUpdate() && author.id) {
      const initData = {
        "email": author.email,
        "signature": author.signature
      }

      if (author.researcher) {
        initData.firstName= author.researcher.firstName,
        initData.lastName= author.researcher.lastName,
        initData.phone= author.researcher.phone,
        initData.address= author.researcher.address,
        initData.access= author.researcher.access,
        initData.admin= author.researcher.admin
      }

      this.props.initialize(initData)
    }
  }

  isUpdate() {
    return this.props.params.key && parseInt(this.props.params.key) > 0
  }

  constructor(props) {
    super(props)

    this.onSubmit = this.onSubmit.bind(this)
    this.handleRemove = this.handleRemove.bind(this)
    this.handleInitialize = this.handleInitialize.bind(this)

    this.state = {
      selectedResearcher: null,
    }
  }

  componentWillMount() {
    this.props.fetchResearchers()
    this.props.fetchAuthors()

    if (this.isUpdate()) {
      this.props.fetchAuthorById(this.props.params.key)
    }
  }

  componentWillUpdate(nextProps) {
    if (nextProps.deletedAuthor) {
      browserHistory.push("/authors")
    }

    if (nextProps.success) {
      browserHistory.push(`/authors?success=${nextProps.success}`)
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errorHappened) alert(nextProps.errorHappened)

    if (nextProps.success) {
      browserHistory.push(`/authors?success=${nextProps.success}`)
    }

    // Datos
    if (this.isUpdate() && nextProps.author && !this.props.author.id) {
      this.setState({
        ...this.state,
        selectedResearcher: nextProps.author.researcher && nextProps.author.researcher.id,
        email: nextProps.author.email,
        signature: nextProps.author.signature
      })
      this.handleInitialize(nextProps.author)
    }
  }

  renderRemoveButton() {
    if (this.isUpdate()) {
      return (
        <div className="col-md-2">
          <input type="button" id="btnRemoveAuthor" className="btn rgm-btn-default rgm-btn-lg" value="Eliminar autor" onClick={this.handleRemove} />
        </div>
      )
    } else return ""
  }

  onResearcherSelected(v) {
    this.setState({
      ...this.state,
      selectedResearcher: v.value
    })

    const res = this.props.selectableResearchers.find(r => r.id === v.value)
    if (res) {
      const initData = {}

      initData.firstName = res.firstName
      initData.lastName = res.lastName
      initData.phone = res.phone
      initData.address = res.address
      initData.access = res.access
      initData.admin = res.admin
      initData.email = this.state.email
      initData.signature = this.state.signature

      this.props.initialize(initData)
    }
  }

  onChange(x, value) {
    const obj = {}
    obj[x.target.id] = value
    this.setState({
      ...this.state,
      ...obj
    })
  }

  render() {
    const { handleSubmit, isFetching, editable } = this.props

    if (isFetching) {
      return <LoadingModal isOpen={this.props.isFetching} />
    }

    const selectableResearchers = this.props.selectableResearchers.map(r => {
      return {"id": r.resId, "description": `${r.firstName} ${r.lastName}`}
    })

    const resValue = selectableResearchers.find(r => r.id === this.state.selectedResearcher) || null
    let divClass = ""
    if (!resValue) divClass = "hide"

    var saveCancel = <div className="col-md-offset-2 col-md-7">
                       <input type="submit" className="btn rgm-btn-primary rgm-btn-lg" value="Guardar autor" />
                       <input type="button" className="btn rgm-btn-default rgm-btn-lg" value="Cancelar" onClick={this.handleCancel} />
                     </div>

    return (
      <div className="author-form">
        <legend>
          Datos de autor
        </legend>
        <div className="row">
          <form className="form-horizontal" onSubmit={handleSubmit(this.onSubmit)}>
            <Field onChange={this.onChange.bind(this)} component={InputRow} type="email" label="Email" name="email" id="email" disabled={!editable} />
            <Field onChange={this.onChange.bind(this)} component={InputRow} type="text" label="signature" name="signature" id="signature" disabled={!editable} />
            <Field component={RGMDefaultSelect}
              onChange={this.onResearcherSelected.bind(this)}
              dataSelected={resValue}
              selectableData={selectableResearchers}
              disabled={!editable}
              label="Investigador asociado"
              name="researcherDesc"
              type="select"
              clearable={true}
             />

           <div className="space-bottom-medium"></div>

           <div className={divClass}>
             <legend className="space-left-small">
               Datos de investigador
             </legend>
             <Field component={InputRow} type="text" label="Nombre" name="firstName" disabled="true" />
             <Field component={InputRow} type="text" label="Apellidos" name="lastName" disabled="true" />
             <Field component={InputRow} type="text" label="Direccion" name="address" disabled="true" />
             <Field component={InputRow} type="text" label="Telefono" name="phone" disabled="true" />

             <div className="space-bottom-medium"></div>
           </div>

           { editable &&
             <div className="form-group">
              {saveCancel}
              {this.renderRemoveButton()}
            </div>
          }
          </form>
        </div>
      </div>
    )
  }

  handleCancel() {
    browserHistory.push("/authors")
  }

  onSubmit(au) {
    if (this.isUpdate()) {
      const authorEmail = this.props.authors.filter(x => x.id != this.props.params.key).find(x => x.email.trim() === au.email.trim())
      if (authorEmail) {
        alert ("Ha introducido el email de otro autor.")
        return
      }
      let toSend = Object.assign({}, au, { id: parseInt(this.props.params.key), researcherId: this.state.selectedResearcher })
      this.props.updateAuthor(toSend)
    } else {

      const authorEmail = this.props.authors.find(a => a.email.trim() === au.email.trim())
      if (authorEmail) {
        alert ("El email introducido ya pertenece a otro autor.")
        return
      }

      let toSend = Object.assign({}, au, { id: 0, researcherId: this.state.selectedResearcher })
      this.props.addAuthor(toSend)
    }
  }

  handleRemove() {
    this.props.deleteAuthor(this.props.author)
  }
}

AuthorDetail.propTypes = {
  author: PropTypes.object,
  authors: PropTypes.array,
  selectableResearchers: PropTypes.array,
  params: PropTypes.object,

  fetchAuthorById: PropTypes.func,
  addAuthor: PropTypes.func,
  updateAuthor: PropTypes.func,
  deleteAuthor: PropTypes.func,
  deletedAuthor: PropTypes.object,

  isFetching: PropTypes.bool,
  editable: PropTypes.bool,

  handleSubmit: PropTypes.func,
  dispatch: PropTypes.func,
  initialize: PropTypes.func,
  success: PropTypes.string,
  errorHappened: PropTypes.string,

  fetchResearchers: PropTypes.func,
  fetchAuthors: PropTypes.func
}

let mapStateToProps = store => {
  return {
    editable: store.sessionState.user.admin || (store.authorState.activeAuthor.researcher ? store.authorState.activeAuthor.researcher.id === store.sessionState.user.userId : false),

    selectableResearchers: store.researcherState.researchers.filter(r => {
      const found = store.authorState.authors.find(a => r.id === a.researcherId)
      if (found) return false
      else return true
    }),
    author: store.authorState.activeAuthor,
    researchers: store.researcherState.researchers,
    authors: store.authorState.authors,
    isFetching: store.researcherState.isFetching || store.authorState.isFetching,

    success: store.authorState.success,
    errorHappened: store.authorState.error,
    deletedAuthor: store.authorState.deletedAuthor
  }
}

let mapDispatchToProps = (dispatch) => {
  return {
    fetchAuthorById: (id) => {
      dispatch(fetchAuthorById(id))
    },
    addAuthor: (au) => {
      dispatch(addAuthor(au))
    },
    updateAuthor: (au) => {
      dispatch(updateAuthor(au))
    },
    deleteAuthor: (au) => {
      dispatch(deleteAuthor(au))
    },
    fetchResearchers: () => dispatch(fetchResearchers()),
    fetchAuthors: () => dispatch(fetchAuthors())
  }
}

// Decorate the form component
var form = reduxForm({
  form: "author",
  validate
})

export default connect(mapStateToProps, mapDispatchToProps)(form(AuthorDetail))
