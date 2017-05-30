export const validate = fp => {
  const errors = {}

  if (!fp.email) {
    errors.email = "Por favor, introduzca una dirección de correo"
  }

  if (fp.email && !fp.email.includes("@")) {
    errors.email = "El texto introducido no es un email."
  }

  if (!fp.signature) {
    errors.signature = "Por favor, introduzca la firma de autor"
  }

  return errors
}
