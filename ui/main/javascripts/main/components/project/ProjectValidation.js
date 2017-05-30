import DateUtils from "../../utils/DateUtils"

export const validate = formProps => {
  const errors = {}

  if (!formProps.code) {
    errors.code = "Por favor, introduzca un código."

  } else if (formProps.code.split("").length >= 100) {
    errors.code = "Este campo excede el número de caracteres permitido."
  }

  if (!formProps.title) {
    errors.title = "Por favor, introduzca el título"

  } else if (formProps.title.split("").length >= 200) {
    errors.title = "Este campo excede el número de caracteres permitido."
  }

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

  if (formProps.budget && formProps.budget > 1000000) {
    errors.budget = "El presupuesto introducido supera el límite permitido."
  } else if (formProps.budget < 0) {
    errors.budget = "El presupuesto no puede ser negativo."
  }

  return errors
}
