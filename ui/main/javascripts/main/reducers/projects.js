import { REQUEST_PROJECTS, RECEIVE_PROJECTS, RECEIVE_PROJECT,
  ADD_PROJECT_SUCCESS, ADD_PROJECT_ERROR
 } from "../constants/actionTypes"

const initialState = {
  projects: [],
  activeProject: 0,
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
      activeProject: 0,
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
      activeProject: action.project.id
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

  }


  return state
}
