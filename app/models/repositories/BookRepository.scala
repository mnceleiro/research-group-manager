package models.repositories

import scala.concurrent.Future
import slick.driver.MySQLDriver.api._
import scala.concurrent.ExecutionContext.Implicits.global
import com.google.inject.Inject
import play.api.db.slick.DatabaseConfigProvider
import slick.driver.JdbcProfile
import java.util.Date
import models.entities.Book

class BookTable(tag: Tag) extends Table[Book](tag, "BOOK") {
  val publicationStatusRows = TableQuery[PublicationStatusTable]
  
  def id = column[Option[Long]]("id", O.PrimaryKey, O.AutoInc)
  def code = column[String]("code")
  def title = column[String]("title")
  def book = column[String]("book")
  def volume = column[Option[String]]("volume")
  def startPage = column[Option[Long]]("start_page")
  def endPage = column[Option[Long]]("end_page")
  def year = column[Option[Long]]("year")
  def editorial = column[String]("editorial")
  def place = column[String]("place")
  def isbn = column[Option[String]]("isbn")
  def statusId = column[Long]("status")
  
  def status = foreignKey("PUBLICATION_STATUS_FK", statusId, publicationStatusRows)(_.id, onUpdate = ForeignKeyAction.NoAction, onDelete = ForeignKeyAction.NoAction)

  override def * = (id, code, title, book, volume, startPage, endPage, year, editorial, place, isbn, statusId) <> ((Book.apply _).tupled, Book.unapply)
}

class BookRepository @Inject() (dbConfigProvider: DatabaseConfigProvider) {
  val dbConfig = dbConfigProvider.get[JdbcProfile]
  val books = TableQuery[BookTable]

  def save(book: Book): Future[Book] = {
    dbConfig.db.run((
      books.returning(books.map(_.id)).into((c, ide) => c.copy(id = ide)) += book).transactionally)
  }

  def listAll: Future[Seq[Book]] = {
    dbConfig.db.run(books.result)
  }
}