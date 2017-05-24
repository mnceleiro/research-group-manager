import React from "react"
import { Link } from "react-router"
import { connect } from "react-redux"

import RGMDefaultTable from "../app_generic/RGMDefaultTable"

// import ProjectList from "./ProjectList"
import FlashMessage from "../html_extended/FlashMessage"
import { fetchProjects, createProject, editProject } from "../../actions/project-actions"

class ProjectTable extends React.Component {
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
    // let headers = ["Código", "Título", "Fecha de Inicio", "Fecha de fin", "Presupuesto", "Investigadores"]
    // let fields = ["code", "title", "startDate", "endDate", "budget", "researcherCount"]
    // let editable = true
    // let data = this.props.projects
    let { headers, fields, editable } = this.props.table

    if (!this.props.isFetching) {
      // return (
      //   <div className="project-table">
      //     {this.renderFlashMessage()}
      //     <br />
      //     <div className="panel-right">
      //       <Link to="/projects/new"><button className="btn rgm-btn-primary rgm-btn-lg">Nuevo Proyecto</button></Link>
      //     </div>
      //     <div className="table-responsive">
      //       <ProjectList list={this.props.projects} onProjectEdit={this.props.onProjectEdit} />
      //     </div>
      //   </div>
      // )

      return (
        <div className="project-table">
          {this.renderFlashMessage()}
          <br />
          <div className="panel-right">
            <Link to="/projects/new"><button className="btn rgm-btn-primary rgm-btn-lg">Nuevo Proyecto</button></Link>
          </div>
          <RGMDefaultTable headers={headers} fields={fields} data={this.props.projects} editable={editable} onEdit={this.props.onProjectEdit} editLink="/projects/edit/" />
        </div>
      )
    } else {
      return <div></div>
    }
  }
}

ProjectTable.propTypes = {
  projects: React.PropTypes.array,
  dispatch: React.PropTypes.func,
  onProjectEdit: React.PropTypes.func,
  getAllProjects: React.PropTypes.func,

  location: React.PropTypes.object,
  table: React.PropTypes.object,
  isFetching: React.PropTypes.bool
}

let mapStateToProps = store => {
  return {
    projects: store.projectState.projects,
    table: store.projectState.table,
    isFetching: store.projectState.isFetching
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
