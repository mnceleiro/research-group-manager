import React, { Component } from "react"
import PropTypes from "prop-types"
import { Link } from "react-router"
import { connect } from "react-redux"

import RGMDefaultTable from "../app_generic/RGMDefaultTable"

import FlashMessage from "../html_extended/FlashMessage"
import { LoadingModal } from "../html_extended/modals/Modal"

import { fetchJournals, createJournal, editJournal } from "../../actions/journal-actions"


class JournalTable extends Component {
  componentWillMount() {
    this.props.getAllJournals()
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
              <Link to="/journals/new"><button className="btn rgm-btn-primary rgm-btn-lg">Nuevo revista</button></Link>
            </div>
          }
          <RGMDefaultTable headers={headers} fields={fields} data={this.props.journals} editable={editable} onEdit={this.props.onJournalEdit} editLink="journals/edit/" />
        </div>
      )
    } else {
      return <LoadingModal isOpen={this.props.isFetching} />
    }
  }
}

JournalTable.propTypes = {
  journals: PropTypes.array,
  dispatch: PropTypes.func,
  onJournalEdit: PropTypes.func,
  getAllJournals: PropTypes.func,

  location: PropTypes.object,
  table: PropTypes.object,

  isFetching: PropTypes.bool,
  creatable: PropTypes.bool
}

let mapStateToProps = store => {
  return {
    journals: store.journalState.objects,
    table: store.journalState.table,
    isFetching: store.journalState.isFetching,
    creatable: store.sessionState.user.admin
  }
}

let mapDispatchToProps = dispatch => {
  return {
    getAllJournals: () => {
      dispatch(fetchJournals())
    },
    createJournal: () => {
      dispatch(createJournal())
    },
    onJournalEdit: (id) => {
      dispatch(editJournal(id))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(JournalTable)
