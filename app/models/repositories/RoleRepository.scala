package models.repositories

import slick.driver.JdbcProfile
import slick.driver.MySQLDriver.api._
import models.entities.Role
import com.google.inject.Inject
import play.api.db.slick.DatabaseConfigProvider
import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future
import models.entities.Researcher

class RoleTable(tag: Tag) extends Table[Role](tag, "ROLE") {
  def id = column[Long]("id", O.PrimaryKey,O.AutoInc)
  def description = column[String]("description")
  
  override def * = (id, description) <> ((Role.apply _).tupled, Role.unapply)
}

class RoleRepository @Inject()(dbConfigProvider: DatabaseConfigProvider) {
  val dbConfig = dbConfigProvider.get[JdbcProfile]
  val roles = TableQuery[RoleTable]
  
  def listAll: Future[Seq[Role]] = {
    dbConfig.db.run(roles.result)
  }
}