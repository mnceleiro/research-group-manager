package models.entities

import play.api.data.Form
import play.api.data.Forms._

case class Congress(id: Long, title: String, name: String, minute: String, place: String, country: String, start: String, end: String, public: Boolean)

object Congress {
    val congressForm: Form[Congress] = Form(
      mapping(
          "id" -> longNumber,
          "title" -> text,
          "name" -> text,
          "minute" -> text,
          "place" -> text,
          "country" -> text,
          "start" -> text,
          "end" -> text,
          "public" -> boolean
      )(Congress.apply)(x => Some(x.id, x.title, x.name, x.minute, x.place, x.country, x.start, x.end, x.public))
  )
}