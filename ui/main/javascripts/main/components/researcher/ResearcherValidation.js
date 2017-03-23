export const validate = formProps => {
  const errors = {}

  if (!formProps.firstName) {
    errors.firstName = "Por favor, introduzca un nombre."
  }

  if (!formProps.lastName) {
    errors.lastName = "Por favor, introduzca los apellidos"
  }

  if (!formProps.email) {
    errors.email = "Por favor, introduzca una dirección de correo"
  }

  if (formProps.email && !formProps.email.includes("@")) {
    errors.email = "El texto introducido no es un email."
  }

  if (!formProps.phone) {
    errors.phone = "Por favor, introduzca número de teléfono"
  }

  if(!formProps.signatureName) {
    errors.signatureName = "Por favor, introduzca la firma"
  }

  if(!formProps.address) {
    errors.address = "Por favor, introduzca su dirección postal"
  }

  if (formProps.password !== formProps.confirmPassword) {
    errors.password = "Las contraseñas no coinciden."
    errors.confirmPassword = "Las contraseñas no coinciden."
  }

  return errors
}
