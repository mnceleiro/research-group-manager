export const validate = fp => {
  const errors = {}

  if (!fp.email) {
    errors.email = "Por favor, introduzca una dirección de correo"

  } else if (fp.email.split("").length >= 200) {
    errors.email = "Este campo excede el número de caracteres permitido."
    
  } else if (!fp.email.includes("@")) {
    errors.email = "El texto introducido no es un email."
  }

  if (!fp.signature) {
    errors.signature = "Por favor, introduzca la firma de autor"
  } else if (fp.signature.split("").length >= 200) {
    errors.signature = "Este campo excede el número de caracteres permitido."
  }

  return errors
}
