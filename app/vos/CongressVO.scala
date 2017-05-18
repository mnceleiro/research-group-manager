package vos

import models.entities.Author

import play.api.data.Form
import play.api.data.Forms._
import play.api.libs.json.Json
import models.entities.Congress

case class CongressVO(id: Long, title: String, name: String, place: String, country: String, start: String, end: String, international: Boolean, authors: Option[Seq[Author]])

object CongressVO {

  implicit var pReadsVO = Json.reads[Author]
  implicit var pWritesVO = Json.writes[Author]
  implicit var pFormatVO = Json.format[Author]
  
  def toVO(c: Congress): CongressVO = {
    return CongressVO(c.id, c.title, c.name, c.place, c.country, c.start, c.end, c.international, None)
  }
  
  def fromVO(c: CongressVO): Congress = {
    return Congress(c.id, c.title, c.name, c.place, c.country, c.start, c.end, c.international)
  }

  val congressVOForm: Form[CongressVO] = Form(
    mapping(
      "id" -> longNumber,
      "title" -> text,
      "name" -> text,
      "place" -> text,
      "country" -> text,
      "start" -> text,
      "end" -> text,
      "international" -> boolean,
      "authors" -> optional(seq(Author.authorMapping)))(CongressVO.apply)(x => Some(x.id, x.title, x.name, x.place, x.country, x.start, x.end, x.international, x.authors)))
}