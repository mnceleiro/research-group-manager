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

  def id = column[Long]("id", O.PrimaryKey,O.AutoInc)
  def firstName = column[String]("first_name")
  def lastName = column[String]("last_name")
  def address = column[String]("address")
  def phone = column[String]("phone")
  
  def userId = column[Long]("user_id")
  
  def user = foreignKey("USER_FK", userId, users)(_.id, onUpdate=ForeignKeyAction.Restrict, onDelete=ForeignKeyAction.Cascade)
  
  override def * = (id, firstName, lastName, address, phone, userId) <> ((Researcher.apply _).tupled, Researcher.unapply)
}

class ResearcherRepository @Inject()(dbConfigProvider: DatabaseConfigProvider) {

  val dbConfig = dbConfigProvider.get[JdbcProfile]
  val researchers = TableQuery[ResearcherTable]
  val users = TableQuery[UserTable]

  def save(res: ResearcherWithUser): Future[ResearcherWithUser] = {
    val researcher = res.researcher
    val user = res.user
    
//    val userAction: DBIO[User] = (users.returning(users.map(_.id)).into((us,ide) => us.copy(id = ide)) += user)
//    val resAction: DBIO[Researcher] = (researchers.returning(researchers.map(_.id)).into((res,ide) => res.copy(id = ide)) += researcher)
//    
    val userAction = ((users returning users.map(_.id)) += user)
    val trans = (for {
      idUs <- userAction
      dbUs <- users.filter(_.id === idUs).result.headOption
      res <- (researchers.returning(researchers.map(_.id)).into((res,ide) => res.copy(id = ide)) += researcher.copy(userId = idUs))
//      userId <- userAction.map(u => u.id)
    } yield ResearcherWithUser(res, dbUs.get)).transactionally
    
    dbConfig.db.run(trans)
//    dbConfig.db.run {
//        (researchers.returning(researchers.map(_.id)).into((res,ide) => res.copy(id = ide)) += researcher)
//        (users.returning(users.map(_.id)).into((us,ide) => us.copy(id = ide)) += user)
//        .transactionally
//      }
  }
  
  def update(resUser: ResearcherWithUser): Future[ResearcherWithUser] = {
    var user = resUser.user
    var researcher = resUser.researcher
    
//    val usGet = (users.filter(_.id === user.id).map(x => x.password)
    val resAction = (researchers.filter(_.id === researcher.id)
          .map(u => (u.id, u.firstName, u.lastName, u.address, u.phone))
          .update((researcher.id, researcher.firstName, researcher.lastName, researcher.address, researcher.phone)).transactionally).map(x => researcher)
          
    val userAction = (users.filter(_.id === user.id)
          .map(u => (u.id, u.email, u.password, u.admin, u.access))
          .update((user.id, user.email, user.password, user.admin, user.access)).transactionally).map(x => user)
          
    val userAction2 = (users.filter(_.id === user.id)
      .map(u => (u.id, u.email, u.admin, u.access))
      .update((user.id, user.email, user.admin, user.access)).transactionally).map(x => user)
              
    val trans = (for {
      us <- if (user.password == None) userAction2 else userAction
      res <- resAction
    } yield ResearcherWithUser(res, us)).transactionally
    
    dbConfig.db.run(trans)
    
//    dbConfig.db.run {
//      val resFut = (researchers.filter(_.id === researcher.id)
//          .map(u => (u.id, u.firstName, u.lastName, u.address, u.phone))
//          .update((researcher.id, researcher.firstName, researcher.lastName, researcher.address, researcher.phone)).transactionally).map(x => researcher)
//          
//      val usFut = (users.filter(_.id === user.id)
//          .map(u => (u.id, u.email, u.password, u.admin, u.access))
//          .update((user.id, user.email, user.password, user.admin, user.access)).transactionally).map(x => user)
//    }
  }

  def delete(id: Long): Future[Int] = {
    dbConfig.db.run(researchers.filter(_.id === id).delete)
  }

  def get(id: Long): Future[Option[ResearcherWithUser]] = {
//    dbConfig.db.run(researchers.filter(_.id === id).result.headOption)
    val query = for {
      (r,u) <- researchers joinLeft users on (_.userId === _.id)
      if r.id === id
    } yield (r,u)
    
    dbConfig.db.run(query.result.headOption).map(x => Some(ResearcherWithUser(x.get._1, x.get._2.get)))
  }

  def listAll: Future[Seq[ResearcherWithUser]] = {
//    dbConfig.db.run(researchers.result)
//    val monadicJoin = for {
//      u <- users
//      r <- researchers if u.id === r.userId
//    } yield (r, u)
    val applicativeJoin = for {
      (researchers, users) <- researchers joinLeft users on (_.userId === _.id)
    } yield (researchers, users)
    
    val executed = for {
      tuples  <- applicativeJoin.result
    } yield (tuples)
    
    val executed2 = for {
      tuples <- dbConfig.db.run(executed).map(x => x.map(y => ResearcherWithUser(y._1, y._2.get)))
    } yield (tuples)
    
    return executed2

//    executed map { case (tuples, data) =>
//      val users = tuples.map(_._1).toSet
//      val researchers = tuples.map(_._2).toSet
//      
//      val wat = tuples.headOption.map(_._1)
//      
//      wat.map(a => ResearcherWithUser(wat.get, a))
//    }
    
  }

}
