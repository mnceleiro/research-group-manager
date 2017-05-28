package models.repositories

import play.api.Play
import play.api.db.slick.DatabaseConfigProvider
import scala.concurrent.Future
import slick.driver.JdbcProfile
import slick.driver.MySQLDriver.api._
import scala.concurrent.ExecutionContext.Implicits.global
import models.entities.Researcher
import com.google.inject.Inject
import utils.Password
import models.entities.Role
import models.entities.ResearcherWithUser
import models.entities.User

class ResearcherTable(tag: Tag) extends Table[Researcher](tag, "RESEARCHER") {
  val users = TableQuery[UserTable]

  def id = column[Long]("id", O.PrimaryKey, O.AutoInc)
  def firstName = column[String]("first_name")
  def lastName = column[String]("last_name")
  def address = column[String]("address")
  def phone = column[String]("phone")
  def userId = column[Long]("user_id")

  def user = foreignKey("USER_FK", userId, users)(_.id, onUpdate = ForeignKeyAction.NoAction, onDelete = ForeignKeyAction.NoAction)

  override def * = (id, firstName, lastName, address, phone, userId) <> ((Researcher.apply _).tupled, Researcher.unapply)
}

class ResearcherRepository @Inject() (dbConfigProvider: DatabaseConfigProvider) {
  val dbConfig = dbConfigProvider.get[JdbcProfile]
  val authors = TableQuery[AuthorTable]
  val researchers = TableQuery[ResearcherTable]
  val users = TableQuery[UserTable]

  def save(res: ResearcherWithUser): Future[ResearcherWithUser] = {
    val researcher = res.researcher
    val user = res.user
    if (!user.password.isDefined) throw new Exception("Debe especificarse una contraseña")

    val userAction = ((users returning users.map(_.id)) += user)
    val trans = (for {
      idUs <- userAction
      dbUs <- users.filter(_.id === idUs).result.headOption
      res <- (researchers.returning(researchers.map(_.id)).into((res, ide) => res.copy(id = ide)) += researcher.copy(userId = idUs))
    } yield ResearcherWithUser(res, dbUs.get)).transactionally

    dbConfig.db.run(trans)
  }

  def update(resUser: ResearcherWithUser): Future[ResearcherWithUser] = {
    var user = resUser.user
    var researcher = resUser.researcher

    val resAction = (researchers.filter(_.id === researcher.id)
      .map(u => u)
      .update(researcher))

    val userAction = if (user.password.isDefined)
        (users.filter(_.id === user.id)
          .map(u => (u.id, u.email, u.password, u.admin, u.access))
          .update((user.id, user.email, user.password, user.admin, user.access)))
      else
        (users.filter(_.id === user.id)
          .map(u => (u.id, u.email, u.admin, u.access))
          .update((user.id, user.email, user.admin, user.access)))

    val dbActions = (for {
      us <- userAction.map(x => user)
      res <- resAction.map(x => researcher)
    } yield (ResearcherWithUser(res, us)))
    
    dbConfig.db.run(dbActions)
  }

  def delete(id: Long): Future[Int] = {
    val query = (for {
      us <- researchers.filter(x => x.id === id).result.headOption
      resDel <- researchers.filter(_.id === id).delete
      usDel <- users.filter(u => u.id === us.map(x => x.id)).delete
      
      authorUpdated <- authors.filter(x => x.resId === id).map(x => x.resId).update(null)
    } yield (resDel))
    
    dbConfig.db.run(query.transactionally)
  }

  def get(id: Long): Future[Option[ResearcherWithUser]] = {
    val query = for {
      (r, u) <- researchers joinLeft users on (_.userId === _.id)
      if r.id === id
    } yield (r, u)

    dbConfig.db.run(query.result.headOption).map(x => Some(ResearcherWithUser(x.get._1, x.get._2.get)))
  }

  def listAll: Future[Seq[ResearcherWithUser]] = {
    val applicativeJoin = for {
      (researchers, users) <- researchers joinLeft users on (_.userId === _.id)
    } yield (researchers, users)

    val executed = for {
      tuples <- applicativeJoin.result
    } yield (tuples)

    val executed2 = for {
      tuples <- dbConfig.db.run(executed).map(x => x.map(y => ResearcherWithUser(y._1, y._2.get)))
    } yield (tuples)

    return executed2
  }
}
