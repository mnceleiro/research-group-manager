import React, { Component } from "react"
import PropTypes from "prop-types"
import ProjectRow from "./ProjectRow"

class ProjectList extends Component {

  render() {
    return (
      <table className="table table-striped table-listing">
        <thead>
          <tr>
            <th>Código</th>
            <th>Título</th>
            <th>Fecha de inicio</th>
            <th>Fecha de fin</th>
            <th>Presupuesto</th>
            <th>Investigadores</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
        {
          this.props.list.map(p => {
            return <ProjectRow onProjectEdit={this.props.onProjectEdit}
                                key={ p.id }
                                id={ p.id }
                                code={ p.code }
                                title={ p.title }
                                public={ p.public }
                                startDate={ p.startDate }
                                endDate={ p.endDate }
                                budget={ p.budget }
                                researcherCount={ p.researcherCount } />
          })
        }
        </tbody>
      </table>
    )
  }
}

ProjectList.propTypes = {
  list: PropTypes.array.isRequired,
  onProjectEdit: PropTypes.func
}

export default ProjectList
