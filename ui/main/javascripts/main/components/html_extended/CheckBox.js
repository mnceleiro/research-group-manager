import React from "react"
import { Field } from "redux-form"

export const CheckBox = (data) => {
  return (
    <div className="checkbox col-md-offset-2 col-md-2">
      <label className="control-label">
        <Field disabled={data.disabled || false} type="checkbox" id={data.name} name={data.name} component="input" />{data.text}
      </label>
    </div>
  )
}
