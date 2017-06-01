import React from "react"
import { Route, IndexRoute } from "react-router"

import ResearcherTable from "./components/researcher/ResearcherTable"
import ResearcherDetail from "./components/researcher/ResearcherDetail"

import ProjectTable from "./components/project/ProjectTable"
import ProjectDetail from "./components/project/ProjectDetail"

import CongressTable from "./components/congress/CongressTable"
import CongressDetail from "./components/congress/CongressDetail"

import JournalTable from "./components/journal/JournalTable"
import JournalDetail from "./components/journal/JournalDetail"

import AuthorTable from "./components/author/AuthorTable"
import AuthorDetail from "./components/author/AuthorDetail"

import Calendar from "./components/calendar/Calendar"

const createRoutes = store => ( // eslint-disable-line no-unused-vars
  <Route path="/">
    <IndexRoute component={Calendar} />
    <Route path="/calendar" component={Calendar} />
    <Route path="/researchers">
      <IndexRoute component={ResearcherTable} />
      <Route path="/researchers/new" component={ResearcherDetail} allowed={["admin"]} />
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
    <Route path="/journals">
      <IndexRoute component={JournalTable} />
      <Route path="/journals/new" component={JournalDetail} />
      <Route path="/journals/edit/:key" component={JournalDetail} />
    </Route>
    <Route path="/authors">
      <IndexRoute component={AuthorTable} />
      <Route path="/authors/new" component={AuthorDetail} />
      <Route path="/authors/edit/:key" component={AuthorDetail} />
    </Route>
  </Route>
)

export default createRoutes
