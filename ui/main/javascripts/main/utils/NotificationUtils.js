import PNotify from "pnotify"

import moment from "moment"

PNotify.prototype.options.styling = "fontawesome"

export const showNotificationBetweenDates = (title, entity, type, start) => {
  let typeMsg = ""
  if (type === "start") typeMsg = " SE INICIARÁ EL DÍA "
  else if (type === "end") typeMsg = " FINALIZARÁ EL DÍA "
  else typeMsg = " TENDRÁ LUGAR EL DÍA "
  new PNotify({
    title: "Aviso de próximos eventos",
    // text: "El evento " + title + typeMsg + moment(start, "DD/MM/YYYY").locale("es").format("L") + " y el " + moment(end, "DD/MM/YYYY").locale("es").format("L"),
    text: "El evento " + title + typeMsg + "<strong>" + moment(start, "DD/MM/YYYY").locale("es").format("L") + "</strong>",
    delay: 13000
  })
}
