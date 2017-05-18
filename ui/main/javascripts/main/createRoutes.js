import React from "react"
import { Route, IndexRoute } from "react-router"

import ResearcherTable from "./components/researcher/ResearcherTable"
import ResearcherForm from "./components/researcher/ResearcherForm"

import ProjectTable from "./components/project/ProjectTable"
import ProjectForm from "./components/project/ProjectForm"

import CongressTable from "./components/congress/CongressTable"
import CongressForm from "./components/project/ProjectForm"

const createRoutes = store => ( // eslint-disable-line no-unused-vars
  <Route path="/">
    <Route path="/researchers">
      <IndexRoute component={ResearcherTable} />
      <Route path="/researchers/new" component={ResearcherForm} />
      <Route path="/researchers/edit/:key" component={ResearcherForm} />
    </Route>
    <Route path="/projects">
      <IndexRoute component={ProjectTable} />
      <Route path="/projects/new" component={ProjectForm} />
      <Route path="/projects/edit/:key" component={ProjectForm} />
    </Route>
    <Route path="/congresses">
      <IndexRoute component={CongressTable} />
      <Route path="/congresses/new" component={CongressForm} />
      <Route path="/congresses/edit/:key" component={CongressForm} />
    </Route>
  </Route>
)

export default createRoutes
