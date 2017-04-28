package models.repositories

import scala.concurrent.Future
import slick.driver.MySQLDriver.api._
import scala.concurrent.ExecutionContext.Implicits.global
import com.google.inject.Inject
import models.entities.Project
import play.api.db.slick.DatabaseConfigProvider
import slick.driver.JdbcProfile
import java.util.Date

class ProjectTable(tag: Tag) extends Table[Project](tag, "CONGRESS") {
    implicit val JavaUtilDateMapper = MappedColumnType.base[java.util.Date, java.sql.Timestamp] (
      d => new java.sql.Timestamp(d.getTime),
      d => new java.util.Date(d.getTime))
      
  def id = column[Long]("id", O.PrimaryKey, O.AutoInc)
  def code = column[String]("code")
  def public = column[Boolean]("public")
  def financier = column[String]("financier")
  def startDate = column[Date]("start_date")
  def endDate = column[Date]("end_date")
  def price = column[BigDecimal]("price")

  override def * = (id, code, public, financier, startDate, endDate, price) <> ((Project.apply _).tupled, Project.unapply)
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
  val projectes = TableQuery[ProjectTable]

  def save(project: Project): Future[Project] = {
    dbConfig.db.run((
      projectes.returning(projectes.map(_.id)).into((c, ide) => c.copy(id = ide)) += project).transactionally)
  }

  def delete(id: Long): Future[Int] = {
    dbConfig.db.run(projectes.filter(_.id === id).delete)
  }

  def get(id: Long): Future[Option[Project]] = {
    dbConfig.db.run(projectes.filter(_.id === id).result.headOption)
  }

  def listAll: Future[Seq[Project]] = {
    dbConfig.db.run(projectes.result)
  }
}