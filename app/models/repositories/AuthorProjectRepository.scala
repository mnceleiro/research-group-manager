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
  
  def author = foreignKey("AUTHOR_FK", authorId, authors)(_.id, onUpdate=ForeignKeyAction.Restrict, onDelete=ForeignKeyAction.Cascade)
  def project = foreignKey("PROJECT_FK", projectId, projects)(_.id, onUpdate=ForeignKeyAction.Restrict, onDelete=ForeignKeyAction.Cascade)
  def role = foreignKey("ROLE_FK", roleId, roles)(_.id, onUpdate=ForeignKeyAction.Restrict, onDelete=ForeignKeyAction.Cascade)

  override def * = (id, authorId, projectId, roleId) <> ((AuthorProject.apply _).tupled, AuthorProject.unapply)
}

class AuthorProjectRepository @Inject()(dbConfigProvider: DatabaseConfigProvider) {
	val authorsProjects = TableQuery[AuthorProjectTable]

	val authors = TableQuery[AuthorTable]
  val projects = TableQuery[ProjectTable]
  val roles = TableQuery[RoleTable]
	val researchers = TableQuery[ResearcherTable]
	val users = TableQuery[UserTable]
  
  val dbConfig = dbConfigProvider.get[JdbcProfile]
  
  def listCompleteProjects: Future[Seq[(Project, Option[AuthorProject], Option[Author], Option[Researcher])]] = {
    val applicativeJoin = for {
      (((authorsProject, project), author), researcher) <- projects joinLeft authorsProjects on (_.id === _.projectId) joinLeft authors on (_._2.map(_.authorId) === _.id) joinLeft researchers on (_._2.flatMap(_.resId) === _.id)
    } yield (authorsProject, project, author, researcher)
    
	  
    val executeJoin = for {
      tuples  <- applicativeJoin.result
    } yield (tuples)
    
    val mappedQuery = for {
      tuples <- dbConfig.db.run(executeJoin).map(x => x.map(y => (y._1, y._2, y._3, y._4)))
    } yield (tuples)
    
    return mappedQuery
  }
	
  def listProjectsWithAuthors: Future[Seq[ProjectWithAuthors]] = {
    val join = (for {
      (project, authorsProject) <- projects joinLeft authorsProjects on (_.id === _.projectId)
      
    } yield (project, authorsProject)).result
    
    dbConfig.db.run(join).map(x => println(x))
    
    dbConfig.db.run(join).map(x => x.groupBy(x => x._1.id).map {
      case (k,v) => (v.head._1,v.map(_._2))
    }).map(o => o.map(fo => ProjectWithAuthors(fo._1, Option(fo._2))) toSeq)
    
    
    
//    val monadicJoin = (for {
//      p <- projects
//      ap <- authorsProjects if (ap.projectId === p.id)
//    } yield (p, ap)).result
//    
////    dbConfig.db.run(monadicJoin).map(x => println(x))
//    
//    dbConfig.db.run(monadicJoin).map(x => x.groupBy(x => x._2.projectId).map {
//      case (k,v) => (v.head._1,v.map(_._2))
//    }).map(o => o.map(fo => ProjectWithAuthors(fo._1, Option(fo._2))) toSeq)
  }
}