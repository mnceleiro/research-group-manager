import React, { Component } from "react"
import { Link } from "react-router"
import { connect } from "react-redux"

import RGMDefaultTable from "../app_generic/RGMDefaultTable"

import FlashMessage from "../html_extended/FlashMessage"
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
          <div className="panel-right">
            <Link to="/books/new"><button className="btn rgm-btn-primary rgm-btn-lg">Nuevo libro</button></Link>
          </div>
          <RGMDefaultTable headers={headers} fields={fields} data={this.props.books} editable={editable} onEdit={this.props.onBookEdit} editLink="books/edit/" />
        </div>
      )
    } else {
      return <div></div>
    }
  }
}

BookTable.propTypes = {
  books: React.PropTypes.array,
  dispatch: React.PropTypes.func,
  onBookEdit: React.PropTypes.func,
  getAllBooks: React.PropTypes.func,

  location: React.PropTypes.object,
  table: React.PropTypes.object,

  isFetching: React.PropTypes.bool
}

let mapStateToProps = store => {
  return {
    books: store.bookState.objects,
    table: store.bookState.table,
    isFetching: store.bookState.isFetching
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
