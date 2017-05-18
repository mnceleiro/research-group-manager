export const validate = formProps => {
  const errors = {}

  if (!formProps.code) {
    errors.code = "Por favor, introduzca un código."
  }

  if (!formProps.title) {
    errors.title = "Por favor, introduzca el título"
  }

  // if (!formProps.startDate) {
  //   errors.email = "Por favor, introduzca una dirección de correo"
  // }
  //
  // if (!formProps.endDate) {
  //   errors.email = "El texto introducido no es un email."
  // }

  // if (!formProps.budget) {
  //   errors.budget = "Por favor, introduzca el presupuesto."
  // }

  return errors
}
