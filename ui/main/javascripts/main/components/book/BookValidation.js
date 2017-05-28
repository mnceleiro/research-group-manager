export const validate = formProps => {
  const errors = {}

  if (!formProps.code) {
    errors.code = "Por favor, introduzca un código."
  }

  if (!formProps.title) {
    errors.title = "Por favor, introduzca un título."
  }


  if (!formProps.book) {
    errors.book = "Por favor, introduzca el nombre del libro"
  }

  if (!formProps.editorial) {
    errors.editorial = "Por favor, introduzca la editorial del libro"
  }

  if (!formProps.place) {
    errors.place = "Por favor, introduzca un lugar"
  }

  if (formProps.startPage && !(formProps.startPage == parseInt(formProps.startPage, 10))) {
    errors.startPage = "El número de página no está en el formato correcto."
  }

  if (formProps.endPage && !(formProps.endPage == parseInt(formProps.endPage, 10))) {
    errors.endPage = "El número de página no está en el formato correcto."
  }

  // if (formProps.isbn && !isValidIsbn(formProps.isbn)) {
  //   errors.isbn = "El formato del isbn introducido no es válido."
  // }

  return errors
}
