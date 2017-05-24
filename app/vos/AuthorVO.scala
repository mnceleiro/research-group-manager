package vos

import play.api.data.Mapping
import play.api.data.Form
import play.api.data.Forms._

import models.entities.Book
import models.entities.Congress
import models.entities.Journal
import models.entities.Researcher
import models.entities.Project

case class AuthorVO(
    id: Long, email: String, signature: String, researcher: Option[Researcher], 
    books: Option[Seq[Book]], journals: Option[Seq[Journal]], congresses: Option[Seq[Congress]], projects: Option[Seq[Project]]
)

trait AuthorOfAbstractVO{
  val id: Long
  val email: String
  val signature: String
  val researcherId: Option[Long]
  val res: Option[ResearcherVO]
}

case class AuthorOfProjectVO(id: Long, email: String, signature: String, researcherId: Option[Long], role: Long, res: Option[ResearcherVO])
case class AuthorOfCongressVO(id: Long, email: String, signature: String, researcherId: Option[Long], res: Option[ResearcherVO]) extends AuthorOfAbstractVO
case class AuthorOfBookVO(id: Long, email: String, signature: String, researcherId: Option[Long], res: Option[ResearcherVO]) extends AuthorOfAbstractVO
case class AuthorOfJournalVO(id: Long, email: String, signature: String, researcherId: Option[Long], res: Option[ResearcherVO]) extends AuthorOfAbstractVO

object AuthorOfProjectVO {
  val authorMapping: Mapping[AuthorOfProjectVO] = mapping(
    "id" -> longNumber,
    "email" -> text,
    "signature" -> text,
    "researcherId" -> optional(longNumber),
    "role" -> longNumber,
    "res" -> optional(ResearcherVO.researcherVOMapping)
  )(AuthorOfProjectVO.apply)(x => Some(x.id, x.email, x.signature, x.researcherId, x.role, x.res))

  val authorForm: Form[AuthorOfProjectVO] = Form(authorMapping)
}

object AuthorOfCongressVO {
  val authorMapping: Mapping[AuthorOfCongressVO] = mapping(
    "id" -> longNumber,
    "email" -> text,
    "signature" -> text,
    "researcherId" -> optional(longNumber),
    "res" -> optional(ResearcherVO.researcherVOMapping)
  )(AuthorOfCongressVO.apply)(x => Some(x.id, x.email, x.signature, x.researcherId, x.res))

  val authorForm: Form[AuthorOfCongressVO] = Form(authorMapping)
}

