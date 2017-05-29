import DateUtils from "../../utils/DateUtils"

export const validate = formProps => {
  const errors = {}

  if (!formProps.code) {
    errors.code = "Por favor, introduzca un código."
  }

  if (!formProps.title) {
    errors.title = "Por favor, introduzca el título"
  }

  // if (formProps.startDate) {
  //   debugger
  //   if (moment(formProps.startDate, "DD/MM/YYYY").toDate() instanceof Date) {
  //     errors.startDate = "Por favor, introduzca una fecha valida"
  //   }
  // }
  if (formProps.startDate && !DateUtils.isValid(formProps.startDate)) {
    errors.startDate = "Por favor, introduzca una fecha valida."
  }

  if (formProps.endDate && !DateUtils.isValid(formProps.endDate)) {
    errors.endDate = "La fecha introducida no es válida."
  }

  if (formProps.startDate && formProps.endDate) {
    if (DateUtils.greaterThan(formProps.startDate, formProps.endDate)) {
      errors.startDate = "La fecha de inicio no puede ser superior a la de fin."
      errors.endDate = "La fecha de inicio no puede ser superior a la de fin."
    }
  }

  // if (!formProps.budget) {
  //   errors.budget = "Por favor, introduzca el presupuesto."
  // }

  return errors
}
