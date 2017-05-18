package models.entities

import play.api.data.Form
import play.api.data.Forms._

case class Author(
  id: Long, email: String, 
  signature: String, researcherId: Option[Long]
)

case class AuthorFull(
  author: Author, researcher: Option[Researcher]
)

object Author {
  val authorMapping = mapping(
    "id" -> longNumber,
    "email" -> text,
    "signature" -> text,
    "researcherId" -> optional(longNumber)
  )(Author.apply)(x => Some(x.id, x.email, x.signature, x.researcherId))
  
  val congressForm: Form[Author] = Form(authorMapping)
}