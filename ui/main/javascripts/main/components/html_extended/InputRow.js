import React from "react"

export const InputRow = (field) => {
  return (
    <div className="form-group">
      <label className="control-label col-xs-3 col-md-2" htmlFor={field.input.name}>{field.label}:</label>
      <div className="col-xs-9 col-md-9">
        <input disabled={field.disabled || false} {...field.input} type="text" className="form-control" id={field.id} name={field.input.name} placeholder={field.label} />
        {field.meta.touched && field.meta.error && <div className="form-alert alert-danger">{field.meta.error}</div>}
      </div>
    </div>
  )
}

export const InlineInputRow = (field) => {
  const inputWidth = field.inputWidth || 4
  const labelWidth = field.labelWidth || 1

  return (
      <div>
        <label className={"control-label col-xs-3 col-md-"+labelWidth} htmlFor={field.input.name}>{field.label}:</label>
        <div className={"col-xs-9 col-md-"+inputWidth}>
          <input {...field.input} type={field.type} className="form-control" id={field.name} name={field.input.name} placeholder={field.label} />
          {field.meta.touched && field.meta.error && <div className="form-alert alert-danger">{field.meta.error}</div>}
        </div>
      </div>
  )
}
