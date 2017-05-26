package models.entities

import play.api.data.Form
import play.api.data.Forms._
import play.api.libs.json.Json

case class Author(
  id: Long, email: String, 
  signature: String, researcherId: Option[Long]
)

object Author {
  val authorMapping = mapping(
    "id" -> longNumber,
    "email" -> text,
    "signature" -> text,
    "researcherId" -> optional(longNumber)
  )(Author.apply)(x => Some(x.id, x.email, x.signature, x.researcherId))
  
  implicit val authorForm: Form[Author] = Form(authorMapping)
  implicit val authorReads = Json.reads[Author]
  implicit val authorWrites = Json.writes[Author]
}