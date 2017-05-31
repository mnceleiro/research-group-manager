import React from "react"
import PropTypes from "prop-types"

export default class RGMInlineTable extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    let headers = this.props.headers.slice()
    let fields = this.props.fields.slice()

    if (this.props.removable) {
      headers.push("Eliminar")
      fields.push("removable")
    }

    const data = this.props.data.map((o,i) => {
      if (this.props.removable) return Object.assign({}, o, { removable: <a className="" onClick={() => this.props.onDelete(i)}><i className="fa fa-trash-o fa-2x" aria-hidden="true"></i></a> })
      return o
    })

    // Cabeceras
    let htmlHeaders = headers.map(x => {
      return (<th key={x}>{x}</th>)
    })

    // Filas
    let htmlmRows = data.map(a => {
      return (
        <tr key={a.id}>{fields.map((f,i) => <td key={i}>{a[f]}</td>)}</tr>
      )
    })


    return (
      <div>
      <div className="table-responsive">
        <table className="table table-striped table-listing">
          <thead>
            <tr>{htmlHeaders}</tr>
          </thead>
          <tbody>{htmlmRows}</tbody>
        </table>
      </div>

    </div>
    )
  }
}

RGMInlineTable.propTypes = {
  // Vista
  headers: PropTypes.array,
  fields: PropTypes.array,

  // Datos
  data: PropTypes.array,

  // Variables de control
  removable: PropTypes.bool,

  // Eventos
  onClickEdit: PropTypes.func,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func
}
