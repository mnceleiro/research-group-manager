import React from "react"
import { Link } from "react-router"

class ResearcherRow extends React.Component {
  render() {
    return(
      <tr>
        <td>{this.props.name}</td>
        <td>{this.props.surname}</td>
        <td>{this.props.address}</td>
        <td>{this.props.phone}</td>
        <td>{this.props.email}</td>
        <td><Link to={"/researchers/edit/" + this.props.id}><button onClick={() => this.props.onResearcherEdit(this.props.id)} className="btn rgm-btn-primary">Editar</button></Link></td>
      </tr>
    )
  }
}

ResearcherRow.propTypes = {
  id: React.PropTypes.number.isRequired,
  name: React.PropTypes.string.isRequired,
  surname: React.PropTypes.string.isRequired,
  email: React.PropTypes.string.isRequired,
  address: React.PropTypes.string.isRequired,
  phone: React.PropTypes.string.isRequired,

  onResearcherEdit: React.PropTypes.func
}

export default ResearcherRow
