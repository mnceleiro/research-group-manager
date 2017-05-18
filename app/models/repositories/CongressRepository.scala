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
  def start = column[String]("start")
  def end = column[String]("end")
  def international = column[Boolean]("international")

  override def * = (id, title, name, place, country, start, end, international) <> ((Congress.apply _).tupled, Congress.unapply)
}

class CongressRepository @Inject() (dbConfigProvider: DatabaseConfigProvider) {
  val dbConfig = dbConfigProvider.get[JdbcProfile]
  val congresses = TableQuery[CongressTable]

  def save(congress: Congress): Future[Congress] = {
    dbConfig.db.run((
      congresses.returning(congresses.map(_.id)).into((c, ide) => c.copy(id = ide)) += congress).transactionally)
  }

  def update(congress: Congress): Future[Congress] = {
    dbConfig.db.run(
      
    congresses.insertOrUpdate(congress)).map(res => "El usuario se ha actualizado correctamente.").recover {
      case ex: Exception => ex.getCause.getMessage
    }

    dbConfig.db.run {
      (congresses.filter(_.id === congress.id)
          .map(c => (c.id, c.title, c.name, c.place, c.country, c.start, c.end, c.international))
          .update((congress.id, congress.title, congress.name, congress.place, congress.country, congress.start, congress.end, congress.international)).transactionally).map(x => congress)
    }
  }

  def delete(id: Long): Future[Int] = {
    dbConfig.db.run(congresses.filter(_.id === id).delete)
  }

  def get(id: Long): Future[Option[Congress]] = {
    dbConfig.db.run(congresses.filter(_.id === id).result.headOption)
  }

  def listAll: Future[Seq[Congress]] = {
    dbConfig.db.run(congresses.result)
  }
}