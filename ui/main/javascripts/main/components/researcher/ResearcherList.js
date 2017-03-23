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
            <th>Firma</th>
            <th>Dirección</th>
            <th>Teléfono</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
        {
          this.props.list.map(r => {
            return <ResearcherRow
                                onResearcherEdit={this.props.onResearcherEdit}
                                key={ r.id }
                                id={ r.id }
                                name={ r.firstName }
                                surname={ r.lastName }
                                signaturename={ r.signatureName }
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
  list: React.PropTypes.array.isRequired,
  onResearcherEdit: React.PropTypes.func
}

export default ResearcherList
