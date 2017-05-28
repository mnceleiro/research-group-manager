package vos

import models.entities.Author

import play.api.data.Form
import play.api.data.Forms._
import play.api.libs.json.Json
import models.entities.Congress
import models.entities.AuthorCongress

case class CongressVO(id: Long, title: String, name: String, place: String, country: String, 
    start: Option[String], end: Option[String], international: Boolean, typeId: Long, statusId: Long, authors: Seq[AuthorOfCongressVO])

object CongressVO {

  implicit var pReadsVO = Json.reads[Author]
  implicit var pWritesVO = Json.writes[Author]
  implicit var pFormatVO = Json.format[Author]
  
  def toVO(c: Congress): CongressVO = {
    return CongressVO(c.id, c.title, c.name, c.place, c.country, c.start, c.end, c.international, c.typeId, c.statusId, Seq())
  }
  
  def fromVO(c: CongressVO): Congress = {
    return Congress(c.id, c.title, c.name, c.place, c.country, c.start, c.end, c.international, c.typeId, c.statusId)
  }
  
  def toCongressVOWithAuthors(data: Seq[(Congress, Option[AuthorCongress], Option[Author])]): Option[CongressVO] = {
    val p = CongressVO.toVO(data.head._1)

    if (data.length == 0) return None
    else if (data.length == 1 && data.head._2.isEmpty) {
      val p = data.head._1
      Some(CongressVO(p.id, p.title, p.name, p.place, p.country, p.start, p.end, p.international, p.typeId, p.statusId, Seq()))
      
    } else {
      Some(CongressVO(p.id, p.title, p.name, p.place, p.country, p.start, p.end, p.international, p.typeId, p.statusId, data.map(t => {
        val mid = t._2.get
        val a = t._3.get
        AuthorOfCongressVO(a.id, a.email, a.signature, a.researcherId, None)
      })))
    }
  }
  
  def toTuples(c: CongressVO):(Congress, Seq[AuthorCongress], Seq[Author]) = {
    var main = CongressVO.fromVO(c)
    var mix = c.authors.map(a => {
      AuthorCongress(None, a.id, main.id)
    })
    var authors = c.authors.map(a => Author(a.id, a.email, a.signature, a.researcherId))
    
    (main, mix, authors)
  }
  
  implicit val authorOfCongressWrites = Json.writes[AuthorOfCongressVO]
  implicit val authorOfCongressReads = Json.reads[AuthorOfCongressVO]
  
  implicit val comgressVOWrites = Json.writes[CongressVO]
  implicit val comgressVOReads = Json.reads[CongressVO]
  
  implicit val congressVOForm: Form[CongressVO] = Form(
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
      "statusId" -> longNumber,
      "authors" -> seq(AuthorOfCongressVO.authorMapping)
    )(CongressVO.apply)(x => Some(x.id, x.title, x.name, x.place, x.country, x.start, x.end, x.international, x.typeId, x.statusId, x.authors)))
}