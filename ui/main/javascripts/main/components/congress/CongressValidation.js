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

  return errors
}
