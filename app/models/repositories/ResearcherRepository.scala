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

class ResearcherTable(tag: Tag) extends Table[Researcher](tag, "USER") {

  def id = column[Long]("id", O.PrimaryKey,O.AutoInc)
  def email = column[String]("email")
  def password = column[Option[String]]("password")
  def firstName = column[String]("first_name")
  def lastName = column[String]("last_name")
  def signatureName = column[String]("signature_name")
  def address = column[String]("address")
  def phone = column[String]("phone")
  def role = column[Long]("role")
  
  override def * = (id, email, password, firstName, lastName, signatureName, address, phone, role) <> ((Researcher.apply _).tupled, Researcher.unapply)
}

class ResearcherRepository @Inject()(dbConfigProvider: DatabaseConfigProvider) {

  val dbConfig = dbConfigProvider.get[JdbcProfile]
  val users = TableQuery[ResearcherTable]

  // TODO: Validar password no vacia
  def save(user: Researcher): Future[Researcher] = {
//    dbConfig.db.run(users += user).map(res => "El usuario se ha anhadido correctamente.").recover {
//      case ex: Exception => ex.getCause.getMessage
//    }
    user.password match {
      case None => throw new Exception()
      case Some(_) => dbConfig.db.run {
  //      ((users returning users.map(_.id)) += user)
  //      (users returning users.map(_.id) into ((researcher, id) => (id=id)) += user).transactionally
        (users.returning(users.map(_.id)).into((res,ide) => res.copy(id = ide)) += user).transactionally
      }
    }
  }
  
  // TODO: Validar actualizacion o no de la password
  def update(user: Researcher): Future[Researcher] = {
    dbConfig.db.run(users.insertOrUpdate(user)).map(res => "El usuario se ha actualizado correctamente.").recover {
      case ex: Exception => ex.getCause.getMessage
    }
    user.password.value match {
      case None => dbConfig.db.run {
        (users.filter(_.id === user.id)
            .map(u => (u.id, u.email, u.firstName, u.lastName, u.signatureName, u.address, u.phone))
            .update((user.id, user.email, user.firstName, user.lastName, user.signatureName, user.address, user.phone)).transactionally).map(x => user)
        }
      
      case Some(pw) => dbConfig.db.run {
        (users.filter(_.id === user.id).update(user.copy(password=Password.hashPassword(pw))).transactionally).map(x => user)
      }
    }
    dbConfig.db.run {
      (users.filter(_.id === user.id)
          .map(u => (u.id, u.email, u.firstName, u.lastName, u.signatureName, u.address, u.phone))
          .update((user.id, user.email, user.firstName, user.lastName, user.signatureName, user.address, user.phone)).transactionally).map(x => user)
    }
    
//    dbConfig.db.run {
//      (users.filter(_.id === user.id).update(user).transactionally).map(x => user)
//    }
  }

  def delete(id: Long): Future[Int] = {
    dbConfig.db.run(users.filter(_.id === id).delete)
  }

  def get(id: Long): Future[Option[Researcher]] = {
    dbConfig.db.run(users.filter(_.id === id).result.headOption)
  }
  
  def getByEmail(email: String): Future[Option[Researcher]] = {
//    println(email + " es igual que mnceleiro@esei.uvigo.es -> " + email.toLowerCase().equalsIgnoreCase("mnceleiro@esei.uvigo.es"))
    dbConfig.db.run(users.filter(_.email.toLowerCase === email.toLowerCase).result.headOption)
  }

  def listAll: Future[Seq[Researcher]] = {
    dbConfig.db.run(users.result)
  }

}
