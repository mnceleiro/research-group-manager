let instance = null

class SessionUtils {

  constructor() {
    if (instance) {
      return instance
    }

    this.instance = this
  }
  getAuthString() {
    return "Bearer " + JSON.parse(localStorage.getItem("current_user")).token
  }

  setData(value) {
    localStorage.setItem("current_user", value)
  }

  isAuthenticated() {
    return localStorage.getItem("current_user") ? true : false
  }
}

SessionUtils.instance = null

export const sessionUtils = new SessionUtils()
