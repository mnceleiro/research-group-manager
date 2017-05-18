import React, { Component } from "react"
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

    if (this.props.congresses.length > 0) {
      return (
        <div className="project-table">
          {this.renderFlashMessage()}
          <br />
          <div className="panel-right">
            <Link to="/projects/new"><button className="btn rgm-btn-primary rgm-btn-lg">Nuevo congreso</button></Link>
          </div>
          <RGMDefaultTable headers={headers} fields={fields} data={this.props.congresses} editable={editable} onEdit={this.props.onCongressEdit} />
        </div>
      )
    } else {
      return <div></div>
    }
  }
}

CongressTable.propTypes = {
  congresses: React.PropTypes.array,
  dispatch: React.PropTypes.func,
  onCongressEdit: React.PropTypes.func,
  getAllCongresses: React.PropTypes.func,

  location: React.PropTypes.object,
  table: React.PropTypes.object
}

let mapStateToProps = store => {
  return {
    congresses: store.congressState.congresses,
    table: store.congressState.table
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
