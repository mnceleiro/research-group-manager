import DateUtils from "../../utils/DateUtils"

export const validate = formProps => {
  const errors = {}

  if (!formProps.code) {
    errors.code = "Por favor, introduzca un código."

  } else if (formProps.code.split("").length >= 100) {
    errors.code = "Este campo excede el numero de caracteres permitido."
  }

  if (!formProps.title) {
    errors.title = "Por favor, introduzca un título."

  } else if (formProps.title.split("").length >= 200) {
    errors.title = "Este campo excede el número de caracteres permitido."
  }


  if (!formProps.journal) {
    errors.journal = "Por favor, introduzca el nombre de la revista"

  } else if (formProps.journal.split("").length >= 200) {
    errors.journal = "Este campo excede el número de caracteres permitido."
  }

  if (!formProps.editorial) {
    errors.editorial = "Por favor, introduzca la editorial de la revista"

  } else if (formProps.editorial.split("").length >= 200) {
    errors.editorial = "Este campo excede el número de caracteres permitido."
  }

  if (!formProps.place) {
    errors.place = "Por favor, introduzca un lugar"

  } else if (formProps.place.split("").length >= 200) {
    errors.place = "Este campo excede el número de caracteres permitido."
  }

  if (formProps.startPage && !(formProps.startPage == parseInt(formProps.startPage, 10))) {
    errors.startPage = "El número de página no está en el formato correcto."
  }

  if (formProps.endPage && !(formProps.endPage == parseInt(formProps.endPage, 10))) {
    errors.endPage = "El número de página no está en el formato correcto."
  }

  if (formProps.startPage && formProps.endPage && formProps.startPage > formProps.endPage) {
    errors.startPage = "La página de inicio no puede ser mayor que la de fin."
    errors.endPage = "La página de inicio no puede ser mayor que la de fin."
  }

  if ((formProps.startPage && !formProps.endPage) || !formProps.startPage && formProps.endPage) {
    errors.startPage = "Si introduce página de inicio o fin debe introducir ambas."
    errors.endPage = "Si introduce página de inicio o fin debe introducir ambas."
  }

  if (!formProps.date) {
    errors.date = "Por favor, introduzca la fecha de la revista"
  }

  if (formProps.date && !DateUtils.isValid(formProps.date)) {
    errors.startDate = "Por favor, introduzca una fecha valida."
  }

  return errors
}
