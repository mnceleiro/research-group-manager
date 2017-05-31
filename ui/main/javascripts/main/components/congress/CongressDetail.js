import React, { Component } from "react"
import PropTypes from "prop-types"
import { browserHistory } from "react-router"
import { connect } from "react-redux"
import { Field, reduxForm } from "redux-form"

import { LoadingModal } from "../html_extended/modals/Modal"
import { InputRow } from "../html_extended/InputRow"
import { CheckBox } from "../html_extended/CheckBox"
import { RGMDefaultDatePicker } from "../html_extended/DatePicker"
import { FormButtons } from "../html_extended/FormButtons"
import { RGMDefaultSelect } from "../html_extended/Select"

import { validate } from "./CongressValidation"

import RGMAuthorsTable from "../app_generic/RGMAuthorsTable"

// Operaciones asíncronas
import { fetchCongressById, addCongress, updateCongress, deleteCongress } from "../../actions/congress-actions"
import { fetchAuthors } from "../../actions/author-actions"
import { fetchResearchers } from "../../actions/researcher-actions"

import { fetchCongressTypes } from "../../actions/congressType-actions"
import { fetchPublicationStates } from "../../actions/publicationState-actions"


class CongressDetail extends Component {
  constructor(props) {
    super(props)

    this.handleInitialize = this.handleInitialize.bind(this)
    this.handleDelete = this.handleDelete.bind(this)
    this.onSubmit = this.onSubmit.bind(this)

    this.onDeleteRow = this.onDeleteRow.bind(this)

    this.state = {
      authors: [],
      selectedAuthor: null,

      selectedState: 1,
      selectedType: 1
    }
  }

  componentWillMount() {
    // Obtengo el congreso actual con su lista de autores
    if (this.isUpdate()) this.props.fetchCongressById(this.props.params.key)

    // Obtengo la lista de autores e investigadores
    this.props.fetchAuthors()
    this.props.fetchResearchers()

    this.props.fetchCongressTypes()
    this.props.fetchPublicationStates()
  }

  componentWillReceiveProps(nextProps) {
    // Si se detecta error
    if (nextProps.errorHappened) alert(nextProps.errorHappened)

    // Operacion con exito
    if (nextProps.success) {
      browserHistory.push(`/congresses?success=${nextProps.success}`)
    }

    // Datos
    if (this.isUpdate() && nextProps.congress && !this.props.congress.id) {
      this.handleInitialize(nextProps.congress)

      this.setState({
        ...this.state,
        authors: nextProps.congress.authors || [],
        selectedState: nextProps.congress.statusId,
        selectedType: nextProps.congress.typeId
      })
    }
  }

  isUpdate() {
    if (this.props.params.key && parseInt(this.props.params.key) > 0) return true
    else return false
  }

  handleInitialize(congress) {
    if (this.isUpdate() && congress.id) {
      const initData = {
        "title": congress.title,
        "name": congress.name,
        "place": congress.place,
        "country": congress.country,
        "startDate": congress.startDate,
        "endDate": congress.endDate,
        "international": congress.international,
        "typeId": {},
        "statusId": {}
      }

      this.props.initialize(initData)
    }
  }

  onSubmit(congress) {
    if (congress.international === "") congress.international = false
    if (this.isUpdate()) {
      let toSend = Object.assign({}, congress, { id: parseInt(this.props.params.key), authors: this.state.authors, typeId: this.state.selectedType, statusId: this.state.selectedState })
      this.props.updateCongress(toSend)
    } else {
      let toSend = Object.assign({}, congress, { id: 0, authors: this.state.authors, typeId: this.state.selectedType, statusId: this.state.selectedState })
      this.props.addCongress(toSend)
    }
  }

  handleDelete() {
    this.props.deleteCongress(this.props.congress)
  }

  handleCancel() {
    browserHistory.push("/congresses")
  }

  handleAuthorSelectionChange(o) {
    let found = this.props.authors.find(x => x.id === o.value)

    if (found) {
      this.setState({
        ...this.state,
        selectedAuthor: { "label": found.email, "value": found.id }
      })
    }
  }

  onAddRow() {
    if (this.state.selectedAuthor) {
      let found = this.props.authors.find(x => x.id === this.state.selectedAuthor.value)
      if (found) {
        const authors = this.state.authors
        authors.push(found)

        this.setState({
          ...this.state,
          authors: authors,
          selectedAuthor: null
        })
      }
    }
  }

  onDeleteRow(index) {
    this.setState({
      ...this.state,
      authors: this.state.authors.filter((o,i) => index !== i)
    })
  }

  onStateChange(v) {
    this.setState({
      ...this.state,
      selectedState: v.value
    })
  }

  onTypeChange(v) {
    this.setState({
      ...this.state,
      selectedType: v.value
    })
  }

  render() {
    const { handleSubmit, isFetching, publicationStates, congressTypes, editable } = this.props

    const headers = ["Email", "Autor", "Investigador asociado"]
    const fields = ["email", "signature", "researcherEmail"]

    if ((isFetching || congressTypes.length == 0 || publicationStates.length == 0)
      || (this.isUpdate() && !this.props.congress.id)
    ) {
      return (
        <LoadingModal isOpen={isFetching} />
      )
    } else {
      let stateValue = publicationStates.find(x => x.id === this.state.selectedState) || publicationStates[0]
      let typeValue = congressTypes.find(x => x.id === this.state.selectedType) || congressTypes[0]
      let congress = this.props.congress
      if (congress.id) {
        congress.authors = congress.authors.map(x => {
          let res = this.props.researchers.find(r => r.id === x.researcherId)
          if (res) x.researcherEmail = res.email

          return x
        })
      }

      return (
        <div className="congress-form">
          <legend>
            Datos del congreso
          </legend>
          <div className="row">
            <form className="form-horizontal" onSubmit={handleSubmit(this.onSubmit)}>
              <Field component={InputRow} type="text" label="Título" name="title" disabled={!editable} />
              <Field component={InputRow} type="text" label="Nombre" name="name" disabled={!editable} />
              <Field component={InputRow} type="text" label="Lugar" name="place" disabled={!editable} />
              <Field component={InputRow} type="text" label="País" name="country" disabled={!editable} />
              <Field component={RGMDefaultDatePicker} type="text" label="Fecha de inicio" name="startDate" disabled={!editable} />
              <Field component={RGMDefaultDatePicker} type="text" label="Fecha de fin" name="endDate" disabled={!editable} />
              <Field component={RGMDefaultSelect} disabled={!editable} onChange={this.onStateChange.bind(this)} dataSelected={stateValue} selectableData={publicationStates} type="select" label="Estado" name="status" />
              <Field component={RGMDefaultSelect} disabled={!editable} onChange={this.onTypeChange.bind(this)} dataSelected={typeValue} selectableData={congressTypes} type="select" label="Tipo" name="type" />
              <div className="form-group">
                <CheckBox name="international" disabled={!editable} text="Internacional" />
              </div>

              <RGMAuthorsTable
                headers={headers}
                fields={fields}
                authors={this.props.authors}

                insertable={editable}
                removable={editable}

                selectedAuthors={this.state.authors}
                selectedAuthor={this.state.selectedAuthor}

                onInsert={this.onAddRow.bind(this)}
                onInsertSelection={this.handleAuthorSelectionChange.bind(this)}
                onDelete={(i) => this.onDeleteRow(i)}
              />

              { editable &&
                <FormButtons canDelete={this.isUpdate()} saveText="Guardar" cancelText="Cancelar" deleteText="Eliminar"
                  cancelAction={this.handleCancel} deleteAction={this.handleDelete} offset="1" />
              }
            </form>
          </div>
        </div>
      )
    }
  }
}

CongressDetail.propTypes = {
  // Datos
  congress: PropTypes.object,
  authors: PropTypes.array,
  researchers: PropTypes.array,
  publicationStates: PropTypes.array,
  congressTypes: PropTypes.array,

  // Variables de control
  isFetching: PropTypes.bool,
  editable: PropTypes.bool,
  errorHappened: PropTypes.string,
  success: PropTypes.string,

  // Funcionalidades
  params: PropTypes.object,
  dispatch: PropTypes.func,
  initialize: PropTypes.func,

  // AJAX
  fetchCongressById: PropTypes.func,
  addCongress: PropTypes.func,
  updateCongress: PropTypes.func,
  deleteCongress: PropTypes.func,

  fetchAuthors: PropTypes.func,
  fetchResearchers: PropTypes.func,

  fetchCongressTypes: PropTypes.func,
  fetchPublicationStates: PropTypes.func,

  // Acciones
  handleSubmit: PropTypes.func
}

var form = reduxForm({
  form: "congress",
  validate
})

let mapStateToProps = store => {
  return {
    editable: store.sessionState.user.admin ||
      (store.congressState.activeCongress.id ? store.congressState.activeCongress.authors.find(a => a.researcherId === store.sessionState.user.userId) && true : false),

    // Datos
    congress: store.congressState.activeCongress,
    authors: store.researcherState.researchers.length === 0 ? store.authorState.authors : store.authorState.authors.map(a => {
      if (a.researcherId) {
        const res = store.researcherState.researchers.find(r => r.id === a.researcherId)
        a.researcherEmail = res.email
      }
      return a
    }),

    researchers: store.researcherState.researchers,
    publicationStates: store.publicationStateState.publicationStates,
    congressTypes: store.congressTypeState.congressTypes,

    // Variables de control
    isFetching: store.congressState.isFetching || store.authorState.isFetching || store.publicationStateState.isFetching || store.congressTypeState.isFetching,
    errorHappened: store.congressState.error,
    success: store.congressState.success
  }
}

let mapDispatchToProps = dispatch => {
  return {
    // Congresos
    fetchCongressById: id => dispatch(fetchCongressById(id)),
    addCongress: c => dispatch(addCongress(c)),
    updateCongress: c => dispatch(updateCongress(c)),
    deleteCongress: id => dispatch(deleteCongress(id)),

    // Otros
    fetchAuthors: () => dispatch(fetchAuthors()),
    fetchResearchers: () => dispatch(fetchResearchers()),

    fetchCongressTypes: () => dispatch(fetchCongressTypes()),
    fetchPublicationStates: () => dispatch(fetchPublicationStates())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(form(CongressDetail))
