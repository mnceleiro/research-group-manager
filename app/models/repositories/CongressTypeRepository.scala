package models.repositories

import slick.driver.JdbcProfile
import slick.driver.MySQLDriver.api._
import com.google.inject.Inject
import play.api.db.slick.DatabaseConfigProvider
import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

import models.entities.CongressType

class CongressTypeTable(tag: Tag) extends Table[CongressType](tag, "CONGRESS_TYPE") {
  def id = column[Long]("id", O.PrimaryKey)
  def description = column[String]("description")
  
  override def * = (id, description) <> ((CongressType.apply _).tupled, CongressType.unapply)
}

class CongressTypeRepository @Inject()(dbConfigProvider: DatabaseConfigProvider) {
  val dbConfig = dbConfigProvider.get[JdbcProfile]
  val congressTypes = TableQuery[CongressTypeTable]
  
  def listAll: Future[Seq[CongressType]] = {
    dbConfig.db.run(congressTypes.result)
  }
}