import React, { Component } from "react"
import PropTypes from "prop-types"
import { Link } from "react-router"
// import ReactDOM from "react-dom"

export default class RGMDefaultTable extends Component {

  constructor(props) {
    super(props)

    let { headers, fields, data, editable } = this.props

    let htmlHeaders = headers.map(x => <th key={x}>{x}</th>)
    if (editable) htmlHeaders.push(<th key="edit"></th>)

    let htmlFields = editable ? [...fields, "html_editable"] : [...fields]

    let htmlData = data.map(o => {
      if (editable) o.html_editable = <Link to={this.props.editLink + o.id}><button className="btn rgm-btn-primary">{o.editText || "Detalle"}</button></Link>
      return (
        <tr key={o.id}>
          {
            htmlFields.map((f,i) => {
              return <td key={i}>{o[f]}</td>
            })
          }
        </tr>
      )
    })

    this.state = {
      htmlHeaders, htmlData
    }
  }

  render() {
    return (
      <div className="table-responsive">
        <table className="table table-striped table-listing">
          <thead><tr>
            {this.state.htmlHeaders}
          </tr></thead>

          <tbody>
            {this.state.htmlData}
          </tbody>
        </table>
      </div>
    )
  }
}


RGMDefaultTable.propTypes = {
  headers: PropTypes.array,
  fields: PropTypes.array,
  data: PropTypes.array,
  editable: PropTypes.bool,
  editLink: PropTypes.string,
  onEdit: PropTypes.func
}
