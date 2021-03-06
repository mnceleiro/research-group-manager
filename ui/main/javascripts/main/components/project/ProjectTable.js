import React, { Component } from "react"
import PropTypes from "prop-types"
import { Link } from "react-router"
import { connect } from "react-redux"

import RGMDefaultTable from "../app_generic/RGMDefaultTable"

import { LoadingModal } from "../html_extended/modals/Modal"
import FlashMessage from "../html_extended/FlashMessage"
import { fetchProjects, createProject, editProject } from "../../actions/project-actions"

class ProjectTable extends Component {
  componentDidMount() {
    this.props.getAllProjects()
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
              <Link to="/projects/new"><button className="btn rgm-btn-primary rgm-btn-lg">Nuevo Proyecto</button></Link>
            </div>
          }
          <RGMDefaultTable headers={headers} fields={fields} data={this.props.projects} editable={editable} onEdit={this.props.onProjectEdit} editLink="/projects/edit/" />
        </div>
      )
    } else {
      return <LoadingModal isOpen={this.props.isFetching} />
    }
  }
}

ProjectTable.propTypes = {
  projects: PropTypes.array,
  dispatch: PropTypes.func,
  onProjectEdit: PropTypes.func,
  getAllProjects: PropTypes.func,

  location: PropTypes.object,
  table: PropTypes.object,
  isFetching: PropTypes.bool,
  creatable: PropTypes.bool
}

let mapStateToProps = store => {
  return {
    projects: store.projectState.projects,
    table: store.projectState.table,
    isFetching: store.projectState.isFetching,
    creatable: store.sessionState.user.admin
  }
}

let mapDispatchToProps = dispatch => {
  return {
    getAllProjects: () => {
      dispatch(fetchProjects())
    },
    createProject: () => {
      dispatch(createProject())
    },
    onProjectEdit: (id) => {
      dispatch(editProject(id))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectTable)
