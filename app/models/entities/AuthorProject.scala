package models.entities

import play.api.data.Form
import play.api.data.Forms._
import play.api.data.Mapping

case class AuthorProject(id: Option[Long], authorId: Long, projectId: Long, role: Long)

object AuthorProject {
    val projectVOMapping: Mapping[AuthorProject] = mapping(
      "id" -> optional(longNumber),
      "authorId" -> longNumber,
      "projectId" -> longNumber,
      "role" -> longNumber
  )(AuthorProject.apply)(x => Some(x.id, x.authorId, x.projectId, x.role))
}