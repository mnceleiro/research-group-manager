import React, { Component } from "react"
import PropTypes from "prop-types"
import { browserHistory } from "react-router"
import { connect } from "react-redux"
import { Field, reduxForm } from "redux-form"

import { fetchProjectById, addProject, updateProject, deleteProject } from "../../actions/project-actions"
import { fetchRoles } from "../../actions/role-actions"
import { fetchAuthors } from "../../actions/author-actions"
import { fetchResearchers } from "../../actions/researcher-actions"

import { InputRow } from "../html_extended/InputRow"
import { RGMDefaultDatePicker } from "../html_extended/DatePicker"
import { FormButtons } from "../html_extended/FormButtons"
import RGMAuthorsTable from "../app_generic/RGMAuthorsTable"

import { LoadingModal } from "../html_extended/modals/Modal"

import { validate } from "./ProjectValidation"

class ProjectDetail extends Component {
  constructor(props) {
    super(props)

    this.handleInitialize = this.handleInitialize.bind(this)
    this.handleRemove = this.handleRemove.bind(this)
    this.onSubmit = this.onSubmit.bind(this)

    this.onDeleteRow = this.onDeleteRow.bind(this)

    this.state = {
      selectedAuthor: null,
      selectedRole: null,
      authors: []
    }
  }

  componentWillMount() {
    this.props.fetchAuthors()
    this.props.fetchResearchers()
    this.props.fetchRoles()

    if (this.isUpdate()) {
      this.props.fetchProjectById(this.props.params.key)
    }
  }

  componentWillReceiveProps(nextProps) {
    // Si se detecta error
    if (nextProps.errorHappened) alert(nextProps.errorHappened)

    // Operacion con exito
    if (nextProps.success) {
      browserHistory.push(`/projects?success=${nextProps.success}`)
    }

    if (this.isUpdate() && nextProps.activeProject.obj && !this.props.activeProject.obj) {
      this.handleInitialize(nextProps.activeProject.obj)

      this.setState({
        ...this.state,
        authors: nextProps.activeProject.obj.authors || []
      })
    }
  }

  handleInitialize(project) {
    if (this.isUpdate() && project.id) {
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

  isUpdate() {
    if (this.props.params.key) return true
    else return false
  }

  onSubmit(project) {
    project.researcherCount = this.state.authors.length
    project.authors = this.state.authors

    if (this.isUpdate()) {
      var toSend = Object.assign({}, project, { id: parseInt(this.props.params.key) })
      toSend.authors = this.state.authors
      this.props.updateProject(toSend)

    } else {
      let toSend = Object.assign({}, project, {id : 0})
      toSend.authors = this.state.authors
      this.props.addProject(toSend)
    }
  }

  onAddAuthor() {
    if (this.state.selectedAuthor && this.state.selectedRole) {
      let found = this.props.authors.find(x => x.id === this.state.selectedAuthor.value)
      let role = this.props.roles.find(x => x.id === this.state.selectedRole.value)
      if (found) {
        const authors = this.state.authors
        const authorToAdd = Object.assign({}, found, { role: role.id, roleDesc: role.description })
        authors.push(authorToAdd)

        this.setState({
          ...this.state,
          authors: authors,
          selectedAuthor: null,
          selectedRole: null
        })
      }
    }
  }

  onDeleteRow(index) {
    this.setState({
      authors: this.state.authors.filter((o,i) => index !== i)
    })
  }

  // onClickEditRow(i) {
  //   // console.log(o)
  //   this.setState({
  //     selectedAuthor: this.state.selectedAuthor,
  //     editingAuthor: this.props.activeProject.obj.authors[i]
  //   })
  // }

  handleAuthorSelectionChange(o) {
    let found = this.props.authors.find(x => x.id === o.value)

    if (found) {
      this.setState({
        ...this.state,
        selectedAuthor: { "label": found.email, "value": found.id }
      })
    }
  }

  handleRoleSelectionChange(o) {
    let found = this.props.roles.find(x => x.id === o.value)

    if (found) {
      this.setState({
        ...this.state,
        selectedRole: { "label": found.description, "value": found.id }
      })
    }
  }

  render() {
    const { handleSubmit, isFetching, editable } = this.props

    const headers = ["Email", "Autor", "rol", "Investigador asociado"]
    const fields = ["email", "signature", "roleDesc", "researcherDesc"]

    if (isFetching || this.props.roles.length === 0 || (this.isUpdate() && !this.props.activeProject.obj)) {
      return (<LoadingModal isOpen={this.props.isFetching} />)

    } else {
      let project = this.props.activeProject.obj
      if (project) {
        project.authors = project.authors.map(x => {
          x.roleDesc = this.props.roles.find(r => x.role === r.id).description
          let res = this.props.researchers.find(r => r.id === x.researcherId)
          if (res) x.researcherDesc = res.email

          return x
        })
      } else {
        project = {}
        project.authors = []
      }

      return (
        <div className="project-form">
          <legend>
            Datos del proyecto
          </legend>
          <div className="row">
            <form className="form-horizontal" onSubmit={handleSubmit(this.onSubmit)}>
              <Field component={InputRow} type="text" label="Codigo" name="code" disabled={!editable} />
              <Field component={InputRow} type="text" label="Titulo" name="title" disabled={!editable} />
              <Field component={RGMDefaultDatePicker} type="text" label="Fecha de inicio" name="startDate" disabled={!editable} />
              <Field component={RGMDefaultDatePicker} type="text" label="Fecha de fin" name="endDate" disabled={!editable} />
              <Field component={InputRow} type="number" label="Presupuesto" name="budget" disabled={!editable} />

              <RGMAuthorsTable
                headers={headers}
                fields={fields}
                authors={this.props.authors}

                insertable={editable}
                removable={editable}

                selectedAuthors={this.state.authors}
                selectedAuthor={this.state.selectedAuthor}
                selectedRole={this.state.selectedRole}

                onInsert={this.onAddAuthor.bind(this)}
                onInsertSelection={this.handleAuthorSelectionChange.bind(this)}
                onRoleSelection={this.handleRoleSelectionChange.bind(this)}
                onDelete={(i) => this.onDeleteRow(i)}

                roles={this.props.roles.map(x => { return {"label": x.description, "value": x.id} })}
              />
              {editable &&
                <FormButtons canDelete={this.isUpdate()} saveText="Guardar" cancelText="Cancelar" deleteText="Eliminar proyecto"
                  cancelAction={this.handleCancel} deleteAction={this.handleRemove} offset="1" />
              }
            </form>
          </div>

        </div>
      )
    }
    // <AuthorModalForm roles={this.props.roles} author={this.state.editingAuthor} researchers={this.props.researchers} authors={this.props.authors} onSaveAuthor={(i,o) => this.onSaveAuthor(i, o)}/>
  }
}

ProjectDetail.propTypes = {
  project: PropTypes.object,
  roles: PropTypes.array,
  researchers: PropTypes.array,
  authors: PropTypes.array,
  params: PropTypes.object,
  dispatch: PropTypes.func,
  initialize: PropTypes.func,
  errorHappened: PropTypes.string,
  success: PropTypes.string,
  isFetching: PropTypes.bool,
  editable: PropTypes.bool,

  activeProject: PropTypes.object,
  activeAuthor: PropTypes.object,

  fetchProjectById: PropTypes.func,
  addProject: PropTypes.func,
  updateProject: PropTypes.func,
  deleteProject: PropTypes.func,
  handleSubmit: PropTypes.func,

  fetchAuthors: PropTypes.func,
  fetchRoles: PropTypes.func,
  fetchResearchers: PropTypes.func,
}

let mapStateToProps = store => {
  return {
    editable: store.sessionState.user.admin ||
      (store.projectState.activeProject.obj ? store.projectState.activeProject.obj.authors.find(a => a.researcherId === store.sessionState.user.userId) && true : false),
    activeProject: store.projectState.activeProject,
    activeAuthor: store.projectState.activeAuthor,
    project: store.projectState.activeProject.id === 0 ? {} : store.projectState.projects.find(o => {
      return o.id === store.projectState.activeProject.id
    }),

    researchers: store.researcherState.researchers,
    authors: store.authorState.authors,
    roles: store.rolesState.roles,
    isFetching: store.rolesState.isFetching || store.authorState.isFetching || store.projectState.isFetching || store.researcherState.isFetching,

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
    },

    fetchAuthors: () => {
      dispatch(fetchAuthors())
    },
    fetchRoles: () => {
      dispatch(fetchRoles())
    },
    fetchResearchers: () => {
      dispatch(fetchResearchers())
    }
  }
}

var form = reduxForm({
  form: "project",
  validate
})

export default connect(mapStateToProps, mapDispatchToProps)(form(ProjectDetail))
