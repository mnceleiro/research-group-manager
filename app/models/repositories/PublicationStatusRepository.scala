package models.repositories

import slick.driver.JdbcProfile
import slick.driver.MySQLDriver.api._
import com.google.inject.Inject
import play.api.db.slick.DatabaseConfigProvider
import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

import models.entities.PublicationStatus

class PublicationStatusTable(tag: Tag) extends Table[PublicationStatus](tag, "PUBLICATION_STATUS") {
  def id = column[Long]("id", O.PrimaryKey)
  def description = column[String]("description")
  
  override def * = (id, description) <> ((PublicationStatus.apply _).tupled, PublicationStatus.unapply)
}

class PublicationStatusRepository @Inject()(dbConfigProvider: DatabaseConfigProvider) {
  val dbConfig = dbConfigProvider.get[JdbcProfile]
  val publicationStatusRows = TableQuery[PublicationStatusTable]
  
  def listAll: Future[Seq[PublicationStatus]] = {
    dbConfig.db.run(publicationStatusRows.result)
  }
}