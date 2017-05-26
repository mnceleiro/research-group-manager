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
import models.entities.User

class UserTable(tag: Tag) extends Table[User](tag, "USER") {
  def id = column[Long]("id", O.PrimaryKey,O.AutoInc)
  def email = column[String]("email")
  def password = column[Option[String]]("password")
  def admin = column[Boolean]("admin")
  def access = column[Boolean]("access")
  
  override def * = (id, email, password, admin, access) <> ((User.apply _).tupled, User.unapply)
}

class UserRepository @Inject()(dbConfigProvider: DatabaseConfigProvider) {
  val dbConfig = dbConfigProvider.get[JdbcProfile]
  val users = TableQuery[UserTable]

  def get(id: Long): Future[Option[User]] = {
    dbConfig.db.run(users.filter(_.id === id).result.headOption)
  }
  
  def getByEmail(email: String): Future[Option[User]] = {
    dbConfig.db.run(users.filter(_.email.toLowerCase === email.toLowerCase).result.headOption)
  }
}
