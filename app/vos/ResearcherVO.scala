package vos

import models.entities.ResearcherWithUser
import models.entities.Researcher
import models.entities.User
import play.api.data.Mapping
import play.api.data.Form
import play.api.data.Forms._
import play.api.libs.json.Json
import utils.Password

case class ResearcherVO(id: Long,
  usId: Long, email: String, password: Option[String], confirmPassword: Option[String], admin: Boolean, access: Boolean,
  resId: Long, firstName: String, lastName: String, address: String, phone: String
)

object ResearcherVO {
  def toResearcherUser(vo: ResearcherVO): ResearcherWithUser = {
    
    if (vo.password != vo.confirmPassword) throw new Exception("Password not equals")
    if (vo.password.isDefined) Password.hashPassword(vo.password.get) else vo.password
    
    ResearcherWithUser(
      Researcher(vo.resId, vo.firstName, vo.lastName, vo.address, vo.phone,vo.usId),
      User(vo.usId,
          vo.email, 
          if (vo.password.isDefined) Password.hashPassword(vo.password.get) else vo.password, 
          vo.admin, 
          vo.access)
      )
  }

  def fromResearcherUser(ru: ResearcherWithUser) = {
    val u = ru.user
    val r = ru.researcher
    
    ResearcherVO(r.id, u.id, u.email, None, None, u.admin, u.access, r.id, r.firstName, r.lastName, r.address, r.phone)
  }

  val researcherVOMapping: Mapping[ResearcherVO] = mapping(
    "id" -> longNumber,
    "usId" -> longNumber,
    "email" -> email,
    "password" -> optional(text),
    "confirmPassword" -> optional(text),
    "admin" -> boolean,
    "access" -> boolean,
    "resId" -> longNumber,
    "firstName" -> nonEmptyText,
    "lastName" -> nonEmptyText,
    "address" -> nonEmptyText,
    "phone" -> nonEmptyText)(ResearcherVO.apply)(x => Some(x.id, x.usId, x.email, x.password, x.confirmPassword, x.admin, x.access, x.resId, x.firstName, x.lastName, x.address, x.phone))

  implicit val researcherVOForm: Form[ResearcherVO] = Form(researcherVOMapping)
  implicit val researcherVOWrites = Json.writes[ResearcherVO]
  implicit val researcherVOReads = Json.reads[ResearcherVO]  
}