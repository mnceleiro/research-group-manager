package models.repositories

import scala.concurrent.Future
import slick.driver.MySQLDriver.api._
import scala.concurrent.ExecutionContext.Implicits.global
import com.google.inject.Inject
import play.api.db.slick.DatabaseConfigProvider
import slick.driver.JdbcProfile
import java.util.Date
import models.entities.Project

class ProjectTable(tag: Tag) extends Table[Project](tag, "PROJECT") {
//    implicit val JavaUtilDateMapper = MappedColumnType.base[java.util.Date, java.sql.Timestamp] (
//      d => new java.sql.Timestamp(d.getTime),
//      d => new java.util.Date(d.getTime))
      
  def id = column[Long]("id", O.PrimaryKey, O.AutoInc)
  def code = column[String]("code")
  def title = column[String]("title")
  def public = column[Boolean]("public")
  def startDate = column[String]("start_date")
  def endDate = column[String]("end_date")
  def budget = column[Long]("budget")
  def researcherCount = column[Option[Long]]("researcher_count")

  override def * = (id, code, title, public, startDate, endDate, budget, researcherCount) <> ((Project.apply _).tupled, Project.unapply)
}

//object DateMapper {
//
//  val utilDate2SqlTimestampMapper = MappedColumnType.base[java.util.Date, java.sql.Timestamp](
//    { utilDate => new java.sql.Timestamp(utilDate.getTime()) },
//    { sqlTimestamp => new java.util.Date(sqlTimestamp.getTime()) })
//
//  val utilDate2SqlDate = MappedColumnType.base[java.util.Date, java.sql.Date](
//    { utilDate => new java.sql.Date(utilDate.getTime()) },
//    { sqlDate => new java.util.Date(sqlDate.getTime()) })
//
//}

class ProjectRepository @Inject() (dbConfigProvider: DatabaseConfigProvider) {
  val dbConfig = dbConfigProvider.get[JdbcProfile]
  val projects = TableQuery[ProjectTable]

  def save(project: Project): Future[Project] = {
    dbConfig.db.run((
      projects.returning(projects.map(_.id)).into((c, ide) => c.copy(id = ide)) += project).transactionally)
  }
  
  def update(project: Project): Future[Project] = {
    dbConfig.db.run {
      (projects.filter(_.id === project.id)
          .map(p => (p.id, p.code, p.title, p.public, p.startDate, p.endDate, p.budget))
          .update((project.id, project.code, project.title, project.public, project.startDate, project.endDate, project.budget)).transactionally).map(x => project)
    }
  }

  def delete(id: Long): Future[Int] = {
    dbConfig.db.run(projects.filter(_.id === id).delete)
  }

  def get(id: Long): Future[Option[Project]] = {
    dbConfig.db.run(projects.filter(_.id === id).result.headOption)
  }

  def listAll: Future[Seq[Project]] = {
    dbConfig.db.run(projects.result)
  }
}