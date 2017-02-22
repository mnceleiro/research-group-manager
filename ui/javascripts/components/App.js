import React from "react"

import { browserHistory, Router, Route, IndexRoute } from "react-router"

import ResearcherTable from "./researcher/ResearcherTable"
import ResearcherForm from "./researcher/ResearcherForm"

class App extends React.Component {

  render() {
    //return (<div>{this.props.children}</div>)
    return (
      <Router history={browserHistory}>
        <Route path="/researchers">
          <IndexRoute component={ResearcherTable} />
          <Route path="/researchers/new" component={ResearcherForm} />
          <Route path="/researchers/edit/:key" component={ResearcherForm} />
      </Route>
      </Router>
    )
  }
}

App.propTypes = {
  children: React.PropTypes.object
}

export default App
