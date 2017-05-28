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
  def id = column[Long]("id", O.PrimaryKey, O.AutoInc)
  def code = column[String]("code")
  def title = column[String]("title")
  def public = column[Boolean]("public")
  def startDate = column[Option[String]]("start_date")
  def endDate = column[Option[String]]("end_date")
  def budget = column[Option[Long]]("budget")
  def researcherCount = column[Option[Long]]("researcher_count")

  override def * = (id, code, title, public, startDate, endDate, budget, researcherCount) <> ((Project.apply _).tupled, Project.unapply)
}

class ProjectRepository @Inject() (dbConfigProvider: DatabaseConfigProvider) {
  val dbConfig = dbConfigProvider.get[JdbcProfile]
  val projects = TableQuery[ProjectTable]

  def save(project: Project): Future[Project] = {
    dbConfig.db.run((
      projects.returning(projects.map(_.id)).into((c, ide) => c.copy(id = ide)) += project).transactionally)
  }

  def listAll: Future[Seq[Project]] = {
    dbConfig.db.run(projects.result)
  }
}