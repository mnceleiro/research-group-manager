import React from "react"
import { Route, IndexRoute } from "react-router"

import ResearcherTable from "./components/researcher/ResearcherTable"
import ResearcherForm from "./components/researcher/ResearcherForm"

const createRoutes = store => ( // eslint-disable-line no-unused-vars
    <Route path="/researchers">
      <IndexRoute component={ResearcherTable} />
      <Route path="/researchers/new" component={ResearcherForm} />
      <Route path="/researchers/edit/:key" component={ResearcherForm} />
  </Route>
)

export default createRoutes
