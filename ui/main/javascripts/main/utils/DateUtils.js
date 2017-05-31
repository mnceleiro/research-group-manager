import moment from "moment"

export default class DateUtils {
  static isValid(d) {
    return d && moment(d, "DD/MM/YYYY").isValid()
  }

  static dateFromStr(d1) {
    return moment(d1, "DD/MM/YYYY").toDate()
  }

  static greaterThan(d1, d2) {
    let x1 = moment(d1, "DD/MM/YYYY").toDate()
    let x2 = moment(d2, "DD/MM/YYYY").toDate()
    return moment.utc(x1).diff(moment.utc(x2)) > 0
  }
}
