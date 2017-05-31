import React, { Component } from "react"
import PropTypes from "prop-types"
import { Link } from "react-router"
import { connect } from "react-redux"

import RGMDefaultTable from "../app_generic/RGMDefaultTable"

import FlashMessage from "../html_extended/FlashMessage"
import { LoadingModal } from "../html_extended/modals/Modal"

import { fetchBooks, createBook, editBook } from "../../actions/book-actions"


class BookTable extends Component {
  componentWillMount() {
    this.props.getAllBooks()
  }

  renderFlashMessage() {
    let alert = this.props.location.query.success

    if (alert) {
      let flashMessage = {
        className: "alert-success",
        message: alert
      }

      return (
        <div>
          <FlashMessage flashMessage={flashMessage} />
        </div>
      )
    }
  }

  render() {
    let { headers, fields, editable } = this.props.table

    if (!this.props.isFetching) {
      return (
        <div className="project-table">
          {this.renderFlashMessage()}
          <br />
          { this.props.creatable &&
            <div className="panel-right">
              <Link to="/books/new"><button className="btn rgm-btn-primary rgm-btn-lg">Nuevo libro</button></Link>
            </div>
          }
          <RGMDefaultTable headers={headers} fields={fields} data={this.props.books} editable={editable} onEdit={this.props.onBookEdit} editLink="books/edit/" />
        </div>
      )
    } else {
      return <LoadingModal isOpen={this.props.isFetching} />
    }
  }
}

BookTable.propTypes = {
  books: PropTypes.array,
  dispatch: PropTypes.func,
  onBookEdit: PropTypes.func,
  getAllBooks: PropTypes.func,

  location: PropTypes.object,
  table: PropTypes.object,

  isFetching: PropTypes.bool,
  creatable: PropTypes.bool
}

let mapStateToProps = store => {
  return {
    books: store.bookState.objects,
    table: store.bookState.table,
    isFetching: store.bookState.isFetching,
    creatable: store.sessionState.user.admin
  }
}

let mapDispatchToProps = dispatch => {
  return {
    getAllBooks: () => {
      dispatch(fetchBooks())
    },
    createBook: () => {
      dispatch(createBook())
    },
    onBookEdit: (id) => {
      dispatch(editBook(id))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BookTable)
