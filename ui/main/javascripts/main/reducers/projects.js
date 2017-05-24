import { REQUEST_PROJECTS, RECEIVE_PROJECTS, RECEIVE_PROJECT,
  ADD_PROJECT_SUCCESS, ADD_PROJECT_ERROR, UPDATE_PROJECT_SUCCESS, UPDATE_PROJECT_ERROR, DELETE_PROJECT_SUCCESS,
  EDIT_AUTHOR_FROM_CURRENT_PROJECT, DELETE_AUTHOR_FROM_CURRENT_PROJECT, ADD_AUTHOR_TO_CURRENT_PROJECT
 } from "../constants/actionTypes"

const initialState = {
  projects: [],
  activeProject: {
    id: 0,
    obj: null
  },
  activeAuthor: {
    id: 0,
    obj: null
  },
  deletedProject: null,
  isFetching: false,
  error: null,
  success: null,
  lastUpdated: 1439478405547,
  table: {
    headers: ["Código", "Título", "Fecha de Inicio", "Fecha de fin", "Presupuesto", "Investigadores"],
    fields: ["code", "title", "startDate", "endDate", "budget", "researcherCount"],
    editable: true
  }
}

export default function projects(state = initialState, action) {
  switch (action.type) {
  case REQUEST_PROJECTS:
    return Object.assign({}, state, {
      isFetching: true,
      didInvalidate: false,
      error: null,
    })

  case RECEIVE_PROJECTS:
    return Object.assign({}, state, {
      isFetching: false,
      activeProject: {
        id: 0,
        obj: null
      },
      deletedProject: null,
      error: null,
      success: null,
      projects: action.projects,
      lastUpdated: action.receivedAt
    })

  case RECEIVE_PROJECT:
    var projects = state.projects.map(p => {
      if (p.id === action.project.id) return action.project
      else return p
    })

    var found = projects.find(p => {
      return p.id === action.project.id
    })

    if (!found) projects.push(action.project)

    return Object.assign({}, state, {
      projects: projects,
      activeProject: {
        id: action.project.id,
        obj: action.project
      }
    })

  case ADD_PROJECT_SUCCESS:
    return Object.assign({}, state, {
      isFetching: false,
      error: null,
      success: "El proyecto ha sido creado correctamente."
    })

  case ADD_PROJECT_ERROR:
    return Object.assign({}, state, {
      isFetching: false,
      error: action.message
    })

  case UPDATE_PROJECT_SUCCESS:
    return Object.assign({}, state, {
      isFetching: false,
      error: null,
      success: "El proyecto ha sido actualizado correctamente."
    })

  case DELETE_PROJECT_SUCCESS:
    return Object.assign({}, state, {
      isFetching: false,
      error: null,
      success: "El proyecto ha sido eliminado correctamente.",
      deletedProject: action.project
    })

  case UPDATE_PROJECT_ERROR:
    return Object.assign({}, state, {
      isFetching: false,
      error: action.message
    })

  case ADD_AUTHOR_TO_CURRENT_PROJECT: {
    let auths = state.activeProject.obj.authors.slice()

    auths.push(action.object)
    let obj = Object.assign({}, state.activeProject.obj, {authors: auths})

    return Object.assign({}, state, {
      activeProject: {
        id: state.activeProject.id,
        obj
      }
    })
  }

  case EDIT_AUTHOR_FROM_CURRENT_PROJECT: {
    let auths = state.activeProject.obj.authors.slice()

    let index = auths.findIndex(x => x.id === action.object.id)
    auths[index] = action.object

    let obj = Object.assign({}, state.activeProject.obj, {authors: auths})
    return Object.assign({}, state, {
      activeProject: {
        id: state.activeProject.id,
        obj
      }
    })
  }

  case DELETE_AUTHOR_FROM_CURRENT_PROJECT: {
    let auths = state.activeProject.obj.authors.slice()
    auths.splice(action.index, 1)
    let obj = Object.assign({}, state.activeProject.obj, {authors: auths})

    return Object.assign({}, state, {
      activeProject: {
        id: state.activeProject.id,
        obj: obj
      }
    })
  }

  }

  return state
}
