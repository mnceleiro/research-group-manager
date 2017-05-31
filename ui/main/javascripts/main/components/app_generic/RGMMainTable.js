import React, { Component } from "react"
import PropTypes from "prop-types"
import { Link } from "react-router"

import FlashMessage from "../html_extended/FlashMessage"
import RGMDefaultTable from "../app_generic/RGMDefaultTable"

export default class RGMMainTable extends Component {
  componentDidMount() {
    this.props.getAll()
    if (this.props.getAllSecondary) this.props.getAllSecondary()
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
        <div className="rgm-table">
          {this.renderFlashMessage()}
          <br />
          {this.props.creatable &&
            <div className="panel-right">
              <Link to={"/" + this.props.entityTable + "/new"}><button className="btn rgm-btn-primary rgm-btn-lg">{"Nuevo " + this.props.entityString}</button></Link>
            </div>
          }
          <RGMDefaultTable headers={headers} fields={fields} data={this.props.objects} editable={editable} editText={this.props.editText} onEdit={this.props.onEditRow} editLink={this.props.entityTable + "/edit/"} />
        </div>
      )
    } else {
      return <div></div>
    }
  }
}

RGMMainTable.propTypes = {
  objects: PropTypes.array,
  dispatch: PropTypes.func,
  onEditRow: PropTypes.func,
  getAll: PropTypes.func,
  getAllSecondary: PropTypes.func,

  location: PropTypes.object,
  table: PropTypes.object,

  entityTable: PropTypes.string,
  entityString: PropTypes.string,
  editText: PropTypes.string,

  isFetching: PropTypes.bool,
  creatable: PropTypes.bool
}
