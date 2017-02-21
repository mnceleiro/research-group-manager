import React from "react"
import { Link } from "react-router"
import ResearcherList from "./ResearcherList"

class ResearcherTable extends React.Component {
  constructor(props) {
    super(props)
    this.state = { researchers: [] }
  }

  componentWillMount() {
    fetch("researchers/all")
      .then(resp => { return resp.json() })
      .then(researcherList => {
        this.setState({
          researchers: researcherList
        })
      })
  }

  render() {
    if (this.state.researchers.length > 0) {
      return (
        <div className="researcher-table">
          <br />
          <div className="panel-right">
            <Link to="/researchers/new"><button className="btn rgm-btn-primary rgm-btn-lg">Nuevo investigador</button></Link>
          </div>
          <div className="table-responsive">
            <ResearcherList list={this.state.researchers} />
          </div>
        </div>
      )
    } else {
      return <p className="text-center">Cargando empleados...</p>
    }
  }
}

export default ResearcherTable
