import React from "react"

export const InputRow = (field) => {
  return (
    <div className="form-group">
      <label className="control-label col-xs-3 col-md-2" htmlFor={field.input.name}>{field.label}:</label>
      <div className="col-xs-9 col-md-9">
        <input {...field.input} type="text" className="form-control" id={field.name} name={field.input.name} placeholder={field.label} />
        {field.meta.touched && field.meta.error && <div className="form-alert alert-danger">{field.meta.error}</div>}
      </div>
    </div>
  )
}
