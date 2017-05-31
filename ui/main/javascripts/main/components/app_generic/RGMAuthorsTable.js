import React, { Component } from "react"
import PropTypes from "prop-types"
import RGMInlineTable from "../app_generic/RGMInlineTable"

import Select from "react-select"

export default class RGMAuthorsTable extends Component {
  constructor(props) {
    super(props)

    if (this.props.roles) {
      this.state = {
        authorSelectClass: "col-md-offset-2 col-md-4"
      }
    } else {
      this.state = {
        authorSelectClass: "col-md-offset-5 col-md-4"
      }
    }
  }

  render() {
    const { headers, fields, onInsert, onInsertSelection, onRoleSelection, onEdit, onDelete, authors, roles, selectedAuthors, selectedAuthor, selectedRole } = this.props
    let insertable = this.props.insertable || false
    let removable = this.props.removable || false

    return (
      <div>
        <div className="row">
          <div className="col-md-offset-1 col-md-10">
            <legend>
              Autores asociados
            </legend>
          </div>
        </div>

        {insertable && <div className="row space-bottom-small">
          <div className={this.state.authorSelectClass}>
            <Select
              clearable={false}
              options={authors.filter(a => !selectedAuthors.find( ap => a.id === ap.id)).map(x => { return { "label": x.email, value: x.id } })}
              value={selectedAuthor}
              onChange={onInsertSelection}
            />
          </div>

          { roles &&
          <div className="col-md-3">
            <Select
              clearable={false}
              options={roles}
              value={selectedRole}
              onChange={onRoleSelection}
            />
          </div>
          }
          <div className="col-md-3">
            <button type="button" className="btn rgm-btn-primary rgm-btn-lg" onClick={onInsert}>Añadir</button>
          </div>
        </div>
        }

        <div className="row space-bottom-small">
          <div className="col-md-offset-1 col-md-10">
            <RGMInlineTable headers={headers} fields={fields} data={selectedAuthors} removable={removable} onClickEdit={onEdit} onDelete={onDelete} />
          </div>
        </div>
      </div>
    )
  }
}


RGMAuthorsTable.propTypes = {
  // table
  headers: PropTypes.array,
  fields: PropTypes.array,

  insertable: PropTypes.bool,
  removable: PropTypes.bool,

  onInsert: PropTypes.func,
  onInsertSelection: PropTypes.func,
  onRoleSelection: PropTypes.func,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,

  authors: PropTypes.array,
  roles: PropTypes.array,
  selectedAuthors: PropTypes.array,
  selectedAuthor: PropTypes.object,
  selectedRole: PropTypes.object
}
