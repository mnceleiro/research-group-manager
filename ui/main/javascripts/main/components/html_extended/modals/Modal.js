import React from "react"

export const LoadingModal = (data) => {
  let className = "hide"

  if (data.isOpen) {
    className="show"
  }

  return (
    <div id="myModal" className={"modal " + className}>
      <div className="modal-content">
        <p>Cargando... espere por favor</p>
      </div>
    </div>
  )
}

export const ErrorModal = (data) => {
  let className = "hide"

  if (data.isOpen) {
    className="show"
  }

  return (
    <div id="myModal" className={"modal " + className}>
      <div className="modal-header">
        <span className="close">&times;</span>
        <h2>{data.header || "Ha ocurrido un error"}</h2>
      </div>

      <div className="modal-content">
        <p>{data.message}</p>
      </div>
    </div>
  )
}
