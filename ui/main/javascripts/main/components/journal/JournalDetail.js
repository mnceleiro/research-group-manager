import React, { Component } from "react"
import PropTypes from "prop-types"
import { browserHistory } from "react-router"
import { connect } from "react-redux"
import { Field, reduxForm } from "redux-form"

import { InlineInputRow } from "../html_extended/InputRow"
import { FormButtons } from "../html_extended/FormButtons"
import { RGMDefaultSelect } from "../html_extended/Select"
import { LoadingModal } from "../html_extended/modals/Modal"
import { RGMDefaultDatePicker } from "../html_extended/DatePicker"
import RGMAuthorsTable from "../app_generic/RGMAuthorsTable"

import { validate } from "./JournalValidation"

// Operaciones asíncronas
import { fetchJournalById, addJournal, updateJournal, deleteJournal } from "../../actions/journal-actions"
import { fetchAuthors } from "../../actions/author-actions"
import { fetchResearchers } from "../../actions/researcher-actions"
import { fetchPublicationStates } from "../../actions/publicationState-actions"


class JournalDetail extends Component {
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
    }

    this.rendered = false
  }

  componentWillMount() {
    if (this.isUpdate()) this.props.fetchJournalById(this.props.params.key)

    this.props.fetchAuthors()
    this.props.fetchResearchers()

    this.props.fetchPublicationStates()
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errorHappened) alert(nextProps.errorHappened)
    if (nextProps.success) {
      browserHistory.push(`/journals?success=${nextProps.success}`)
    }

    // Datos
    if (this.isUpdate() && nextProps.journal && !this.props.journal.id) {
      this.handleInitialize(nextProps.journal)
      this.setState({
        ...this.state,
        authors: nextProps.journal.authors || [],
        selectedState: nextProps.journal.statusId,
      })
    }
  }

  isUpdate() {
    return this.props.params.key && parseInt(this.props.params.key) > 0
  }

  handleInitialize(j) {
    if (this.isUpdate() && j.id) {
      const initData = {
        "code": j.code,
        "title": j.title,
        "journal": j.journal,
        "volume": j.volume,
        "startPage": j.startPage,
        "endPage": j.endPage,
        "date": j.date,
        "editorial": j.editorial,
        "place": j.place,
        "issn": j.issn,
        "statusId": {}
      }

      this.props.initialize(initData)
    }
  }

  onSubmit(journal) {
    if (this.isUpdate()) {
      let toSend = Object.assign({}, journal, { id: parseInt(this.props.params.key), authors: this.state.authors, statusId: this.state.selectedState })
      this.props.updateJournal(toSend)
    } else {
      let toSend = Object.assign({}, journal, { id: 0, authors: this.state.authors, statusId: this.state.selectedState })
      this.props.addJournal(toSend)
    }
  }

  handleDelete() {
    this.props.deleteJournal(this.props.journal)
  }

  handleCancel() {
    browserHistory.push("/journals")
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

  render() {
    const { handleSubmit, isFetching, publicationStates, editable } = this.props

    const headers = ["Email", "Autor", "Investigador asociado"]
    const fields = ["email", "signature", "researcherEmail"]

    if (!this.rendered && (isFetching || publicationStates.length == 0)) {
      return (
        <LoadingModal isOpen={this.props.isFetching} />
      )
    } else {
      this.rendered = true
      const stateValue = publicationStates.find(x => x.id === this.state.selectedState) || publicationStates[0]

      let journal = this.props.journal
      if (journal.id) {
        journal.authors = journal.authors.map(x => {
          let res = this.props.researchers.find(r => r.id === x.researcherId)
          if (res) x.researcherEmail = res.email

          return x
        })
      }

      return (
        <div className="journal-form">
          <legend>
            Datos de la publicación (Revista)
          </legend>
          <div className="row">
            <form className="form-horizontal" onSubmit={handleSubmit(this.onSubmit)}>
              <div className="form-group space-bottom-small">
                <Field component={InlineInputRow} labelWidth="1" inputWidth="4" type="text" label="Código" name="code" disabled={!editable} />
                <Field component={InlineInputRow} labelWidth="1" inputWidth="5" type="text" label="Título" name="title" disabled={!editable} />
              </div>
              <div className="form-group space-bottom-small">
                <Field component={InlineInputRow} labelWidth="1" inputWidth="4" type="text" label="Revista" name="journal" disabled={!editable} />
                <Field component={InlineInputRow} labelWidth="1" inputWidth="2" type="number" label="Página de inicio" name="startPage" disabled={!editable} />
                <Field component={InlineInputRow} labelWidth="1" inputWidth="2" type="number" label="Página de fin" name="endPage" disabled={!editable} />
              </div>
              <div className="form-group space-bottom-small">
                <Field component={InlineInputRow} labelWidth="1" inputWidth="2" type="text" label="Volumen" name="volume" disabled={!editable} />
                <Field component={RGMDefaultDatePicker} formGroup={false} labelWidth="1" inputWidth="2" type="text" label="Fecha" name="date" disabled={!editable} />
                <Field component={InlineInputRow} labelWidth="1" inputWidth="4" type="text" label="Editorial" name="editorial" disabled={!editable} />
              </div>
              <div className="form-group space-bottom-small">
                <Field component={InlineInputRow} labelWidth="1" inputWidth="2"  type="text" label="Lugar" name="place" disabled={!editable} />
                <Field component={InlineInputRow} labelWidth="1" inputWidth="3"  type="text" label="issn" name="issn" disabled={!editable} />
                <Field component={RGMDefaultSelect} formClass="" labelWidth="1" inputWidth="3" disabled={!editable} onChange={this.onStateChange.bind(this)} dataSelected={stateValue} selectableData={publicationStates} type="select" label="Estado" name="status" />
              </div>

              <RGMAuthorsTable
                headers={headers}
                fields={fields}
                insertable={editable}
                removable={editable}
                authors={this.props.authors}
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

JournalDetail.propTypes = {
  // Datos
  journal: PropTypes.object,
  authors: PropTypes.array,
  researchers: PropTypes.array,
  publicationStates: PropTypes.array,

  // Variables de control
  isFetching: PropTypes.bool,
  editable: PropTypes.bool,
  errorHappened: PropTypes.string,
  success: PropTypes.string,

  // Funcionalidades
  params: PropTypes.object,
  dispatch: PropTypes.func,
  initialize: PropTypes.func,

  // Acciones
  addJournal: PropTypes.func,
  updateJournal: PropTypes.func,
  deleteJournal: PropTypes.func,

  fetchJournalById: PropTypes.func,
  fetchAuthors: PropTypes.func,
  fetchResearchers: PropTypes.func,
  fetchJournalTypes: PropTypes.func,
  fetchPublicationStates: PropTypes.func,

  handleSubmit: PropTypes.func
}

var form = reduxForm({
  form: "journal",
  validate
})

let mapStateToProps = store => {
  return {
    // Datos
    journal: store.journalState.active,
    researchers: store.researcherState.researchers,
    publicationStates: store.publicationStateState.publicationStates,
    authors: store.researcherState.researchers.length === 0 ? store.authorState.authors : store.authorState.authors.map(a => {
      if (a.researcherId) {
        const res = store.researcherState.researchers.find(r => r.id === a.researcherId)
        a.researcherEmail = res.email
      }
      return a
    }),

    // Variables de control
    editable: store.sessionState.user.admin ||
      (store.journalState.active.id ? store.journalState.active.authors.find(a => a.researcherId === store.sessionState.user.userId) && true : false),
    isFetching: store.journalState.isFetching || store.authorState.isFetching || store.publicationStateState.isFetching,
    errorHappened: store.journalState.error,
    success: store.journalState.success
  }
}

let mapDispatchToProps = dispatch => {
  return {
    // Revistas
    fetchJournalById: id => dispatch(fetchJournalById(id)),
    addJournal: c => dispatch(addJournal(c)),
    updateJournal: c => dispatch(updateJournal(c)),
    deleteJournal: id => dispatch(deleteJournal(id)),

    // Otros
    fetchAuthors: () => dispatch(fetchAuthors()),
    fetchResearchers: () => dispatch(fetchResearchers()),
    fetchPublicationStates: () => dispatch(fetchPublicationStates())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(form(JournalDetail))
