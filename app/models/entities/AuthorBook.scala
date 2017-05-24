package models.entities

import play.api.data.Form
import play.api.data.Forms._
import play.api.data.Mapping

case class AuthorBook(id: Option[Long], authorId: Long, bookId: Long)

object AuthorBook {
    val projectVOMapping: Mapping[AuthorBook] = mapping(
      "id" -> optional(longNumber),
      "authorId" -> longNumber,
      "bookId" -> longNumber
  )(AuthorBook.apply)(x => Some(x.id, x.authorId, x.bookId))
}