import React from "react"
import Select from "react-select"

export class RGMDefaultSelect extends React.Component {
  constructor(props) {
    super(props)

    // this.handleChange = this.handleChange.bind(this)

    this.state = {
      data: this.props.selectableData.map(x => { return { value: x.id, label: x.description } }),
      // dataSelected: this.props.dataSelected ? { "value": this.props.dataSelected.id, "label": this.props.dataSelected.description } : null
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.selectableData && nextProps.selectableData.length > 0 && !this.state.selectableData) {
      this.setState({
        ...this.state,
        data: this.props.selectableData.map(x => { return { value: x.id, label: x.description } }),
      })
    }

    // if (nextProps.dataSelected && !this.state.dataSelected) {
    //   this.setState({
    //     ...this.state,
    //     value: { "value": nextProps.dataSelected, "label": nextProps.description }
    //   })
    // }
  }

  render() {

    let { input, label, name, dataSelected } = this.props

    if (!dataSelected) return (<div></div>)
    else {
      let currentValue =  { "value": dataSelected.id, "label": dataSelected.description }
      return (
        <div className="form-group">
          <label className="control-label col-xs-3 col-md-2" htmlFor={input.name}>{label}:</label>
          <div className="col-xs-9 col-md-9">
            <Select {...input}
              id={name}
              options={this.state.data}
              clearable={false}
              value={currentValue}
            />
          </div>
        </div>
      )
    }
  }
}

RGMDefaultSelect.propTypes = {
  input: React.PropTypes.object,
  selectableData: React.PropTypes.array,
  dataSelected: React.PropTypes.object,
  label: React.PropTypes.string,
  name: React.PropTypes.string
}


// import React from "react"
// import Select from "react-select"
//
// export const RGMDefaultSelect = (field) => {
//   debugger
//   return (
//     <div className="form-group">
//       <label className="control-label col-xs-3 col-md-2" htmlFor={field.input.name}>{field.label}:</label>
//       <div className="col-xs-9 col-md-9">
//         <Select {...field.input}
//           id={field.name}
//           name={field.input.name}
//           options={this.state.data}
//           clearable={false}
//           value={this.state.dataSelected}
//           onChange={this.handleChange}
//         />
//       </div>
//     </div>
//   )
// }
