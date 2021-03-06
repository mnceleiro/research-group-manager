package vos

import java.util.Date
import play.api.data.Mapping
import play.api.data.Form
import play.api.data.Forms._
import models.entities.Project
import models.entities.ProjectWithAuthors
import models.entities.Author
import models.entities.ResearcherWithUser
import models.entities.Role
import models.entities.AuthorProject
import play.api.libs.json.Json

case class ProjectVO(id: Long, code: String, title: String, public: Boolean, startDate: Option[String], endDate: Option[String], budget: Option[Long], researcherCount: Option[Long], authors: Seq[AuthorOfProjectVO])


object ProjectVO {
  def toProject(vo: ProjectVO): Project = {
    Project(vo.id, vo.code, vo.title, vo.public, vo.startDate, vo.endDate, vo.budget, vo.researcherCount)
  }
  
  def toVO(p: Project): ProjectVO = {
    ProjectVO(p.id, p.code, p.title, p.public, p.startDate, p.endDate, p.budget, p.researcherCount, Seq())
  }

  def toVO(data: Seq[(Project, Option[AuthorProject], Option[Author])]): Option[ProjectVO] = {
    val p = ProjectVO.toVO(data.head._1)

    if (data.length == 0) return None
    else if (data.length == 1 && data.head._2.isEmpty) {
      val p = data.head._1
      Some(ProjectVO(p.id, p.code, p.title, p.public, p.startDate, p.endDate, p.budget, p.researcherCount, Seq()))
      
    } else {
      Some(ProjectVO(p.id, p.code, p.title, p.public, p.startDate, p.endDate, p.budget, p.researcherCount, data.map(t => {
        val mid = t._2.get
        val a = t._3.get
        AuthorOfProjectVO(a.id, a.email, a.signature, a.researcherId, mid.role, None)
      })))
    }
  }
  
  def toTuples(p: ProjectVO):(Project, Seq[AuthorProject], Seq[Author]) = {
    var main = ProjectVO.toProject(p)
    var mix = p.authors.map(a => {
      AuthorProject(None, a.id, main.id, a.role)
    })
    var authors = p.authors.map(a => Author(a.id, a.email, a.signature, a.researcherId))
    
    (main, mix, authors)
  }
  
  val projectVOMapping: Mapping[ProjectVO] = mapping(
      "id" -> longNumber,
      "code" -> text,
      "title" -> text,
      "public" -> boolean,
      "startDate" -> optional(text),
      "endDate" -> optional(text),
      "budget" -> optional(longNumber),
      "researcherCount" -> optional(longNumber),
      "authors" -> seq(AuthorOfProjectVO.authorMapping)
  )(ProjectVO.apply)(x => Some(x.id, x.code, x.title, x.public, x.startDate, x.endDate, x.budget, x.researcherCount, x.authors))
  
  implicit val projectVOForm: Form[ProjectVO] = Form(projectVOMapping)
	implicit val projectWrites = Json.writes[ProjectVO]
	implicit val projectReads = Json.reads[ProjectVO]
}