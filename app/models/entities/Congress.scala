package models.entities

import play.api.data.Form
import play.api.data.Forms._

case class Congress(id: Long, title: String, name: String, place: String, country: String, startDate: Option[String], endDate: Option[String], international: Boolean, typeId: Long, statusId: Long) extends BaseEntity

object Congress {
    val congressForm: Form[Congress] = Form(
      mapping(
          "id" -> longNumber,
          "title" -> text,
          "name" -> text,
          "place" -> text,
          "country" -> text,
          "start" -> optional(text),
          "end" -> optional(text),
          "international" -> boolean,
          "typeId" -> longNumber,
          "statusId" -> longNumber
      )(Congress.apply)(x => Some(x.id, x.title, x.name, x.place, x.country, x.startDate, x.endDate, x.international, x.typeId, x.statusId))
  )
}