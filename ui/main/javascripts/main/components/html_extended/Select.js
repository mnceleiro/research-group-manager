import React from "react"
import Select from "react-select"

export class RGMDefaultSelect extends React.Component {
  constructor(props) {
    super(props)

    this.handleChange = this.handleChange.bind(this)
    this.state = {
      data: this.props.selectableData.map(x => { return { value: x.id, label: x.description } }),
      value: this.props.selectableData[0]
    }
  }

  handleChange(value) {
    let found = this.state.data.find(x => { return x.value === value.value })
    // console.log(value)
    if (found) {
      this.props.input.onChange(value.label)
      this.setState({
        data: this.state.data,
        value
      })
    }

  }

  render() {
    let field = this.props
    // let data = field.selectableData

    // data = data.map(x => { return { value: x.id, label: x.description } })


    return (
      <div className="form-group">
        <label className="control-label col-xs-3 col-md-2" htmlFor={field.input.name}>{field.label}:</label>
        <div className="col-xs-9 col-md-9">
          <Select
            id={field.name}
            name={field.input.name}
            options={this.state.data}
            value={this.state.value}
            onChange={this.handleChange}
          />
        </div>
      </div>
    )
  }
}

RGMDefaultSelect.propTypes = {
  input: React.PropTypes.object,
  selectableData: React.PropTypes.array
}
