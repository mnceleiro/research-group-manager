package models.repositories

import play.api.Play
import play.api.db.slick.DatabaseConfigProvider
import scala.concurrent.Future
import slick.driver.JdbcProfile
import slick.driver.MySQLDriver.api._
import scala.concurrent.ExecutionContext.Implicits.global
import com.google.inject.Inject
import models.entities.AuthorCongress
import models.entities.Author
import models.entities.User
import models.entities.Researcher
import models.entities.Congress

class AuthorCongressTable(tag: Tag) extends Table[AuthorCongress](tag, "AUTHOR_CONGRESS") {
  val authors = TableQuery[AuthorTable]
  val congresses = TableQuery[CongressTable]
  
  def id = column[Option[Long]]("id", O.PrimaryKey,O.AutoInc)
  def authorId = column[Long]("author_id")
  def congressId = column[Long]("congress_id")
  
  def author = foreignKey("AUTHOR_FK", authorId, authors)(_.id, onUpdate=ForeignKeyAction.NoAction, onDelete=ForeignKeyAction.NoAction)
  def congress = foreignKey("PROJECT_FK", congressId, congresses)(_.id, onUpdate=ForeignKeyAction.NoAction, onDelete=ForeignKeyAction.NoAction)

  override def * = (id, authorId, congressId) <> ((AuthorCongress.apply _).tupled, AuthorCongress.unapply)
}

class AuthorCongressRepository @Inject()(dbConfigProvider: DatabaseConfigProvider) {
	val authorsCongresses = TableQuery[AuthorCongressTable]

	val researchers = TableQuery[ResearcherTable]
	val authors = TableQuery[AuthorTable]
  val congresses = TableQuery[CongressTable]
  
  val dbConfig = dbConfigProvider.get[JdbcProfile]
  
  def getCongress(id: Long): Future[Seq[(Congress, Option[AuthorCongress], Option[Author])]] = {
    val applicativeJoin = for {
      ((c, ac), a) <- congresses.filter(_.id === id) joinLeft authorsCongresses on (_.id === _.congressId) joinLeft authors on (_._2.map(_.authorId) === _.id)
    } yield (c, ac, a)
    
	  
    val executeJoin = for {
      tuples  <- applicativeJoin.result
    } yield (tuples)
    
    val mappedQuery = for {
      tuples <- dbConfig.db.run(executeJoin).map(x => x.map(y => (y._1, y._2, y._3)))
    } yield (tuples)
    
    return mappedQuery
  }
	
//	def getAuthorWithCongressesByResearcherId(id: Long) = {
//	  val join = (for {
//	    (((r,a), ac), c) <- researchers.filter(_.id === id) joinLeft authors on (_.id === _.resId) joinLeft authorsCongresses on(_._2.map(_.id) === _.authorId) joinLeft congresses on (_._2.map(_.congressId) === _.id)
//	  } yield (r, a, ac, c) )
//	  
//	  dbConfig.db.run(join)
//	}
	
//	def checkAuthorHasCongress(resId: Long, congressId: Long): Future[Seq[(Author, Option[AuthorCongress])]] = {
//	  val join = (for {
//	    x <- authors.filter(_.resId === resId) joinLeft authorsCongresses.filter(_.congressId === congressId) on(_.id === _.authorId)
//	  } yield (x._2) ).result.transactionally
//	  
//	  dbConfig.db.run(join)
//	}
	
	def checkAuthorHasCongress(resId: Long, congressId: Long): Future[Option[Option[Long]]] = {
	  val join = (for {
	    au <- authors.filter(a => a.resId === resId)
	    x <- authorsCongresses.filter(x => x.congressId === congressId && x.authorId === au.id)
	  } yield (x.id) ).result.headOption.transactionally
	  
	  dbConfig.db.run(join)
	}

  def saveCongress(congress: Congress, aps: Seq[AuthorCongress], as: Seq[Author]) = {
    val authorIds = as.map(x => x.id)
    val query = (for {
      pId <- congresses.returning(congresses.map(_.id)) += congress
      insertAps <- authorsCongresses ++= aps.map(x => x.copy(congressId = pId))
      
    } yield ()).transactionally

    dbConfig.db.run(query)
  }
  
  def updateCongress(congress: Congress, aps: Seq[AuthorCongress], as: Seq[Author]) = {
    val query = (for {
      updateCongresses <- (congresses.filter(_.id === congress.id)
          .map(c => (c.id, c.title, c.name, c.place, c.country, c.startDate, c.endDate, c.international, c.typeId, c.statusId))
          .update((congress.id, congress.title, congress.name, congress.place, congress.country, congress.startDate, congress.endDate, congress.international, congress.typeId, congress.statusId)))
      deleteAps <- authorsCongresses.filter(_.congressId === congress.id).delete
      insertAps <- authorsCongresses.returning(authorsCongresses.map(_.id)).into((c, ide) => c.copy(id = ide)) ++= aps
      
    } yield()).transactionally
    
    dbConfig.db.run(query)
  }
  
  def deleteCongress(id: Long) = {
    val query = (for {
    	ac <- authorsCongresses.filter(_.congressId === id).delete
      c <- congresses.filter(_.id === id).delete
    } yield ())
    
    dbConfig.db.run(query.transactionally)
  }
}