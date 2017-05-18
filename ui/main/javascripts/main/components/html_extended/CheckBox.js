import React from "react"
import { Field } from "redux-form"

export const CheckBox = (data) => {
  return (
    <div className="checkbox col-xs-offset-2 col-md-offset-2 col-xs-3 col-md-2">
      <label className="control-label">
        <Field type="checkbox" id={data.name} name={data.name} component="input" />{data.text}
      </label>
    </div>
  )
}
