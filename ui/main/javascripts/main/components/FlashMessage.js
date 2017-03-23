import React, {Component} from "react"
import {connect} from "react-redux"

class FlashMessage extends Component{

  render() {
    const {message, className} = this.props.flashMessage
    if(!message){
      return null
    }

    return (
      <div className="row">
        <div className={"col-md-12 alert " + className} role="alert">
          {message}
        </div>
      </div>
    )
  }
}

FlashMessage.propTypes = {
  flashMessage: React.PropTypes.object,
  message: React.PropTypes.string,
  className: React.PropTypes.string
}

const mapStateToProps = (flashMessage) => {
  return flashMessage
}

export default connect(mapStateToProps)(FlashMessage)
