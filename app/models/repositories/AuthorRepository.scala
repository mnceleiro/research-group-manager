package models.repositories

import play.api.Play
import play.api.db.slick.DatabaseConfigProvider
import scala.concurrent.Future
import slick.driver.JdbcProfile
import slick.driver.MySQLDriver.api._
import scala.concurrent.ExecutionContext.Implicits.global
import models.entities.Researcher
import com.google.inject.Inject
import utils.Password
import models.entities.Role
import models.entities.ResearcherWithUser
import models.entities.User
import models.entities.Author
import play.libs.F.Tuple

class AuthorTable(tag: Tag) extends Table[Author](tag, "AUTHOR") {
  val authors = TableQuery[AuthorTable]

  def id = column[Long]("id", O.PrimaryKey,O.AutoInc)
  def email = column[String]("email")
  def signature = column[String]("signature")
  
  def resId = column[Option[Long]]("res_id")
  def researcher = foreignKey("RESEARCHER_FK", resId, authors)(_.id.?, onUpdate=ForeignKeyAction.Restrict, onDelete=ForeignKeyAction.Cascade)
  
  override def * = (id, email, signature, resId) <> ((Author.apply _).tupled, Author.unapply)
}

class AuthorRepository @Inject()(dbConfigProvider: DatabaseConfigProvider) {
  val dbConfig = dbConfigProvider.get[JdbcProfile]
  
  val authors = TableQuery[AuthorTable]
  val researchers = TableQuery[ResearcherTable]
  val users = TableQuery[UserTable]
  
  def save(author: Author): Future[Author] = {
    dbConfig.db.run(
        (authors.returning(authors.map(_.id)).into((c, ide) => c.copy(id = ide)) += author)
    .transactionally)
  }
  
  def update(author: Author): Future[Author] = {
    dbConfig.db.run {
      (authors.filter(_.id === author.id)
          .map(o => (o.id, o.email, o.signature, o.resId))
          .update((author.id, author.email, author.signature, author.researcherId)).transactionally).map(x => author)
    }
  }

  def delete(id: Long): Future[Int] = {
    dbConfig.db.run(authors.filter(_.id === id).delete)
  }

  def get(id: Long): Future[Option[Author]] = {
    dbConfig.db.run(authors.filter(_.id === id).result.headOption)
  }

  def listAll: Future[Seq[Author]] = {
    dbConfig.db.run(authors.result)
  }

}
