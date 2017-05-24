package models.entities

import java.util.Date

import play.api.data.Form
import play.api.data.Forms._
import play.api.data.Mapping


case class Project(
    id: Long, code: String, title: String, 
    public: Boolean, startDate: String, endDate: String, budget: Long, 
    researcherCount: Option[Long]
) extends BaseEntity

//case class WithAuthor(authorId: Long, role: Long)

case class ProjectWithAuthors(
    p: Project, withAuthors: Option[Seq[AuthorProject]]
)