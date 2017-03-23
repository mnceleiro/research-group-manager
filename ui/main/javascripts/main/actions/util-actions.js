import FLASH_MESSAGE from "../constants/actionTypes"

export const sendFlashMessage = (message, className) => {
  return {
    type: FLASH_MESSAGE,
    payload: {
      message,
      className
    }
  }
}
