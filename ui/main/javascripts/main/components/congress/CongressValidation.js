import DateUtils from "../../utils/DateUtils"

export const validate = formProps => {
  const errors = {}

  if (!formProps.title) {
    errors.title = "Por favor, introduzca un título."
  }

  if (!formProps.name) {
    errors.name = "Por favor, introduzca los nombre"
  }

  if (!formProps.place) {
    errors.place = "Por favor, introduzca un lugar"
  }

  if (!formProps.country) {
    errors.country = "Por favor, introduzca un país."
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

  return errors
}
