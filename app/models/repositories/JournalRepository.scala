package models.repositories

import scala.concurrent.Future
import slick.driver.MySQLDriver.api._
import scala.concurrent.ExecutionContext.Implicits.global
import com.google.inject.Inject
import play.api.db.slick.DatabaseConfigProvider
import slick.driver.JdbcProfile
import java.util.Date
import models.entities.Journal

class JournalTable(tag: Tag) extends Table[Journal](tag, "JOURNAL") {
  val publicationStatusRows = TableQuery[PublicationStatusTable]
  
  def id = column[Option[Long]]("id", O.PrimaryKey, O.AutoInc)
  def code = column[String]("code")
  def title = column[String]("title")
  def journal = column[String]("journal")
  def volume = column[Option[String]]("volume")
  def startPage = column[Option[Long]]("start_page")
  def endPage = column[Option[Long]]("end_page")
  def date = column[String]("date")
  def editorial = column[String]("editorial")
  def place = column[String]("place")
  def issn = column[Option[String]]("issn")
  def statusId = column[Long]("status")
  
  def status = foreignKey("PUBLICATION_STATUS_FK", statusId, publicationStatusRows)(_.id, onUpdate = ForeignKeyAction.NoAction, onDelete = ForeignKeyAction.NoAction)

  override def * = (id, code, title, journal, volume, startPage, endPage, date, editorial, place, issn, statusId) <> ((Journal.apply _).tupled, Journal.unapply)
}

class JournalRepository @Inject() (dbConfigProvider: DatabaseConfigProvider) {
  val dbConfig = dbConfigProvider.get[JdbcProfile]
  val journals = TableQuery[JournalTable]

  def save(journal: Journal): Future[Journal] = {
    dbConfig.db.run((
      journals.returning(journals.map(_.id)).into((c, ide) => c.copy(id = ide)) += journal).transactionally)
  }

  def listAll: Future[Seq[Journal]] = {
    dbConfig.db.run(journals.result)
  }
}