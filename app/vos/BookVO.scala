package vos

import play.api.data.Mapping
import play.api.data.Form
import play.api.data.Forms._

import models.entities.Book
import models.entities.AuthorBook
import models.entities.Author
import play.api.libs.json.Json

case class BookVO(
    id: Option[Long], code: String, title: String, book: String, 
    volume: Option[String], startPage: Option[Long], endPage: Option[Long], year: Option[Long], 
    editorial: String, place: String, isbn: Option[String], statusId: Long, authors: Seq[AuthorOfBookVO]
)

object BookVO {
  def toBook(vo: BookVO): Book = {
    Book(vo.id, vo.code, vo.title, vo.book, vo.volume, vo.startPage, vo.endPage, vo.year, vo.editorial, vo.place, vo.isbn, vo.statusId)
  }
  
  def toVO(b: Book): BookVO = {
        BookVO(b.id, b.code, b.title, b.book, b.volume, b.startPage, b.endPage, b.year, b.editorial, b.place, b.isbn, b.statusId, Seq())

  }
  
  def toVO(data: Seq[(Book, Option[AuthorBook], Option[Author])]): Option[BookVO] = {
    val b = BookVO.toVO(data.head._1)

    if (data.length == 0) return None
    else if (data.length == 1 && data.head._2.isEmpty) {
      val b = data.head._1
      Some(BookVO(b.id, b.code, b.title, b.book, b.volume, b.startPage, b.endPage, b.year, b.editorial, b.place, b.isbn, b.statusId, Seq()))
      
    } else {
      Some(BookVO(b.id, b.code, b.title, b.book, b.volume, b.startPage, b.endPage, b.year, b.editorial, b.place, b.isbn, b.statusId, data.map(t => {
        val mid = t._2.get
        val a = t._3.get
        AuthorOfBookVO(a.id, a.email, a.signature, a.researcherId, None)
      })))
    }
  }
    
  def toTuples(b: BookVO):(Book, Seq[AuthorBook], Seq[Author]) = {
    var main = BookVO.toBook(b)
    var mix = b.authors.map(a => {
      AuthorBook(None, a.id, main.id)
    })
    var authors = b.authors.map(a => Author(a.id, a.email, a.signature, a.researcherId))
    
    (main, mix, authors)
  }
  
    val bookVOMapping: Mapping[BookVO] = mapping(
      "id" -> optional(longNumber),
      "code" -> text,
      "title" -> text,
      "book" -> text,
      "volume" -> optional(text),
      "startPage" -> optional(longNumber),
      "endPage" -> optional(longNumber),
      "year" -> optional(longNumber),
      "editorial" -> text,
      "place" -> text,
      "isbn" -> optional(text),
      "statusId" -> longNumber,
      "authors" -> seq(AuthorOfBookVO.authorMapping)
  )(BookVO.apply)(x => Some(x.id, x.code, x.title, x.book, x.volume, x.startPage, x.endPage, x.year, x.editorial, x.place, x.isbn, x.statusId, x.authors))
  
  implicit val bookVOForm: Form[BookVO] = Form(bookVOMapping)
	implicit val bookWrites = Json.writes[BookVO]
	implicit val bookReads = Json.reads[BookVO]
}