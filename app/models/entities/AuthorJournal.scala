package models.entities

import play.api.data.Form
import play.api.data.Forms._
import play.api.data.Mapping

case class AuthorJournal(id: Option[Long], authorId: Long, journalId: Option[Long])

object AuthorJournal {
    val authorJournalVOMapping: Mapping[AuthorJournal] = mapping(
      "id" -> optional(longNumber),
      "authorId" -> longNumber,
      "journalId" -> optional(longNumber)
  )(AuthorJournal.apply)(x => Some(x.id, x.authorId, x.journalId))
}