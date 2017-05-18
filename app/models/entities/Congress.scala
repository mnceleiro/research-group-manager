package models.entities

import play.api.data.Form
import play.api.data.Forms._

case class Congress(id: Long, title: String, name: String, place: String, country: String, start: String, end: String, international: Boolean) extends BaseEntity

object Congress {
    val congressForm: Form[Congress] = Form(
      mapping(
          "id" -> longNumber,
          "title" -> text,
          "name" -> text,
          "place" -> text,
          "country" -> text,
          "start" -> text,
          "end" -> text,
          "public" -> boolean
      )(Congress.apply)(x => Some(x.id, x.title, x.name, x.place, x.country, x.start, x.end, x.international))
  )
}