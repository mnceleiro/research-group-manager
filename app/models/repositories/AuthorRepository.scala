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
import models.entities.Project
import models.entities.Congress
import models.entities.Book

class AuthorTable(tag: Tag) extends Table[Author](tag, "AUTHOR") {
  val authors = TableQuery[AuthorTable]

  def id = column[Long]("id", O.PrimaryKey,O.AutoInc)
  def email = column[String]("email")
  def signature = column[String]("signature")
  
  def resId = column[Option[Long]]("res_id")
  
  override def * = (id, email, signature, resId) <> ((Author.apply _).tupled, Author.unapply)
}

class AuthorRepository @Inject()(dbConfigProvider: DatabaseConfigProvider) {
  val dbConfig = dbConfigProvider.get[JdbcProfile]
  
  val authors = TableQuery[AuthorTable]
  val researchers = TableQuery[ResearcherTable]
  val users = TableQuery[UserTable]
  
  val congresses = TableQuery[CongressTable]
  val authorsCongresses = TableQuery[AuthorCongressTable]
  
  val books = TableQuery[BookTable]
  val authorsBooks= TableQuery[AuthorBookTable]
  
  val projects = TableQuery[ProjectTable]
  val authorsProjects = TableQuery[AuthorProjectTable]
  
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
//    dbConfig.db.run(authors.filter(_.id === id).delete)
    val query = (for {
      au <- authors.filter(x => x.id === id).result.headOption
      auCongress <- authorsCongresses.filter(_.authorId === id).delete
      auBook <- authorsBooks.filter(_.authorId === id).delete
      auProject <- authorsProjects.filter(_.authorId === id).delete
      authorDel <- authors.filter(_.id === id).delete
    } yield (authorDel))
    
    dbConfig.db.run(query.transactionally)
  }

  def get(id: Long): Future[Option[Author]] = {
    dbConfig.db.run(authors.filter(_.id === id).result.headOption)
  }
  
  def getComplete(id: Long): Future[Option[(Author, Option[Researcher])]] = {
    val join = for {
      (x)   <- (authors.filter(_.id === id) joinLeft researchers on (_.resId === _.id)).result.headOption
      
    } yield (x.map(x => (x._1, x._2)))

    val mappedQuery = for {
      tuples <- dbConfig.db.run(join).map(x => x.map(y => (y._1, y._2)))
    } yield (tuples)
    
    return mappedQuery
  }

  def listAll: Future[Seq[Author]] = {
    dbConfig.db.run(authors.result)
  }
  
  def listAllComplete: Future[Seq[(Author, Option[Researcher])]] = {
    val join = (for {
      x <- authors joinLeft researchers on (_.resId === _.id)
    } yield ((x._1, x._2))).result
    
    return dbConfig.db.run(join)
  }

}
