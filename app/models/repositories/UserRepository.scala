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

  def save(user: User): Future[User] = {
    user.password match {
      case None => throw new Exception()
      case Some(_) => dbConfig.db.run {
        (users.returning(users.map(_.id)).into((res,ide) => res.copy(id = ide)) += user).transactionally
      }
    }
  }
//  
//  def update(user: User): Future[User] = {
//    dbConfig.db.run(users.insertOrUpdate(user)).map(res => "El usuario se ha actualizado correctamente.").recover {
//      case ex: Exception => ex.getCause.getMessage
//    }
//    user.password.value match {
//      case None => dbConfig.db.run {
//        (users.filter(_.id === user.id)
//            .map(u => (u.id, u.email, u.password, u.admin, u.access))
//            .update((user.id, user.email, user.password, user.admin, user.access)).transactionally).map(x => user)
//        }
//      
//      case Some(pw) => dbConfig.db.run {
//        (users.filter(_.id === user.id).update(user.copy(password=Password.hashPassword(pw))).transactionally).map(x => user)
//      }
//    }
//    dbConfig.db.run {
//      (users.filter(_.id === user.id)
//          .map(u => (user.id, user.email, user.password, user.admin, user.access))
//          .update((user.id, user.email, user.password, user.admin, user.access)).transactionally).map(x => user)
//    }
//  }
//
//  def delete(id: Long): Future[Int] = {
//    dbConfig.db.run(users.filter(_.id === id).delete)
//  }

  def get(id: Long): Future[Option[User]] = {
    dbConfig.db.run(users.filter(_.id === id).result.headOption)
  }
  
  def getByEmail(email: String): Future[Option[User]] = {
    dbConfig.db.run(users.filter(_.email.toLowerCase === email.toLowerCase).result.headOption)
  }

  def listAll: Future[Seq[User]] = {
    dbConfig.db.run(users.result)
  }

}
