package vos

import play.api.data.Mapping
import play.api.data.Form
import play.api.data.Forms._

import models.entities.Journal
import models.entities.Congress
import models.entities.Journal
import models.entities.Researcher
import models.entities.Author
import play.api.libs.json.Json

case class AuthorVO(
    id: Long, email: String, signature: String, researcher: Option[Researcher]
)

object AuthorVO {
  def toVO(a: Author, r: Option[Researcher]): AuthorVO = {
    AuthorVO(a.id, a.email, a.signature, r)
  }
  
  val authorMapping: Mapping[AuthorVO] = mapping(
    "id" -> longNumber,
    "email" -> text,
    "signature" -> text,
    "researcher" -> optional(Researcher.researcherMapping) 
  )(AuthorVO.apply)(x => Some(x.id, x.email, x.signature, x.researcher))
  
  implicit val authorReads = Json.reads[AuthorVO]
  implicit val authorWrites = Json.writes[AuthorVO]
  implicit val authorForm: Form[AuthorVO] = Form(authorMapping)
}

trait AuthorOfAbstractVO{
  val id: Long
  val email: String
  val signature: String
  val researcherId: Option[Long]
  val res: Option[ResearcherVO]
}

case class AuthorOfProjectVO(id: Long, email: String, signature: String, researcherId: Option[Long], role: Long, res: Option[ResearcherVO]) extends AuthorOfAbstractVO
case class AuthorOfCongressVO(id: Long, email: String, signature: String, researcherId: Option[Long], res: Option[ResearcherVO]) extends AuthorOfAbstractVO
case class AuthorOfJournalVO(id: Long, email: String, signature: String, researcherId: Option[Long], res: Option[ResearcherVO]) extends AuthorOfAbstractVO

object AuthorOfProjectVO {
  
  def toAuthor(vo: AuthorVO) = {
    val resId = if (vo.researcher.isDefined) Option(vo.researcher.get.id) else None
    Author(vo.id, vo.email, vo.signature, resId)
  }
  
  val authorMapping: Mapping[AuthorOfProjectVO] = mapping(
    "id" -> longNumber,
    "email" -> text,
    "signature" -> text,
    "researcherId" -> optional(longNumber),
    "role" -> longNumber,
    "res" -> optional(ResearcherVO.researcherVOMapping)
  )(AuthorOfProjectVO.apply)(x => Some(x.id, x.email, x.signature, x.researcherId, x.role, x.res))

  implicit val authorForm: Form[AuthorOfProjectVO] = Form(authorMapping)
	implicit val authorOfProjectWrites = Json.writes[AuthorOfProjectVO]
	implicit val authorOfProjectReads = Json.reads[AuthorOfProjectVO]
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
	implicit val authorOfCongressWrites = Json.writes[AuthorOfCongressVO]
	implicit val authorOfCongressReads = Json.reads[AuthorOfCongressVO]
}

object AuthorOfJournalVO {
  val authorMapping: Mapping[AuthorOfJournalVO] = mapping(
    "id" -> longNumber,
    "email" -> text,
    "signature" -> text,
    "researcherId" -> optional(longNumber),
    "res" -> optional(ResearcherVO.researcherVOMapping)
  )(AuthorOfJournalVO.apply)(x => Some(x.id, x.email, x.signature, x.researcherId, x.res))

  implicit val authorForm: Form[AuthorOfJournalVO] = Form(authorMapping)
	implicit val authorOfJournalWrites = Json.writes[AuthorOfJournalVO]
	implicit val authorOfJournalReads = Json.reads[AuthorOfJournalVO]
}

