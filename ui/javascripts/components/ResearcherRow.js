import React from 'react';

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

export default ResearcherRow