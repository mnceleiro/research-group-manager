import ReactDOM from "react-dom"
import React from "react"
import { browserHistory, Router, Route } from "react-router"
import ResearcherTable from "./components/researcher/ResearcherTable"

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

ReactDOM.render(
    <Router history={browserHistory}>
      <Route path="/" component={ResearcherTable}/>
    </Router>,
    document.getElementById("rgmApp")
)

//$.get("researchers/all", function(respuestaSolicitud){
//  alert(respuestaSolicitud)
//})