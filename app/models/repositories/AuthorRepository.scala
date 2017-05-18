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

  def listAll: Future[Seq[(Author, Option[Researcher], Option[User])]] = {
//    dbConfig.db.run(researchers.result)
//    val monadicJoin = for {
//      u <- users
//      r <- researchers if u.id === r.userId
//    } yield (r, u)
    
    val applicativeJoin = for {
      ((authors, researchers), users) <- authors joinLeft researchers on (_.resId === _.id) joinLeft users on (_._2.map(_.userId) === _.id)
    } yield (authors, researchers, users)
    
//    val monadicJoin = for {
//      (a, r) <- authors joinLeft researchers on (_.resId === _.id)
//      (u, _) <- r joinLeft users on (_.userId === _.id)
//    } yield (a, r)
    
    
    val executed = for {
      tuples  <- applicativeJoin.result
    } yield (tuples)
    
    val executed2 = for {
      tuples <- dbConfig.db.run(executed).map(x => x.map(y => (y._1, y._2, y._3)))
    } yield (tuples)
    
    return executed2

//    executed map { case (tuples, data) =>
//      val users = tuples.map(_._1).toSet
//      val researchers = tuples.map(_._2).toSet
//      
//      val wat = tuples.headOption.map(_._1)
//      
//      wat.map(a => ResearcherWithUser(wat.get, a))
//    }
    
  }

}
