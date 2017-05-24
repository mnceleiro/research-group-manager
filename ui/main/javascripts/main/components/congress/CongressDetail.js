import React, { Component, PropTypes } from "react"
import { browserHistory } from "react-router"
import { connect } from "react-redux"
import { Field, reduxForm } from "redux-form"

import { InputRow } from "../html_extended/InputRow"
import { CheckBox } from "../html_extended/CheckBox"
import { RGMDefaultDatePicker } from "../html_extended/DatePicker"
import { FormButtons } from "../html_extended/FormButtons"
// import RGMInlineTable from "../app_generic/RGMInlineTable"
import RGMAuthorsTable from "../app_generic/RGMAuthorsTable"
import { validate } from "./CongressValidation"

// Operaciones asíncronas
import { fetchCongressById, addCongress, updateCongress, deleteCongress } from "../../actions/congress-actions"
import { fetchAuthors } from "../../actions/author-actions"
import { fetchResearchers } from "../../actions/researcher-actions"


class CongressDetail extends Component {
  constructor(props) {
    super(props)

    this.handleInitialize = this.handleInitialize.bind(this)
    this.handleDelete = this.handleDelete.bind(this)
    this.onSubmit = this.onSubmit.bind(this)

    this.onDeleteRow = this.onDeleteRow.bind(this)

    this.state = {
      authors: [],
      selectedAuthor: null
    }
  }

  componentWillMount() {
    // Obtengo el congreso actual con su lista de autores
    if (this.isUpdate()) this.props.fetchCongressById(this.props.params.key)

    // Obtengo la lista de autores e investigadores
    this.props.fetchAuthors()
    this.props.fetchResearchers()

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
        authors: nextProps.congress.authors || []
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
        "start": congress.start,
        "end": congress.end,
        "international": congress.international
      }

      this.props.initialize(initData)
    }
  }

  onSubmit(congress) {

    if (this.isUpdate()) {
      let toSend = Object.assign({}, congress, { id: this.props.params.key, authors: this.state.authors })
      this.props.updateCongress(toSend)
    } else {
      let toSend = Object.assign({}, congress, { id: 0, authors: this.state.authors })
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
      authors: this.state.authors.filter((o,i) => index !== i)
    })
  }

  render() {
    const { handleSubmit, isFetching } = this.props

    const headers = ["Email", "Autor", "Investigador asociado"]
    const fields = ["email", "signature", "researcherEmail"]

    if (isFetching) {
      return (
        <div>Cargando...</div>
      )
    } else {
      return (
        <div className="congress-form">
          <legend>
            Datos del congreso
          </legend>
          <div className="row">
            <form className="form-horizontal" onSubmit={handleSubmit(this.onSubmit)}>
              <Field component={InputRow} type="text" label="Título" name="title" />
              <Field component={InputRow} type="text" label="Nombre" name="name" />
              <Field component={InputRow} type="text" label="Lugar" name="place" />
              <Field component={InputRow} type="text" label="País" name="country" />
              <Field component={RGMDefaultDatePicker} type="text" label="Fecha de inicio" name="start" />
              <Field component={RGMDefaultDatePicker} type="text" label="Fecha de fin" name="end" />
              <div className="form-group">
                <CheckBox name="international" text="Internacional" />
              </div>

              <RGMAuthorsTable
                headers={headers}
                fields={fields}
                authors={this.props.authors}
                selectedAuthors={this.state.authors}
                selectedAuthor={this.state.selectedAuthor}
                onInsert={this.onAddRow.bind(this)}
                onInsertSelection={this.handleAuthorSelectionChange.bind(this)}
                onDelete={(i) => this.onDeleteRow(i)}
              />

              <FormButtons canDelete={this.isUpdate()} saveText="Guardar" cancelText="Cancelar" deleteText="Eliminar"
                cancelAction={this.handleCancel} deleteAction={this.handleDelete} offset="1" />
            </form>
          </div>
        </div>
      )
    }
  }
}

// { congress && this.state.authors &&
//   <div className="row">
//     <div className="col-xs-12 col-md-offset-1 col-md-10">
//       <RGMInlineTable headers={headers} fields={fields} data={this.state.authors} editable={false} removable={true} onDelete={(i) => this.onDeleteRow(i)} />
//     </div>
//   </div>
// }

CongressDetail.propTypes = {
  // Datos
  congress: PropTypes.object,
  researchers: PropTypes.array,
  authors: PropTypes.array,

  // Variables de control
  isFetching: PropTypes.bool,
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

  // Acciones
  handleSubmit: PropTypes.func
}

var form = reduxForm({
  form: "congress",
  validate
})

let mapStateToProps = store => {
  return {
    // Datos
    authors: store.researcherState.researchers.length === 0 ? store.authorState.authors : store.authorState.authors.map(a => {
      if (a.researcherId) {
        const res = store.researcherState.researchers.find(r => r.id === a.researcherId)
        a.researcherEmail = res.email
      }
      return a
    }),
    researchers: store.researcherState.researchers,
    congress: store.congressState.activeCongress,

    // Variables de control
    isFetching: store.congressState.isFetching && store.authorState.isFetching,
    errorHeppened: store.congressState.error,
    success: store.congressState.success
  }
}

//fetchCongressById, addCongress, updateCongress, deleteCongress
let mapDispatchToProps = dispatch => {
  return {
    // Congresos
    fetchCongressById: id => dispatch(fetchCongressById(id)),
    addCongress: c => dispatch(addCongress(c)),
    updateCongress: c => dispatch(updateCongress(c)),
    deleteCongress: id => dispatch(deleteCongress(id)),

    // Otros
    fetchAuthors: () => dispatch(fetchAuthors()),
    fetchResearchers: () => dispatch(fetchResearchers())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(form(CongressDetail))
