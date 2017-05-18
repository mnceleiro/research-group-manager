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

  getUser() {
    let userObject = JSON.parse(localStorage.getItem("current_user"))
    if (userObject.email) userObject.name = userObject.email.substring(0, userObject.email.indexOf("@"))

    return userObject
  }
}

SessionUtils.instance = null

export const sessionUtils = new SessionUtils()
