import React from "react"
import { browserHistory } from "react-router"

class ResearcherForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      id: -1,
      firstName: "",
      lastName: "",
      signatureName: "",
      email: "",
      address: "",
      phone: ""
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }
    
  componentWillMount() {
    fetch("../../researchers/id/" + this.props.params.key)
      .then(resp => { return resp.json() })
      .then(researcher => { 
        this.setState({
          id: researcher.id,
          firstName: researcher.firstName,
          lastName: researcher.lastName,
          signatureName: researcher.signatureName,
          email: researcher.email,
          address: researcher.address,
          phone: researcher.phone
        })
      })
//    var url = "../../researchers/id/" + this.props.params.key
//    $.get(url, function(resp) {
//      alert(resp);
//    });
  }
  
  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  render() {
    return <div className="researcher-form">
      <legend>
        Datos personales
      </legend>
      <div className="row">
        <form className="form-horizontal" onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label className="control-label col-xs-3 col-md-2" htmlFor="email">Email:</label>
            <div className="col-xs-9 col-md-9">
              <input type="email" className="form-control" id="email" name="email" placeholder="Email" value={this.state.email} onChange={this.handleChange} />
            </div>
          </div>
          <div className="form-group">
            <label className="control-label col-xs-3 col-md-2" htmlFor="password">Password:</label>
            <div className="col-xs-9 col-md-9">
              <input type="password" className="form-control" id="password" name="password" placeholder="Contraseña"  value={this.state.password} onChange={this.handleChange} />
            </div>
          </div>
          <div className="form-group">
              <label className="control-label col-xs-3 col-md-2" htmlFor="confirmPassword">Confirmar contraseña:</label>
              <div className="col-xs-9 col-md-9">
                  <input type="password" className="form-control" id="confirmPassword" name="confirmPassword" placeholder="Confirmar contraseña" value={this.state.password} onChange={this.handleChange} />
              </div>
          </div>
          <div className="form-group">
              <label className="control-label col-xs-3 col-md-2" htmlFor="firstName">Nombre:</label>
              <div className="col-xs-9 col-md-9">
                  <input type="text" className="form-control" id="firstName" name="firstName" placeholder="Nombre" value={this.state.firstName} onChange={this.handleChange} />
              </div>
          </div>
          <div className="form-group">
              <label className="control-label col-xs-3 col-md-2" htmlFor="lastName">Apellidos:</label>
              <div className="col-xs-9 col-md-9">
                  <input type="text" className="form-control" id="lastName" name="lastName" placeholder="Apellidos" value={this.state.lastName} onChange={this.handleChange} />
              </div>
          </div>
          <div className="form-group">
            <label className="control-label col-xs-3 col-md-2" htmlFor="signatureName">Firma:</label>
            <div className="col-xs-9 col-md-9">
                <input type="text" className="form-control" id="signatureName" name="signatureName" placeholder="Firma" value={this.state.signatureName} onChange={this.handleChange} />
            </div>
        </div>
          <div className="form-group">
              <label className="control-label col-xs-3 col-md-2" htmlFor="phone">Telefono:</label>
              <div className="col-xs-9 col-md-9">
                  <input type="tel" className="form-control" id="phone" name="phone" placeholder="Telefono" value={this.state.phone} onChange={this.handleChange} />
              </div>
          </div>
          <div className="form-group">
              <label className="control-label col-xs-3 col-md-2" htmlFor="address">Dirección:</label>
              <div className="col-xs-9 col-md-9">
                  <textarea rows="3" className="form-control" id="address" name="address" placeholder="Dirección" value={this.state.address} onChange={this.handleChange} />
              </div>
          </div>
          <br />
          <div className="form-group">
              <div className="col-xs-offset-3 col-xs-9 col-md-offset-2 col-md-10">
                  <input type="submit" className="btn rgm-btn-primary rgm-btn-lg" value="Guardar" />
                  <input type="reset" className="btn rgm-btn-default rgm-btn-lg" value="Cancelar" />
              </div>
          </div>
        </form>
      </div>
    </div>	
  }
  
  handleSubmit(event) {
    event.preventDefault()
    
    // Request
    var request = new Request("../../researchers/add", {
      headers: new Headers({
        "Content-Type": "application/json"
      })
    })

    fetch(request, {
      method: "POST",
      body: JSON.stringify(this.state)
      
    }).then(response => {
      return response.text()
    }).then(() => {
        
      browserHistory.push("/researchers")
    })
//    var url = "../../researchers/add"
//    $.post(url, function(resp) {
//      debugger
//      alert(resp);
//    });
  }
}

ResearcherForm.propTypes = {
  id: React.PropTypes.number,
  firstName: React.PropTypes.string,
  lastName: React.PropTypes.string,
  signatureName: React.PropTypes.string,
  email: React.PropTypes.string,
  address: React.PropTypes.string,
  phone: React.PropTypes.string,
  params: React.PropTypes.object
  
}

export default ResearcherForm