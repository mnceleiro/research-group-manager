import React, { Component } from "react"
import PropTypes from "prop-types"
import { Link } from "react-router"
import { connect } from "react-redux"

import RGMDefaultTable from "../app_generic/RGMDefaultTable"

import FlashMessage from "../html_extended/FlashMessage"
import { fetchCongresses, createCongress, editCongress } from "../../actions/congress-actions"


class CongressTable extends Component {
  componentWillMount() {
    this.props.getAllCongresses()
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
            <Link to="/congresses/new"><button className="btn rgm-btn-primary rgm-btn-lg">Nuevo congreso</button></Link>
          </div>
          <RGMDefaultTable headers={headers} fields={fields} data={this.props.congresses} editable={editable} onEdit={this.props.onCongressEdit} editLink="congresses/edit/" />
        </div>
      )
    } else {
      return <div></div>
    }
  }
}

CongressTable.propTypes = {
  congresses: PropTypes.array,
  dispatch: PropTypes.func,
  onCongressEdit: PropTypes.func,
  getAllCongresses: PropTypes.func,

  location: PropTypes.object,
  table: PropTypes.object,

  isFetching: PropTypes.bool
}

let mapStateToProps = store => {
  return {
    congresses: store.congressState.congresses,
    table: store.congressState.table,
    isFetching: store.congressState.isFetching
  }
}

let mapDispatchToProps = dispatch => {
  return {
    getAllCongresses: () => {
      dispatch(fetchCongresses())
    },
    createCongress: () => {
      dispatch(createCongress())
    },
    onCongressEdit: (id) => {
      dispatch(editCongress(id))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CongressTable)
