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

class ResearcherTable(tag: Tag) extends Table[Researcher](tag, "RESEARCHER") {
  
  val users = TableQuery[UserTable]

  def id = column[Long]("id", O.PrimaryKey,O.AutoInc)
  def firstName = column[String]("first_name")
  def lastName = column[String]("last_name")
  def address = column[String]("address")
  def phone = column[String]("phone")
  
  def userId = column[Long]("user_id")
  
  def user = foreignKey("USER_FK", userId, users)(_.id, onUpdate=ForeignKeyAction.Restrict, onDelete=ForeignKeyAction.Cascade)
  
  override def * = (id, firstName, lastName, address, phone) <> ((Researcher.apply _).tupled, Researcher.unapply)
}

class ResearcherRepository @Inject()(dbConfigProvider: DatabaseConfigProvider) {

  val dbConfig = dbConfigProvider.get[JdbcProfile]
  val users = TableQuery[ResearcherTable]

  def save(user: Researcher): Future[Researcher] = {
    dbConfig.db.run {
        (users.returning(users.map(_.id)).into((res,ide) => res.copy(id = ide)) += user).transactionally
      }
  }
  
  def update(user: Researcher): Future[Researcher] = {
    dbConfig.db.run {
      (users.filter(_.id === user.id)
          .map(u => (u.id, u.firstName, u.lastName, u.address, u.phone))
          .update((user.id, user.firstName, user.lastName, user.address, user.phone)).transactionally).map(x => user)
    }
  }

  def delete(id: Long): Future[Int] = {
    dbConfig.db.run(users.filter(_.id === id).delete)
  }

  def get(id: Long): Future[Option[Researcher]] = {
    dbConfig.db.run(users.filter(_.id === id).result.headOption)
  }

  def listAll: Future[Seq[Researcher]] = {
    dbConfig.db.run(users.result)
  }

}
