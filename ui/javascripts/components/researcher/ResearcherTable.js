import React from "react"
import { Link } from "react-router"
import ResearcherList from "./ResearcherList"
import { fetchResearchers } from "../../actions"

import { connect } from "react-redux"
//import { bindActionCreators } from "redux"

class ResearcherTable extends React.Component {
  constructor(props) {
    super(props)
    this.state = { researchers: [] }
  }

  componentDidMount() {
    //this.props.dispatch(fetchResearchers(this.props.dispatch))
  }

  componentWillMount() {
    this.props.dispatch(fetchResearchers(this.props.dispatch))
    // fetch("researchers/all")
    //   .then(resp => { return resp.json() })
    //   .then(researcherList => {
    //     this.setState({
    //       researchers: researcherList
    //     })
    //   })

  }

  render() {
    if (this.props.researchers.length > 0) {
      return (
        <div className="researcher-table">
          <br />
          <div className="panel-right">
            <Link to="/researchers/new"><button className="btn rgm-btn-primary rgm-btn-lg">Nuevo investigador</button></Link>
          </div>
          <div className="table-responsive">
            <ResearcherList list={this.props.researchers} />
          </div>
        </div>
      )
    } else {
      return <p className="text-center">Cargando empleados...</p>
    }
  }
}

let mapStateToProps = state => ({
  researchers: state.researchers
})

export default connect(mapStateToProps)(ResearcherTable)
