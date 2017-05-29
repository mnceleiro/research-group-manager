package models.repositories

import scala.concurrent.Future
import slick.driver.MySQLDriver.api._
import scala.concurrent.ExecutionContext.Implicits.global
import com.google.inject.Inject
import models.entities.Congress
import play.api.db.slick.DatabaseConfigProvider
import slick.driver.JdbcProfile

class CongressTable(tag: Tag) extends Table[Congress](tag, "CONGRESS") {
  def id = column[Long]("id", O.PrimaryKey, O.AutoInc)
  def title = column[String]("title")
  def name = column[String]("name")
  def place = column[String]("place")
  def country = column[String]("country")
  def startDate = column[Option[String]]("start")
  def endDate = column[Option[String]]("end")
  def international = column[Boolean]("international")
  
  def typeId = column[Long]("type")
  def statusId = column[Long]("status")

  override def * = (id, title, name, place, country, startDate, endDate, international, typeId, statusId) <> ((Congress.apply _).tupled, Congress.unapply)
}

class CongressRepository @Inject() (dbConfigProvider: DatabaseConfigProvider) {
  val dbConfig = dbConfigProvider.get[JdbcProfile]
  val congresses = TableQuery[CongressTable]

  def save(congress: Congress): Future[Congress] = {
    dbConfig.db.run((
      congresses.returning(congresses.map(_.id)).into((c, ide) => c.copy(id = ide)) += congress).transactionally)
  }

  def get(id: Long): Future[Option[Congress]] = {
    dbConfig.db.run(congresses.filter(_.id === id).result.headOption)
  }

  def listAll: Future[Seq[Congress]] = {
    dbConfig.db.run(congresses.result)
  }
}