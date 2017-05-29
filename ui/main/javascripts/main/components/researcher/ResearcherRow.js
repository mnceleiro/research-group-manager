import React, { Component } from "react"
import PropTypes from "prop-types"
import { Link } from "react-router"

class ResearcherRow extends Component {
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
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  surname: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  address: PropTypes.string.isRequired,
  phone: PropTypes.string.isRequired,

  onResearcherEdit: PropTypes.func
}

export default ResearcherRow
