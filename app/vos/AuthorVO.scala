package vos

import models.entities.Book
import models.entities.Congress
import models.entities.Journal
import models.entities.Researcher

case class AuthorVO(
    id: Long, email: String, signature: String, researcher: Option[Researcher], 
    books: Option[Seq[Book]], journals: Option[Seq[Journal]], congresses: Option[Seq[Congress]]
)