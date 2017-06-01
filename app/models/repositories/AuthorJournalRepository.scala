package models.repositories

import play.api.Play
import play.api.db.slick.DatabaseConfigProvider
import scala.concurrent.Future
import slick.driver.JdbcProfile
import slick.driver.MySQLDriver.api._
import scala.concurrent.ExecutionContext.Implicits.global
import com.google.inject.Inject
import models.entities.AuthorJournal
import models.entities.Author
import models.entities.Researcher
import models.entities.Journal

class AuthorJournalTable(tag: Tag) extends Table[AuthorJournal](tag, "AUTHOR_JOURNAL") {
  val authors = TableQuery[AuthorTable]
  val journals = TableQuery[JournalTable]
  
  def id = column[Option[Long]]("id", O.PrimaryKey,O.AutoInc)
  def authorId = column[Long]("author_id")
  def journalId = column[Option[Long]]("journal_id")
  
  def author = foreignKey("AUTHOR_FK", authorId, authors)(_.id, onUpdate=ForeignKeyAction.NoAction, onDelete=ForeignKeyAction.NoAction)
  def journal = foreignKey("JOURNAL_FK", journalId, journals)(_.id, onUpdate=ForeignKeyAction.NoAction, onDelete=ForeignKeyAction.NoAction)

  override def * = (id, authorId, journalId) <> ((AuthorJournal.apply _).tupled, AuthorJournal.unapply)
}

class AuthorJournalRepository @Inject()(dbConfigProvider: DatabaseConfigProvider) {
	val authorsJournals = TableQuery[AuthorJournalTable]

	val authors = TableQuery[AuthorTable]
  val journals = TableQuery[JournalTable]
  
  val dbConfig = dbConfigProvider.get[JdbcProfile]
	
	def checkAuthorHasJournal(resId: Long, journalId: Long): Future[Option[Option[Long]]] = {
	  val join = (for {
	    x <- authorsJournals.filter(x => x.journalId === journalId && x.authorId === resId)
	    x <- authorsJournals.filter(x => x.journalId === journalId && x.authorId === resId)
	  } yield (x.id) ).result.headOption.transactionally
	  
	  dbConfig.db.run(join)
	}
  
  def getJournal(id: Long): Future[Seq[(Journal, Option[AuthorJournal], Option[Author])]] = {
    val applicativeJoin = for {
      ((j, ab), a) <- journals.filter(_.id === id) joinLeft authorsJournals on (_.id === _.journalId) joinLeft authors on (_._2.map(_.authorId) === _.id)
    } yield (j, ab, a)
    
	  
    val executeJoin = for {
      tuples  <- applicativeJoin.result
    } yield (tuples)
    
    val mappedQuery = for {
      tuples <- dbConfig.db.run(executeJoin).map(x => x.map(y => (y._1, y._2, y._3)))
    } yield (tuples)
    
    return mappedQuery
  }

  def saveJournal(journal: Journal, abs: Seq[AuthorJournal], as: Seq[Author]) = {
    val authorIds = as.map(x => x.id)
    val query = (for {
      bId <- journals.returning(journals.map(_.id)) += journal
      insertAbs <- authorsJournals ++= abs.map(x => x.copy(journalId = bId))
      
    } yield ()).transactionally

    dbConfig.db.run(query)
  }
  
  def updateJournal(journal: Journal, abs: Seq[AuthorJournal], as: Seq[Author]) = {
    val query = (for {
      updateJournals <- journals.filter(_.id === journal.id).update(journal)
      deleteAbs <- authorsJournals.filter(_.journalId === journal.id).delete
      insertAbs <- authorsJournals.returning(authorsJournals.map(_.id)).into((c, ide) => c.copy(id = ide)) ++= abs
      
    } yield()).transactionally
    
    dbConfig.db.run(query)
  }
  
  def deleteJournal(id: Long) = {
    val query = (for {
    	ab <- authorsJournals.filter(_.journalId === id).delete
      j <- journals.filter(_.id === id).delete
    } yield ())
    
    dbConfig.db.run(query.transactionally)
  }
}