package vos

import java.util.Date
import play.api.data.Mapping
import play.api.data.Form
import play.api.data.Forms._
import models.entities.Project
import models.entities.AuthorProject
import models.entities.ProjectWithAuthors

case class ProjectVO(id: Long, code: String, title: String, public: Boolean, startDate: String, endDate: String, budget: Long, researcherCount: Option[Long], withAuthors: Option[Seq[Option[AuthorProject]]])

object ProjectVO {
  def toProject(vo: ProjectVO): Project = {
    Project(vo.id, vo.code, vo.title, vo.public, vo.startDate, vo.endDate, vo.budget, vo.researcherCount)
  }
  
  def toVO(p: Project): ProjectVO = {
    ProjectVO(p.id, p.code, p.title, p.public, p.startDate, p.endDate, p.budget, p.researcherCount, None)
  }
  
  def toVOWithAuthors(pwa: ProjectWithAuthors): ProjectVO = {
    val (p, as) = (pwa.p, pwa.withAuthors)
    ProjectVO(p.id, p.code, p.title, p.public, p.startDate, p.endDate, p.budget, p.researcherCount, as)
  }
  
  val projectVOMapping: Mapping[ProjectVO] = mapping(
      "id" -> longNumber,
      "code" -> text,
      "title" -> text,
      "public" -> boolean,
      "startDate" -> text,
      "endDate" -> text,
      "budget" -> longNumber,
      "researcherCount" -> optional(longNumber),
      "withAuthors" -> optional(seq(optional(AuthorProject.projectVOMapping)))
  )(ProjectVO.apply)(x => Some(x.id, x.code, x.title, x.public, x.startDate, x.endDate, x.budget, x.researcherCount, x.withAuthors))
  
  val projectVOForm: Form[ProjectVO] = Form(projectVOMapping)
}