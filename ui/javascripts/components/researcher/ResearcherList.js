import React from "react"
import ResearcherRow from "./ResearcherRow"

class ResearcherList extends React.Component {

  render() {
    return (
      <table className="table">
        <thead>
          <th>Nombre</th>
          <th>Apellidos</th>
          <th>Correo</th>
        </thead>
        <tbody>
        {
          this.props.list.map(r => {
            return <ResearcherRow key={ r.id }
                                name={ r.firstName }
                                surname={ r.lastName }
                                email={ r.email } />
          })
        }
        </tbody>
      </table>
    )
  }
}

ResearcherList.propTypes = {
  list: React.PropTypes.array.isRequired
}

export default ResearcherList