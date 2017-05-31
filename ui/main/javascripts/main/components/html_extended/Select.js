import React, { Component } from "react"
import PropTypes from "prop-types"
import Select from "react-select"

export class RGMDefaultSelect extends Component {
  constructor(props) {
    super(props)

    this.state = {
      data: this.props.selectableData.map(x => { return { value: x.id, label: x.description } }),
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.selectableData && nextProps.selectableData.length > 0 && !this.state.selectableData) {
      this.setState({
        ...this.state,
        data: this.props.selectableData.map(x => { return { value: x.id, label: x.description } }),
      })
    }
  }

  render() {

    let { input, label, name, dataSelected, clearable } = this.props

    const labelWidth = this.props.labelWidth || 2
    const inputWidth = this.props.inputWidth || 9

    const disabled = this.props.disabled || false

    if (!dataSelected && !clearable) return (<div></div>)
    else {
      let currentValue = dataSelected ? { "value": dataSelected.id, "label": dataSelected.description } : null
      return (
        <div className={this.props.formClass || "form-group"}>
          <label className={"control-label col-md-" + labelWidth} htmlFor={input.name}>{label}:</label>
          <div className={"col-md-" + inputWidth}>
            <Select {...input}
              id={name}
              disabled={disabled}
              options={this.state.data}
              clearable={clearable || false}
              value={currentValue}
            />
          </div>
        </div>
      )
    }
  }
}

RGMDefaultSelect.propTypes = {
  input: PropTypes.object,
  selectableData: PropTypes.array,
  dataSelected: PropTypes.object,
  label: PropTypes.string,
  name: PropTypes.string,
  clearable: PropTypes.bool,
  disabled: PropTypes.bool,

  formClass: PropTypes.string,
  labelWidth: PropTypes.string,
  inputWidth: PropTypes.string
}
