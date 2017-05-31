package models.repositories

import play.api.Play
import play.api.db.slick.DatabaseConfigProvider
import scala.concurrent.Future
import slick.driver.JdbcProfile
import slick.driver.MySQLDriver.api._
import scala.concurrent.ExecutionContext.Implicits.global
import com.google.inject.Inject
import models.entities.AuthorProject
import models.entities.Author
import models.entities.User
import models.entities.Researcher
import models.entities.Project
import models.entities.ProjectWithAuthors

class AuthorProjectTable(tag: Tag) extends Table[AuthorProject](tag, "AUTHOR_PROJECT") {
  val authors = TableQuery[AuthorTable]
  val projects = TableQuery[ProjectTable]
  val roles = TableQuery[RoleTable]
  
  def id = column[Option[Long]]("id", O.PrimaryKey,O.AutoInc)
  def authorId = column[Long]("author_id")
  def projectId = column[Long]("project_id")
  def roleId = column[Long]("role_id")
  
  def author = foreignKey("AUTHOR_FK", authorId, authors)(_.id, onUpdate=ForeignKeyAction.NoAction, onDelete=ForeignKeyAction.NoAction)
  def project = foreignKey("PROJECT_FK", projectId, projects)(_.id, onUpdate=ForeignKeyAction.NoAction, onDelete=ForeignKeyAction.NoAction)
  def role = foreignKey("ROLE_FK", roleId, roles)(_.id, onUpdate=ForeignKeyAction.NoAction, onDelete=ForeignKeyAction.NoAction)

  override def * = (id, authorId, projectId, roleId) <> ((AuthorProject.apply _).tupled, AuthorProject.unapply)
}

class AuthorProjectRepository @Inject()(dbConfigProvider: DatabaseConfigProvider) {
	val authorsProjects = TableQuery[AuthorProjectTable]

	val authors = TableQuery[AuthorTable]
  val projects = TableQuery[ProjectTable]
  val roles = TableQuery[RoleTable]
  
  val dbConfig = dbConfigProvider.get[JdbcProfile]
	
	def checkAuthorHasProject(resId: Long, projectId: Long): Future[Option[Option[Long]]] = {
	  val join = (for {
	    x <- authorsProjects.filter(x => x.projectId === projectId && x.authorId === resId)
	    x <- authorsProjects.filter(x => x.projectId === projectId && x.authorId === resId)
	  } yield (x.id) ).result.headOption.transactionally
	  
	  dbConfig.db.run(join)
	}
  
  def getProject(id: Long): Future[Seq[(Project, Option[AuthorProject], Option[Author])]] = {
    val applicativeJoin = for {
      ((p, ap), a) <- projects.filter(_.id === id) joinLeft authorsProjects on (_.id === _.projectId) joinLeft authors on (_._2.map(_.authorId) === _.id)
    } yield (p, ap, a)
    
    val executeJoin = for {
      tuples  <- applicativeJoin.result
    } yield (tuples)
    
    val mappedQuery = for {
      tuples <- dbConfig.db.run(executeJoin).map(x => x.map(y => (y._1, y._2, y._3)))
    } yield (tuples)
    
    return mappedQuery
  }
  
    def saveProject(project: Project, aps: Seq[AuthorProject], as: Seq[Author]) = {
      val authorIds = as.map(x => x.id)
      val query = (for {
        pId <- projects.returning(projects.map(_.id)) += project
        insertAps <- authorsProjects ++= aps.map(x => x.copy(projectId = pId))
      } yield ()).transactionally
    
    dbConfig.db.run(query)
  }
  
  def updateProject(project: Project, aps: Seq[AuthorProject], as: Seq[Author]) = {
    val query = (for {
      updateProjects <- (projects.filter(_.id === project.id)
          .map(p => (p.id, p.code, p.title, p.public, p.startDate, p.endDate, p.budget))
          .update((project.id, project.code, project.title, project.public, project.startDate, project.endDate, project.budget)))
      deleteAps <- authorsProjects.filter(_.projectId === project.id).delete
      insertAps <- authorsProjects.returning(authorsProjects.map(_.id)).into((c, ide) => c.copy(id = ide)) ++= aps
      
    } yield()).transactionally
    
    dbConfig.db.run(query)
  }
  
  def deleteProject(id: Long) = {
    val query = (for {
    	ap <- authorsProjects.filter(_.projectId === id).delete
      p <- projects.filter(_.id === id).delete
    } yield ())
    
    dbConfig.db.run(query.transactionally)
  }
}