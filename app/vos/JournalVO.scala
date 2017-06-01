package vos

import play.api.data.Mapping
import play.api.data.Form
import play.api.data.Forms._

import models.entities.Journal
import models.entities.AuthorJournal
import models.entities.Author
import play.api.libs.json.Json

case class JournalVO(
    id: Option[Long], code: String, title: String, journal: String, 
    volume: Option[String], startPage: Option[Long], endPage: Option[Long], date: String, 
    editorial: String, place: String, issn: Option[String], statusId: Long, authors: Seq[AuthorOfJournalVO]
)

object JournalVO {
  def toJournal(vo: JournalVO): Journal = {
    Journal(vo.id, vo.code, vo.title, vo.journal, vo.volume, vo.startPage, vo.endPage, vo.date, vo.editorial, vo.place, vo.issn, vo.statusId)
  }
  
  def toVO(j: Journal): JournalVO = {
        JournalVO(j.id, j.code, j.title, j.journal, j.volume, j.startPage, j.endPage, j.date, j.editorial, j.place, j.issn, j.statusId, Seq())

  }
  
  def toVO(data: Seq[(Journal, Option[AuthorJournal], Option[Author])]): Option[JournalVO] = {
    val j = JournalVO.toVO(data.head._1)

    if (data.length == 0) return None
    else if (data.length == 1 && data.head._2.isEmpty) {
      val j = data.head._1
      Some(JournalVO(j.id, j.code, j.title, j.journal, j.volume, j.startPage, j.endPage, j.date, j.editorial, j.place, j.issn, j.statusId, Seq()))
      
    } else {
      Some(JournalVO(j.id, j.code, j.title, j.journal, j.volume, j.startPage, j.endPage, j.date, j.editorial, j.place, j.issn, j.statusId, data.map(t => {
        val mid = t._2.get
        val a = t._3.get
        AuthorOfJournalVO(a.id, a.email, a.signature, a.researcherId, None)
      })))
    }
  }
    
  def toTuples(j: JournalVO):(Journal, Seq[AuthorJournal], Seq[Author]) = {
    var main = JournalVO.toJournal(j)
    var mix = j.authors.map(a => {
      AuthorJournal(None, a.id, main.id)
    })
    var authors = j.authors.map(a => Author(a.id, a.email, a.signature, a.researcherId))
    
    (main, mix, authors)
  }
  
    val journalVOMapping: Mapping[JournalVO] = mapping(
      "id" -> optional(longNumber),
      "code" -> text,
      "title" -> text,
      "journal" -> text,
      "volume" -> optional(text),
      "startPage" -> optional(longNumber),
      "endPage" -> optional(longNumber),
      "date" -> text,
      "editorial" -> text,
      "place" -> text,
      "issn" -> optional(text),
      "statusId" -> longNumber,
      "authors" -> seq(AuthorOfJournalVO.authorMapping)
  )(JournalVO.apply)(x => Some(x.id, x.code, x.title, x.journal, x.volume, x.startPage, x.endPage, x.date, x.editorial, x.place, x.issn, x.statusId, x.authors))
  
  implicit val journalVOForm: Form[JournalVO] = Form(journalVOMapping)
	implicit val journalWrites = Json.writes[JournalVO]
	implicit val journalReads = Json.reads[JournalVO]
}