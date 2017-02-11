import React from "react"
import ResearcherRow from "./ResearcherRow"

class ResearcherList extends React.Component {

  render() {
    return (
      <table className="table table-striped table-listing">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Apellidos</th>
            <th>Correo</th>
            <th>Dirección</th>
            <th>Teléfono</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
        {
          this.props.list.map(r => {
            return <ResearcherRow key={ r.id }
                                id={ r.id }
                                name={ r.firstName }
                                surname={ r.lastName }
                                email={ r.email } 
                                address={ r.address } 
                                phone={ r.phone } />
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