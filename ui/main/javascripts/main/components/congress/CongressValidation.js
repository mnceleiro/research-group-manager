import DateUtils from "../../utils/DateUtils"

export const validate = formProps => {
  const errors = {}

  if (!formProps.title) {
    errors.title = "Por favor, introduzca un título."
  } else if (formProps.title.split("").length >= 200) {
    errors.title = "Este campo excede el número de caracteres permitido."
  }

  if (!formProps.name) {
    errors.name = "Por favor, introduzca los nombre"
  } else if (formProps.name.split("").length >= 200) {
    errors.name = "Este campo excede el número de caracteres permitido."
  }

  if (!formProps.place) {
    errors.place = "Por favor, introduzca un lugar"
  } else if (formProps.place.split("").length >= 200) {
    errors.place = "Este campo excede el número de caracteres permitido."
  }

  if (!formProps.country) {
    errors.country = "Por favor, introduzca un país."
  } else if (formProps.country.split("").length >= 200) {
    errors.country = "Este campo excede el número de caracteres permitido."
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
