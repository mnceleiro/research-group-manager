import React, { Component } from "react"
import PropTypes from "prop-types"
import { Link } from "react-router"

class ProjectRow extends Component {
  render() {
    return(
      <tr>
        <td>{this.props.code}</td>
        <td>{this.props.title}</td>
        <td>{this.props.startDate}</td>
        <td>{this.props.endDate}</td>
        <td>{this.props.budget}</td>
        <td>{this.props.researcherCount}</td>
        <td><Link to={"/projects/edit/" + this.props.id}><button onClick={() => this.props.onProjectEdit(this.props.id)} className="btn rgm-btn-primary">Editar</button></Link></td>
      </tr>
    )
  }
}

ProjectRow.propTypes = {
  id: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  code: PropTypes.string.isRequired,
  startDate: PropTypes.string.isRequired,
  endDate: PropTypes.string.isRequired,
  budget: PropTypes.number.isRequired,
  researcherCount: PropTypes.number,

  onProjectEdit: PropTypes.func
}

export default ProjectRow
