import React, { PropTypes } from "react"
import RGMInlineTable from "../app_generic/RGMInlineTable"

import Select from "react-select"

export default class RGMAuthorsTable extends React.Component {
  constructor(props) {
    super(props)

    // let editable = this.props.editable || false
    // let insertable = this.props.insertable || this.props.onInsert
    // let removable = this.props.removable || this.props.onDelete
    //
    // this.state = {
    //   authors: this.props.authors,
    //   editable, insertable, removable
    // }
    if (this.props.roles) {
      this.state = {
        authorSelectClass: "col-xs-6 col-md-offset-2 col-md-4"
      }
    } else {
      this.state = {
        authorSelectClass: "col-xs-10 col-md-offset-5 col-md-4"
      }
    }
  }

  render() {
    const { headers, fields, onInsert, onInsertSelection, onRoleSelection, onEdit, onDelete, authors, roles, selectedAuthors, selectedAuthor, selectedRole } = this.props

    let editable = this.props.editable || false
    let insertable = this.props.insertable || (onInsert && onInsertSelection) ? true : false
    let removable = this.props.removable || onDelete ? true : false

    return (
      <div>
        <div className="row">
          <div className="col-xs-12 col-md-offset-1 col-md-10">
            <legend>
              Autores asociados al proyecto
            </legend>
          </div>
        </div>

        {insertable && <div className="row">
          <div className={this.state.authorSelectClass}>
            <Select
              clearable={false}
              options={authors.filter(a => !selectedAuthors.find( ap => a.id === ap.id)).map(x => { return { "label": x.email, value: x.id } })}
              value={selectedAuthor}
              onChange={onInsertSelection}
            />
          </div>

          { roles &&
          <div className="col-xs-4 col-md-3">
            <Select
              clearable={false}
              options={roles}
              value={selectedRole}
              onChange={onRoleSelection}
            />
          </div>
          }
          <div className="col-xs-2 col-md-3">
            <button type="button" className="btn rgm-btn-primary rgm-btn-lg" onClick={onInsert}>Añadir</button>
          </div>
        </div>
        }

        <div className="row">
          <div className="col-xs-12 col-md-offset-1 col-md-10">
            <RGMInlineTable headers={headers} fields={fields} data={selectedAuthors} editable={editable} removable={removable} onClickEdit={onEdit} onDelete={onDelete} />
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
  editable: PropTypes.bool,
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
