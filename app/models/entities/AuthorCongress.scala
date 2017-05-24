package models.entities

import play.api.data.Form
import play.api.data.Forms._
import play.api.data.Mapping

case class AuthorCongress(id: Option[Long], authorId: Long, congressId: Long)

object AuthorCongress {
    val projectVOMapping: Mapping[AuthorCongress] = mapping(
      "id" -> optional(longNumber),
      "authorId" -> longNumber,
      "congressId" -> longNumber
  )(AuthorCongress.apply)(x => Some(x.id, x.authorId, x.congressId))
}