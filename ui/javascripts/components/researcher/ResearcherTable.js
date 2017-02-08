import React from "react" 
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
        <div>
          <ResearcherList list={this.state.researchers} />
        </div>
      )
    } else {
      return <p className="text-center">Cargando empleados...</p>
    }
  }
}

export default ResearcherTable