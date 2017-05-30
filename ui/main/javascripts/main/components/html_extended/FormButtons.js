import React from "react"

export const FormButtons = (data) => {
  var { canDelete, deleteName, saveText, cancelText, deleteText, cancelAction, deleteAction } = data

  var { offset } = data

  let offsetCN = "col-md-offset-2 col-md-7"
  if (offset) {
    offsetCN = offsetCN.replace("col-md-offset-2", "col-md-offset-" + offset)
    offsetCN = offsetCN.replace("col-md-7", "col-md-" + (9-offset))
  }
  // console.log(JSON.stringify(data))
  return (
    <div className="form-group">
      <div className={offsetCN}>
        <input type="submit" className="btn rgm-btn-primary rgm-btn-lg" value={saveText} />
        <input type="button" className="btn rgm-btn-default rgm-btn-lg" value={cancelText} onClick={cancelAction} />
      </div>
      {
        canDelete &&
          <div className="col-md-2">
            <input type="button" id={deleteName} name={deleteName} className="btn rgm-btn-default rgm-btn-lg"
              value={deleteText} onClick={deleteAction} />
          </div>
      }
    </div>
  )
}
