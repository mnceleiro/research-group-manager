import React from "react"
import { Route, IndexRoute } from "react-router"

import ResearcherTable from "./components/researcher/ResearcherTable"
import ResearcherDetail from "./components/researcher/ResearcherDetail"

import ProjectTable from "./components/project/ProjectTable"
import ProjectDetail from "./components/project/ProjectDetail"

import CongressTable from "./components/congress/CongressTable"
import CongressDetail from "./components/congress/CongressDetail"

const createRoutes = store => ( // eslint-disable-line no-unused-vars
  <Route path="/">
    <Route path="/researchers">
      <IndexRoute component={ResearcherTable} />
      <Route path="/researchers/new" component={ResearcherDetail} />
      <Route path="/researchers/edit/:key" component={ResearcherDetail} />
    </Route>
    <Route path="/projects">
      <IndexRoute component={ProjectTable} />
      <Route path="/projects/new" component={ProjectDetail} />
      <Route path="/projects/edit/:key" component={ProjectDetail} />
    </Route>
    <Route path="/congresses">
      <IndexRoute component={CongressTable} />
      <Route path="/congresses/new" component={CongressDetail} />
      <Route path="/congresses/edit/:key" component={CongressDetail} />
    </Route>
  </Route>
)

export default createRoutes
