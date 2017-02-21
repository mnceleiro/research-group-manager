import ReactDOM from "react-dom"
import React from "react"
import { browserHistory, Router, Route, IndexRoute } from "react-router"
import ResearcherTable from "./components/researcher/ResearcherTable"
import ResearcherForm from "./components/researcher/ResearcherForm"

// class App extends Component {
// render() {
// return (
// <div className="appcomponent">
// <ul>
// <li>Instagram</li>
// <li>WhatsApp</li>
// <li>Oculus</li>
// </ul>
// </div>
// );
// }
// }
// ReactDOM.render(
// <ResearcherTable />,
// document.getElementById("rgmApp")
// );

class App extends React.Component {
  render() {
    return (<div>{this.props.children}</div>)
  }
}

ReactDOM.render(
    <Router history={browserHistory}>
      <Route path="/" component={App}>
        <Route path="/researchers">
          <IndexRoute component={ResearcherTable} />
          <Route path="/researchers/new" component={ResearcherForm} />
          <Route path="/researchers/edit/:key" component={ResearcherForm} />
        </Route>
      </Route>
    </Router>,
    document.getElementById("rgmApp")
)

App.propTypes = {
  children: React.PropTypes.object
}

//$.get("researchers/all", function(respuestaSolicitud){
//  alert(respuestaSolicitud)
//})
