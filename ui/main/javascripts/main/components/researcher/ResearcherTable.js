import React from "react"
import { Link } from "react-router"
import { connect } from "react-redux"

import ResearcherList from "./ResearcherList"
import FlashMessage from "../html_extended/FlashMessage"
import { fetchResearchers, createResearcher, editResearcher } from "../../actions/researcher-actions"

class ResearcherTable extends React.Component {

  componentWillMount() {
    this.props.getAllResearchers()
  }

  renderFlashMessage() {
    let alert = this.props.location.query.success

    if (alert) {
      let flashMessage = {
        className: "alert-success",
        message: alert
      }

      return (
        <div>
          <FlashMessage flashMessage={flashMessage} />
        </div>
      )
    }
  }

  render() {
    if (this.props.researchers.length > 0) {
      return (
        <div className="researcher-table">
          {this.renderFlashMessage()}
          <br />
          <div className="panel-right">
            <Link to="/researchers/new"><button className="btn rgm-btn-primary rgm-btn-lg">Nuevo investigador</button></Link>
          </div>
          <div className="table-responsive">
            <ResearcherList list={this.props.researchers} onResearcherEdit={this.props.onResearcherEdit} />
          </div>
        </div>
      )
    } else {
      return <div></div>
    }
  }
}

ResearcherTable.propTypes = {
  researchers: React.PropTypes.array,
  dispatch: React.PropTypes.func,
  onResearcherEdit: React.PropTypes.func,
  getAllResearchers: React.PropTypes.func,

  location: React.PropTypes.object
}

let mapStateToProps = store => {
  return { researchers: store.researcherState.researchers }
}

let mapDispatchToProps = dispatch => {
  return {
    getAllResearchers: () => {
      dispatch(fetchResearchers())
    },
    createResearcher: () => {
      dispatch(createResearcher())
    },
    onResearcherEdit: (id) => {
      dispatch(editResearcher(id))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ResearcherTable)
