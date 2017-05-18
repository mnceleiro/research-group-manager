package vos

import models.entities.Journal
import play.api.data.Mapping
import play.api.data.Form
import play.api.data.Forms._

case class JournalVO(
  id: Option[Long], code: String, title: String, journal: String, 
  volume: String, startPage: Long, endPage: Long, date: String, 
  editorial: String, place: String, issn: String, status: Long
)

object JournalVO {
  def fromVO(vo: JournalVO): Journal = {
    new Journal(vo.id, vo.code, vo.title, vo.journal, vo.volume, vo.startPage, vo.endPage, vo.date, vo.editorial, vo.place, vo.issn, vo.status)
  }
  
  def toVO(j: Journal): JournalVO = {
    new JournalVO(j.id, j.code, j.title, j.journal, j.volume, j.startPage, j.endPage, j.date, j.editorial, j.place, j.issn, j.status)
  }
  
  val voMapping: Mapping[JournalVO] = mapping(
    "id" -> optional(longNumber),
    "code" -> text,
    "title" -> text,
    "journal" -> text,
    "volume" -> text,
    "startPage" -> longNumber,
    "endPage" -> longNumber,
    "date" -> text,
    "editorial" -> text,
    "place" -> text,
    "issn" -> text,
    "status" -> longNumber
    
  )(JournalVO.apply)(x => Some(x.id, x.code, x.title, x.journal, x.volume, x.startPage, x.endPage, x.date, x.editorial, x.place, x.issn, x.status))
  
  val form = Form(voMapping)
}