export const validate = formProps => {
  const errors = {}

  if (!formProps.firstName) {
    errors.firstName = "Por favor, introduzca un nombre."
  } else if (formProps.firstName.split("").length >= 200) {
    errors.firstName = "Este campo excede el número de caracteres permitido."
  } else if (formProps.firstName.split("").length < 3) {
    errors.firstName = "Este campo debe tener un mínimo de tres caracteres."
  }

  if (!formProps.lastName) {
    errors.lastName = "Por favor, introduzca los apellidos"
  } else if (formProps.lastName.split("").length >= 200) {
    errors.lastName = "Este campo excede el número de caracteres permitido."
  } else if (formProps.lastName.split("").length < 3) {
    errors.firstName = "Este campo debe tener un mínimo de tres caracteres."
  }

  if (!formProps.email) {
    errors.email = "Por favor, introduzca una dirección de correo"
  } else if (formProps.email.split("").length >= 200) {
    errors.email = "Este campo excede el número de caracteres permitido."
  }

  if (formProps.email && !formProps.email.includes("@")) {
    errors.email = "El texto introducido no es un email."
  }

  if (!formProps.phone) {
    errors.phone = "Por favor, introduzca número de teléfono"
  } else if (formProps.phone > 999999999999) {
    errors.phone = "El máximo de cifras que se puede introducir es 12."
  } else if (formProps.phone < 10000) {
    errors.phone = "El mínimo de cifras que se puede introducir es 5."
  }

  if(!formProps.address) {
    errors.address = "Por favor, introduzca su dirección postal"
  } else if (formProps.address.split("").length >= 200) {
    errors.address = "Este campo excede el número de caracteres permitido."
  }

  if (formProps.password !== formProps.confirmPassword) {
    errors.password = "Las contraseñas no coinciden."
    errors.confirmPassword = "Las contraseñas no coinciden."

  } else if (formProps.password && (formProps.password.split("").length >= 40 || formProps.password.split("").length < 3)) {
    errors.password = "Este campo no puede ser menor de 3 caracteres ni mayor de 40."
    errors.confirmPassword = "Este campo no puede ser menor de 3 caracteres ni mayor de 40."
  }

  return errors
}
