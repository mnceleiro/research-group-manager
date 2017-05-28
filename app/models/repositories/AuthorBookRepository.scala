package models.repositories

import play.api.Play
import play.api.db.slick.DatabaseConfigProvider
import scala.concurrent.Future
import slick.driver.JdbcProfile
import slick.driver.MySQLDriver.api._
import scala.concurrent.ExecutionContext.Implicits.global
import com.google.inject.Inject
import models.entities.AuthorBook
import models.entities.Author
import models.entities.Researcher
import models.entities.Book

class AuthorBookTable(tag: Tag) extends Table[AuthorBook](tag, "AUTHOR_BOOK") {
  val authors = TableQuery[AuthorTable]
  val books = TableQuery[BookTable]
  
  def id = column[Option[Long]]("id", O.PrimaryKey,O.AutoInc)
  def authorId = column[Long]("author_id")
  def bookId = column[Option[Long]]("book_id")
  
  def author = foreignKey("AUTHOR_FK", authorId, authors)(_.id, onUpdate=ForeignKeyAction.NoAction, onDelete=ForeignKeyAction.NoAction)
  def book = foreignKey("BOOK_FK", bookId, books)(_.id, onUpdate=ForeignKeyAction.NoAction, onDelete=ForeignKeyAction.NoAction)

  override def * = (id, authorId, bookId) <> ((AuthorBook.apply _).tupled, AuthorBook.unapply)
}

class AuthorBookRepository @Inject()(dbConfigProvider: DatabaseConfigProvider) {
	val authorsBooks = TableQuery[AuthorBookTable]

	val authors = TableQuery[AuthorTable]
  val books = TableQuery[BookTable]
  
  val dbConfig = dbConfigProvider.get[JdbcProfile]
  
  def getBook(id: Long): Future[Seq[(Book, Option[AuthorBook], Option[Author])]] = {
    val applicativeJoin = for {
      ((b, ab), a) <- books.filter(_.id === id) joinLeft authorsBooks on (_.id === _.bookId) joinLeft authors on (_._2.map(_.authorId) === _.id)
    } yield (b, ab, a)
    
	  
    val executeJoin = for {
      tuples  <- applicativeJoin.result
    } yield (tuples)
    
    val mappedQuery = for {
      tuples <- dbConfig.db.run(executeJoin).map(x => x.map(y => (y._1, y._2, y._3)))
    } yield (tuples)
    
    return mappedQuery
  }

  def saveBook(book: Book, abs: Seq[AuthorBook], as: Seq[Author]) = {
    val authorIds = as.map(x => x.id)
    val query = (for {
      bId <- books.returning(books.map(_.id)) += book
      insertAbs <- authorsBooks ++= abs.map(x => x.copy(bookId = bId))
      
    } yield ()).transactionally

    dbConfig.db.run(query)
  }
  
  def updateBook(book: Book, abs: Seq[AuthorBook], as: Seq[Author]) = {
    val query = (for {
      updateBooks <- books.filter(_.id === book.id).update(book)
      deleteAbs <- authorsBooks.filter(_.bookId === book.id).delete
      insertAbs <- authorsBooks.returning(authorsBooks.map(_.id)).into((c, ide) => c.copy(id = ide)) ++= abs
      
    } yield()).transactionally
    
    dbConfig.db.run(query)
  }
  
  def deleteBook(id: Long) = {
    val query = (for {
    	ab <- authorsBooks.filter(_.bookId === id).delete
      b <- books.filter(_.id === id).delete
    } yield ())
    
    dbConfig.db.run(query.transactionally)
  }
}