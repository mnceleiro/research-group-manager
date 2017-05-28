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
//  def researcher = foreignKey("RESEARCHER_FK", resId, authors)(_.id.?, onUpdate=ForeignKeyAction.Restrict, onDelete=ForeignKeyAction.Cascade)
  
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
    dbConfig.db.run(authors.filter(_.id === id).delete)
  }

  def get(id: Long): Future[Option[Author]] = {
    dbConfig.db.run(authors.filter(_.id === id).result.headOption)
  }
  
  def getComplete(id: Long): Future[Seq[(Author, Option[Researcher], Option[Congress], Option[Project], Option[Book])]] = {
//    val applicativeJoin = for {
//      author   <- authors.filter(_.id === id) joinLeft researchers on (_.resId === _.id)
//      
//      congress   <- authorsCongresses.filter(_.authorId === id) joinLeft congresses on (_.congressId === _.id)
//      project    <- authorsProjects.filter(_.authorId === id) joinLeft projects on (_.projectId === _.id)
//      book       <- authorsBooks.filter(_.authorId === id) joinLeft books on (_.bookId === _.id)
//      
//    } yield (author._1, author._2, congress._2, project._2, book._2)
    
    val applicativeJoin = for {
      author   <- authors.filter(_.id === id) joinLeft researchers on (_.resId === _.id)
      
      congress   <- authorsCongresses.filter(_.authorId === id) joinLeft congresses on (_.congressId === _.id)
      project    <- authorsProjects.filter(_.authorId === id) joinLeft projects on (_.projectId === _.id)
      book       <- authorsBooks.filter(_.authorId === id) joinLeft books on (_.bookId === _.id)
      
    } yield (author._1, author._2, congress._2, project._2, book._2)
	  
    val executeJoin = for {
      tuples  <- applicativeJoin.result
    } yield (tuples)
    
    val mappedQuery = for {
      tuples <- dbConfig.db.run(executeJoin).map(x => x.map(y => (y._1, y._2, y._3, y._4, y._5)))
    } yield (tuples)
    
    return mappedQuery
  }

  def listAll: Future[Seq[Author]] = {
    dbConfig.db.run(authors.result)
  }

}
