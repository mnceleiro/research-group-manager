import React from "react"
import { browserHistory } from "react-router"
import { connect } from "react-redux"
import { Field, reduxForm } from "redux-form"

import { fetchProjectById, addProject, updateProject, deleteProject } from "../../actions/project-actions"

import { InputRow } from "../html_extended/InputRow"
import { CheckBox } from "../html_extended/CheckBox"
import { FormButtons } from "../html_extended/FormButtons"

import { RGMDefaultDatePicker } from "../html_extended/DatePicker"
import { validate } from "./ProjectValidation"

class ProjectForm extends React.Component {
  constructor(props) {
    super(props)

    this.handleInitialize = this.handleInitialize.bind(this)
    this.handleRemove = this.handleRemove.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
  }

  handleInitialize(project) {
    if (this.props.params.key && parseInt(this.props.params.key) > 0 && project.id) {
      const initData = {
        "code": project.code,
        "title": project.title,
        "startDate": project.startDate,
        "endDate": project.endDate,
        "budget": project.budget,
        "public": project.public
      }

      this.props.initialize(initData)
    }
  }

  handleRemove() {
    this.props.deleteProject(this.props.project)
  }

  handleCancel() {
    browserHistory.push("/projects")
  }

  componentWillMount() {
    if (this.isUpdate()) {
      this.props.fetchProjectById(this.props.params.key)
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errorHappened) alert(nextProps.errorHappened)

    if (this.props.activeProject === 0 && nextProps.activeProject > 0) {
      this.handleInitialize(nextProps.project)
    }

    if (nextProps.success) {
      browserHistory.push(`/projects?success=${nextProps.success}`)
    }
  }

  isUpdate() {
    if (this.props.params.key) return true
    else return false
  }

  onSubmit(project) {
    if (this.isUpdate()) {
      var toSend = Object.assign({}, project, { id: this.props.params.key })
      this.props.updateProject(toSend)

    } else {
      let toSend = Object.assign({}, project, {id : 0})
      this.props.addProject(toSend)
    }
  }

  render() {
    const { handleSubmit } = this.props

    let headers = ["Email", "Autor", "rol", "Investigador asociado"]
    let fields = ["email", "signature", "role", "researcherId"]

    let htmlHeaders = headers.map(x => {
      return (<th>{x}</th>)
    })

    return (
      <div className="project-form">
        <legend>
          Datos del proyecto
        </legend>
        <div className="row">
          <form className="form-horizontal" onSubmit={handleSubmit(this.onSubmit)}>
            <Field component={InputRow} type="text" label="Codigo" name="code" />
            <Field component={InputRow} type="text" label="Titulo" name="title" />
            <Field component={RGMDefaultDatePicker} type="text" label="Fecha de inicio" name="startDate" />
            <Field component={RGMDefaultDatePicker} type="text" label="Fecha de fin" name="endDate" />
            <Field component={InputRow} type="text" label="Presupuesto" name="budget" />

            <div className="form-group">
              <CheckBox name="public" text="Público" />
            </div>

            <div className="researchers-project-table">
              <legend>
                Investigadores asociados al proyecto
              </legend>

              <div className="table-responsive">
                <table className="table table-striped table-listing">
                  <thead>
                    <tr>
                      {htmlHeaders}
                    </tr>
                  </thead>

                  <tbody>
                    <tr>

                    </tr>
                  </tbody>
                </table>
              </div>

            </div>

            <FormButtons canDelete={this.isUpdate()} saveText="Guardar" cancelText="Cancelar" deleteText="Eliminar proyecto"
              cancelAction={this.handleCancel} deleteAction={this.handleDelete} />

          </form>
        </div>
      </div>
    )
  }
}

ProjectForm.propTypes = {
  project: React.PropTypes.object,
  params: React.PropTypes.object,
  dispatch: React.PropTypes.func,
  initialize: React.PropTypes.func,
  errorHappened: React.PropTypes.string,

  activeProject: React.PropTypes.number,

  fetchProjectById: React.PropTypes.func,
  addProject: React.PropTypes.func,
  updateProject: React.PropTypes.func,
  deleteProject: React.PropTypes.func,

  handleSubmit: React.PropTypes.func
}

let mapStateToProps = store => {
  return {
    activeProject: store.projectState.activeProject,
    project: store.projectState.activeProject === 0 ? {} : store.projectState.projects.find(o => {
      return o.id === store.projectState.activeProject
    }),
    success: store.projectState.success,
    errorHappened: store.projectState.error,
    deletedProject: store.projectState.deletedResearcher
  }
}

let mapDispatchToProps = (dispatch) => {
  return {
    fetchProjectById: (id) => {
      dispatch(fetchProjectById(id))
    },
    addProject: (project) => {
      dispatch(addProject(project))
    },
    updateProject: (project) => {
      dispatch(updateProject(project))
    },
    deleteProject: (id) => {
      dispatch(deleteProject(id))
    }
  }
}

var form = reduxForm({
  form: "project",
  validate
})

export default connect(mapStateToProps, mapDispatchToProps)(form(ProjectForm))
