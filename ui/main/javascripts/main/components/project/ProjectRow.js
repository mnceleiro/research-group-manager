import React from "react"
import { Link } from "react-router"

class ProjectRow extends React.Component {
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
  id: React.PropTypes.number.isRequired,
  title: React.PropTypes.string.isRequired,
  code: React.PropTypes.string.isRequired,
  startDate: React.PropTypes.string.isRequired,
  endDate: React.PropTypes.string.isRequired,
  budget: React.PropTypes.number.isRequired,
  researcherCount: React.PropTypes.number,

  onProjectEdit: React.PropTypes.func
}

export default ProjectRow
