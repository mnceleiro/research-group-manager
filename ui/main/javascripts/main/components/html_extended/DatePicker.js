import React, { Component } from "react"
import PropTypes from "prop-types"
import DatePicker from "react-datepicker"
import moment from "moment"

export class RGMDefaultDatePicker extends Component {
  constructor(props) {
    super(props)

    this.handleChange = this.handleChange.bind(this)
  }

  handleChange(date) {
    if (date) this.props.input.onChange(moment(date).format("DD/MM/YYYY"))
    else this.props.input.onChange("")
  }

  render() {
    let field = this.props
    const disabled = field.disabled

    const labelWidth = this.props.labelWidth || 2
    const inputWidth = this.props.inputWidth || 9

    let formGroup = this.props.formGroup === undefined ? true : this.props.formGroup

    const labelHtml = <label className={`control-label col-md-${labelWidth}`} htmlFor={field.input.name}>{field.label}:</label>
    const datepickerHtml = <div className={`col-md-${inputWidth}`}>
        <DatePicker {...field.input}
          id={field.name}
          name={field.input.name}
          placeholderText={field.label}
          isClearable={!disabled && false}
          dateFormat="DD/MM/YYYY"
          disabled={disabled}
          locale="es-ES"
          className="form-control"
          selected={field.input.value ? moment(field.input.value, "DD/MM/YYYY") : null}
          onChange={this.handleChange}
        />
        {field.meta.touched && field.meta.error && <div className="form-alert alert-danger">{field.meta.error}</div>}
      </div>
debugger
    if (formGroup) {
      return (
        <div className="form-group">
          {labelHtml}{datepickerHtml}
        </div>
      )
    } else {
      return (<div>{labelHtml}{datepickerHtml}</div>)
    }
  }
}

RGMDefaultDatePicker.propTypes = {
  input: PropTypes.object,
  labelWidth: PropTypes.string,
  inputWidth: PropTypes.string,
  formGroup: PropTypes.bool
}
