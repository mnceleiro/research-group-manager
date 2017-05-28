import React, { Component, PropTypes } from "react"
import { browserHistory } from "react-router"
import { connect } from "react-redux"
import { Field, reduxForm } from "redux-form"

import { InlineInputRow } from "../html_extended/InputRow"
import { FormButtons } from "../html_extended/FormButtons"
import { RGMDefaultSelect } from "../html_extended/Select"

import { validate } from "./BookValidation"

import RGMAuthorsTable from "../app_generic/RGMAuthorsTable"

// Operaciones asíncronas
import { fetchBookById, addBook, updateBook, deleteBook } from "../../actions/book-actions"
import { fetchAuthors } from "../../actions/author-actions"
import { fetchResearchers } from "../../actions/researcher-actions"

import { fetchPublicationStates } from "../../actions/publicationState-actions"


class BookDetail extends Component {
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
  }

  componentWillMount() {
    // Obtengo el congreso actual con su lista de autores
    if (this.isUpdate()) this.props.fetchBookById(this.props.params.key)

    // Obtengo la lista de autores e investigadores
    this.props.fetchAuthors()
    this.props.fetchResearchers()

    this.props.fetchPublicationStates()
  }

  componentWillReceiveProps(nextProps) {
    // Si se detecta error
    if (nextProps.errorHappened) alert(nextProps.errorHappened)

    // Operacion con exito
    if (nextProps.success) {
      browserHistory.push(`/books?success=${nextProps.success}`)
    }

    // Datos
    if (this.isUpdate() && nextProps.book && !this.props.book.id) {
      this.handleInitialize(nextProps.book)
      this.setState({
        ...this.state,
        authors: nextProps.book.authors || [],
        selectedState: nextProps.book.statusId,
      })
    }
  }

  isUpdate() {
    return this.props.params.key && parseInt(this.props.params.key) > 0
  }

  handleInitialize(b) {
    if (this.isUpdate() && b.id) {
      const initData = {
        "code": b.code,
        "title": b.title,
        "book": b.book,
        "volume": b.volume,
        "startPage": b.startPage,
        "endPage": b.endPage,
        "year": b.year,
        "editorial": b.editorial,
        "place": b.place,
        "isbn": b.isbn,
        "statusId": {}
      }

      this.props.initialize(initData)
    }
  }

  onSubmit(book) {
    if (this.isUpdate()) {
      let toSend = Object.assign({}, book, { id: this.props.params.key, authors: this.state.authors, statusId: this.state.selectedState })
      this.props.updateBook(toSend)
    } else {
      let toSend = Object.assign({}, book, { id: 0, authors: this.state.authors, statusId: this.state.selectedState })
      this.props.addBook(toSend)
    }
  }

  handleDelete() {
    this.props.deleteBook(this.props.book)
  }

  handleCancel() {
    browserHistory.push("/books")
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
    const { handleSubmit, isFetching, publicationStates } = this.props

    const headers = ["Email", "Autor", "Investigador asociado"]
    const fields = ["email", "signature", "researcherEmail"]

    if (isFetching || publicationStates.length == 0) {
      return (
        <div>Cargando...</div>
      )
    } else {
      const stateValue = publicationStates.find(x => x.id === this.state.selectedState) || publicationStates[0]

      let book = this.props.book
      if (book.id) {
        book.authors = book.authors.map(x => {
          let res = this.props.researchers.find(r => r.id === x.researcherId)
          if (res) x.researcherEmail = res.email

          return x
        })
      }

      return (
        <div className="book-form">
          <legend>
            Datos de la publicación
          </legend>
          <div className="row">
            <form className="form-horizontal" onSubmit={handleSubmit(this.onSubmit)}>
              <div className="form-group space-bottom-small">
                <Field component={InlineInputRow} labelWidth="1" inputWidth="4" type="text" label="Código" name="code" />
                <Field component={InlineInputRow} labelWidth="1" inputWidth="5" type="text" label="Título" name="title" />
              </div>
              <div className="form-group space-bottom-small">
                <Field component={InlineInputRow} labelWidth="1" inputWidth="4" type="text" label="Libro" name="book" />
                <Field component={InlineInputRow} labelWidth="1" inputWidth="2" type="number" label="Página de inicio" name="startPage" />
                <Field component={InlineInputRow} labelWidth="1" inputWidth="2" type="number" label="Página de fin" name="endPage" />
              </div>
              <div className="form-group space-bottom-small">
                <Field component={InlineInputRow} labelWidth="1" inputWidth="2" type="text" label="Volumen" name="volume" />
                <Field component={InlineInputRow} labelWidth="1" inputWidth="1"  type="text" label="Año" name="year" />
                <Field component={InlineInputRow} labelWidth="1" inputWidth="5" type="text" label="Editorial" name="editorial" />
              </div>
              <div className="form-group space-bottom-small">
                <Field component={InlineInputRow} labelWidth="1" inputWidth="2"  type="text" label="Lugar" name="place" />
                <Field component={InlineInputRow} labelWidth="1" inputWidth="3"  type="text" label="ISBN" name="isbn" />
                <Field component={RGMDefaultSelect} formClass="" labelWidth="1" inputWidth="3" onChange={this.onStateChange.bind(this)} dataSelected={stateValue} selectableData={publicationStates} type="select" label="Estado" name="status" />
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

BookDetail.propTypes = {
  // Datos
  book: PropTypes.object,
  authors: PropTypes.array,
  researchers: PropTypes.array,
  publicationStates: PropTypes.array,

  // Variables de control
  isFetching: PropTypes.bool,
  errorHappened: PropTypes.string,
  success: PropTypes.string,

  // Funcionalidades
  params: PropTypes.object,
  dispatch: PropTypes.func,
  initialize: PropTypes.func,

  // AJAX
  fetchBookById: PropTypes.func,
  addBook: PropTypes.func,
  updateBook: PropTypes.func,
  deleteBook: PropTypes.func,

  fetchAuthors: PropTypes.func,
  fetchResearchers: PropTypes.func,

  fetchBookTypes: PropTypes.func,
  fetchPublicationStates: PropTypes.func,

  // Acciones
  handleSubmit: PropTypes.func
}

var form = reduxForm({
  form: "book",
  validate
})

let mapStateToProps = store => {
  return {
    // Datos
    book: store.bookState.active,
    authors: store.researcherState.researchers.length === 0 ? store.authorState.authors : store.authorState.authors.map(a => {
      if (a.researcherId) {
        const res = store.researcherState.researchers.find(r => r.id === a.researcherId)
        a.researcherEmail = res.email
      }
      return a
    }),

    researchers: store.researcherState.researchers,
    publicationStates: store.publicationStateState.publicationStates,

    // Variables de control
    isFetching: store.bookState.isFetching || store.authorState.isFetching || store.publicationStateState.isFetching,
    errorHappened: store.bookState.error,
    success: store.bookState.success
  }
}

let mapDispatchToProps = dispatch => {
  return {
    // Congresos
    fetchBookById: id => dispatch(fetchBookById(id)),
    addBook: c => dispatch(addBook(c)),
    updateBook: c => dispatch(updateBook(c)),
    deleteBook: id => dispatch(deleteBook(id)),

    // Otros
    fetchAuthors: () => dispatch(fetchAuthors()),
    fetchResearchers: () => dispatch(fetchResearchers()),

    fetchPublicationStates: () => dispatch(fetchPublicationStates())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(form(BookDetail))
