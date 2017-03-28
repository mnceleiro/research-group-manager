//package models.repositories
//
//import play.api.Play
//import play.api.db.slick.DatabaseConfigProvider
//import scala.concurrent.Future
//import slick.driver.JdbcProfile
//import slick.driver.MySQLDriver.api._
//import scala.concurrent.ExecutionContext.Implicits.global
//import models.entities.Researcher
//import com.google.inject.Inject
//
//class ResearcherTable(tag: Tag) extends Table[Session](tag, "SESSIONS") {
//
//  def id = column[Long]("id", O.PrimaryKey,O.AutoInc)
//  def email = column[String]("email")
//  def password = column[String]("password")
//  def firstName = column[String]("first_name")
//  def lastName = column[String]("last_name")
//  def signatureName = column[String]("signature_name")
//  def address = column[String]("address")
//  def phone = column[String]("phone")
//
//  override def * =
//    (id, email, password, firstName, lastName, signatureName, address, phone) <> ((Researcher.apply _).tupled, Researcher.unapply)
//}
//
//class ResearcherRepository @Inject()(dbConfigProvider: DatabaseConfigProvider) {
//
//  val dbConfig = dbConfigProvider.get[JdbcProfile]
//  val users = TableQuery[ResearcherTable]
//
//  // TODO: Validar password no vacia
//  def save(user: Researcher): Future[Researcher] = {
////    dbConfig.db.run(users += user).map(res => "El usuario se ha anhadido correctamente.").recover {
////      case ex: Exception => ex.getCause.getMessage
////    }
//    dbConfig.db.run {
////      ((users returning users.map(_.id)) += user)
////      (users returning users.map(_.id) into ((researcher, id) => (id=id)) += user).transactionally
//      (users.returning(users.map(_.id)).into((res,ide) => res.copy(id = ide)) += user).transactionally
//    }
//  }
//  
//  // TODO: Validar actualizacion o no de la password
//  def update(user: Researcher): Future[Researcher] = {
////    dbConfig.db.run(users.insertOrUpdate(user)).map(res => "El usuario se ha actualizado correctamente.").recover {
////      case ex: Exception => ex.getCause.getMessage
////    }
//    dbConfig.db.run {
//      (users.filter(_.id === user.id).update(user).transactionally).map(x => user)
//    }
//  }
//
//  def delete(id: Long): Future[Int] = {
//    dbConfig.db.run(users.filter(_.id === id).delete)
//  }
//
//  def get(id: Long): Future[Option[Researcher]] = {
//    dbConfig.db.run(users.filter(_.id === id).result.headOption)
//  }
//
//  def listAll: Future[Seq[Researcher]] = {
//    dbConfig.db.run(users.result)
//  }
//
//}
