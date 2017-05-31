import React, { Component } from "react"
import PropTypes from "prop-types"
import { Link } from "react-router"
import { connect } from "react-redux"

import ResearcherList from "./ResearcherList"
import FlashMessage from "../html_extended/FlashMessage"
import { fetchResearchers, createResearcher, editResearcher } from "../../actions/researcher-actions"
import { LoadingModal } from "../html_extended/modals/Modal"

class ResearcherTable extends Component {

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

          { this.props.creatable &&
            <div className="panel-right">
              <Link to="/researchers/new"><button className="btn rgm-btn-primary rgm-btn-lg">Nuevo investigador</button></Link>
            </div>
          }
          <div className="table-responsive">
            <ResearcherList list={this.props.researchers} onResearcherEdit={this.props.onResearcherEdit} />
          </div>
        </div>
      )
    } else {
      return <LoadingModal isOpen={this.props.isFetching} />
    }
  }
}

ResearcherTable.propTypes = {
  researchers: PropTypes.array,
  creatable: PropTypes.bool,
  isFetching: PropTypes.bool,
  dispatch: PropTypes.func,
  onResearcherEdit: PropTypes.func,
  getAllResearchers: PropTypes.func,

  location: PropTypes.object
}

let mapStateToProps = store => {
  return {
    creatable: store.sessionState.user.admin,
    researchers: store.researcherState.researchers.map(x => {
      // if (store.sessionState.user.admin || store.sessionState.user.userId === x.usId) x.editText = "Detalle"
      // else x.editText = "Detalle"
      x.editText = "Detalle"

      return x
    }),
    isFetching: store.researcherState.isFetching
  }
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
