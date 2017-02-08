import React from "react"

class ResearcherRow extends React.Component {
  render() {
    return(
      <tr>
        <td>{this.props.name}</td>
        <td>{this.props.surname}</td>
        <td>{this.props.email}</td>
      </tr>
    )
  }
}

ResearcherRow.propTypes = {
  name: React.PropTypes.string.isRequired,
  surname: React.PropTypes.string.isRequired,
  email: React.PropTypes.string.isRequired,
}

export default ResearcherRow