import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { browserHistory, Router, Route, IndexRoute } from 'react-router'
import $ from 'jquery';
import ResearcherTable from './components/ResearcherTable'

class App extends Component {
	render() {
	    return (
	      <div className="appcomponent">
	        <ul>
	          <li>Instagram</li>
	          <li>WhatsApp</li>
	          <li>Oculus</li>
	        </ul>
	      </div>
	    );
	}
}

ReactDOM.render(
	<ResearcherTable />,
	document.getElementById('rgmApp')
);

//ReactDOM.render(
//	    <Router history={browserHistory}>
//	        <Route path="/" component={App}/>
//	    </Router>,
//	    document.getElementById('rgmApp')
//	);

//$.get("researchers/all", function(respuestaSolicitud){
//	   alert(respuestaSolicitud);
//});