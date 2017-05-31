import PNotify from "pnotify"

import moment from "moment"

PNotify.prototype.options.styling = "fontawesome"

export const showNotificationBetweenDates = (title, entity, type, start) => {
  let typeMsg = ""
  if (type === "start") typeMsg = " SE INICIARÁ EL DÍA "
  else if (type === "end") typeMsg = " FINALIZARÁ EL DÍA "
  else typeMsg = " TENDRÁ LUGAR EL DÍA "

  let entityDesc = "evento"
  if (entity === "project") entityDesc = "proyecto"
  else if (entity === "congress") entityDesc = "congreso"


  new PNotify({
    title: "Aviso de próximos eventos",
    text: "El " + entityDesc + " " + title + typeMsg + "<strong>" + moment(start, "DD/MM/YYYY").locale("es").format("L") + "</strong>",
    delay: 7000
  })
}

export const removeAll = () => {
  PNotify.removeAll()
}
