import React from "react"
import DatePicker from "react-datepicker"
import moment from "moment"

export class RGMDefaultDatePicker extends React.Component {
  constructor(props) {
    super(props)

    this.handleChange = this.handleChange.bind(this)
  }

  handleChange(date) {
    if (date) this.props.input.onChange(moment(date).format("DD/MM/YYYY"))
  }

  render() {
    // return (
    //   <div className="form-group">
    //     <label className="control-label col-xs-3 col-md-2" htmlFor={field.input.name}>{field.label}:</label>
    //     <div className="col-xs-9 col-md-9">
    //       <input {...field.input} type="date" className="form-control" id={field.name} name={field.input.name} placeholder={field.label} />
    //       {field.meta.touched && field.meta.error && <div className="form-alert alert-danger">{field.meta.error}</div>}
    //     </div>
    //   </div>
    // )
    let field = this.props

    return (
      <div className="form-group">
        <label className="control-label col-xs-3 col-md-2" htmlFor={field.input.name}>{field.label}:</label>
        <div className="col-xs-9 col-md-9">
          <DatePicker
            id={field.name}
            name={field.input.name}
            placeholderText={field.label}
            dateFormat="DD/MM/YYYY"
            locale="es-ES"
            className="form-control"
            selected={field.input.value ? moment(field.input.value, "DD/MM/YYYY") : null}
            onChange={this.handleChange}
          />
          {field.meta.touched && field.meta.error && <div className="form-alert alert-danger">{field.meta.error}</div>}
        </div>
      </div>
    )
  }
}

RGMDefaultDatePicker.propTypes = {
  input: React.PropTypes.object
}
