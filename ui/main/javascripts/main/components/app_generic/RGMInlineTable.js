import React from "react"
import PropTypes from "prop-types"

export default class RGMInlineTable extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    let headers = this.props.headers.slice()
    let fields = this.props.fields.slice()

    // if (this.props.editable) {
    //   headers.push("Editar")
    //   headers.push("Eliminar")
    //   fields.push("editable")
    //   fields.push("removable")
    // }

    if (this.props.removable) {
      headers.push("Eliminar")
      fields.push("removable")
    }

    const data = this.props.data.map((o,i) => {
      // if (this.props.editable) o.editable = <a className="" data-toggle="modal" data-target="#myModal" onClick={() => this.props.onClickEdit(i)}><i className="fa fa-pencil-square-o fa-2x" aria-hidden="true"></i></a>
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

// <button type="button" className="btn btn-primary btn-lg" data-toggle="modal" data-target="#myModal">
//   Launch demo modal
// </button>

RGMInlineTable.propTypes = {
  headers: PropTypes.array,
  fields: PropTypes.array,
  data: PropTypes.array,
  removable: PropTypes.bool,

  onClickEdit: PropTypes.func,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func
}
