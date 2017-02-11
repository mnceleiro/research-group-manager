package models.repositories

import play.api.Play
import play.api.db.slick.DatabaseConfigProvider
import scala.concurrent.Future
import slick.driver.JdbcProfile
import slick.driver.MySQLDriver.api._
import scala.concurrent.ExecutionContext.Implicits.global
import models.entities.Researcher

class ResearcherTable(tag: Tag) extends Table[Researcher](tag, "USER") {

  def id = column[Long]("id", O.PrimaryKey,O.AutoInc)
  def email = column[String]("email")
  def firstName = column[String]("first_name")
  def lastName = column[String]("last_name")
  def signatureName = column[String]("signature_name")
  def address = column[String]("address")
  def phone = column[String]("phone")

  override def * =
    (id, email, firstName, lastName, signatureName, address, phone) <> ((Researcher.apply _).tupled, Researcher.unapply)
}

object ResearcherRepository {

  val dbConfig = DatabaseConfigProvider.get[JdbcProfile](Play.current)

  val users = TableQuery[ResearcherTable]

  def add(user: Researcher): Future[String] = {
    dbConfig.db.run(users += user).map(res => "El usuario se ha anhadido correctamente.").recover {
      case ex: Exception => ex.getCause.getMessage
    }
  }
  
  def update(user: Researcher): Future[String] = {
    dbConfig.db.run(users.insertOrUpdate(user)).map(res => "El usuario se ha actualizado correctamente.").recover {
      case ex: Exception => ex.getCause.getMessage
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
